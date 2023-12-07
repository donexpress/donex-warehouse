import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Función para obtener el valor de una cookie
export const getCookie = (name: string): any | undefined => {
  return cookies.get(name);
};

// Función para establecer una cookie
export const setCookie = (name: string, value: any, options: any = {}): void => {
  cookies.set(name, value, {...{ path: '/', sameSite: 'strict'}, ...options});
};

// Función para eliminar una cookie
export const removeCookie = (name: string): void => {
  cookies.remove(name, {path: '/'});
};

// Funciones para la verificación de sesión
export const verifySessionWMS = () => {
  const token = getCookie('tokenWMS');
  return !!token;
};

export const verifySessionOMS = () => {
  const token = getCookie('tokenOMS');
  return !!token;
};

export const sessionWMSIsExpires = () => {
  const expires = getCookie('expireWMS');
  if (!!expires && (Number(expires) <= (new Date()).getTime())) {
    return true;
  }
  return false;
};

export const sessionOMSIsExpires = () => {
  const expires = getCookie('expireOMS');
  if (!!expires && (Number(expires) <= (new Date()).getTime())) {
    return true;
  }
  return false;
};

// Función para eliminar todas las cookies
export const removeAllCookies = () => {
  const allCookieNames = Object.keys(cookies.getAll());
  
  allCookieNames.forEach((cookieName: string) => {
    cookies.remove(cookieName, { path: '/'});
  });
};