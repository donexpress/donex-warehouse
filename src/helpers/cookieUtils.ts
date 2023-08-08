import Cookies from 'universal-cookie';

const cookies = new Cookies();

// Función para obtener el valor de una cookie
export const getCookie = (name: string): string | undefined => {
  return cookies.get(name);
};

// Función para establecer una cookie
export const setCookie = (name: string, value: string, options: any = {}): void => {
  cookies.set(name, value, options);
};

// Función para eliminar una cookie
export const removeCookie = (name: string): void => {
  cookies.remove(name);
};

// Función para la verificación de sesión
export const verifySession = () => {
  const userId = getCookie('userId'); // Obtén la cookie de sesión de la solicitud
  return !!userId; // Devuelve true si hay una sesión activa, de lo contrario, false
};