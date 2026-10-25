import { useMemo, useRef, useState, type FormEvent } from "react";
import { Collapse } from "./Collapse";
import { Field } from "./Field";
import { Check, EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "./icons";
import { PasswordMeter } from "./PasswordMeter";
import { SubmitButton, type Status } from "./SubmitButton";
import { Tabs } from "./Tabs";
import { validate, type FieldName, type Mode, type Values } from "./validate";
import "./auth.css";

const EMPTY: Values = { name: "", email: "", password: "", confirm: "" };
const ORDER: FieldName[] = ["name", "email", "password", "confirm"];

/** Имитация запроса к серверу — замените на свой fetch. */
const fakeRequest = () => new Promise((r) => setTimeout(r, 1400));

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("login");
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const refs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});

  const isRegister = mode === "register";
  const errors = useMemo(() => validate(mode, values), [mode, values]);

  // ошибку показываем после ухода с поля или после попытки отправить — не во время первого набора
  const showError = (f: FieldName) => Boolean((touched[f] || submitted) && errors[f]);
  const isValid = (f: FieldName) => Boolean((touched[f] || submitted) && values[f] && !errors[f]);

  const set = (f: FieldName) => (v: string) => setValues((s) => ({ ...s, [f]: v }));
  // пустое поле, мимо которого просто прошли Tab'ом, не ругаем — об этом скажет отправка
  const blur = (f: FieldName) => () => {
    if (values[f]) setTouched((t) => ({ ...t, [f]: true }));
  };

  const switchMode = (m: Mode) => {
    if (m === mode || status !== "idle") return;
    setMode(m);
    setSubmitted(false);
    setTouched({});
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const bad = ORDER.filter((f) => errors[f]);
    if (bad.length) {
      setShake((n) => n + 1);
      refs.current[bad[0]]?.focus();
      return;
    }
    setStatus("loading");
    await fakeRequest();
    setStatus("success");
    setTimeout(() => setDone(true), 900);
  };

  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
    setDone(false);
    setShake(0);
  };

  const common = (f: FieldName) => ({
    id: f,
    value: values[f],
    error: errors[f],
    showError: showError(f),
    valid: isValid(f),
    shake,
    onChange: set(f),
    onBlur: blur(f),
    inputRef: (el: HTMLInputElement | null) => {
      refs.current[f] = el;
    },
  });

  const eye = (
    <button type="button" className="field-eye" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Скрыть пароль" : "Показать пароль"}>
      {showPw ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <div className="auth" data-mode={mode} data-done={done}>
      <Collapse open={!done}>
        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <Tabs mode={mode} onChange={switchMode} />

          <div className="auth-head">
            <h1 className={isRegister ? "out" : ""}>С возвращением</h1>
            <h1 className={isRegister ? "" : "out"}>Создать аккаунт</h1>
          </div>
          <p className="auth-sub">{isRegister ? "Минута — и вы внутри." : "Войдите, чтобы продолжить."}</p>

          <Collapse open={isRegister} delay={0}>
            <Field {...common("name")} label="Имя" autoComplete="name" icon={<UserIcon />} />
          </Collapse>
          <Field {...common("email")} label="Email" type="email" autoComplete="email" icon={<MailIcon />} />
          <Field
            {...common("password")}
            label="Пароль"
            type={showPw ? "text" : "password"}
            autoComplete={isRegister ? "new-password" : "current-password"}
            icon={<LockIcon />}
            trailing={eye}
          />
          <Collapse open={isRegister} delay={90}>
            <PasswordMeter password={values.password} />
          </Collapse>
          <Collapse open={isRegister} delay={160}>
            <Field {...common("confirm")} label="Повторите пароль" type={showPw ? "text" : "password"} autoComplete="new-password" icon={<LockIcon />} />
          </Collapse>
          <Collapse open={!isRegister}>
            <a className="auth-forgot" href="#forgot">
              Забыли пароль?
            </a>
          </Collapse>

          <SubmitButton status={status}>{isRegister ? "Создать аккаунт" : "Войти"}</SubmitButton>
        </form>
      </Collapse>

      <Collapse open={done} delay={120}>
        <div className="auth-done">
          <div className="auth-done-badge">
            <Check size={44} />
          </div>
          <h2>{isRegister ? `Готово, ${values.name.trim() || "друг"}!` : "Вы вошли"}</h2>
          <p>{isRegister ? "Письмо для подтверждения уже на почте." : "Перенаправляем в кабинет…"}</p>
          <button type="button" className="auth-back" onClick={reset}>
            Начать заново
          </button>
        </div>
      </Collapse>
    </div>
  );
}
