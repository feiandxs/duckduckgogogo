# Duckduckgogogo

[[text](https://www.npmjs.com/package/duckduckgogogo)](<https://www.npmjs.com/package/duckduckgogogo>)

## how to use

```typescript
import { search } from 'duckduckgogogo';

const query: string = 'what is the answer to the ultimate question of life, the universe, and everything ?';

const searchResults = await search(query, {
safeSearch: SafeSearchType.STRICT
});

console.log(searchResults);

```
