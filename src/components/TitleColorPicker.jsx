import { useState } from 'react';

export const TITLE_COLORS = [
  { value: '', label: 'Χωρίς χρώμα' },
  { value: '#ef4444', label: 'Κόκκινο' },
  { value: '#c2410c', label: 'Πορτοκαλί' },
  { value: '#a16207', label: 'Κίτρινο' },
  { value: '#4d7c0f', label: 'Λαχανί' },
  { value: '#15803d', label: 'Πράσινο' },
  { value: '#0f766e', label: 'Τιρκουάζ' },
  { value: '#2563eb', label: 'Μπλε' },
  { value: '#4338ca', label: 'Ίντιγκο' },
  { value: '#7e22ce', label: 'Μωβ' },
  { value: '#be185d', label: 'Ροζ' },
];

const LEGACY_COLORS = {
  '#fee2e2': '#ef4444', '#ffedd5': '#c2410c', '#fef3c7': '#a16207',
  '#ecfccb': '#4d7c0f', '#dcfce7': '#15803d', '#ccfbf1': '#0f766e',
  '#dbeafe': '#2563eb', '#e0e7ff': '#4338ca', '#ede9fe': '#7e22ce',
  '#fce7f3': '#be185d',
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
        <div className="absolute right-0 top-full z-30 mt-1 grid grid-cols-6 gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--card-bg)] p-2 shadow-lg">
          {TITLE_COLORS.map((color) => (
            <button
              key={color.value || 'none'}
              type="button"
              aria-label={color.label}
              title={color.label}
              aria-pressed={value === color.value}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => { onChange(color.value); setOpen(false); }}
              className={`h-6 w-6 rounded-full border border-black/15 ${value === color.value ? 'ring-2 ring-primary ring-offset-1' : ''}`}
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
