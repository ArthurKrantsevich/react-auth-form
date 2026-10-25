import type { Mode } from "./validate";

/** Сегмент-переключатель: одна «пилюля» под кнопками уезжает к выбранной. */
export function Tabs({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="tabs" role="tablist" data-mode={mode}>
      <span className="tabs-pill" aria-hidden />
      <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => onChange("login")}>
        Вход
      </button>
      <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => onChange("register")}>
        Регистрация
      </button>
    </div>
  );
}
