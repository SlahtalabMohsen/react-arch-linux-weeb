import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import GlobalStyle from "./styles/GlobalStyle";
import { DesktopProvider } from "./context/DesktopContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <DesktopProvider>
      <App />
    </DesktopProvider>
  </StrictMode>
);
