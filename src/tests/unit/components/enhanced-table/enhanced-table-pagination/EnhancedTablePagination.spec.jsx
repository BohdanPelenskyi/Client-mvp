import { fireEvent, render, screen } from '@testing-library/react'
import EnhancedTablePagination from '~/components/enhanced-table/enhanced-table-pagination/EnhancedTablePagination'

const mockPagination = {
  page: 1,
  pageInput: 1,
  rowsPerPage: 10,
  pageCount: 5,
  itemsCount: 50,
  handleChangePage: vi.fn(),
  handleChangeRowsPerPage: vi.fn(),
  handleChangePageInput: vi.fn(),
  handlePageSubmit: vi.fn()
}

describe('EnhancedTablePagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render first page', () => {
    render(<EnhancedTablePagination pagination={mockPagination} />)
    const activePage = screen.getByRole('button', { current: true })
    expect(activePage).toHaveTextContent('1')
  })
  it('should change page from 1 to 2', () => {
    render(<EnhancedTablePagination pagination={mockPagination} />)
    const page2Button = screen.getByRole('button', { name: /page 2/i })
    fireEvent.click(page2Button)
    expect(mockPagination.handleChangePage).toBeCalledWith(expect.anything(), 2)
  })
})
