export const VQD_REGEX = /vqd=['"](\d+-\d+(?:-\d+)?)['"]/;

/**
 * Get the VQD of a search query.
 * @param query The query to search
 * @param ia The type(?) of search
 * @param options The options of the HTTP request
 * @returns The VQD
 */
export async function getVQD(query: string, ia = 'web', options?: RequestInit): Promise<string> {
  try {
    const queryParams = new URLSearchParams({ q: query, ia });
    const response = await fetch(`https://duckduckgo.com/?${queryParams.toString()}`, options);

    if (!response.ok) {
      console.log(111)
      console.log(response.status)
      throw new Error(`Failed to get the VQD for query "${query}". Status: ${response.status} - ${response.statusText}`);
    }

    const responseText = await response.text();
    const vqd = VQD_REGEX.exec(responseText)?.[1];
    if (!vqd) {
      throw new Error(`Failed to extract the VQD from the response for query "${query}".`);
    }

    return vqd;
  } catch (e: any) {
    // console.log(e)
    // console.log(Object.keys(e))
    // console.log(e.cause)
    // console.log(Object.keys(e.cause))
    // console.log('code', e.cause.code)
    // console.log('message', e.cause.message)
    // console.log('name', e.cause.name)
    const err = `Failed to get the VQD for query "${query}".
      Error: ${e.cause.message}
    `;
    throw new Error(err);
  }
}


export function queryString(query: Record<string, string>) {
  return new URLSearchParams(query).toString();
}
