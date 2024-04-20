import {
  NewsSearchOptions,
  NewsSearchResults,
  NewsResult,
} from '../schema/news.schema';


import {
  SearchTimeType,
  SafeSearchType
} from '../schema/common.schema';

import { decode } from 'html-entities';

import{ getVQD, queryString } from './base';

const defaultOptions: NewsSearchOptions = {
  safeSearch: SafeSearchType.OFF,
  locale: 'en-us',
  offset: 0
};

function sanityCheck(options: NewsSearchOptions) {
  options = Object.assign({}, defaultOptions, options);

  if (!(options.safeSearch! in SafeSearchType)) throw new TypeError(`${options.safeSearch} is an invalid safe search type!`);

  if (typeof options.safeSearch! === 'string')
    // @ts-ignore
    options.safeSearch = SafeSearchType[options.safeSearch!];

  if (typeof options.offset !== 'number') throw new TypeError(`Search offset is not a number!`);

  if (options.offset! < 0) throw new RangeError('Search offset cannot be below zero!');

  if (!options.locale || typeof options.locale! !== 'string') throw new TypeError('Search locale must be a string!');

  if (options.time && !Object.values(SearchTimeType).includes(options.time)) throw new TypeError(`${options.time} is an invalid time filter!`);

  if (options.vqd && !/\d-\d+-\d+/.test(options.vqd)) throw new Error(`${options.vqd} is an invalid VQD!`);

  return options;
}



/**
 * Search news articles.
 * @category Search
 * @param query The query to search with
 * @param options The options of the search
 * @param needleOptions The options of the HTTP request
 * @returns Search results
 */
export async function searchNews(query: string, options?: NewsSearchOptions): Promise<NewsSearchResults> {
  if (!query) throw new Error('Query cannot be empty!');
  if (!options) options = defaultOptions;
  else options = sanityCheck(options);

  let vqd = options.vqd!;
  if (!vqd) vqd = await getVQD(query, 'web');

  const queryObject: Record<string, string> = {
    l: options.locale!,
    o: 'json',
    noamp: '1',
    q: query,
    vqd,
    p: options.safeSearch === 0 ? '1' : String(options.safeSearch),
    df: options.time || '',
    s: String(options.offset || 0)
  };

  const response = await fetch(`https://duckduckgo.com/news.js?${queryString(queryObject)}`, {
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


  const newsResult = JSON.parse(responseBody);

  return {
    noResults: !newsResult.results.length,
    vqd,
    results: (options.count !== undefined
      ? newsResult.results.slice(0, options.count)
      : newsResult.results
    ).map((article: any) => ({
      date: article.date,
      excerpt: decode(article.excerpt),
      image: article.image,
      relativeTime: article.relative_time,
      syndicate: article.syndicate,
      title: decode(article.title),
      url: article.url,
      isOld: !!article.is_old
    })) as NewsResult[]
  };
}
