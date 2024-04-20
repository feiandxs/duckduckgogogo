# Duckduckgogogo

## Description

This is a library for calling the duckduckgo search engine. It is based on [duck-duck-scrape](https://www.npmjs.com/package/duck-duck-scrape), but the underlying HTTP request is changed from `XMLHttpRequest` to `fetch`, so it can be used in more serverless environments like `cloudflare`.

## 说明

调用 duckduckgo 进行搜索的库，参考了[duck-duck-scrape](https://www.npmjs.com/package/duck-duck-scrape) ，将底层 http 请求调用者由`XMLHttpRequest`换成了 `fetch` ，因而可以在类似 `cloudflare` 等更多的云服务商的 serverless 环境下使用。

对中国用户来说，使用时候需要注意，国内网络不可直接访问 duckduckgo 。

## Source Code

[https://github.com/feiandxs/duckduckgogogo](https://github.com/feiandxs/duckduckgogogo)

## 源码

[https://github.com/feiandxs/duckduckgogogo](https://github.com/feiandxs/duckduckgogogo)

## Available Features

- Search
  - Regular search
  - News search

## Todo

- Image search
- Video search
- Type Define

## Install

```shell
npm install duckduckgogogo
```

or

```shell
yarn add duckduckgogogo
```

or

```shell
pnpm install duckduckgogogo
```

## how to use

### web search

```typescript
import { search } from 'duckduckgogogo';

const query: string = 'what is the answer to the ultimate question of life, the universe, and everything ?';

const searchResults = await search(query, {
  safeSearch: SafeSearchType.STRICT,
  count: 10
});

console.log(searchResults);

```

### news search

```typescript
import { searchNews } from 'duckduckgogogo';

const query: string = 'Shanghai Weather'

const searchResults = await searchNews(query, {
    count: 10
})

console.log(searchResults);

```
