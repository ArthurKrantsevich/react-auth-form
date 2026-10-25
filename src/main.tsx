import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthCard } from "./auth/AuthCard";
import "./stage.css";

// ?zoom=1.4 — крупный план (так записано видео)
const zoom = Number(new URLSearchParams(location.search).get("zoom") ?? 1);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="stage">
      <div style={{ zoom }}>
        <AuthCard />
      </div>
    </main>
  </StrictMode>,
);
