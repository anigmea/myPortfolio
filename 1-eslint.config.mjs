import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
export default [...coreWebVitals, ...nextTypeScript, { ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"] }];
