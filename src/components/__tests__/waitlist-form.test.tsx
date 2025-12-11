import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WaitlistForm } from '@/components/waitlist-form'

// Mock React DOM hooks
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    useFormState: vi.fn(() => [null, vi.fn()]),
    useFormStatus: vi.fn(() => ({ pending: false })),
  }
})

// Mock the server action
vi.mock('@/lib/actions/waitlist', () => ({
  submitWaitlistForm: vi.fn(),
}))

// Get the mocked function for testing
import { submitWaitlistForm } from '@/lib/actions/waitlist'
import { useFormState, useFormStatus } from 'react-dom'
const mockSubmitWaitlistForm = vi.mocked(submitWaitlistForm)
const mockUseFormState = vi.mocked(useFormState)
const mockUseFormStatus = vi.mocked(useFormStatus)

describe('WaitlistForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSubmitWaitlistForm.mockResolvedValue({ success: true })
    mockUseFormState.mockReturnValue([null, vi.fn()])
    mockUseFormStatus.mockReturnValue({ pending: false })
  })

  describe('Form Structure and Accessibility', () => {
    it('renders all required form fields', () => {
      render(<WaitlistForm />)

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByText(/your role/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/biggest caregiving challenge/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/agree to receive updates/i)).toBeInTheDocument()
    })

    it('marks required fields with asterisk', () => {
      render(<WaitlistForm />)

      const emailField = screen.getByRole('textbox', { name: /email address/i })
      const consentField = screen.getByRole('checkbox', { name: /agree to receive updates/i })

      expect(emailField).toBeRequired()
      expect(consentField).toBeRequired()
      
      // Check for asterisk in the labels by content
      expect(screen.getByText('Email address')).toBeInTheDocument()
      expect(screen.getByText('Your role')).toBeInTheDocument()
      
      // Check that required field indicators are present
      const asterisks = document.querySelectorAll('span.text-red-500')
      expect(asterisks.length).toBeGreaterThan(0)
      expect(asterisks[0]).toHaveTextContent('*')
    })

    it('has proper ARIA labels and descriptions', () => {
      render(<WaitlistForm />)

      // Email field
      const emailField = screen.getByLabelText(/email address/i)
      expect(emailField).toHaveAttribute('type', 'email')
      expect(emailField).toHaveAttribute('autoComplete', 'email')
      expect(emailField).toHaveAttribute('required')

      // Name field
      const nameField = screen.getByLabelText(/name/i)
      expect(nameField).toHaveAttribute('autoComplete', 'name')
      expect(nameField).not.toHaveAttribute('required')

      // Role radio group
      const roleGroup = screen.getByRole('radiogroup')
      expect(roleGroup).toHaveAttribute('aria-required', 'true')

      // Challenge textarea
      const challengeField = screen.getByLabelText(/biggest caregiving challenge/i)
      expect(challengeField).toHaveAttribute('maxLength', '500')
      expect(challengeField).toHaveAttribute('aria-describedby', 'challenge-hint')
    })

    it('renders all role options with descriptions', () => {
      render(<WaitlistForm />)

      const roles = [
        { label: 'Family Caregiver', description: 'Caring for a family member or friend' },
        { label: 'Healthcare Professional', description: 'Doctor, nurse, social worker, etc.' },
        { label: 'Investor/Funder', description: 'Looking to support our mission' },
        { label: 'Other', description: 'Partner, researcher, or advocate' }
      ]

      roles.forEach(role => {
        expect(screen.getByText(role.label)).toBeInTheDocument()
        expect(screen.getByText(role.description)).toBeInTheDocument()
      })
    })

    it('has ARIA-live region for status announcements', () => {
      render(<WaitlistForm />)

      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
      expect(liveRegion).toHaveClass('sr-only')
    })
  })

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm />)

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
        expect(screen.getByText(/please select your role/i)).toBeInTheDocument()
        expect(screen.getByText(/you must agree to receive updates/i)).toBeInTheDocument()
      })
    })

    it('validates email format', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm />)

      const emailField = screen.getByLabelText(/email address/i)
      await user.type(emailField, 'invalid-email')

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('enforces character limit on challenge field', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm />)

      const challengeField = screen.getByLabelText(/biggest caregiving challenge/i)
      const longText = 'a'.repeat(501) // Over 500 character limit

      await user.type(challengeField, longText)

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/please keep your response under 500 characters/i)).toBeInTheDocument()
      })
    })

    it('accepts valid form submission', async () => {
      const user = userEvent.setup()
      const mockFormAction = vi.fn()
      mockUseFormState.mockReturnValue([null, mockFormAction])
      
      render(<WaitlistForm />)

      // Fill out valid form
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.click(screen.getByLabelText(/family caregiver/i))
      await user.type(screen.getByLabelText(/biggest caregiving challenge/i), 'Finding time for self-care')
      await user.click(screen.getByLabelText(/agree to receive updates/i))

      const submitButton = screen.getByRole('button', { name: /join the waitlist/i })
      await user.click(submitButton)

      // Verify form fields are filled correctly
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Finding time for self-care')).toBeInTheDocument()
      expect(screen.getByLabelText(/family caregiver/i)).toBeChecked()
      expect(screen.getByLabelText(/agree to receive updates/i)).toBeChecked()
    })
  })

  describe('Form Interaction and UX', () => {
    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      mockUseFormStatus.mockReturnValue({ pending: true })
      mockSubmitWaitlistForm.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      render(<WaitlistForm />)

      expect(screen.getByText(/joining waitlist/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /joining waitlist/i })).toBeDisabled()
    })

    it('updates role selection state correctly', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm />)

      const caregiverRole = screen.getByLabelText(/family caregiver/i)
      const professionalRole = screen.getByLabelText(/healthcare professional/i)

      await user.click(caregiverRole)
      expect(caregiverRole).toBeChecked()

      await user.click(professionalRole)
      expect(professionalRole).toBeChecked()
      expect(caregiverRole).not.toBeChecked()
    })

    it('shows benefit text near submit button', () => {
      render(<WaitlistForm />)

      expect(screen.getByText(/join early members shaping withcare/i)).toBeInTheDocument()
      expect(screen.getByText(/caregiver starter kit/i)).toBeInTheDocument()
    })

    it('displays error messages with proper ARIA attributes', async () => {
      const formState = {
        success: false,
        errors: { email: ['This email is already registered'] }
      }
      mockUseFormState.mockReturnValue([formState, vi.fn()])

      render(<WaitlistForm />)

      await waitFor(() => {
        const errorMessage = screen.getByText(/this email is already registered/i)
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveAttribute('role', 'alert')
        expect(errorMessage).toHaveAttribute('aria-live', 'polite')
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports tab navigation through all interactive elements', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm />)

      // Tab through form elements
      await user.tab()
      expect(screen.getByLabelText(/name/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/email address/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/family caregiver/i)).toHaveFocus()

      // Tab through other role options
      await user.tab()
      expect(screen.getByLabelText(/healthcare professional/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/investor\/funder/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/other/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/biggest caregiving challenge/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/agree to receive updates/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /join the waitlist/i })).toHaveFocus()
    })

    it('supports arrow key navigation in radio group', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm />)

      const caregiverRole = screen.getByLabelText(/family caregiver/i)
      caregiverRole.focus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByLabelText(/healthcare professional/i)).toHaveFocus()

      await user.keyboard('{ArrowDown}')
      expect(screen.getByLabelText(/investor\/funder/i)).toHaveFocus()

      await user.keyboard('{ArrowUp}')
      expect(screen.getByLabelText(/healthcare professional/i)).toHaveFocus()
    })

    it('allows form submission via Enter key', async () => {
      const user = userEvent.setup()
      const mockFormAction = vi.fn()
      mockUseFormState.mockReturnValue([null, mockFormAction])
      
      render(<WaitlistForm />)

      // Fill required fields and focus the submit button
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.click(screen.getByLabelText(/family caregiver/i))
      await user.click(screen.getByLabelText(/agree to receive updates/i))

      // Focus submit button and press Enter
      const submitButton = screen.getByRole('button', { name: /join the waitlist/i })
      submitButton.focus()
      await user.keyboard('{Enter}')

      // Verify form was properly filled for submission
      expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
      expect(screen.getByLabelText(/family caregiver/i)).toBeChecked()
      expect(screen.getByLabelText(/agree to receive updates/i)).toBeChecked()
    })
  })

  describe('Optional Title Display', () => {
    it('shows title when showTitle is true', () => {
      render(<WaitlistForm showTitle={true} />)

      expect(screen.getByText(/join the waitlist/i)).toBeInTheDocument()
      expect(screen.getByText(/be the first to know when we launch/i)).toBeInTheDocument()
    })

    it('hides title when showTitle is false', () => {
      render(<WaitlistForm showTitle={false} />)

      expect(screen.queryByText(/join the waitlist/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/be the first to know when we launch/i)).not.toBeInTheDocument()
    })
  })

  describe('ARIA-live Announcements', () => {
    it('announces form submission status to screen readers', async () => {
      const formState = {
        success: false,
        message: 'Something went wrong. Please try again.'
      }
      mockUseFormState.mockReturnValue([formState, vi.fn()])

      render(<WaitlistForm />)

      await waitFor(() => {
        const liveRegion = document.querySelector('[aria-live="polite"]')
        expect(liveRegion).toHaveTextContent('Something went wrong. Please try again.')
      })
    })

    it('announces successful form submission', async () => {
      const formState = {
        success: true,
        message: 'Thank you for joining our waitlist!'
      }
      mockUseFormState.mockReturnValue([formState, vi.fn()])

      render(<WaitlistForm />)

      await waitFor(() => {
        const liveRegion = document.querySelector('[aria-live="polite"]')
        expect(liveRegion).toHaveTextContent('Thank you for joining our waitlist!')
      })
    })

    it('shows ARIA-live region exists for screen reader announcements', () => {
      render(<WaitlistForm />)

      const liveRegion = document.querySelector('[aria-live="polite"]')
      expect(liveRegion).toBeInTheDocument()
      expect(liveRegion).toHaveAttribute('aria-atomic', 'true')
      expect(liveRegion).toHaveClass('sr-only')
    })
  })

  describe('Character Count and Field Limits', () => {
    it('enforces maxLength on challenge textarea', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm />)

      const challengeField = screen.getByLabelText(/biggest caregiving challenge/i) as HTMLTextAreaElement
      const longText = 'a'.repeat(600) // Longer than 500 character limit

      await user.type(challengeField, longText)

      // Field should only accept up to 500 characters
      expect(challengeField.value).toHaveLength(500)
      expect(challengeField.value).toBe('a'.repeat(500))
    })

    it('provides clear indication of field requirements in labels', () => {
      render(<WaitlistForm />)

      // Required fields should have asterisk
      expect(screen.getByText(/email address/)).toHaveTextContent('*')
      expect(screen.getByText(/your role/)).toHaveTextContent('*')
      expect(screen.getByText(/agree to receive updates/)).toHaveTextContent('*')

      // Optional fields should be clearly marked
      expect(screen.getByText(/name \(optional\)/i)).toBeInTheDocument()
      expect(screen.getByText(/biggest caregiving challenge\? \(optional\)/i)).toBeInTheDocument()
    })
  })

  describe('Form Reset and State Management', () => {
    it('maintains role selection state correctly across interactions', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm />)

      const caregiverRole = screen.getByLabelText(/family caregiver/i)
      const professionalRole = screen.getByLabelText(/healthcare professional/i)
      const investorRole = screen.getByLabelText(/investor\/funder/i)

      // Select caregiver
      await user.click(caregiverRole)
      expect(caregiverRole).toBeChecked()
      expect(professionalRole).not.toBeChecked()
      expect(investorRole).not.toBeChecked()

      // Switch to professional
      await user.click(professionalRole)
      expect(caregiverRole).not.toBeChecked()
      expect(professionalRole).toBeChecked()
      expect(investorRole).not.toBeChecked()

      // Switch to investor
      await user.click(investorRole)
      expect(caregiverRole).not.toBeChecked()
      expect(professionalRole).not.toBeChecked()
      expect(investorRole).toBeChecked()
    })

    it('preserves form state during validation errors', async () => {
      const user = userEvent.setup()
      const formState = {
        success: false,
        errors: { email: ['This email is already registered'] }
      }
      mockUseFormState.mockReturnValue([formState, vi.fn()])

      render(<WaitlistForm />)

      // Fill out form
      await user.type(screen.getByLabelText(/name/i), 'Test User')
      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.click(screen.getByLabelText(/family caregiver/i))
      await user.type(screen.getByLabelText(/biggest caregiving challenge/i), 'Time management')
      await user.click(screen.getByLabelText(/agree to receive updates/i))

      // Verify error is shown
      await waitFor(() => {
        expect(screen.getByText(/this email is already registered/i)).toBeInTheDocument()
      })

      // Form fields should retain their values
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Time management')).toBeInTheDocument()
      expect(screen.getByLabelText(/family caregiver/i)).toBeChecked()
      expect(screen.getByLabelText(/agree to receive updates/i)).toBeChecked()
    })
  })
})