import './App.css'
import { BrowserRouter } from 'react-router'
import Router from './Router/Router'
import Header from './components/Header'
import { AuthProvider } from './Context/authContext'
import { CartProvider } from './Context/cartContext'
import { initMercadoPago } from '@mercadopago/sdk-react'

initMercadoPago('TEST-0eb3340e-778a-4577-a53d-999e4feab5ed');

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <Header />
        <Router />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
