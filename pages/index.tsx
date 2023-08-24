import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de inicio de inglés por defecto
    const timer = setTimeout(() => {
      router.push('/es/oms');
    }, 1000);

    // Limpiar el temporizador cuando el componente se desmonte
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1>You are being redirected to the home page...</h1>
    </div>
  );
}