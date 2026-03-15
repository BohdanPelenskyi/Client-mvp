import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AppContentSwitcher from '~/components/app-content-switcher/AppContentSwitcher'

const mockSwitchOptions = {
  left: { text: 'Left Option', tooltip: 'Left Tooltip' },
  right: { text: 'Right Option', tooltip: 'Right Tooltip' }
}

const mockOnChange = vi.fn()

const defaultProps = {
  active: false,
  onChange: mockOnChange,
  switchOptions: mockSwitchOptions,
  typographyVariant: 'body1'
}

const renderComponent = (props = {}) =>
  render(<AppContentSwitcher {...defaultProps} {...props} />)

describe('AppContentSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with the correct props', () => {
    renderComponent({ active: true })

    expect(screen.getByText('Left Option')).toBeInTheDocument()
    expect(screen.getByText('Right Option')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should call the onChange function when the switch is clicked', () => {
    renderComponent()

    fireEvent.click(screen.getByRole('checkbox'))

    expect(mockOnChange).toHaveBeenCalledOnce()
  })

  it('should renders tooltips when tooltip props are passed', async () => {
    renderComponent()

    fireEvent.mouseOver(screen.getByText('Left Option'))

    const leftTooltip = await screen.findByText('Left Tooltip')

    expect(leftTooltip).toBeInTheDocument()

    fireEvent.mouseOver(screen.getByText('Right Option'))

    const rightTooltip = await screen.findByText('Right Tooltip')

    expect(rightTooltip).toBeInTheDocument()
  })
})
