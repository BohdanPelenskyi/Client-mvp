import { helperTextHandler, nameField, emptyField } from './common'

export const email = (value) => {
  return helperTextHandler(value, 'email')
}

export const password = (value) => {
  const basicError = helperTextHandler(value, 'password')
  if (basicError) {
    return basicError
  }

  const hasLetter = /[A-Za-z]/.test(value)
  const hasNumber = /\d/.test(value)

  if (hasLetter && hasNumber) {
    return ''
  }

  return 'common.errorMessages.passwordValid'
}

const validateName = (value) => {
  const error = nameField(value)
  if (error) {
    return error
  }

  if (value && value.length >= 2 && value.length <= 15) {
    return ''
  }

  return 'common.errorMessages.nameLength'
}

export const firstName = (value) => validateName(value)
export const lastName = (value) => validateName(value)

export const confirmPassword = (confirmPassword, data) => {
  return emptyField(
    confirmPassword,
    'common.errorMessages.emptyField',
    confirmPassword === data.password
      ? ''
      : 'common.errorMessages.passwordsDontMatch'
  )
}
