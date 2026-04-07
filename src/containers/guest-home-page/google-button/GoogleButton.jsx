import { useCallback, useEffect } from 'react'
import { useHref } from 'react-router-dom'

import { useGoogleAuthMutation } from '~/services/auth-service'
import { useModalContext } from '~/context/modal-context'
import { useSnackBarContext } from '~/context/snackbar-context'
import { scrollToHash } from '~/utils/hash-scroll'
import useBreakpoints from '~/hooks/use-breakpoints'

import { snackbarVariants } from '~/constants'
import { styles } from '~/containers/guest-home-page/google-button/GoogleButton.styles'

const GoogleButton = ({ role, route, buttonWidth, type }) => {
  const ref = useHref(route)
  const mediaQuery = useBreakpoints().isLaptopAndAbove ? 'md' : 'xs'
  const { closeModal } = useModalContext()
  const { setAlert } = useSnackBarContext()
  const [googleAuth] = useGoogleAuthMutation()

  const handleCredentialResponse = useCallback(
    async (token) => {
      try {
        // Викликаємо функцію без .unwrap(), щоб уникнути помилки TypeError
        const response = await googleAuth({ token, role })

        // Перевіряємо, чи повернув RTK Query помилку всередині об'єкта
        if (response?.error) {
          throw response.error
        }

        // Якщо все успішно (статус 200 OK) — закриваємо модалку
        closeModal()
        // ОНОВЛЮЄМО СТОРІНКУ, щоб React побачив нові куки і закинув у профіль
        window.location.reload()
      } catch (e) {
        // Логуємо реальну помилку в консоль для дебагінгу
        console.error('Google Auth Error Details:', e)

        // Безпечно дістаємо код помилки або показуємо невідому помилку
        setAlert({
          severity: snackbarVariants.error,
          message: e?.data?.code
            ? `errors.${e.data.code}`
            : 'errors.UNKNOWN_ERROR'
        })

        // Якщо юзера не знайдено, перенаправляємо на відповідний блок
        if (e?.data?.code === 'USER_NOT_FOUND') {
          closeModal()
          scrollToHash(ref)
        }
      }
    },
    [googleAuth, role, closeModal, setAlert, ref]
  )

  useEffect(() => {
    const googleId = window.google.accounts.id

    googleId.initialize({
      client_id: import.meta.env.VITE_GMAIL_CLIENT_ID,
      callback: handleCredentialResponse
    })

    googleId.renderButton(document.getElementById('googleButton'), {
      size: 'large',
      width: buttonWidth[mediaQuery],
      locale: 'en',
      text: `${type}_with`
    })
  }, [handleCredentialResponse, buttonWidth, type, mediaQuery])

  return <div id='googleButton' style={styles.google} />
}

export default GoogleButton
