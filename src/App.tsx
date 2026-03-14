import { useScenario, DevToolsPanel } from "react-mock-devtools";
import TodoApp from "./components/TodoApp";
import "./App.css";

interface ScenarioConfig {
  title: string;
  subtitle: string;
  addPlaceholder: string;
}

const SCENARIO_CONFIG: Record<string, ScenarioConfig> = {
  "animals-default": { title: "Animals", subtitle: "Browse the animal kingdom", addPlaceholder: "Add an animal..." },
  "animals-empty":   { title: "Animals", subtitle: "Browse the animal kingdom", addPlaceholder: "Add an animal..." },
};

const DEFAULT_CONFIG: ScenarioConfig = {
  title: "Todo list",
  subtitle: "Powered by MSW — all requests intercepted at the network layer",
  addPlaceholder: "What needs to be done?",
};

export default function App() {
  const { scenario } = useScenario();
  const config = SCENARIO_CONFIG[scenario] ?? DEFAULT_CONFIG;

  return (
    <>
      <TodoApp {...config} />
      {import.meta.env.DEV && <DevToolsPanel />}
    </>
  );
}
