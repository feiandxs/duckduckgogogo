import { SafeSearchType, SearchTimeType } from "../schema/common.schema";
import type { SearchOptions,
    CallbackDuckbarPayload,
  CallbackNextSearch,
  CallbackSearchResult,
  DuckbarImageResult,
  DuckbarNewsResult,
  DuckbarRelatedSearch,
  DuckbarVideoResult,
  SearchResults,
  SearchResultBang
} from "../schema/search.schema";

import type { NewsResult } from "../schema/news.schema";
import type { VideoResult } from "../schema/video.schema";

const defaultOptions: SearchOptions = {
  safeSearch: SafeSearchType.OFF,
  time: SearchTimeType.ALL,
  locale: 'en-us',
  region: 'wt-wt',
  offset: 0,
  marketRegion: 'us'
};

import{ getVQD } from './base';

const SEARCH_REGEX = /DDG\.pageLayout\.load\('d',(\[.+\])\);DDG\.duckbar\.load\('images'/;
const IMAGES_REGEX = /;DDG\.duckbar\.load\('images', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('news/;
const NEWS_REGEX = /;DDG\.duckbar\.load\('news', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('videos/;
const VIDEOS_REGEX = /;DDG\.duckbar\.load\('videos', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.loadModule\('related_searches/;
const RELATED_SEARCHES_REGEX = /DDG\.duckbar\.loadModule\('related_searches', ({"ads":.+"vqd":{".+":"\d-\d+-\d+"}})\);DDG\.duckbar\.load\('products/;
export declare type DecodeScope = 'strict' | 'body' | 'attribute';
interface CommonOptions {
  level?: Level;
}
export declare type Level = 'xml' | 'html4' | 'html5' | 'all';

export interface DecodeOptions extends CommonOptions {
  scope?: DecodeScope;
}

// /** Decodes all entities in the text */
// export declare function decode(text: string | undefined | null, { level, scope }?: DecodeOptions): string;

import { decode } from 'html-entities';


export function queryString(query: Record<string, string>) {
  return new URLSearchParams(query).toString();
}


export async function search(query: string, options?: SearchOptions): Promise<SearchResults> {
  if (!query) throw new Error('Query cannot be empty!');
  if (!options) options = defaultOptions;

  let vqd = options.vqd!;
  if (!vqd) vqd = await getVQD(query, 'web');

  /* istanbul ignore next */
  const queryObject: Record<string, string> = {
    q: query,
    ...(options.safeSearch !== SafeSearchType.STRICT ? { t: 'D' } : {}),
    l: options.locale!,
    ...(options.safeSearch === SafeSearchType.STRICT ? { p: '1' } : {}),
    kl: options.region || 'wt-wt',
    s: String(options.offset),
    dl: 'en',
    ct: 'US',
    ss_mkt: options.marketRegion!,
    df: options.time! as string,
    vqd,
    ...(options.safeSearch !== SafeSearchType.STRICT ? { ex: String(options.safeSearch) } : {}),
    sp: '1',
    bpa: '1',
    biaexp: 'b',
    msvrtexp: 'b',
    ...(options.safeSearch === SafeSearchType.STRICT
      ? {
          videxp: 'a',
          nadse: 'b',
          eclsexp: 'a',
          stiaexp: 'a',
          tjsexp: 'b',
          related: 'b',
          msnexp: 'a'
        }
      : {
          nadse: 'b',
          eclsexp: 'b',
          tjsexp: 'b'
          // cdrexp: 'b'
        })
  };

  const response = await fetch(`https://links.duckduckgo.com/d.js?${queryString(queryObject)}`, {
  method: 'GET'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from DuckDuckGo. Status: ${response.status} - ${response.statusText}`);
  }

  const responseBody = await response.text();

  if (responseBody.includes('DDG.deep.is506')) {
    throw new Error('A server error occurred!');
  }
  
  if (responseBody.includes('DDG.deep.anomalyDetectionBlock')) {
    throw new Error('DDG detected an anomaly in the request, you are likely making requests too quickly.');
  }

  const searchResults = JSON.parse(SEARCH_REGEX.exec(responseBody)![1].replace(/\t/g, '    ')) as (CallbackSearchResult | CallbackNextSearch)[];
  console.log(searchResults);

    // check for no results
    if (searchResults.length === 1 && !('n' in searchResults[0])) {
      const onlyResult = searchResults[0] as CallbackSearchResult;
      /* istanbul ignore next */
      if ((!onlyResult.da && onlyResult.t === 'EOF') || !onlyResult.a || onlyResult.d === 'google.com search')
        return {
          noResults: true,
          vqd,
          results: []
        };
    }

    const results: SearchResults = {
      noResults: false,
      vqd,
      results: []
    };


      // Populate search results
  for (const search of searchResults) {
    if ('n' in search) continue;
    let bang: SearchResultBang | undefined;
    if (search.b) {
      const [prefix, title, domain] = search.b.split('\t');
      bang = { prefix, title, domain };
    }

    
  if (options.count !== undefined && results.results.length >= options.count) {
    break;
  }

    results.results.push({
      title: search.t,
      description: decode(search.a),
      rawDescription: search.a,
      hostname: search.i,
      icon: `https://external-content.duckduckgo.com/ip3/${search.i}.ico`,
      url: search.u,
      bang
    });
  }
  return results;
}