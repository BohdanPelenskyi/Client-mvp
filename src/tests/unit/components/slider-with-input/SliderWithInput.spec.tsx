import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SliderWithInput from '~/components/slider-with-input/SliderWithInput'
import { checkNumberIsInRange } from '~/utils/range-filter'

vi.mock('~/hooks/use-debounce', () => ({
  useDebounce: (callback: (value: number) => void) => callback
}))

vi.mock('~/utils/range-filter', async () => {
  const actual = await vi.importActual<typeof import('~/utils/range-filter')>(
    '~/utils/range-filter'
  )

  return {
    ...actual,
    createMarks: vi.fn(() => []),
    checkNumberIsInRange: vi.fn(
      ({
        inputValue,
        min,
        max
      }: {
        inputValue: number | null
        min: number
        max: number
      }) => {
        if (inputValue === null || Number.isNaN(inputValue)) return min
        if (inputValue < min) return min
        if (inputValue > max) return max
        return inputValue
      }
    )
  }
})

vi.mock('@mui/material/Slider', () => ({
  default: ({
    value,
    min,
    max,
    onChange
  }: {
    value: number
    min: number
    max: number
    onChange: (_event: Event, value: number) => void
  }) => (
    <input
      aria-label='slider'
      max={max}
      min={min}
      onChange={(event) =>
        onChange(event as unknown as Event, Number(event.target.value))
      }
      type='range'
      value={value}
    />
  )
}))

describe('SliderWithInput', () => {
  const defaultProps = {
    defaultValue: 100,
    title: 'Price',
    min: 50,
    max: 500,
    onChange: vi.fn()
  }

  const renderComponent = (props = {}) => {
    const onChange = vi.fn()

    render(<SliderWithInput {...defaultProps} {...props} onChange={onChange} />)

    return {
      onChange,
      slider: screen.getByRole('slider'),
      input: screen.getByRole('textbox')
    }
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with initial values', () => {
    const { slider, input } = renderComponent()

    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(slider).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input).toHaveDisplayValue('100')
  })

  it('calls onChange when slider value changes', () => {
    const { slider, onChange } = renderComponent()

    fireEvent.change(slider, { target: { value: '200' } })

    expect(onChange).toHaveBeenCalledWith(200)
  })

  it('handles empty input and calls onChange with min value', async () => {
    const user = userEvent.setup()
    const { input, onChange } = renderComponent()

    await user.clear(input)

    expect(input).toHaveDisplayValue('')
    expect(checkNumberIsInRange).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith(50)
  })

  it('does NOT call onChange on blur if value has not changed', () => {
    const { input, onChange } = renderComponent()

    fireEvent.blur(input)

    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveDisplayValue('100')
  })

  it('clamps value to max on blur when input exceeds max', async () => {
    const user = userEvent.setup()
    const { input } = renderComponent()

    await user.clear(input)
    await user.type(input, '999')

    fireEvent.blur(input)

    expect(checkNumberIsInRange).toHaveBeenLastCalledWith({
      inputValue: 999,
      min: 50,
      max: 500
    })

    expect(input).toHaveDisplayValue('500')
  })
})
