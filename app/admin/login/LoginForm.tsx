"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="admin-primary-button" type="submit" disabled={pending}>
      {pending ? "Ingresando..." : "Ingresar"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form className="admin-login-form" action={formAction}>
      <label className="admin-field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="admin-field">
        <span>Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
        />
      </label>
      {state.error && <p className="admin-form-error" role="alert">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}