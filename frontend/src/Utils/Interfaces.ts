export interface APIResult {
  ok: boolean,
  data: Data
}

interface Data {
  results: Array<Article>
}

export interface Article {
  id: string,
  link: string,
  published: string,
}

export interface User {
  username: Object,
  articlesInReport: Array<Article>,
  reportId: number
}