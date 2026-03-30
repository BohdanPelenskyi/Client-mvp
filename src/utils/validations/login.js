import { helperTextHandler, nameField, emptyField } from './common'

export const email = (value) => {
  return helperTextHandler(value, 'email')
}

export const password = (value) => {
  return helperTextHandler(value, 'password')
}

export const signupPassword = (value) => {
  const basicError = helperTextHandler(value, 'password')
  if (basicError) return basicError

  const hasLetter = /[A-Za-z]/.test(value)
  const hasNumber = /\d/.test(value)

  return hasLetter && hasNumber ? '' : 'common.errorMessages.passwordValid'
}

const validateName = (value) => {
  const error = nameField(value)
  if (error) return error

  return value && value.length >= 2 && value.length <= 15
    ? ''
    : 'common.errorMessages.nameLength'
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
