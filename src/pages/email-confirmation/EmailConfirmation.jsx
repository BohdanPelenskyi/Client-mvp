import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useModalContext } from '~/context/modal-context'
import EmailConfirmModal from '~/containers/email-confirm-modal/EmailConfirmModal'

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { openModal } = useModalContext()

  // Цей ref захистить нас від бага React 18 (подвійного відкриття)
  const isModalOpened = useRef(false)

  useEffect(() => {
    if (token && !isModalOpened.current) {
      isModalOpened.current = true // Кажемо React, що модалка вже відкривається

      openModal({
        component: <EmailConfirmModal confirmToken={token} />,
        closeOnBackdropClick: false
      })
    }
  }, [token, openModal])

  // Замість null покажемо текст, щоб розуміти, що сторінка реально працює
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}
    >
      <h2>...</h2>
    </div>
  )
}

export default EmailConfirmation
