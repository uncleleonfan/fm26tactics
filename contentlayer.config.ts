import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";

export const Tactic = defineDocumentType(() => ({
  name: "Tactic",
  filePathPattern: "tactics/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    formation: { type: "string", required: true },
    style: {
      type: "enum",
      options: ["gegenpress", "tiki-taka", "counter-attack", "wing-play", "route-one", "fluid", "fluid-counter-attack", "park-the-bus", "control-possession"],
      required: true,
    },
    difficulty: {
      type: "enum",
      options: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    publishedAt: { type: "date", required: true },
    updatedAt: { type: "date", required: false },
    coverImage: { type: "string", required: false },
    author: { type: "string", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("tactics/", ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/tactics/${doc._raw.flattenedPath.replace("tactics/", "")}`,
    },
  },
}));

// Turkish translation of tactics. Same fields as Tactic; files live in
// content/tr/tactics/ and keep the SAME slug as the English original so the
// two can be cross-linked via hreflang. Only translated tactics generate
// /tr/tactics/[slug] routes (see src/app/[locale]/tactics/[slug]/page.tsx).
export const TacticTr = defineDocumentType(() => ({
  name: "TacticTr",
  filePathPattern: "tr/tactics/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    formation: { type: "string", required: true },
    style: {
      type: "enum",
      options: ["gegenpress", "tiki-taka", "counter-attack", "wing-play", "route-one", "fluid", "fluid-counter-attack", "park-the-bus", "control-possession"],
      required: true,
    },
    difficulty: {
      type: "enum",
      options: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    publishedAt: { type: "date", required: true },
    updatedAt: { type: "date", required: false },
    coverImage: { type: "string", required: false },
    author: { type: "string", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("tr/tactics/", ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/tr/tactics/${doc._raw.flattenedPath.replace("tr/tactics/", "")}`,
    },
  },
}));

export const Role = defineDocumentType(() => ({
  name: "Role",
  filePathPattern: "roles/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    category: {
      type: "enum",
      options: ["goalkeeper", "defender", "midfielder", "forward"],
      required: true,
    },
    duties: { type: "list", of: { type: "string" }, required: true },
    keyAttributes: { type: "list", of: { type: "string" }, required: true },
    bestFor: { type: "string", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("roles/", ""),
    },
  },
}));

export const Guide = defineDocumentType(() => ({
  name: "Guide",
  filePathPattern: "guides/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    category: {
      type: "enum",
      options: ["training", "set-pieces", "scouting", "team-management", "match-day", "youth-development", "tactics"],
      required: true,
    },
    publishedAt: { type: "date", required: true },
    updatedAt: { type: "date", required: false },
    author: { type: "string", required: true },
    relatedTactic: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    difficulty: {
      type: "enum",
      options: ["beginner", "intermediate", "advanced"],
      required: false,
    },
    coverImage: { type: "string", required: false },
    // FAQ array for JSON-LD (list of {question, answer}); stored as raw JSON
    faq: { type: "json", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("guides/", ""),
    },
  },
}));

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    publishedAt: { type: "date", required: true },
    updatedAt: { type: "date", required: false },
    author: { type: "string", required: true },
    tags: { type: "list", of: { type: "string" }, required: false },
    readTime: { type: "number", required: false },
    relatedTactic: { type: "string", required: false },
    relatedGuide: { type: "string", required: false },
    // FAQ array for JSON-LD (list of {question, answer}); stored as raw JSON
    faq: { type: "json", required: false },
    category: {
      type: "enum",
      options: ["training", "set-pieces", "scouting", "team-management", "match-day", "youth-development", "tactics", "meta-analysis"],
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("blog/", ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Tactic, TacticTr, Role, Guide, Blog],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});
