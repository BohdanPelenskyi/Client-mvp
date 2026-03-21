import { vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilterInput from '~/components/search-filter-input/SearchFilterInput'

const defaultProps = {
  updateFilter: vi.fn(),
  textFieldProps: {}
}

const renderComponent = (props = {}) =>
  render(<SearchFilterInput {...defaultProps} {...props} />)

describe('SearchFilterInput', () => {
  beforeEach(() => {
    defaultProps.updateFilter.mockClear()
  })

  it('should render component with input in it', () => {
    renderComponent()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should render typed text correctly', () => {
    renderComponent()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input).toHaveValue('test')
  })

  it('should delete typed text when delete button is clicked', () => {
    renderComponent()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    const clearButton = screen.getByTestId('clearIcon')
    fireEvent.click(clearButton)
    expect(defaultProps.updateFilter).toHaveBeenCalledWith('')
  })

  it('should call updateFilter function on search button click', () => {
    renderComponent()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    const searchButton = screen.getByText('common.search')
    fireEvent.click(searchButton)
    expect(defaultProps.updateFilter).toHaveBeenCalledWith('test')
  })

  it('should call updateFilter function when enter is pressed', async () => {
    renderComponent()
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test{enter}')
    expect(defaultProps.updateFilter).toHaveBeenCalledWith('test')
  })
})
