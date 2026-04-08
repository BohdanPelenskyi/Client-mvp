import { lazy } from 'react'
import { Route } from 'react-router-dom'

import { guestRoutes } from '~/router/constants/guestRoutes'
import { privacyPolicy } from '~/router/constants/crumbs'

const CookiePolicy = lazy(() => import('~/pages/cookie-policy/CookiePolicy'))
// ДОДАЄМО СЮДИ ТВІЙ ФАЙЛ ПІДТВЕРДЖЕННЯ
const EmailConfirmation = lazy(
  () => import('~/pages/email-confirmation/EmailConfirmation')
)

export const guestRouter = (
  <>
    <Route
      element={<CookiePolicy />}
      handle={{
        crumb: privacyPolicy
      }}
      path={guestRoutes.privacyPolicy.route}
    />

    {/* ДОДАЄМО САМ МАРШРУТ */}
    <Route
      element={<EmailConfirmation />}
      path={guestRoutes.confirmEmail.route}
    />
  </>
)
