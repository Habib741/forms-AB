"use client";

import { useState, type FormEvent } from "react";

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export default function MessageForm() {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      first_name: String(formData.get("first_name") ?? "").trim(),
      last_name: String(formData.get("last_name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "L’envoi n’a pas fonctionné. Réessaie dans un instant.";
        setState({ status: "error", message: errorMessage });
        return;
      }

      form.reset();
      setState({ status: "success" });
    } catch {
      setState({
        status: "error",
        message: "Impossible de joindre le formulaire. Vérifie ta connexion et réessaie.",
      });
    }
  }

  return (
    <div className="form-card">
      <form className="message-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="first_name">Prénom</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            maxLength={80}
            placeholder="Ton prénom"
          />
        </div>

        <div className="field-group">
          <label htmlFor="last_name">Nom</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            maxLength={80}
            placeholder="Ton nom"
          />
        </div>

        <div className="field-group">
          <label htmlFor="phone">Numéro de téléphone (facultatif)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="+221 77 608 56 94"
          />
        </div>

        <div className="field-group">
          <label htmlFor="message">Ton message</label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Pose ta question ou écris ce que tu veux…"
          />
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={state.status === "submitting"}
        >
          {state.status === "submitting" ? (
            <>
              <span className="loading-spinner" aria-hidden="true" />
              Enregistrement…
            </>
          ) : (
            <>
              Envoyer
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4.5 10h11m-4.5-4.5L15.5 10 11 14.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>

        <div className="form-feedback" aria-live="polite">
          {state.status === "success" && (
            <div className="feedback-message feedback-success" role="status">
              <span aria-hidden="true">✓</span>
              Ton message a bien été envoyé. Merci !
            </div>
          )}
          {state.status === "error" && (
            <p className="feedback-message feedback-error" role="alert">
              {state.message}
            </p>
          )}
        </div>
      </form>

    </div>
  );
}
