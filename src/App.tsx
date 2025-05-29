import './App.css'
import { BrowserRouter } from 'react-router'
import Router from './Router/Router'
import Header from './components/Header'
import { AuthProvider } from './Context/authContext'
import { CartProvider } from './Context/cartContext'

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
