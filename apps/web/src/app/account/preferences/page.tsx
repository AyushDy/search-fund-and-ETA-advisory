"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Protected } from "@/components/Protected";
import { ErrorState, LoadingState } from "@/components/States";
import { api } from "@/lib/api";
import type { User } from "@/types";

function PreferencesContent() {
  const [preferences, setPreferences] = useState<
    User["notificationPreferences"]
  >({ email: true, inApp: true });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    api
      .preferences()
      .then((result) => setPreferences(result.preferences))
      .catch((reason) =>
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load preferences",
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const result = await api.updatePreferences(preferences);
      setPreferences(result.preferences);
      setMessage("Preferences updated.");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to update preferences",
      );
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <LoadingState label="Loading preferences" />;
  if (error && !message)
    return (
      <main className="narrow">
        <ErrorState message={error} />
      </main>
    );
  return (
    <main className="narrow">
      <section className="detail-header">
        <span className="eyebrow">Account</span>
        <h1>Notification preferences</h1>
        <p className="muted">
          Choose which account notifications you want to receive. Email delivery
          is not connected yet.
        </p>
        <div className="button-row">
          <Link className="text-link" href="/account/profile">
            Back to profile
          </Link>
        </div>
      </section>
      <section className="panel">
        <form className="form-stack" onSubmit={save}>
          <label className="preference-row">
            <input
              type="checkbox"
              checked={preferences.email}
              onChange={(event) =>
                setPreferences({ ...preferences, email: event.target.checked })
              }
            />
            <span>
              <strong>Email notifications</strong>
              <small className="muted">
                Stored for the future email provider integration.
              </small>
            </span>
          </label>
          <label className="preference-row">
            <input
              type="checkbox"
              checked={preferences.inApp}
              onChange={(event) =>
                setPreferences({ ...preferences, inApp: event.target.checked })
              }
            />
            <span>
              <strong>In-app notifications</strong>
              <small className="muted">
                Keep account and workflow notices available in the app.
              </small>
            </span>
          </label>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="success-message" role="status">
              {message}
            </p>
          )}
          <button className="button" disabled={busy}>
            {busy ? "Saving..." : "Save preferences"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function PreferencesPage() {
  return (
    <Protected>
      <PreferencesContent />
    </Protected>
  );
}
