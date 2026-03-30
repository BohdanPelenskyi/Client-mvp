import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import LoginDialog from '~/containers/guest-home-page/login-dialog/LoginDialog'
import GoogleButton from '~/containers/guest-home-page/google-button/GoogleButton'
import { useModalContext } from '~/context/modal-context'
import { guestRoutes } from '~/router/constants/guestRoutes'
import { UserRoleEnum } from '~/types'

import { styles } from '~/containers/guest-home-page/google-login/GoogleLogin.styles'

const GoogleLogin = ({ type, buttonWidth, role }) => {
  const { t } = useTranslation()
  const { whatCanYouDo } = guestRoutes.navBar
  const { openModal, closeModal } = useModalContext()

  const openLoginDialog = () => {
    closeModal()
    setTimeout(() => openModal({ component: <LoginDialog /> }), 0)
  }

  const haveAccountText =
    role === UserRoleEnum.Student
      ? t('signup.haveAccount.student')
      : t('signup.haveAccount.tutor')

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}
    >
      <Box sx={{ ...styles.linesBox, width: '100%', ml: 0, mt: '16px' }}>
        <Typography sx={styles.continue} variant='body2'>
          {t('signup.continue')}
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          mt: '8px',
          '& > div': { width: '100% !important' },
          '& button': { width: '100% !important' }
        }}
      >
        <GoogleButton
          buttonWidth={buttonWidth}
          role={role}
          route={whatCanYouDo.path}
          type={type}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          mt: '8px',
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <Typography variant='body2'>{haveAccountText}</Typography>
        <Typography
          onClick={openLoginDialog}
          sx={{
            ml: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            textDecoration: 'underline',
            color: 'primary.700'
          }}
          variant='body2'
        >
          {t('signup.joinUs')}
        </Typography>
      </Box>
    </Box>
  )
}

GoogleLogin.propTypes = {
  type: PropTypes.string.isRequired,
  buttonWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  role: PropTypes.string
}

export default GoogleLogin
