import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { PortfolioDataProvider } from './context/PortfolioDataContext'

function App() {

  return (
    <>
      <BrowserRouter>
        <AdminAuthProvider>
          <PortfolioDataProvider>
            <Layout />
          </PortfolioDataProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
