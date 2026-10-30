import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HubDashboard } from "./components/hub/hub-dashboard";

interface ModuleFrameProps {
  title: string;
  url: string;
}

const ModuleFrame = ({ title, url }: ModuleFrameProps) => (
  <div className="w-full h-[calc(100vh-100px)]">
    {url ? (
      <iframe src={url} title={title} className="w-full h-full border-0 rounded-xl shadow-sm bg-white" />
    ) : (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
        <p className="text-lg font-medium text-slate-500">Módulo em desenvolvimento</p>
        <p className="mt-1 text-sm text-slate-400">A aguardar o link de produção da equipa responsável.</p>
      </div>
    )}
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HubDashboard />}>
          {/* Módulo já entregue */}
          <Route path="eleicoes" element={<ModuleFrame title="Módulo Eleições" url="https://elei-es-bahia.vercel.app/" />} />
          
          {/* Módulos a aguardar link */}
          <Route path="clima" element={<ModuleFrame title="Módulo Clima" url="" />} />
          <Route path="economia" element={<ModuleFrame title="Módulo Economia" url="" />} />
          <Route path="educacao" element={<ModuleFrame title="Módulo Educação" url="" />} />
          <Route path="populacao" element={<ModuleFrame title="Módulo População" url="" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}