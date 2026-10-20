import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { KakeiboProvider } from "./store/KakeiboProvider";
import { createKakeiboStore } from "./store/kakeibo";
import "./index.css";

const root = document.getElementById("root");
if (root === null) throw new Error("#root が見つからない");

createRoot(root).render(
  <StrictMode>
    <KakeiboProvider store={createKakeiboStore(localStorage)}>
      <App />
    </KakeiboProvider>
  </StrictMode>,
);
