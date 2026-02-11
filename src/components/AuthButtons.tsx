"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButton() {
  return (
    <button
      className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 dark:bg-white dark:text-black"
      onClick={() => signIn("google")}
    >
      Google로 로그인
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      onClick={() => signOut()}
    >
      로그아웃
    </button>
  );
}
