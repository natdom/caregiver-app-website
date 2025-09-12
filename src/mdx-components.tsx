import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-50 mb-6 mt-8 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 mt-8 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3 mt-4">
        {children}
      </h4>
    ),
    
    // Paragraphs
    p: ({ children }) => (
      <p className="text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
        {children}
      </p>
    ),
    
    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-neutral-600 dark:text-neutral-300 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-neutral-600 dark:text-neutral-300 ml-4">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="mb-1 leading-relaxed">
        {children}
      </li>
    ),
    
    // Links
    a: ({ href, children }) => (
      <a 
        href={href}
        className="text-coral-600 dark:text-coral-400 hover:text-coral-700 dark:hover:text-coral-300 underline underline-offset-2 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    
    // Strong/Bold
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-800 dark:text-neutral-100">
        {children}
      </strong>
    ),
    
    // Emphasis/Italic
    em: ({ children }) => (
      <em className="italic text-neutral-600 dark:text-neutral-300">
        {children}
      </em>
    ),
    
    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-teal-500 pl-6 py-2 my-6 bg-teal-50 dark:bg-teal-900/20 rounded-r-lg">
        <div className="text-teal-800 dark:text-teal-200 font-medium italic">
          {children}
        </div>
      </blockquote>
    ),
    
    // Code
    code: ({ children, className }) => (
      <code className={`${className || ''} bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-sm font-mono text-coral-600 dark:text-coral-400`}>
        {children}
      </code>
    ),
    
    // Pre (code blocks)
    pre: ({ children }) => (
      <pre className="bg-neutral-900 dark:bg-neutral-950 p-4 rounded-lg overflow-x-auto mb-6 border border-neutral-200 dark:border-neutral-700">
        <code className="text-neutral-100 text-sm font-mono leading-relaxed">
          {children}
        </code>
      </pre>
    ),
    
    // Horizontal rule
    hr: () => (
      <hr className="border-neutral-200 dark:border-neutral-700 my-8" />
    ),
    
    ...components,
  }
}