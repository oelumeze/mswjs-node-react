export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    key: "showProgressBar",
    label: "Progress bar",
    description: "Show completion progress bar above the todo list",
    defaultValue: true,
  },
  {
    key: "showSubtitle",
    label: "Subtitle",
    description: "Show the subtitle below the page title",
    defaultValue: true,
  },
  {
    key: "enableAnimations",
    label: "Animations",
    description: "Enable CSS transitions on list items",
    defaultValue: true,
  },
  {
    key: "compactView",
    label: "Compact view",
    description: "Reduce padding on todo list items",
    defaultValue: false,
  },
];

const STORAGE_KEY = "feature-flags";

export type FlagValues = Record<string, boolean>;

export function loadFlags(): FlagValues {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function saveFlags(flags: FlagValues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}
