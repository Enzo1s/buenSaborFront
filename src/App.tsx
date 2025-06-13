import './App.css'
import { BrowserRouter } from 'react-router'
import Router from './Router/Router'
import Header from './components/Header'
import { AuthProvider } from './Context/authContext'
import { CartProvider } from './Context/cartContext'
import { initMercadoPago } from '@mercadopago/sdk-react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

initMercadoPago('TEST-0eb3340e-778a-4577-a53d-999e4feab5ed');

function App() {

  return (
    <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <AuthProvider>
        <CartProvider>
        <Header />
        <Router />
        </CartProvider>
      </AuthProvider>
      </LocalizationProvider>
    </BrowserRouter>
  )
}

export default App
