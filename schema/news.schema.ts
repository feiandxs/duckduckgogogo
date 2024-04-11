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
