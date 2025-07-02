import './App.css';
import { useEffect, useState } from 'react';
import { AuthProvider } from './components/context/AuthContext';
import { PedidoProvider } from './components/context/orderContext';
import { Home } from './components/home/home';
import ModalRenovarToken from './components/auth/renovarToken';

function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setShowModal(true);
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  return (
    <>
      {showModal && <ModalRenovarToken onClose={() => setShowModal(false)} />}

      <PedidoProvider>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </PedidoProvider>
    </>
  );
}

export default App;
