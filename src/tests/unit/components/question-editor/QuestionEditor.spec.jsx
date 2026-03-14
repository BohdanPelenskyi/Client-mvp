import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import QuestionEditor from '~/components/question-editor/QuestionEditor'
import { QuestionTypesEnum } from '~/types'

const defaultProps = {
  data: {
    type: QuestionTypesEnum.MultipleChoice,
    text: '',
    answers: [{ text: '', isCorrect: false }],
    openAnswer: ''
  },
  handleInputChange: vi.fn(() => vi.fn()),
  handleNonInputValueChange: vi.fn(),
  onCancel: vi.fn(),
  onSave: vi.fn(),
  loading: false
}

const openMenu = vi.fn()
vi.mock('~/hooks/use-menu', () => ({
  default: () => ({
    openMenu,
    closeMenu: vi.fn(),
    renderMenu: vi.fn(() => null)
  })
}))

vi.mock('~/components/app-select/AppSelect', () => ({
  default: ({ setValue, value }) => (
    <select
      data-testid='mock-select'
      onChange={(e) => setValue(e.target.value)}
      value={value}
    >
      <option value='multipleChoice'>Multiple Choice</option>
      <option value='openAnswer'>Open Answer</option>
      <option value='oneAnswer'>One Answer</option>
    </select>
  )
}))

describe('QuestionEditor', () => {
  beforeEach(() => {
    defaultProps.handleInputChange.mockClear()
    defaultProps.handleNonInputValueChange.mockClear()
    defaultProps.onCancel.mockClear()
    defaultProps.onSave.mockClear()
    openMenu.mockClear()
  })

  it('should render question input field', () => {
    render(<QuestionEditor {...defaultProps} />)

    expect(screen.getByLabelText('questionPage.question')).toBeInTheDocument()
  })

  it('should render an open answer', () => {
    render(
      <QuestionEditor
        {...defaultProps}
        data={{ ...defaultProps.data, type: QuestionTypesEnum.OpenAnswer }}
      />
    )

    expect(screen.getByLabelText('questionPage.answer')).toBeInTheDocument()
  })

  it('should change question type', () => {
    render(<QuestionEditor {...defaultProps} />)

    const select = screen.getByTestId('mock-select')
    fireEvent.change(select, {
      target: { value: QuestionTypesEnum.OpenAnswer }
    })

    expect(defaultProps.handleNonInputValueChange).toHaveBeenCalledWith(
      'type',
      QuestionTypesEnum.OpenAnswer
    )
  })

  it('should change question and answer input fields', () => {
    render(<QuestionEditor {...defaultProps} />)

    const questionInput = screen.getByLabelText('questionPage.question')
    fireEvent.change(questionInput, { target: { value: 'New question' } })

    expect(defaultProps.handleInputChange).toHaveBeenCalledWith('text')
  })

  it('should open menu when clicking more (edit title and category)', () => {
    render(<QuestionEditor {...defaultProps} isQuizQuestion />)

    const moreButton = screen.getByTestId('MoreVertIcon')
    fireEvent.click(moreButton)

    expect(openMenu).toHaveBeenCalled()
  })
})
