import { SafeSearchType, SearchTimeType } from "./common.schema";

/** The options for {@link searchNews}. */
export interface NewsSearchOptions {
  /** The safe search type of the search. */
  safeSearch?: SafeSearchType;
  /** The locale(?) of the search. Defaults to "en-us". */
  locale?: string;
  /** The number to offset the results to. */
  offset?: number;
  /**
   * The string that acts like a key to a search.
   * Set this if you made a search with the same query.
   */
  vqd?: string;
  /** The time range of the articles. */
  time?: SearchTimeType;
  count?: number;
}

/** The news article results from {@link searchNews}. */
export interface NewsSearchResults {
  /** Whether there were no results found. */
  noResults: boolean;
  /** The VQD of the search query. */
  vqd: string;
  /** The news article results of the search. */
  results: NewsResult[];
}

/** A news article search result. */
export interface NewsResult {
  /** The timestamp of when the article was created. */
  date: number;
  /** An except of the article. */
  excerpt: string;
  /** The image URL used in the article. */
  image?: string;
  /** The relative time of when the article was posted, in human readable format. */
  relativeTime: string;
  /** Where this article was indexed from. */
  syndicate: string;
  /** The title of the article. */
  title: string;
  /** The URL of the article. */
  url: string;
  /** Whether this article is classified as old. */
  isOld: boolean;
}
