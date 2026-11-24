import { useState } from 'react';

export const TITLE_COLORS = [
  { value: '', label: 'Χωρίς χρώμα' },
  { value: '#fee2e2', label: 'Κόκκινο' },
  { value: '#ffedd5', label: 'Πορτοκαλί' },
  { value: '#fef3c7', label: 'Κίτρινο' },
  { value: '#ecfccb', label: 'Λαχανί' },
  { value: '#dcfce7', label: 'Πράσινο' },
  { value: '#ccfbf1', label: 'Τιρκουάζ' },
  { value: '#dbeafe', label: 'Μπλε' },
  { value: '#e0e7ff', label: 'Ίντιγκο' },
  { value: '#ede9fe', label: 'Μωβ' },
  { value: '#fce7f3', label: 'Ροζ' },
];

const LEGACY_COLORS = {
  '#ef4444': '#fee2e2', '#f97316': '#ffedd5', '#eab308': '#fef3c7',
  '#84cc16': '#ecfccb', '#22c55e': '#dcfce7', '#06b6d4': '#ccfbf1',
  '#3b82f6': '#dbeafe', '#6366f1': '#e0e7ff', '#a855f7': '#ede9fe',
  '#ec4899': '#fce7f3', '#c2410c': '#ffedd5', '#a16207': '#fef3c7',
  '#4d7c0f': '#ecfccb', '#15803d': '#dcfce7', '#0f766e': '#ccfbf1',
  '#2563eb': '#dbeafe', '#4338ca': '#e0e7ff', '#7e22ce': '#ede9fe',
  '#be185d': '#fce7f3',
};

export const normalizeTitleColor = (color = '') => LEGACY_COLORS[color.toLowerCase()] || color;

export default function TitleColorPicker({ value = '', onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label="Επιλογή χρώματος τίτλου"
        title="Επιλογή χρώματος τίτλου"
        aria-expanded={open}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setOpen((shown) => !shown)}
        className="w-7 h-7 rounded-md border border-black/10 bg-white/80 text-[#45475a] flex items-center justify-center hover:bg-white"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 1.4-3c-.8-1-.1-2.2 1.2-2.2H18a3 3 0 0 0 3-3c0-5.4-4-9.8-9-9.8Z" />
          <circle cx="7.5" cy="11" r="1" fill="currentColor" />
          <circle cx="10" cy="7.5" r="1" fill="currentColor" />
          <circle cx="14" cy="7.5" r="1" fill="currentColor" />
          <circle cx="17" cy="11" r="1" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 grid grid-cols-4 gap-2 rounded-xl border border-[var(--line)] bg-[var(--card-bg)] p-3 shadow-xl">
          {TITLE_COLORS.map((color) => (
            <button
              key={color.value || 'none'}
              type="button"
              aria-label={color.label}
              title={color.label}
              aria-pressed={value === color.value}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => { onChange(color.value); setOpen(false); }}
              className={`h-9 w-9 rounded-lg border border-black/20 shadow-sm ${value === color.value ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              style={{ backgroundColor: color.value || '#ffffff' }}
            >
              {!color.value && <span className="block h-px w-full rotate-[-45deg] bg-red-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
