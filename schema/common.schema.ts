
/** @internal */
export const SPICE_BASE = 'https://duckduckgo.com/js/spice';
/** @internal */
export const VQD_REGEX = /vqd=['"](\d+-\d+(?:-\d+)?)['"]/;

/** The safe search values when searching DuckDuckGo. */
export enum SafeSearchType {
  /** Strict filtering, no NSFW content. */
  STRICT = 0,
  /** Moderate filtering. */
  MODERATE = -1,
  /** No filtering. */
  OFF = -2
}

/** The type of time ranges of the search results in DuckDuckGo. */
export enum SearchTimeType {
  /** From any time. */
  ALL = 'a',
  /** From the past day. */
  DAY = 'd',
  /** From the past week. */
  WEEK = 'w',
  /** From the past month. */
  MONTH = 'm',
  /** From the past year. */
  YEAR = 'y'
}

export function queryString(query: Record<string, string>) {
  return new URLSearchParams(query).toString();
}

export function parseSpiceBody(body: any, regex = /^ddg_spice_[\w]+\(\n?((?:.|\n)+)\n?\);?/) {
  return JSON.parse(regex.exec(body.toString())![1]);
}
