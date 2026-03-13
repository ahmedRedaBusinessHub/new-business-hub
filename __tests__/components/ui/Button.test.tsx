import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../utils/test-providers'
import { Button } from '@/components/ui/Button'

describe('Button Component Props Type Tests', () => {
  describe('Type Safety', () => {
    it('should accept all variant types', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const

      variants.forEach((variant) => {
        const { container } = renderWithProviders(
          <Button variant={variant}>Test Button</Button>
        )
        const button = container.querySelector('button')
        expect(button).toBeInTheDocument()
      })
    })

    it('should accept all size types', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const

      sizes.forEach((size) => {
        const { container } = renderWithProviders(
          <Button size={size}>Test Button</Button>
        )
        const button = container.querySelector('button')
        expect(button).toBeInTheDocument()
      })
    })

    it('should accept asChild boolean prop', () => {
      const { rerender, container } = renderWithProviders(
        <Button asChild={false}>Test Button</Button>
      )
      expect(container.querySelector('button')).toBeInTheDocument()

      rerender(
        <Button asChild={true}>
          <span>Wrapped</span>
        </Button>
      )
      expect(container.querySelector('span')).toBeInTheDocument()
    })

    it('should accept all standard button props', () => {
      const handleClick = vi.fn()
      const { container } = renderWithProviders(
        <Button
          onClick={handleClick}
          disabled
          type="submit"
          name="test-button"
          value="test-value"
          aria-label="Test Button"
        >
          Test Button
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('name', 'test-button')
      expect(button).toHaveAttribute('value', 'test-value')
      expect(button).toHaveAttribute('aria-label', 'Test Button')
    })

    it('should accept className prop', () => {
      const { container } = renderWithProviders(
        <Button className="custom-class">Test Button</Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should accept children as ReactNode', () => {
      const { container } = renderWithProviders(
        <Button>
          <span>Icon</span> Text
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Type Inference', () => {
    it('should correctly infer onClick handler type', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()

      renderWithProviders(<Button onClick={handleClick}>Click Me</Button>)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should accept disabled prop without TypeScript errors', () => {
      const { container } = renderWithProviders(
        <Button disabled={true}>Disabled Button</Button>
      )
      const button = container.querySelector('button')
      expect(button).toBeDisabled()
    })

    it('should accept form related props', () => {
      const { container } = renderWithProviders(
        <Button form="test-form" formAction="/submit" formMethod="post">
          Submit
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('formAction', '/submit')
      expect(button).toHaveAttribute('formMethod', 'post')
    })
  })

  describe('Accessibility Props', () => {
    it('should accept ARIA props', () => {
      const { container } = renderWithProviders(
        <Button aria-label="Close dialog" aria-pressed={false}>
          Close
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('aria-label', 'Close dialog')
      expect(button).toHaveAttribute('aria-pressed', 'false')
    })

    it('should accept data attributes', () => {
      const { container } = renderWithProviders(
        <Button data-testid="test-button" data-id="123">
          Test
        </Button>
      )
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('data-testid', 'test-button')
      expect(button).toHaveAttribute('data-id', '123')
    })
  })
})
