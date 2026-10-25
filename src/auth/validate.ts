export type Mode = "login" | "register";
export type Values = { name: string; email: string; password: string; confirm: string };
export type FieldName = keyof Values;
export type Errors = Partial<Record<FieldName, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Правила пароля — их же показывает индикатор силы. */
export const passwordChecks = (pw: string) => [
  { id: "len", label: "8+ символов", ok: pw.length >= 8 },
  { id: "case", label: "Aa", ok: /\p{Ll}/u.test(pw) && /\p{Lu}/u.test(pw) },
  { id: "num", label: "1–9", ok: /\d/.test(pw) },
  { id: "sym", label: "!@#", ok: /[^\p{L}\d\s]/u.test(pw) },
];

export const passwordScore = (pw: string) => passwordChecks(pw).filter((c) => c.ok).length;

/** Все ошибки формы сразу; какие из них показать — решает компонент. */
export function validate(mode: Mode, v: Values): Errors {
  const e: Errors = {};
  if (mode === "register" && v.name.trim().length < 2) e.name = "Минимум 2 буквы";
  if (!v.email.trim()) e.email = "Введите email";
  else if (!EMAIL.test(v.email.trim())) e.email = "Похоже, в адресе опечатка";
  if (!v.password) e.password = "Введите пароль";
  else if (mode === "register" && passwordScore(v.password) < 3) e.password = "Пароль слишком простой";
  if (mode === "register" && v.confirm !== v.password) e.confirm = v.confirm ? "Пароли не совпадают" : "Повторите пароль";
  return e;
}
