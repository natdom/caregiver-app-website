import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Resource = defineDocumentType(() => ({
  name: 'Resource',
  filePathPattern: `resources/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the resource',
      required: true,
    },
    excerpt: {
      type: 'string',
      description: 'A brief description of the resource',
      required: true,
    },
    publishedAt: {
      type: 'date',
      description: 'The date the resource was published',
      required: true,
    },
    updatedAt: {
      type: 'date',
      description: 'The date the resource was last updated',
      required: false,
    },
    author: {
      type: 'string',
      description: 'The author of the resource',
      required: true,
    },
    authorRole: {
      type: 'string',
      description: 'The role/credentials of the author',
      required: false,
    },
    topics: {
      type: 'list',
      of: { type: 'string' },
      description: 'Topics/tags for the resource',
      required: true,
    },
    readingTime: {
      type: 'number',
      description: 'Estimated reading time in minutes',
      required: false,
    },
    featured: {
      type: 'boolean',
      description: 'Whether this resource should be featured',
      required: false,
      default: false,
    },
    cover: {
      type: 'string',
      description: 'Cover image URL',
      required: false,
    },
    coverAlt: {
      type: 'string',
      description: 'Alt text for cover image',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (resource) => `/resources/${resource._raw.flattenedPath.replace('resources/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (resource) => resource._raw.flattenedPath.replace('resources/', ''),
    },
  },
}))

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `pages/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the page',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the page',
      required: true,
    },
    publishedAt: {
      type: 'date',
      description: 'The date the page was published',
      required: true,
    },
    updatedAt: {
      type: 'date',
      description: 'The date the page was last updated',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (page) => `/${page._raw.flattenedPath.replace('pages/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (page) => page._raw.flattenedPath.replace('pages/', ''),
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Resource, Page],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})