import type { FeatureFlag } from "react-mock-devtools";

export type { FeatureFlag };

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
