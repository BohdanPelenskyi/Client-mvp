import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import AppRange from '~/components/app-range/AppRange'

const MIN = 0
const MAX = 100
const defaultProps = {
  min: MIN,
  max: MAX,
  onChange: vi.fn()
}

vi.mock('~/hooks/use-debounce', () => ({
  useDebounce: (fn) => fn
}))

vi.mock('@mui/material/Slider', () => ({
  default: ({ onChange, value, ...rest }) => (
    <input
      data-testid='mock-slider'
      {...rest}
      onChange={(e) => {
        const val = JSON.parse(e.target.value || '[]')
        onChange?.({}, val)
      }}
      value={JSON.stringify(value)}
    />
  )
}))

describe('AppRange', () => {
  beforeEach(() => {
    defaultProps.onChange.mockClear()
  })

  it('should render correctly', () => {
    render(<AppRange {...defaultProps} />)

    expect(screen.getByTestId('mock-slider')).toBeInTheDocument()
    expect(screen.getByDisplayValue(MIN.toString())).toBeInTheDocument()
    expect(screen.getByDisplayValue(MAX.toString())).toBeInTheDocument()
    expect(screen.getByText('common.from')).toBeInTheDocument()
    expect(screen.getByText('common.to')).toBeInTheDocument()
  })

  it('should call onChange when slider is moved', () => {
    render(<AppRange {...defaultProps} />)

    const slider = screen.getByTestId('mock-slider')
    fireEvent.change(slider, { target: { value: '[20, 80]' } })

    expect(defaultProps.onChange).toHaveBeenCalledWith([20, 80])
  })

  it('should call onChange when input is changed', () => {
    render(<AppRange {...defaultProps} />)

    const fromInput = screen.getByDisplayValue('0')
    fireEvent.change(fromInput, { target: { value: '30' } })

    expect(defaultProps.onChange).toHaveBeenCalledWith([30, 100])
  })

  it('should not call onChange when input is changed with not a number', () => {
    render(<AppRange {...defaultProps} />)

    const fromInput = screen.getByDisplayValue('0')
    fireEvent.change(fromInput, { target: { value: 'abc' } })

    expect(defaultProps.onChange).not.toHaveBeenCalled()
  })

  it('should call onChange with min number if input is empty', () => {
    render(<AppRange {...defaultProps} value={[10, MAX]} />)

    const fromInput = screen.getByDisplayValue('10')
    fireEvent.change(fromInput, { target: { value: '' } })

    expect(defaultProps.onChange).toHaveBeenCalledWith([MIN, MAX])
  })

  it('should update prices when input is blurred and input is greater than max value', () => {
    render(<AppRange {...defaultProps} />)

    const toInput = screen.getByDisplayValue('100')
    fireEvent.change(toInput, { target: { value: '150' } })
    fireEvent.blur(toInput)

    expect(toInput).toHaveValue('100')
  })

  it('should not update prices when input is blurred and value in input has not changed', () => {
    render(<AppRange {...defaultProps} value={[20, 80]} />)

    const fromInput = screen.getByDisplayValue('20')
    expect(fromInput).toHaveValue('20')
    fireEvent.blur(fromInput, { target: { value: '20' } })

    expect(fromInput).toHaveValue('20')
  })
})
