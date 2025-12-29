import { cookies } from "next/headers";

export const AUTH_TOKEN_COOKIE_NAME = "ograph_do_app_token";

export const getAuthTokenCookie = async () => {
  if (typeof window !== "undefined") return "";
  const cookieStore = cookies();
  return (await cookieStore).get(AUTH_TOKEN_COOKIE_NAME)?.value;
};

export const checkLoggedIn = async () => {
  const cookieStore = cookies();
  const isLoggedIn = !!(await cookieStore).get(AUTH_TOKEN_COOKIE_NAME);
  return isLoggedIn;
};
