import Cookies from 'js-cookie'

const COOKIE_NAME = 'hidden'
const EXPIRES = 1

export function persistHiddenState (state) {
  Cookies.set(COOKIE_NAME, +state, { expires: EXPIRES })
}

export function getHiddenState () {
  return !!parseInt(Cookies.get(COOKIE_NAME), 2)
}
