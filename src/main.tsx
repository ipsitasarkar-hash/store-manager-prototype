import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;
rootEl.style.cssText = "min-height: 100vh; width: 100%;";
createRoot(rootEl).render(<App />);
