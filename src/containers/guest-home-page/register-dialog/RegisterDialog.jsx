import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'

import GoogleLogin from '~/containers/guest-home-page/google-login/GoogleLogin'
import SignupForm from '~/containers/guest-home-page/signup-form/SignupForm'
import { UserRoleEnum } from '~/types'
import { signup } from '~/constants'

import studentImg from '~/assets/img/register-dialog/student-register.svg'
import tutorImg from '~/assets/img/register-dialog/tutor-register.svg'

import { authDialogStyles as styles } from '~/containers/guest-home-page/styles/AuthDialog.styles'

const RegisterDialog = ({ role }) => {
  const { t } = useTranslation()
  const isStudent = role === UserRoleEnum.Student
  const titleKey = isStudent ? 'signup.head.student' : 'signup.head.tutor'

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
          {t(titleKey)}
        </Typography>
        <Box sx={styles.form}>
          <SignupForm role={role} />
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

RegisterDialog.propTypes = { role: PropTypes.string.isRequired }
export default RegisterDialog
