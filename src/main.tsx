import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ThemeContextProvider from './hooks/Theme.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Remova o React.StrictMode para testar sem a execução dupla
  <ThemeContextProvider>
    {/*<React.StrictMode>*/}
   
    <App />

    {/*</React.StrictMode> */}
  </ThemeContextProvider>
)
