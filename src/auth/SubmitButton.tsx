import { ArrowIcon, Check, Spinner } from "./icons";

export type Status = "idle" | "loading" | "success";

/** Кнопка с тремя состояниями: текст → круг со спиннером → зелёная галочка. */
export function SubmitButton({ status, children }: { status: Status; children: string }) {
  return (
    <button className="submit" type="submit" data-status={status} disabled={status !== "idle"} aria-busy={status === "loading"}>
      <span className="submit-label">
        {children}
        <ArrowIcon />
      </span>
      <span className="submit-spin">
        <Spinner />
      </span>
      <span className="submit-done">
        <Check size={26} />
        Готово
      </span>
    </button>
  );
}
