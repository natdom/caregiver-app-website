import { render, screen } from '@testing-library/react'
import { Users } from 'lucide-react'
import { Stat } from '../stat'
import { Pillar } from '../pillar' 
import { Timeline } from '../timeline'
import { BioCard } from '../bio-card'

describe('Partners Components', () => {
  describe('Stat Component', () => {
    it('renders basic stat without source', () => {
      render(<Stat number="53.4M" description="Family caregivers" />)
      
      expect(screen.getByText('53.4M')).toBeInTheDocument()
      expect(screen.getByText('Family caregivers')).toBeInTheDocument()
    })

    it('renders stat with source link and date', () => {
      const source = {
        title: 'AARP Study',
        url: 'https://example.com',
        date: '2023'
      }
      
      render(<Stat number="61%" description="Report stress" source={source} />)
      
      expect(screen.getByText('61%')).toBeInTheDocument()
      expect(screen.getByText('Report stress')).toBeInTheDocument()
      
      const sourceLink = screen.getByRole('link', { name: 'AARP Study' })
      expect(sourceLink).toHaveAttribute('href', 'https://example.com')
      expect(sourceLink).toHaveAttribute('target', '_blank')
      expect(screen.getByText('2023')).toBeInTheDocument()
    })
  })

  describe('Pillar Component', () => {
    it('renders pillar with icon, title and outcome', () => {
      render(
        <Pillar 
          icon={Users}
          title="Connection"
          outcome="Reduce isolation by 40% through peer matching."
        />
      )
      
      expect(screen.getByText('Connection')).toBeInTheDocument()
      expect(screen.getByText('Reduce isolation by 40% through peer matching.')).toBeInTheDocument()
      
      const icon = document.querySelector('.lucide-users')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Timeline Component', () => {
    const timelineItems = [
      {
        period: 'Now' as const,
        items: ['Beta platform launch', 'Partnership pilot']
      },
      {
        period: 'Next' as const,
        items: ['Scale to 10k users', 'Mobile app']
      },
      {
        period: 'Later' as const,
        items: ['International expansion']
      }
    ]

    it('renders all timeline periods and items', () => {
      render(<Timeline items={timelineItems} />)
      
      expect(screen.getByText('Now')).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeInTheDocument()
      expect(screen.getByText('Later')).toBeInTheDocument()
      
      expect(screen.getByText('Beta platform launch')).toBeInTheDocument()
      expect(screen.getByText('Scale to 10k users')).toBeInTheDocument()
      expect(screen.getByText('International expansion')).toBeInTheDocument()
    })

    it('applies correct color classes for periods', () => {
      render(<Timeline items={timelineItems} />)
      
      const timelineElements = document.querySelectorAll('[class*="rounded-full"]')
      expect(timelineElements[0]).toHaveClass('bg-teal-500') // Now
      expect(timelineElements[1]).toHaveClass('bg-coral-500') // Next
      expect(timelineElements[2]).toHaveClass('bg-neutral-400') // Later
    })
  })

  describe('BioCard Component', () => {
    it('renders bio card with initials when no image provided', () => {
      render(
        <BioCard
          name="John Doe"
          role="CEO"
          bio="Experienced leader with 10 years in healthcare."
        />
      )
      
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('CEO')).toBeInTheDocument()
      expect(screen.getByText('Experienced leader with 10 years in healthcare.')).toBeInTheDocument()
      expect(screen.getByText('JD')).toBeInTheDocument() // Initials
    })

    it('renders bio card with image when provided', () => {
      render(
        <BioCard
          name="Jane Smith"
          role="CTO"
          bio="Tech expert"
          imageUrl="https://example.com/jane.jpg"
        />
      )
      
      const image = screen.getByRole('img', { name: 'Jane Smith headshot' })
      expect(image).toHaveAttribute('src', 'https://example.com/jane.jpg')
    })

    it('renders LinkedIn link when provided', () => {
      render(
        <BioCard
          name="Bob Wilson"
          role="VP"
          bio="Sales leader"
          linkedinUrl="https://linkedin.com/in/bobwilson"
        />
      )
      
      const linkedinLink = screen.getByLabelText('Bob Wilson LinkedIn profile')
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/bobwilson')
      expect(linkedinLink).toHaveAttribute('target', '_blank')
    })

    it('generates correct initials for single and multi-word names', () => {
      const { rerender } = render(
        <BioCard name="Madonna" role="Singer" bio="Pop icon" />
      )
      expect(screen.getByText('M')).toBeInTheDocument()

      rerender(
        <BioCard name="Mary Jane Watson" role="Reporter" bio="Spider-Man's friend" />
      )
      expect(screen.getByText('MJ')).toBeInTheDocument() // Should take first two initials
    })
  })
})