export interface APIResponse {
  ok?: boolean,
  data?: Data,
  blobData?: any, // check something for ReadableStream,
  reportId: number,
  articlesInReport: Array<ArticleInReport>,
  status: any
}

interface Data {
  results: Array<Article>
}

export interface Article {
  _id: string,
  html: string,
  keywords: Array<string>,
  language: string,
  link: string,
  published: string,
  region: string,
  title: string
}

export interface ArticleInReport {
  id: string,
  title: string,
  searchTerm: string | null,
  timeAdded: string
}

// should be refactored...
export interface User {
  user: User | undefined, 
  id: string,
  username: Object,
  articlesInReport: Array<ArticleInReport>,
  reportId: number,
  removeArcticleReport?(articleId: string): void,
  addArticleReport?(articleInReport: ArticleInReport): void,
  login?(loginData: any): void,
  logout?(): void,
  signup?(signupData: any): void
}