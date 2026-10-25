import { Check } from "./icons";
import { passwordChecks, passwordScore } from "./validate";

const LEVELS = ["Слабый", "Слабый", "Средний", "Хороший", "Надёжный"];

/** Четыре сегмента и чек-лист правил: видно, чего не хватает, а не просто «плохо». */
export function PasswordMeter({ password }: { password: string }) {
  const score = password ? passwordScore(password) : 0;
  return (
    <div className="meter" data-score={score}>
      <div className="meter-bars" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={i <= score ? "on" : ""} />
        ))}
      </div>
      <div className="meter-row">
        <ul className="meter-rules">
          {passwordChecks(password).map((c) => (
            <li key={c.id} className={c.ok ? "ok" : ""}>
              <Check size={14} />
              {c.label}
            </li>
          ))}
        </ul>
        <span className="meter-label" aria-live="polite">
          {password ? LEVELS[score] : ""}
        </span>
      </div>
    </div>
  );
}
