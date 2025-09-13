import { render, screen, fireEvent } from '@testing-library/react'
import { TopicFilter, topicHubs } from '../topic-filter'

// Mock Plausible
const mockPlausible = vi.fn()
Object.defineProperty(window, 'plausible', {
  value: mockPlausible,
  writable: true
})

describe('TopicFilter', () => {
  const mockOnTopicsChange = vi.fn()

  beforeEach(() => {
    mockOnTopicsChange.mockClear()
    mockPlausible.mockClear()
  })

  it('renders all topic hubs', () => {
    render(
      <TopicFilter 
        selectedTopics={[]} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    // Check that all topic hubs are rendered
    topicHubs.forEach(hub => {
      expect(screen.getByText(hub.name)).toBeInTheDocument()
    })
  })

  it('shows selected topics as active', () => {
    render(
      <TopicFilter 
        selectedTopics={['self-care', 'dementia']} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    // Selected topics should have active styling
    const selfCareButton = screen.getByRole('button', { name: /self-care/i })
    const dementiaButton = screen.getByRole('button', { name: /dementia care/i })
    
    expect(selfCareButton).toHaveClass('bg-gradient-to-r')
    expect(dementiaButton).toHaveClass('bg-gradient-to-r')
  })

  it('displays selected topics in filter chips', () => {
    render(
      <TopicFilter 
        selectedTopics={['self-care']} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    expect(screen.getByText('Filtered by:')).toBeInTheDocument()
    expect(screen.getByText('Self-Care')).toBeInTheDocument()
  })

  it('calls onTopicsChange when topic is selected', () => {
    render(
      <TopicFilter 
        selectedTopics={[]} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    const selfCareButton = screen.getByRole('button', { name: /self-care/i })
    fireEvent.click(selfCareButton)

    expect(mockOnTopicsChange).toHaveBeenCalledWith(['self-care'])
  })

  it('calls onTopicsChange when topic is deselected', () => {
    render(
      <TopicFilter 
        selectedTopics={['self-care', 'dementia']} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    const selfCareButton = screen.getByRole('button', { name: /self-care/i })
    fireEvent.click(selfCareButton)

    expect(mockOnTopicsChange).toHaveBeenCalledWith(['dementia'])
  })

  it('removes topic when filter chip is clicked', () => {
    render(
      <TopicFilter 
        selectedTopics={['self-care']} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    const filterChip = screen.getByText('Self-Care').closest('button')
    expect(filterChip).toBeInTheDocument()
    
    if (filterChip) {
      fireEvent.click(filterChip)
      expect(mockOnTopicsChange).toHaveBeenCalledWith([])
    }
  })

  it('clears all filters when clear button is clicked', () => {
    render(
      <TopicFilter 
        selectedTopics={['self-care', 'dementia']} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    const clearButton = screen.getByRole('button', { name: /clear all/i })
    fireEvent.click(clearButton)

    expect(mockOnTopicsChange).toHaveBeenCalledWith([])
  })

  it('tracks analytics events when topic is selected', () => {
    render(
      <TopicFilter 
        selectedTopics={[]} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    const selfCareButton = screen.getByRole('button', { name: /self-care/i })
    fireEvent.click(selfCareButton)

    expect(mockPlausible).toHaveBeenCalledWith('topic_filter_used', {
      props: { 
        topic: 'self-care',
        action: 'add'
      }
    })
  })

  it('tracks analytics events when topic is deselected', () => {
    render(
      <TopicFilter 
        selectedTopics={['self-care']} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    const selfCareButton = screen.getByRole('button', { name: /self-care/i })
    fireEvent.click(selfCareButton)

    expect(mockPlausible).toHaveBeenCalledWith('topic_filter_used', {
      props: { 
        topic: 'self-care',
        action: 'remove'
      }
    })
  })

  it('tracks analytics when filters are cleared', () => {
    render(
      <TopicFilter 
        selectedTopics={['self-care', 'dementia']} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    const clearButton = screen.getByRole('button', { name: /clear all/i })
    fireEvent.click(clearButton)

    expect(mockPlausible).toHaveBeenCalledWith('topic_filter_cleared')
  })

  it('toggles expanded view', () => {
    render(
      <TopicFilter 
        selectedTopics={[]} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    const expandButton = screen.getByRole('button', { name: /show all/i })
    fireEvent.click(expandButton)

    expect(screen.getByRole('button', { name: /show less/i })).toBeInTheDocument()
    
    // In expanded view, descriptions should be visible
    expect(screen.getByText(/Resources for caring for someone with dementia/i)).toBeInTheDocument()
  })

  it('shows topic descriptions in expanded view', () => {
    render(
      <TopicFilter 
        selectedTopics={[]} 
        onTopicsChange={mockOnTopicsChange} 
      />
    )

    // Initially descriptions should not be visible (compact view)
    expect(screen.queryByText(/Resources for caring for someone with dementia/i)).not.toBeInTheDocument()

    // Expand view
    const expandButton = screen.getByRole('button', { name: /show all/i })
    fireEvent.click(expandButton)

    // Descriptions should now be visible
    topicHubs.forEach(hub => {
      expect(screen.getByText(hub.description)).toBeInTheDocument()
    })
  })
})