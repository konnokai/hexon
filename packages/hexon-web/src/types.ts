export interface Article {
  _id: string;
  title: string;
  date: number;
  updated?: number | undefined;
  comments: boolean;
  layout: string;
  content: string;
  excerpt?: string | undefined;
  more?: string | undefined;
  source: string;
  full_source: string;
  path: string;
  permalink: string;
  prev?: string | undefined; // _id
  next?: string | undefined; // _id
  raw?: string | undefined;
  photos?: string[] | undefined;
  link?: string | undefined;
  [key: string]: any;
}

export interface Page extends Article {
  __page: boolean;
}

export interface Post extends Article {
  published?: boolean | undefined;
  categories?: Category[] | undefined;
  tags: Tag[];
  __post: boolean;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  path: string;
  permalink: string;
  posts: string[]; // _id
  length: number;
}
export interface Category extends Tag {
  parent: string;
}
