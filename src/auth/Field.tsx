import type { ReactNode, Ref } from "react";
import { Check } from "./icons";

type Props = {
  id: string;
  label: string;
  type?: string;
  value: string;
  autoComplete?: string;
  icon: ReactNode;
  /** Текст ошибки — показывается, только если showError. */
  error?: string;
  showError: boolean;
  valid: boolean;
  /** Меняется при неудачной отправке — поле с ошибкой вздрагивает. */
  shake: number;
  trailing?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
  onChange: (v: string) => void;
  onBlur: () => void;
};

export function Field({ id, label, type = "text", value, autoComplete, icon, error, showError, valid, shake, trailing, inputRef, onChange, onBlur }: Props) {
  const state = showError ? "error" : valid ? "valid" : "idle";
  // два одинаковых keyframes по очереди — так анимация перезапускается без перемонтирования инпута
  const shakeClass = showError && shake > 0 ? `shake-${shake % 2}` : "";
  return (
    <div className="field" data-state={state}>
      <div className={`field-box ${shakeClass}`}>
        <span className="field-icon">{icon}</span>
        <input
          ref={inputRef}
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder=" "
          autoComplete={autoComplete}
          aria-invalid={showError}
          aria-describedby={`${id}-msg`}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
        <label htmlFor={id}>{label}</label>
        <span className="field-ok">{valid && <Check size={18} />}</span>
        {trailing}
      </div>
      <div className="field-msg" id={`${id}-msg`} aria-live="polite">
        <span>{showError ? error : ""}</span>
      </div>
    </div>
  );
}
