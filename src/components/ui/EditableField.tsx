"use client";

import { useEffect, useRef, useState } from "react";

interface EditableFieldProps {
  value: string;
  canEdit: boolean;
  onSave: (next: string) => void | Promise<void>;
  /** Render a <textarea> instead of a single-line input. */
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  /** Classes for the read-only rendered value. */
  displayClassName?: string;
}

/**
 * Inline-editable text. When `canEdit` is false it renders as plain text.
 * When true, clicking turns it into an input; Enter / blur saves, Escape
 * cancels. Saving routes through the caller's `onSave` (repository upsert).
 */
export function EditableField({
  value,
  canEdit,
  onSave,
  multiline = false,
  placeholder,
  className = "",
  displayClassName = "",
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Adjust the draft when the incoming value changes and we are not editing
  // (React's "adjust state during render" pattern instead of an effect).
  if (value !== lastValue && !editing) {
    setLastValue(value);
    setDraft(value);
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!canEdit) {
    return (
      <span className={displayClassName}>
        {value || (
          <span className="italic text-muted">{placeholder ?? "—"}</span>
        )}
      </span>
    );
  }

  async function commit() {
    if (draft !== value) {
      setSaving(true);
      try {
        await onSave(draft);
      } finally {
        setSaving(false);
      }
    }
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={`cursor-text rounded-md px-1 text-left hover:bg-sand-100 ${displayClassName}`}
        title="Click to edit"
      >
        {value || (
          <span className="italic text-muted">{placeholder ?? "Add…"}</span>
        )}
      </button>
    );
  }

  const shared =
    "w-full rounded-md border border-ember-400 bg-surface px-2 py-1 text-ink-900 outline-none focus:ring-2 focus:ring-ember-400/40";

  return multiline ? (
    <textarea
      ref={(el) => {
        inputRef.current = el;
      }}
      value={draft}
      disabled={saving}
      rows={3}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Escape") cancel();
      }}
      className={`${shared} ${className}`}
    />
  ) : (
    <input
      ref={(el) => {
        inputRef.current = el;
      }}
      value={draft}
      disabled={saving}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          void commit();
        } else if (e.key === "Escape") {
          cancel();
        }
      }}
      className={`${shared} ${className}`}
    />
  );
}
