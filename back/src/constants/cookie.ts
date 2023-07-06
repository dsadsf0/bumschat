import { CookieOptions } from "express";

export const COOKIE_LIFE_TIME = 1000 * 60 * 60 * 24 * 30;
export const COOKIE_OPTIONS: CookieOptions = { maxAge: COOKIE_LIFE_TIME, httpOnly: true, secure: true, sameSite: 'none' };