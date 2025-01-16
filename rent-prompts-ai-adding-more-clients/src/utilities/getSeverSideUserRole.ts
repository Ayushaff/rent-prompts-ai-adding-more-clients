import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

type UserToken = {
  role: 'admin' | 'entAdmin' | 'professional' | 'entUser' | 'user'
}
export const getUserRole = (cookies: NextRequest['cookies'] | ReadonlyRequestCookies) => {
  const token = cookies.get('payload-token')?.value
  if (token) {
    const user = jwtDecode<UserToken>(token)
    return user.role
  }
  return 'null'
}
