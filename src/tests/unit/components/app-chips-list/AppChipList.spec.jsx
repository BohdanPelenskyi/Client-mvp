import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, vi, it } from 'vitest'
import AppChipList from '~/components/app-chips-list/AppChipList'

const handleChipDeleteMock = vi.fn()

const items = [
  'English',
  'Spanish',
  'French',
  'German',
  'Polish',
  'Ukrainian',
  'Japanese',
  'Korean',
  'Portuguese',
  'Chinese'
]

describe('AppChipList', () => {
  beforeEach(() => {
    handleChipDeleteMock.mockClear()
  })

  it('should show chips', () => {
    render(<AppChipList defaultQuantity={items.length} items={items} />)

    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Chinese')).toBeInTheDocument()
  })

  it('should show chip with +3', () => {
    render(<AppChipList defaultQuantity={items.length - 3} items={items} />)

    expect(screen.getByTestId('amount-of-chips')).toHaveTextContent('+3')
  })

  it.each([{ count: 7 }, { count: 10 }])(
    'should show only $count chips',
    ({ count }) => {
      render(<AppChipList defaultQuantity={count} items={items} />)

      const chips = screen.queryAllByTestId('chip')
      expect(chips.length).toBe(count)
    }
  )

  it('should delete 1 chip', () => {
    render(
      <AppChipList
        defaultQuantity={items.length}
        handleChipDelete={handleChipDeleteMock}
        items={items}
      />
    )
    const firstCloseBtn = screen.queryAllByTestId('close-btn')[0]

    fireEvent.click(firstCloseBtn)

    expect(handleChipDeleteMock).toHaveBeenCalledTimes(1)
    expect(handleChipDeleteMock).toHaveBeenCalledWith(items[0])
  })
})
