/** A video search result. */
export interface VideoResult {
  /** The URL of the video. */
  url: string;
  /** The title of the video. */
  title: string;
  /** The description of the video. */
  description: string;
  /** The image URL of the video. */
  image: string;
  /** The duration of the video. (i.e. "9:20") */
  duration: string;
  /** The ISO timestamp of when the video was published. */
  published: string;
  /** Where the video was publised on. (i.e. "YouTube") */
  publishedOn: string;
  /** The name of who uploaded the video. */
  publisher: string;
  /** The view count of the video. */
  viewCount?: number;
}
