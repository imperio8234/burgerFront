
import './App.css'
import { AuthProvider } from './components/context/AuthContext'
import { PedidoProvider } from './components/context/orderContext'
import { Home } from './components/home/home'

function App() {

  return (
    <>
      <PedidoProvider>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </PedidoProvider>
    </>
  )
}

export default App
