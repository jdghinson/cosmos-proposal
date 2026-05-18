import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  {
    // `react-hooks/set-state-in-effect` is new in the react-hooks plugin
    // bundled with eslint-config-next 16. It flags several pre-existing
    // hydration/init effects (e.g. lib/collections-store.tsx). Kept as a
    // warning to preserve the pre-upgrade lint baseline; address separately.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
