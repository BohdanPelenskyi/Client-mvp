import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'

import GoogleLogin from '~/containers/guest-home-page/google-login/GoogleLogin'
import SignupForm from '~/containers/guest-home-page/signup-form/SignupForm'
import { UserRoleEnum } from '~/types'
import { signup } from '~/constants'

import studentImg from '~/assets/img/register-dialog/student-register.svg'
import tutorImg from '~/assets/img/register-dialog/tutor-register.svg'

import styles from '~/containers/guest-home-page/register-dialog/RegisterDialog.styles'

const RegisterDialog = ({ role }) => {
  const isStudent = role === UserRoleEnum.Student

  return (
    <Box sx={styles.root}>
      <Box sx={styles.imgContainer}>
        <Box
          alt='signup'
          component='img'
          src={isStudent ? studentImg : tutorImg}
          sx={styles.img}
        />
      </Box>

      <Box sx={styles.formContainer}>
        <Typography sx={styles.title} variant='h2'>
          {isStudent ? 'Sign up as a student' : 'Sign up as a tutor'}
        </Typography>
        <Box sx={styles.form}>
          {/* Тільки чиста форма */}
          <SignupForm role={role} />
          {/* Один системний GoogleLogin під формою */}
          <GoogleLogin
            buttonWidth={styles.form.maxWidth}
            role={role}
            type={signup}
          />
        </Box>
      </Box>
    </Box>
  )
}

RegisterDialog.propTypes = {
  role: PropTypes.string.isRequired
}

export default RegisterDialog
