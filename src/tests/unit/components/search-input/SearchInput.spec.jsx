import { render, screen, fireEvent } from '@testing-library/react'
import { expect, vi } from 'vitest'

import SearchInput from '~/components/search-input/SearchInput'

const search = 'test'
const setSearch = vi.fn()

describe('SearchInput', () => {
  beforeEach(() => {
    render(<SearchInput search={search} setSearch={setSearch} />)
  })

  it('renders search input', () => {
    const searchText = screen.getByDisplayValue(search)

    expect(searchText).toBeInTheDocument()
  })

  it('should call setSearch when search icon is clicked', () => {
    const searchIcon = screen.getByTestId('search-icon')

    fireEvent.click(searchIcon)
    expect(setSearch).toHaveBeenCalled()
  })

  it('should call empty setSerch when delete icon cliked', () => {
    const deleteIcon = screen.getByTestId('delete-icon')

    fireEvent.click(deleteIcon)
    expect(setSearch).toHaveBeenCalledWith('')
  })

  it('it should call setSearch when enter is pressed', () => {
    const searchInput = screen.getByDisplayValue(search)
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 13 })
    expect(setSearch).toHaveBeenCalledWith(search)
  })

  it('it should have visible class if search is empty', () => {
    const deleteIcon = screen.getByTestId('delete-icon')
    const searchInput = screen.getByDisplayValue(search)

    fireEvent.change(searchInput, { target: { value: '' } })
    expect(deleteIcon).toHaveClass('hidden')
  })

  it('it should have hidden class if search is not empty', () => {
    const deleteIcon = screen.getByTestId('delete-icon')

    expect(deleteIcon).toHaveClass('visible')
  })
})
