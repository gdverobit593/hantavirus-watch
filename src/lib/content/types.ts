export type SourceLink = {
  label: string;
  url: string;
};

export type NewsFrontmatter = {
  title: string;
  date: string;
  datetime?: string;
  summary: string;
  category?: "news" | "digest" | "site";
  image?: string;
  sources?: SourceLink[];
};

export type ReferenceFrontmatter = {
  title: string;
  date: string;
  summary: string;
};

export type ContentItem<TFrontmatter> = {
  slug: string;
  frontmatter: TFrontmatter;
  content: string;
};
