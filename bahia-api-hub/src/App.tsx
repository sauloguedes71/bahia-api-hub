import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HubDashboard } from "./components/hub/hub-dashboard";

interface ModuleFrameProps {
  title: string;
  url: string;
}

const ModuleFrame = ({ title, url }: ModuleFrameProps) => (
  <div className="w-full h-[calc(100vh-100px)]">
    <iframe src={url} title={title} className="w-full h-full border-0 rounded-lg shadow-sm" />
  </div>
);

// Componente provisório para o ecrã inicial (pode depois colocar aqui os cartões que retirou do main)
const WelcomeScreen = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Bahia API Hub</h1>
    <p>Selecione um módulo no menu lateral para visualizar os dados.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pai: O Dashboard com o Menu Lateral */}
        <Route path="/" element={<HubDashboard />}>
          
          {/* Rotas Filhas: Aparecem dentro do <Outlet /> */}
          <Route index element={<WelcomeScreen />} /> {/* O que aparece por defeito */}
          
          <Route 
            path="eleicoes" 
            element={
              <ModuleFrame 
                title="Módulo Eleições" 
                url="https://elei-es-bahia.vercel.app/" 
              />
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}