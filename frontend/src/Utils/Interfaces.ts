export interface APIResult {
  ok?: boolean,
  data?: Data
  status: any
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
  reportId: number,
  removeArcticleReport?(articleId: string): void
}