import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'
import trTR from 'antd/locale/tr_TR'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={trTR}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
