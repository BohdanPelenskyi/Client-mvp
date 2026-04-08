import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Box, Typography, IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { useModalContext } from '~/context/modal-context'
import { AuthService } from '~/services/auth-service'

import imgReject from '~/assets/img/email-confirmation-modals/not-success-icon.svg'
import imgSuccess from '~/assets/img/email-confirmation-modals/success-icon.svg'
import imgInfo from '~/assets/img/email-confirmation-modals/i.svg'
import LoginDialog from '~/containers/guest-home-page/login-dialog/LoginDialog'
import Loader from '~/components/loader/Loader'

let isRequestTriggered = false

const EmailConfirmModal = ({ confirmToken, email }) => {
  const { t } = useTranslation('translations')
  const { closeModal, openModal } = useModalContext()

  const isPending = confirmToken === 'verification-pending'
  const [loading, setLoading] = useState(!isPending)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isPending || isRequestTriggered) return

    const verifyEmailOnServer = async () => {
      isRequestTriggered = true
      setLoading(true)
      try {
        await AuthService.confirmEmail(confirmToken)
        setError(null)
      } catch (err) {
        const errorCode = err?.response?.data?.code || 'BAD_CONFIRM_TOKEN'
        setError({ code: errorCode })
      } finally {
        setLoading(false)
      }
    }

    verifyEmailOnServer()
  }, [confirmToken, isPending])

  const styles = {
    container: {
      maxWidth: '744px',
      width: '100%',
      minHeight: '396px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: { xs: '30px 20px', md: '50px 70px' },
      backgroundColor: 'background.paper',
      borderRadius: '4px',
      boxSizing: 'border-box',
      mx: 'auto',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      right: '16px',
      top: '16px',
      color: 'primary.900'
    },
    img: {
      width: '120px',
      height: '120px',
      mb: '32px',
      display: 'block'
    },
    title: {
      color: 'primary.900',
      fontWeight: 700,
      fontSize: '32px',
      lineHeight: '1.2',
      mb: '24px'
    },
    description: {
      color: 'primary.900',
      fontSize: '18px',
      lineHeight: '1.6',
      maxWidth: '580px'
    },
    email: {
      fontWeight: 700
    },
    // ОНОВЛЕНІ СТИЛІ ДЛЯ ФІНАЛЬНОЇ КНОПКИ (Go to login / OK)
    actionButton: {
      backgroundColor: '#263238', // Темний колір з макета
      color: 'white',
      padding: '12px 64px', // Вертикальний і горизонтальний відступи
      borderRadius: '4px',
      fontSize: '18px', // Більший шрифт
      fontWeight: 700,
      textTransform: 'none', // Прибираємо CAPS LOCK
      mt: '40px', // Відступ від заголовка
      minWidth: '220px', // Щоб вона була компактною, але не занадто маленькою
      '&:hover': {
        backgroundColor: '#1a2327'
      }
    }
  }

  const handleClose = () => {
    isRequestTriggered = false
    window.history.replaceState({}, document.title, '/')
    closeModal()
  }

  const handleGoToLogin = () => {
    handleClose()
    openModal({ component: <LoginDialog /> })
  }

  if (loading)
    return (
      <Box sx={styles.container}>
        <Loader size={100} />
      </Box>
    )

  // Стан після реєстрації: ТІЛЬКИ ХРЕСТИК, БЕЗ КНОПКИ
  if (isPending) {
    return (
      <Box sx={styles.container}>
        <IconButton onClick={handleClose} sx={styles.closeButton}>
          <CloseIcon />
        </IconButton>

        <Box component='img' src={imgInfo} sx={styles.img} />

        <Typography sx={styles.title}>
          {t(
            'modals.emailAddressNeedVerify',
            'Your email address needs to be verified'
          )}
        </Typography>

        <Typography sx={styles.description}>
          {t('modals.emailConfirmSentTo', 'We sent a confirmation email to: ')}
          <Box component='span' sx={styles.email}>
            {email}
          </Box>
          {t(
            'modals.checkEmailInstructions',
            '. Check your email and click on the confirmation button to continue.'
          )}
        </Typography>
      </Box>
    )
  }

  const isAlreadyConfirmed = error?.code === 'EMAIL_ALREADY_CONFIRMED'
  const isError = error !== null && !isAlreadyConfirmed

  // Стан після кліку по лінку: ТУТ КНОПКА ПОТРІБНА (Go to login / OK)
  return (
    <Box sx={styles.container}>
      <IconButton onClick={handleClose} sx={styles.closeButton}>
        <CloseIcon />
      </IconButton>

      <Box
        component='img'
        src={isError ? imgReject : imgSuccess}
        sx={styles.img}
      />

      <Typography sx={styles.title}>
        {isAlreadyConfirmed
          ? t('modals.emailAlreadyConfirm')
          : isError
            ? t('modals.emailNotConfirm')
            : t('modals.emailConfirm')}
      </Typography>

      {/* ТУТ МИ СТАВИМО ФІНАЛЬНУ КНОПКУ ЯК НА МАКЕТІ */}
      <Button
        onClick={isError ? handleClose : handleGoToLogin}
        sx={styles.actionButton}
        variant='contained'
        // fullWidth={false} // Можна додати, якщо Material-UI автоматично її розтягує
      >
        {isError ? t('common.confirmButton') : t('button.goToLogin')}
      </Button>
    </Box>
  )
}

EmailConfirmModal.propTypes = {
  confirmToken: PropTypes.string.isRequired,
  email: PropTypes.string
}

export default EmailConfirmModal
