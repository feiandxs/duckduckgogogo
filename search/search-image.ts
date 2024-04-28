import {
  ImageSize,
  ImageType,
  ImageLayout,
  ImageColor,
  ImageLicense,
  ImageSearchOptions,
  ImageSearchResults
} from '../schema/image.schema';

import {SafeSearchType} from '../schema/common.schema';

import{ getVQD, queryString } from './base';

const defaultOptions: ImageSearchOptions = {
  safeSearch: SafeSearchType.OFF,
  locale: 'en-us',
  offset: 0
};

export async function searchImages(query: string, options?: ImageSearchOptions ): Promise<any> {
  if (!query) throw new Error('Query cannot be empty!');
  if (!options) options = defaultOptions;
  else options = sanityCheck(options);

  let vqd = options.vqd!;
  if (!vqd) vqd = await getVQD(query, 'web');

  /* istanbul ignore next */
  const filters = [
    options.size ? `size:${options.size}` : '',
    options.type ? `type:${options.type}` : '',
    options.layout ? `layout:${options.layout}` : '',
    options.color ? `color:${options.color}` : '',
    options.license ? `license:${options.license}` : ''
  ];

  const queryObject: Record<string, string> = {
    l: options.locale!,
    o: 'json',
    q: query,
    vqd,
    p: options.safeSearch === 0 ? '1' : '-1',
    f: filters.toString(),
    s: String(options.offset || 0)
  };

  const response = await fetch(`https://duckduckgo.com/i.js?${queryString(queryObject)}`,{
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from DuckDuckGo. Status: ${response.status} - ${response.statusText}`);
  }

  const responseBody = await response.text();

  console.log(responseBody);

  // const imagesResult = ensureJSON(response.body) as DuckbarResponse<DuckbarImageResult>;

  // return {
  //   noResults: !imagesResult.results.length,
  //   vqd,
  //   results: imagesResult.results.map((image) => ({
  //     ...image,
  //     title: decode(image.title)
  //   }))
  // };
}

function sanityCheck(options: ImageSearchOptions) {
  options = Object.assign({}, defaultOptions, options);

  if (!(options.safeSearch! in SafeSearchType)) throw new TypeError(`${options.safeSearch} is an invalid safe search type!`);

  /* istanbul ignore next */
  if (typeof options.safeSearch! === 'string') options.safeSearch = SafeSearchType[options.safeSearch!] as any as SafeSearchType;

  if (typeof options.offset !== 'number') throw new TypeError(`Search offset is not a number!`);

  if (options.offset! < 0) throw new RangeError('Search offset cannot be below zero!');

  if (!options.locale || typeof options.locale! !== 'string') throw new TypeError('Search locale must be a string!');

  if (options.size && !Object.values(ImageSize).includes(options.size)) throw new TypeError(`${options.size} is an invalid image size filter!`);

  if (options.type && !Object.values(ImageType).includes(options.type)) throw new TypeError(`${options.type} is an invalid image type filter!`);

  if (options.layout && !Object.values(ImageLayout).includes(options.layout))
    throw new TypeError(`${options.layout} is an invalid image layout filter!`);

  if (options.color && !Object.values(ImageColor).includes(options.color)) throw new TypeError(`${options.color} is an invalid color filter!`);

  if (options.license && !Object.values(ImageLicense).includes(options.license))
    throw new TypeError(`${options.license} is an invalid license filter!`);

  if (options.vqd && !/\d-\d+-\d+/.test(options.vqd)) throw new Error(`${options.vqd} is an invalid VQD!`);

  return options;
}
