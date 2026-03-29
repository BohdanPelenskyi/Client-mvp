import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Typography
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import AppTextField from '~/components/app-text-field/AppTextField'
import useForm from '~/hooks/use-form'
import {
  firstName,
  lastName,
  email,
  password,
  confirmPassword
} from '~/utils/validations/login'

const SignupForm = ({ role }) => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { data, errors, handleBlur, handleInputChange, handleSubmit } = useForm(
    {
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreement: false
      },
      onSubmit: async () => console.log('Submit:', role, data),
      validations: { firstName, lastName, email, password, confirmPassword }
    }
  )

  const getErrorMessage = (errorKey) => {
    if (!errorKey) return ''
    return errorKey.includes('empty') || errorKey.includes('required')
      ? 'This field is required.'
      : t(errorKey)
  }

  const isFormInvalid =
    !data.firstName.trim() ||
    !data.lastName.trim() ||
    !data.email.trim() ||
    !data.password.trim() ||
    !data.confirmPassword.trim() ||
    !data.agreement ||
    Object.values(errors).some(Boolean)

  const helperTextProps = {
    sx: {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      lineHeight: '1.2'
    }
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%'
      }}
    >
      {/* ТУТ ТІЛЬКИ АДАПТАЦІЯ: XS - column, MD - row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '16px',
          width: '100%'
        }}
      >
        <AppTextField
          FormHelperTextProps={helperTextProps}
          error={Boolean(errors.firstName)}
          fullWidth
          helperText={getErrorMessage(errors.firstName)}
          label='First name'
          onBlur={handleBlur('firstName')}
          onChange={handleInputChange('firstName')}
          value={data.firstName}
        />
        <AppTextField
          FormHelperTextProps={helperTextProps}
          error={Boolean(errors.lastName)}
          fullWidth
          helperText={getErrorMessage(errors.lastName)}
          label='Last name'
          onBlur={handleBlur('lastName')}
          onChange={handleInputChange('lastName')}
          value={data.lastName}
        />
      </Box>

      <AppTextField
        FormHelperTextProps={helperTextProps}
        error={Boolean(errors.email)}
        fullWidth
        helperText={getErrorMessage(errors.email)}
        label='Email'
        onBlur={handleBlur('email')}
        onChange={handleInputChange('email')}
        value={data.email}
      />

      <AppTextField
        FormHelperTextProps={helperTextProps}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <VisibilityOff
                    color={errors.password ? 'error' : 'inherit'}
                  />
                ) : (
                  <Visibility color={errors.password ? 'error' : 'inherit'} />
                )}
              </IconButton>
            </InputAdornment>
          )
        }}
        error={Boolean(errors.password)}
        fullWidth
        helperText={getErrorMessage(errors.password)}
        label='Password'
        onBlur={handleBlur('password')}
        onChange={handleInputChange('password')}
        type={showPassword ? 'text' : 'password'}
        value={data.password}
      />

      <AppTextField
        FormHelperTextProps={helperTextProps}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <VisibilityOff
                    color={errors.confirmPassword ? 'error' : 'inherit'}
                  />
                ) : (
                  <Visibility
                    color={errors.confirmPassword ? 'error' : 'inherit'}
                  />
                )}
              </IconButton>
            </InputAdornment>
          )
        }}
        error={Boolean(errors.confirmPassword)}
        fullWidth
        helperText={getErrorMessage(errors.confirmPassword)}
        label='Confirm password'
        onBlur={handleBlur('confirmPassword')}
        onChange={handleInputChange('confirmPassword')}
        type={showConfirmPassword ? 'text' : 'password'}
        value={data.confirmPassword}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={data.agreement}
            onChange={(e) => handleInputChange('agreement')(e)}
          />
        }
        label={
          <Typography variant='body2'>
            I agree to the Terms and Privacy Policy
          </Typography>
        }
        sx={{ ml: '-8px' }}
      />

      <Button
        disabled={isFormInvalid}
        fullWidth
        size='large'
        sx={{ py: '14px', fontWeight: 600, mt: '8px' }}
        type='submit'
        variant='contained'
      >
        Sign up
      </Button>
    </Box>
  )
}

SignupForm.propTypes = { role: PropTypes.string.isRequired }
export default SignupForm
