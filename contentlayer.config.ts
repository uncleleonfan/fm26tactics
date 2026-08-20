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
      options: ["gegenpress", "tiki-taka", "counter-attack", "wing-play", "route-one", "fluid-counter-attack", "park-the-bus", "control-possession"],
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
    suitableFormations: { type: "list", of: { type: "string" }, required: false },
    tags: { type: "list", of: { type: "string" }, required: true },
    icon: { type: "string", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("roles/", ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/roles/${doc._raw.flattenedPath.replace("roles/", "")}`,
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
      options: ["training", "set-pieces", "scouting", "team-management", "match-day", "youth-development"],
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
    author: { type: "string", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("guides/", ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/guides/${doc._raw.flattenedPath.replace("guides/", "")}`,
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
    category: {
      type: "enum",
      options: ["tactics", "formations", "player-roles", "set-pieces", "meta", "beginner", "wonderkids"],
      required: true,
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    publishedAt: { type: "date", required: true },
    updatedAt: { type: "date", required: false },
    author: { type: "string", required: false },
    readTime: { type: "number", required: true },
    relatedTactic: { type: "string", required: false },
    relatedGuide: { type: "string", required: false },
    faq: { type: "json", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace("blog/", ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace("blog/", "")}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Tactic, Role, Guide, Blog],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});
