import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import "antd/dist/reset.css";
import "./index.css";
import App from "./App.tsx";

// ConfigProvider: Ant Design bilesenlerinin dilini ve temasini belirler.
// trTR verildigi icin tablo, tarih secici, "veri yok" gibi hazir metinler
// Turkce gorunur.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={trTR}>
      <App />
    </ConfigProvider>
  </StrictMode>
);
