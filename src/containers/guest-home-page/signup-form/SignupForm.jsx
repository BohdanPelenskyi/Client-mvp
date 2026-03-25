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
import { useState } from 'react'

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
          flexDirection: { xs: 'column', sm: 'row' },
          gap: '16px',
          width: '100%'
        }}
      >
        <AppTextField
          error={Boolean(errors.firstName)}
          fullWidth
          helperText={t(errors.firstName)}
          label='First name'
          onBlur={handleBlur('firstName')}
          onChange={handleInputChange('firstName')}
          value={data.firstName}
        />
        <AppTextField
          error={Boolean(errors.lastName)}
          fullWidth
          helperText={t(errors.lastName)}
          label='Last name'
          onBlur={handleBlur('lastName')}
          onChange={handleInputChange('lastName')}
          value={data.lastName}
        />
      </Box>

      <AppTextField
        error={Boolean(errors.email)}
        fullWidth
        helperText={t(errors.email)}
        label='Email'
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
        helperText={t(errors.password)}
        label='Password'
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
        helperText={t(errors.confirmPassword)}
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
            onChange={(e) => handleInputChange('agreement')(e.target.checked)}
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
