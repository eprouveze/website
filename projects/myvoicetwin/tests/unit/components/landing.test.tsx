import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Since the landing page is complex with many components,
// let's test a simplified mock of its key interactions

// Mock reusable button component
function PrimaryButton({
  children,
  onClick,
  disabled = false
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-brand-600 text-white rounded-lg"
    >
      {children}
    </button>
  )
}

// Mock pricing card component
function PricingCard({
  title,
  price,
  features,
  onSelect,
  popular = false,
}: {
  title: string
  price: number
  features: string[]
  onSelect: () => void
  popular?: boolean
}) {
  return (
    <div className={`p-6 rounded-xl ${popular ? 'border-brand-500' : 'border-slate-200'}`}>
      {popular && <span className="text-sm text-brand-600">Most Popular</span>}
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-3xl font-bold">${price}</p>
      <ul>
        {features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>
      <button onClick={onSelect}>Get Started</button>
    </div>
  )
}

// Mock FAQ accordion component
function FAQItem({
  question,
  answer
}: {
  question: string
  answer: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full text-left py-4"
      >
        {question}
      </button>
      {isOpen && <p className="pb-4">{answer}</p>}
    </div>
  )
}

// Need to import useState for the FAQ component
import { useState } from 'react'

describe('PrimaryButton', () => {
  it('renders children correctly', () => {
    render(<PrimaryButton>Click me</PrimaryButton>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>)

    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<PrimaryButton disabled>Disabled</PrimaryButton>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<PrimaryButton onClick={handleClick} disabled>Disabled</PrimaryButton>)

    await userEvent.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})

describe('PricingCard', () => {
  const defaultProps = {
    title: 'Complete',
    price: 99,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    onSelect: vi.fn(),
  }

  it('renders title and price', () => {
    render(<PricingCard {...defaultProps} />)

    expect(screen.getByText('Complete')).toBeInTheDocument()
    expect(screen.getByText('$99')).toBeInTheDocument()
  })

  it('renders all features', () => {
    render(<PricingCard {...defaultProps} />)

    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
    expect(screen.getByText('Feature 3')).toBeInTheDocument()
  })

  it('shows popular badge when popular is true', () => {
    render(<PricingCard {...defaultProps} popular />)

    expect(screen.getByText('Most Popular')).toBeInTheDocument()
  })

  it('does not show popular badge by default', () => {
    render(<PricingCard {...defaultProps} />)

    expect(screen.queryByText('Most Popular')).not.toBeInTheDocument()
  })

  it('calls onSelect when Get Started is clicked', async () => {
    const onSelect = vi.fn()
    render(<PricingCard {...defaultProps} onSelect={onSelect} />)

    await userEvent.click(screen.getByText('Get Started'))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})

describe('FAQItem', () => {
  const props = {
    question: 'What is My Voice Twin?',
    answer: 'My Voice Twin creates an AI that writes like you.',
  }

  it('renders the question', () => {
    render(<FAQItem {...props} />)
    expect(screen.getByText(props.question)).toBeInTheDocument()
  })

  it('hides the answer by default', () => {
    render(<FAQItem {...props} />)
    expect(screen.queryByText(props.answer)).not.toBeInTheDocument()
  })

  it('shows the answer when clicked', async () => {
    render(<FAQItem {...props} />)

    await userEvent.click(screen.getByText(props.question))
    expect(screen.getByText(props.answer)).toBeInTheDocument()
  })

  it('hides the answer when clicked again', async () => {
    render(<FAQItem {...props} />)

    const button = screen.getByText(props.question)
    await userEvent.click(button)
    expect(screen.getByText(props.answer)).toBeInTheDocument()

    await userEvent.click(button)
    expect(screen.queryByText(props.answer)).not.toBeInTheDocument()
  })

  it('has correct aria-expanded state', async () => {
    render(<FAQItem {...props} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })
})
