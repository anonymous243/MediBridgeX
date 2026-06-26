export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/auth/sign-in',
  SIGN_UP: '/auth/sign-up',

  DASHBOARD: '/dashboard',

  MESSAGES: '/dashboard/messages',

  FHIR: '/dashboard/fhir',

  INTEGRATIONS:
    '/dashboard/integrations',

  MONITORING:
    '/dashboard/monitoring',

  SETTINGS:
    '/dashboard/settings',
  DEVELOPERS:
    '/dashboard/developers',
} as const;