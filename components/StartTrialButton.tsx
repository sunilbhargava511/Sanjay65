"use client";
import React, { useTransition } from "react";

export default function StartTrialButton() {
  const [pending, startTransition] = useTransition();

  async function start() {
    startTransition(async () => {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (res.ok) {
        const { url } = await res.json();
        if (url) window.location.href = url;
      } else {
        alert("Could not start checkout. Please try again.");
      }
    });
  }

  return (
    <button
      onClick={start}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold hover:opacity-95 disabled:opacity-60"
    >
      {pending ? "Creating session…" : "Start 30‑day free trial"}
    </button>
  );
}