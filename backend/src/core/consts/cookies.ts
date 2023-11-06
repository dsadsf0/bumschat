export const MILLISECONDS_IN_DAY = 86400000;
export const MILLISECONDS_IN_MONTH = MILLISECONDS_IN_DAY * 30;
export const COOKIE_OPTIONS = { httpOnly: true, maxAge: MILLISECONDS_IN_MONTH, secure: false, sameSite: 'strict' } as const;
