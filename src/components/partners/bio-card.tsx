interface BioCardProps {
  name: string
  role: string
  bio: string
  imageUrl?: string
  linkedinUrl?: string
  className?: string
}

export function BioCard({ name, role, bio, imageUrl, linkedinUrl, className = '' }: BioCardProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={`bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-white/10 p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`${name} headshot`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-coral-200 dark:bg-coral-800 rounded-full flex items-center justify-center">
              <span className="text-coral-800 dark:text-coral-200 font-semibold text-lg">
                {initials}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-white truncate">
              {name}
            </h3>
            {linkedinUrl && (
              <a 
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral-600 hover:text-coral-700 dark:text-coral-400 dark:hover:text-coral-300 transition-colors"
                aria-label={`${name} LinkedIn profile`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
          </div>
          <p className="text-sm text-coral-600 dark:text-coral-400 font-medium mb-2">
            {role}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {bio}
          </p>
        </div>
      </div>
    </div>
  )
}