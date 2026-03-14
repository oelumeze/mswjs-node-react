export interface Scenario {
  label: string;
  key: string;
}

export interface ScenarioGroup {
  label: string;
  scenarios: string[];
}

export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

export type FlagValues = Record<string, boolean>;
