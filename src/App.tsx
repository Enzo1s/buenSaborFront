import './App.css'
import { BrowserRouter } from 'react-router'
import Router from './Router/Router'
import Header from './components/Header'
import { AuthProvider } from './Context/authContext'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Router />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
