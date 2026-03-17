import { vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import SearchAutocomplete from '~/components/search-autocomplete/SearchAutocomplete'

const mockSearch = ''
const mockSetSearch = vi.fn()
const mockTextFieldProps = {
  label: 'Search',
  placeholder: 'Search'
}

const defaultProps = {
  search: mockSearch,
  setSearch: mockSetSearch,
  textFieldProps: mockTextFieldProps
}

const renderComponent = (props = {}) =>
  render(<SearchAutocomplete {...defaultProps} {...props} />)

describe('SearchAutocomplete', () => {
  beforeEach(() => {
    mockSetSearch.mockClear()
  })

  it('should render autocomplete with search input', () => {
    renderComponent()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('should update search input on typing', () => {
    renderComponent()
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'test' } })
    expect(searchInput.value).toBe('test')
  })

  it('should filters options on typing', () => {
    renderComponent({ options: ['Math', 'Physics', 'Chemistry'] })
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'Math' } })
    expect(screen.getByText('Math')).toBeInTheDocument()
    expect(screen.queryByText('Physics')).not.toBeInTheDocument()
    expect(screen.queryByText('Chemistry')).not.toBeInTheDocument()
  })

  it('should selects an option on click', () => {
    renderComponent({ options: ['Math', 'Physics', 'Chemistry'] })
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'Math' } })
    const option = screen.getByText('Math')
    fireEvent.click(option)
    expect(mockSetSearch).toHaveBeenCalledWith('Math')
  })

  it('should clears search input on clear icon click', () => {
    renderComponent({ search: 'Math', setSearch: mockSetSearch })
    const clearIcon = screen.getByTestId('ClearIcon').closest('button')
    fireEvent.click(clearIcon)
    expect(mockSetSearch).toHaveBeenCalledWith('')
  })

  it('should triggers search on search button click', () => {
    renderComponent({ search: '', setSearch: mockSetSearch })
    const searchInput = screen.getByPlaceholderText('Search')
    fireEvent.change(searchInput, { target: { value: 'Math' } })
    const searchButton = screen.getByText('common.search').closest('button')
    fireEvent.click(searchButton)
    expect(mockSetSearch).toHaveBeenCalledWith('Math')
  })
})
