import { useState } from "react";
import { ScenarioProvider, useScenario } from "./mocks/context";
import TodoApp from "./components/TodoApp";
import DevToolsPanel from "./components/DevToolsPanel";
import "./App.css";

interface ScenarioConfig {
  title: string;
  subtitle: string;
  addPlaceholder: string;
}

const SCENARIO_CONFIG: Record<string, ScenarioConfig> = {
  "animals-default": { title: "Animals", subtitle: "Browse the animal kingdom", addPlaceholder: "Add an animal..." },
  "animals-empty": { title: "Animals", subtitle: "Browse the animal kingdom", addPlaceholder: "Add an animal..." },
};

const DEFAULT_CONFIG: ScenarioConfig = {
  title: "Todo list",
  subtitle: "Powered by MSW — all requests intercepted at the network layer",
  addPlaceholder: "What needs to be done?",
};

function AppContent() {
  const { scenario } = useScenario();
  const [devToolsOpen, setDevToolsOpen] = useState(true);
  const config = SCENARIO_CONFIG[scenario] ?? DEFAULT_CONFIG;

  return (
    <>
      <TodoApp {...config} />

      {!devToolsOpen && (
        <div style={{ display: "flex", justifyContent: "center", padding: "0 1rem 2rem" }}>
          <button onClick={() => setDevToolsOpen(true)} style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Open MSW DevTools
          </button>
        </div>
      )}

      {devToolsOpen && (
        <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 1rem 2rem" }}>
          <DevToolsPanel onClose={() => setDevToolsOpen(false)} />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <ScenarioProvider>
      <AppContent />
    </ScenarioProvider>
  );
}
