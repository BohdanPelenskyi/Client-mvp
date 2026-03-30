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
import { authService } from '~/services/auth-service'
import { useModalContext } from '~/context/modal-context'
import { useSnackBarContext } from '~/context/snackbar-context'
import { snackbarVariants } from '~/constants'
import {
  firstName,
  lastName,
  email,
  signupPassword as password,
  confirmPassword
} from '~/utils/validations/login'

const SignupForm = ({ role }) => {
  const { t } = useTranslation()
  const { closeModal } = useModalContext()
  const { setAlert } = useSnackBarContext()
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
      onSubmit: async () => {
        try {
          await authService.signup({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            role
          })
          closeModal()
        } catch (e) {
          setAlert({
            severity: snackbarVariants.error,
            message: e.response?.data?.code
              ? `errors.${e.response.data.code}`
              : 'common.errorMessages.signupFailed'
          })
        }
      },
      validations: { firstName, lastName, email, password, confirmPassword }
    }
  )

  const isFormInvalid =
    !data.agreement ||
    !data.firstName.trim() ||
    !data.lastName.trim() ||
    !data.email.trim() ||
    !data.password.trim() ||
    !data.confirmPassword.trim() ||
    Object.values(errors).some(Boolean)

  const getErrorMessage = (errorKey) => (errorKey ? t(errorKey) : '')

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: '16px'
        }}
      >
        <AppTextField
          error={Boolean(errors.firstName)}
          fullWidth
          helperText={getErrorMessage(errors.firstName)}
          label={t('common.labels.firstName')}
          onBlur={handleBlur('firstName')}
          onChange={handleInputChange('firstName')}
          value={data.firstName}
        />
        <AppTextField
          error={Boolean(errors.lastName)}
          fullWidth
          helperText={getErrorMessage(errors.lastName)}
          label={t('common.labels.lastName')}
          onBlur={handleBlur('lastName')}
          onChange={handleInputChange('lastName')}
          value={data.lastName}
        />
      </Box>

      <AppTextField
        error={Boolean(errors.email)}
        fullWidth
        helperText={getErrorMessage(errors.email)}
        label={t('common.labels.email')}
        onBlur={handleBlur('email')}
        onChange={handleInputChange('email')}
        value={data.email}
      />

      <AppTextField
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        error={Boolean(errors.password)}
        fullWidth
        helperText={getErrorMessage(errors.password)}
        label={t('common.labels.password')}
        onBlur={handleBlur('password')}
        onChange={handleInputChange('password')}
        type={showPassword ? 'text' : 'password'}
        value={data.password}
      />

      <AppTextField
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        error={Boolean(errors.confirmPassword)}
        fullWidth
        helperText={getErrorMessage(errors.confirmPassword)}
        label={t('common.labels.confirmPassword')}
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
            {t('signup.iAgree')} {t('common.labels.terms')} {t('signup.and')}{' '}
            {t('common.labels.privacyPolicy')}
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
        {t('common.labels.signup')}
      </Button>
    </Box>
  )
}

SignupForm.propTypes = { role: PropTypes.string.isRequired }
export default SignupForm
