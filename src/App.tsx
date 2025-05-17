import './App.css'
import { BrowserRouter } from 'react-router'
import Router from './Router/Router'
import Header from './components/Header'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Router />
    </BrowserRouter>
  )
}

export default App
