import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import GoogleLogin from '~/containers/guest-home-page/google-login/GoogleLogin'
import LoginForm from '~/containers/guest-home-page/login-form/LoginForm'
import useForm from '~/hooks/use-form'
import { authService } from '~/services/auth-service'
import { useModalContext } from '~/context/modal-context'
import { useSnackBarContext } from '~/context/snackbar-context'
import { email, password } from '~/utils/validations/login'
import loginImg from '~/assets/img/login-dialog/login.svg'
import { login, snackbarVariants } from '~/constants'

import styles from '~/containers/guest-home-page/login-dialog/LoginDialog.styles'

const LoginDialog = () => {
  const { t } = useTranslation()
  const { closeModal } = useModalContext()
  const { setAlert } = useSnackBarContext()

  // Функція для обробки успішного входу (спільна для форми та Google)
  const handleSuccessLogin = () => {
    closeModal()
    // Перезавантаження обов'язкове, щоб Redux побачив accessToken у куках
    globalThis.location.reload()
  }

  // Функція для обробки помилок (спільна)
  const handleLoginError = (e) => {
    console.error('Login Error:', e)
    // Безпечне отримання коду помилки, щоб уникнути TypeError: cannot read properties of undefined
    const errorCode = e?.response?.data?.code || e?.data?.code || 'loginFailed'

    setAlert({
      severity: snackbarVariants.error,
      message: t(`errors.${errorCode}`)
    })
  }

  const { handleSubmit, handleInputChange, handleBlur, data, errors } = useForm(
    {
      onSubmit: async () => {
        try {
          await authService.login(data)
          handleSuccessLogin()
        } catch (e) {
          handleLoginError(e)
        }
      },
      initialValues: { email: '', password: '' },
      validations: { email, password }
    }
  )

  return (
    <Box sx={styles.root}>
      <Box sx={styles.imgContainer}>
        <Box alt='login' component='img' src={loginImg} sx={styles.img} />
      </Box>

      <Box sx={styles.formContainer}>
        <Typography sx={styles.title} variant='h2'>
          {t('login.head')}
        </Typography>
        <Box sx={styles.form}>
          <LoginForm
            data={data}
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleInputChange}
            handleSubmit={handleSubmit}
          />

          {/* Компонент GoogleLogin автоматично використовує мутацію з auth-service.ts */}
          <GoogleLogin buttonWidth={styles.form.maxWidth} type={login} />
        </Box>
      </Box>
    </Box>
  )
}

export default LoginDialog
