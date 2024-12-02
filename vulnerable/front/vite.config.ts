import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: { port: Number(process.env.VITE_PORT) || 5173 },
    plugins: [react()],
    resolve: {
      alias: {
        "@src": "/src",
      },
    },
  });
};
