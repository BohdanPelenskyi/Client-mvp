import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Box, Button, Typography } from '@mui/material'

import { useModalContext } from '~/context/modal-context'
import { AuthService } from '~/services/auth-service'
import useAxios from '~/hooks/use-axios'

import imgReject from '~/assets/img/email-confirmation-modals/not-success-icon.svg'
import imgSuccess from '~/assets/img/email-confirmation-modals/success-icon.svg'
import LoginDialog from '~/containers/guest-home-page/login-dialog/LoginDialog'
import Loader from '~/components/loader/Loader'

const EmailConfirmModal = ({ confirmToken }) => {
  const { t } = useTranslation('translations')
  const { closeModal, openModal } = useModalContext()

  const styles = {
    container: {
      maxWidth: '800px', // Оптимальна ширина для великої модалки
      width: '100%',
      minHeight: '480px', // Додаємо висоти, щоб виглядало солідно
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: { xs: '40px 24px', md: '84px 100px' }, // Хороші "дихаючі" відступи
      backgroundColor: 'background.paper',
      borderRadius: '4px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      mx: 'auto'
    },
    img: {
      width: '140px',
      height: '140px',
      mb: '40px',
      display: 'block'
    },
    title: {
      color: 'primary.900',
      fontWeight: 600,
      fontSize: { xs: '24px', sm: '28px' }, // Зробив заголовок трохи більшим під ширину
      lineHeight: '1.2',
      mb: '48px',
      maxWidth: '600px'
    },
    button: {
      backgroundColor: '#263238',
      color: 'white',
      padding: '16px 64px', // Широка зручна кнопка
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: 600,
      textTransform: 'none',
      '&:hover': {
        backgroundColor: '#1a2327'
      }
    }
  }

  const serviceFunction = useCallback(
    () => AuthService.confirmEmail(confirmToken),
    [confirmToken]
  )

  const { response, error, loading } = useAxios({
    service: serviceFunction,
    defaultResponse: null
  })

  const openLoginDialog = () => {
    closeModal()
    openModal({ component: <LoginDialog /> })
  }

  if (loading) {
    return (
      <Box sx={styles.container}>
        <Loader size={100} />
      </Box>
    )
  }

  const isError =
    error?.code === 'BAD_CONFIRM_TOKEN' ||
    (error?.code === 'DOCUMENT_NOT_FOUND' && !response)
  const isAlreadyConfirmed = error?.code === 'EMAIL_ALREADY_CONFIRMED'

  // Визначаємо заголовок залежно від стану
  const getTitle = () => {
    if (isAlreadyConfirmed) return t('modals.emailAlreadyConfirm')
    if (isError) return t('modals.emailNotConfirm')
    return t('modals.emailConfirm')
  }

  return (
    <Box sx={styles.container}>
      <Box
        component='img'
        src={isError || isAlreadyConfirmed ? imgReject : imgSuccess}
        sx={styles.img}
      />

      <Typography sx={styles.title}>{getTitle()}</Typography>

      <Button
        onClick={isError && !isAlreadyConfirmed ? closeModal : openLoginDialog}
        sx={styles.button}
        variant='contained'
      >
        {isError && !isAlreadyConfirmed
          ? t('common.confirmButton')
          : t('button.goToLogin')}
      </Button>
    </Box>
  )
}

EmailConfirmModal.propTypes = {
  confirmToken: PropTypes.string.isRequired
}

export default EmailConfirmModal
