import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HubDashboard } from "./components/hub/hub-dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota principal agora carrega o design completo */}
        <Route path="/" element={<HubDashboard />} />
        
        {/* Futuramente, adicionaremos as rotas dos iframes aqui */}
        {/* <Route path="/clima" element={<ClimaIframe />} /> */}
      </Routes>
    </BrowserRouter>
  );
}