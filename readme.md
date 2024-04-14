code copied from <https://github.com/Snazzah/duck-duck-scrape>

## npm

[[text](https://www.npmjs.com/package/duckduckgogogo)](<https://www.npmjs.com/package/duckduckgogogo>)

只复制了一部分功能，后续慢慢再补。
现在我们可以在 cloudflare workers 上运行了。

## how to use

```typescript
import { search } from 'duckduckgogogo';

const query: string = 'what is the answer to the ultimate question of life, the universe, and everything ?';

const searchResults = await search(query, {
safeSearch: SafeSearchType.STRICT
});

console.log(searchResults);

```
