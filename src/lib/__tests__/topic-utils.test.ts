import { 
  getResourceTopicHubs, 
  filterResourcesByTopicHubs, 
  getTopicHubStats,
  getMostSavedResources 
} from '../topic-utils'

// Mock resource data
const mockResources = [
  {
    _id: '1',
    title: 'Self-Care for Caregivers',
    topics: ['Self-Care', 'Mental Health', 'Wellness'],
    featured: true,
    slug: 'self-care-caregivers'
  },
  {
    _id: '2', 
    title: 'Understanding Dementia',
    topics: ['Dementia', 'Memory', 'Healthcare'],
    featured: false,
    slug: 'understanding-dementia'
  },
  {
    _id: '3',
    title: 'Organizing Medical Appointments',
    topics: ['Healthcare', 'Organization', 'Planning'],
    featured: true,
    slug: 'organizing-appointments'
  },
  {
    _id: '4',
    title: 'Home Safety for Mobility Issues',
    topics: ['Safety', 'Mobility', 'Home Modifications'],
    featured: false,
    slug: 'home-safety-mobility'
  },
  {
    _id: '5',
    title: 'Supporting Someone with Autism',
    topics: ['Autism', 'Special Needs', 'Communication'],
    featured: false,
    slug: 'supporting-autism'
  }
] as any[]

describe('topic-utils', () => {
  describe('getResourceTopicHubs', () => {
    it('maps self-care topics correctly', () => {
      const resource = mockResources[0] // Self-care resource
      const hubs = getResourceTopicHubs(resource)
      
      expect(hubs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'self-care', name: 'Self-Care' })
        ])
      )
    })

    it('maps dementia topics correctly', () => {
      const resource = mockResources[1] // Dementia resource
      const hubs = getResourceTopicHubs(resource)
      
      expect(hubs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'dementia', name: 'Dementia Care' })
        ])
      )
    })

    it('maps care coordination topics correctly', () => {
      const resource = mockResources[2] // Healthcare organization resource
      const hubs = getResourceTopicHubs(resource)
      
      expect(hubs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'care-coordination', name: 'Care Coordination' })
        ])
      )
    })

    it('maps mobility/safety topics correctly', () => {
      const resource = mockResources[3] // Safety resource
      const hubs = getResourceTopicHubs(resource)
      
      expect(hubs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'mobility', name: 'Mobility & Safety' })
        ])
      )
    })

    it('maps neurodiversity topics correctly', () => {
      const resource = mockResources[4] // Autism resource
      const hubs = getResourceTopicHubs(resource)
      
      expect(hubs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'neurodiversity', name: 'Neurodiversity' })
        ])
      )
    })

    it('handles resources with multiple matching hubs', () => {
      const resource = {
        _id: 'test',
        topics: ['Healthcare', 'Safety', 'Self-Care'],
        title: 'Multi-topic resource'
      } as any

      const hubs = getResourceTopicHubs(resource)
      
      expect(hubs.length).toBeGreaterThan(1)
      expect(hubs.map(h => h.id)).toEqual(
        expect.arrayContaining(['care-coordination', 'mobility', 'self-care'])
      )
    })

    it('handles resources with no matching topics', () => {
      const resource = {
        _id: 'test',
        topics: ['Unrelated Topic'],
        title: 'No match resource'
      } as any

      const hubs = getResourceTopicHubs(resource)
      expect(hubs).toEqual([])
    })

    it('handles resources with empty topics array', () => {
      const resource = {
        _id: 'test',
        topics: [],
        title: 'Empty topics resource'
      } as any

      const hubs = getResourceTopicHubs(resource)
      expect(hubs).toEqual([])
    })

    it('handles resources with undefined topics', () => {
      const resource = {
        _id: 'test',
        title: 'No topics resource'
      } as any

      const hubs = getResourceTopicHubs(resource)
      expect(hubs).toEqual([])
    })
  })

  describe('filterResourcesByTopicHubs', () => {
    it('returns all resources when no hubs selected', () => {
      const filtered = filterResourcesByTopicHubs(mockResources, [])
      expect(filtered).toEqual(mockResources)
    })

    it('filters by single hub correctly', () => {
      const filtered = filterResourcesByTopicHubs(mockResources, ['self-care'])
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].title).toBe('Self-Care for Caregivers')
    })

    it('filters by multiple hubs correctly', () => {
      const filtered = filterResourcesByTopicHubs(mockResources, ['dementia', 'mobility'])
      
      expect(filtered).toHaveLength(2)
      expect(filtered.map(r => r.title)).toEqual(
        expect.arrayContaining([
          'Understanding Dementia',
          'Home Safety for Mobility Issues'
        ])
      )
    })

    it('includes resources that match any of the selected hubs', () => {
      const filtered = filterResourcesByTopicHubs(mockResources, ['care-coordination'])
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].title).toBe('Organizing Medical Appointments')
    })

    it('returns empty array when no resources match', () => {
      // Create a hub ID that won't match any resources
      const filtered = filterResourcesByTopicHubs(mockResources, ['nonexistent-hub'])
      expect(filtered).toEqual([])
    })
  })

  describe('getTopicHubStats', () => {
    it('counts resources for each hub correctly', () => {
      const stats = getTopicHubStats(mockResources)
      
      expect(stats['self-care']).toBe(1)
      expect(stats['dementia']).toBe(1)
      expect(stats['care-coordination']).toBe(1)
      expect(stats['mobility']).toBe(1)
      expect(stats['neurodiversity']).toBe(1)
    })

    it('returns zero for hubs with no matching resources', () => {
      const singleResource = [mockResources[0]] // Only self-care resource
      const stats = getTopicHubStats(singleResource)
      
      expect(stats['self-care']).toBe(1)
      expect(stats['dementia']).toBe(0)
      expect(stats['care-coordination']).toBe(0)
      expect(stats['mobility']).toBe(0)
      expect(stats['neurodiversity']).toBe(0)
    })

    it('handles empty resource array', () => {
      const stats = getTopicHubStats([])
      
      Object.values(stats).forEach(count => {
        expect(count).toBe(0)
      })
    })
  })

  describe('getMostSavedResources', () => {
    it('returns featured resources as most saved', () => {
      const mostSaved = getMostSavedResources(mockResources)
      
      expect(mostSaved).toHaveLength(2)
      expect(mostSaved.every(r => r.featured)).toBe(true)
      expect(mostSaved.map(r => r.title)).toEqual(
        expect.arrayContaining([
          'Self-Care for Caregivers',
          'Organizing Medical Appointments'
        ])
      )
    })

    it('returns empty array when no featured resources', () => {
      const nonFeaturedResources = mockResources.map(r => ({ ...r, featured: false }))
      const mostSaved = getMostSavedResources(nonFeaturedResources)
      
      expect(mostSaved).toEqual([])
    })

    it('handles empty resource array', () => {
      const mostSaved = getMostSavedResources([])
      expect(mostSaved).toEqual([])
    })
  })
})