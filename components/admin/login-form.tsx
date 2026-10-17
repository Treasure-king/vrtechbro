"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, inputClass } from "@/components/admin/field";
import { signIn, type SignInState } from "@/app/admin/actions";

export function LoginForm({ notice }: { notice?: string }) {
  const [state, formAction, pending] = useActionState<SignInState, FormData>(
    signIn,
    {},
  );
  const message = state.error ?? notice;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {message && (
        <p
          role="alert"
          className="border-error/40 bg-error/10 text-text-primary rounded-lg border px-4 py-3 text-sm"
        >
          {message}
        </p>
      )}
      <Field id="email" label="Email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </Field>
      <Field id="password" label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>
      <Button type="submit" className="w-full" isLoading={pending}>
        Sign in
      </Button>
    </form>
  );
}
