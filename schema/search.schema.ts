import type { SafeSearchType, SearchTimeType } from "./common.schema";
import type { NewsResult } from "../schema/news.schema";
import type { VideoResult } from "../schema/video.schema";

export interface SearchOptions {
  /** The safe search type of the search. */
  safeSearch?: SafeSearchType;
  /** The time range of the searches, can be a SearchTimeType or a date range ("2021-03-16..2021-03-30") */
  time?: SearchTimeType | string;
  /** The locale(?) of the search. Defaults to "en-us". */
  locale?: string;
  /** The region of the search. Defaults to "wt-wt" or all regions. */
  region?: string;
  /** The market region(?) of the search. Defaults to "US". */
  marketRegion?: string;
  /** The number to offset the results to. */
  offset?: number;
  /**
   * The string that acts like a key to a search.
   * Set this if you made a search with the same query.
   */
  vqd?: string;
}

export interface CallbackSearchResult {
  /** Website description */
  a: string;
  /** Unknown */
  ae: null;
  /** ddg!bang information (ex. w Wikipedia en.wikipedia.org) */
  b?: string;
  /** URL */
  c: string;
  /** URL of some sort. */
  d: string;
  /** Class name associations. */
  da?: string;
  /** Unknown */
  h: number;
  /** Website hostname */
  i: string;
  /** Unknown */
  k: null;
  /** Unknown */
  m: number;
  /** Unknown */
  o: number;
  /** Unknown */
  p: number;
  /** Unknown */
  s: string;
  /** Website Title */
  t: string;
  /** Website URL */
  u: string;
}

export interface CallbackNextSearch {
  /** URL to the next page of results */
  n: string;
}

export interface CallbackDuckbarPayload<T> {
  ads: null | any[];
  query: string;
  queryEncoded: string;
  response_type: string;
  results: T[];
  vqd: {
    [query: string]: string;
  };
}

export interface DuckbarImageResult {
  /** The height of the image in pixels. */
  height: number;
  /** The image URL. */
  image: string;
  /** The source of the image. */
  source: string;
  /** The thumbnail URL. */
  thumbnail: string;
  /** The title (or caption) of the image. */
  title: string;
  /** The website URL of where the image came from. */
  url: string;
  /** The width of the image in pixels. */
  width: number;
}

export interface DuckbarVideoResult {
  /** URL of the video */
  content: string;
  /** Description of the video */
  description: string;
  /** Duration of the video */
  duration: string;
  /** Embed HTML for the video */
  embed_html: string;
  /** Embed URL for the video */
  embed_url: string;
  /** Thumbnail images of the video */
  images: {
    large: string;
    medium: string;
    motion: string;
    small: string;
  };
  /** Where this search result came from */
  provider: string;
  /** ISO timestamp of the upload */
  published: string;
  /** What site the video was on */
  publisher: string;
  /** Various statistics */
  statistics: {
    /** View count of the video */
    viewCount: number | null;
  };
  /** Title of the video */
  title: string;
  /** Name of the video uploader(?) */
  uploader: string;
}

export interface DuckbarRelatedSearch {
  display_text: string;
  text: string;
  web_search_url: string;
}

export interface DuckbarNewsResult {
  date: number;
  excerpt: string;
  image?: string;
  relative_time: string;
  syndicate: string;
  title: string;
  url: string;
  use_relevancy: number;
  is_old?: number;
  fetch_image?: number;
}

export interface DuckbarResponse<T> extends CallbackDuckbarPayload<T> {
  next: string;
}

export interface SearchResultBang {
  /** The prefix of the bang. (i.e. "w" for !w) */
  prefix: string;
  /** The title of the bang. */
  title: string;
  /** The domain of the bang. */
  domain: string;
}

export interface RelatedResult {
  text: string;
  raw: string;
}

/** A web search result. */
export interface SearchResult {
  /** The hostname of the website. (i.e. "google.com") */
  hostname: string;
  /** The URL of the result. */
  url: string;
  /** The title of the result. */
  title: string;
  /**
   * The sanitized description of the result.
   * Bold tags will still be present in this string.
   */
  description: string;
  /** The description of the result. */
  rawDescription: string;
  /** The icon of the website. */
  icon: string;
  /** The ddg!bang information of the website, if any. */
  bang?: SearchResultBang;
}


/**
 * The search results from {@link search}.
 * `images`, `news`, `videos` and `related` only show up if the query
 * shows elements of these in a webpage search.
 */
export interface SearchResults {
  /** Whether there were no results found. */
  noResults: boolean;
  /** The VQD of the search query. */
  vqd: string;
  /** The web results of the search. */
  results: SearchResult[];
  /** The image results of the search. */
  images?: DuckbarImageResult[];
  /** The news article results of the search. */
  news?: NewsResult[];
  /** The video results of the search. */
  videos?: VideoResult[];
  /** The related searches of the query. */
  related?: RelatedResult[];
}