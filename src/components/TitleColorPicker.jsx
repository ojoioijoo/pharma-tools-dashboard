import { useEffect, useRef, useState } from 'react';

export const TITLE_COLORS = [
  { value: '', label: 'Χωρίς χρώμα' },
  { value: '#f2a6a2', label: 'Κοραλλί' },
  { value: '#ee9c70', label: 'Πορτοκαλί' },
  { value: '#fff0a8', label: 'Κίτρινο' },
  { value: '#d9efc5', label: 'Λαχανί' },
  { value: '#addbd1', label: 'Μέντα' },
  { value: '#c6dfeb', label: 'Γαλάζιο' },
  { value: '#b5d4e4', label: 'Μπλε' },
  { value: '#d7c4df', label: 'Λιλά' },
  { value: '#f4dcd7', label: 'Ροζ' },
  { value: '#e6e2d5', label: 'Μπεζ' },
  { value: '#eceef0', label: 'Γκρι' },
];

const LEGACY_COLORS = {
  '#fee2e2': '#f2a6a2', '#ffedd5': '#ee9c70', '#fef3c7': '#fff0a8',
  '#ecfccb': '#d9efc5', '#dcfce7': '#addbd1', '#ccfbf1': '#addbd1',
  '#dbeafe': '#c6dfeb', '#e0e7ff': '#b5d4e4', '#ede9fe': '#d7c4df',
  '#fce7f3': '#f4dcd7', '#ef4444': '#f2a6a2', '#f97316': '#ee9c70',
  '#eab308': '#fff0a8', '#84cc16': '#d9efc5', '#22c55e': '#addbd1',
  '#06b6d4': '#addbd1', '#3b82f6': '#c6dfeb', '#6366f1': '#b5d4e4',
  '#a855f7': '#d7c4df', '#ec4899': '#f4dcd7', '#c2410c': '#ee9c70',
  '#a16207': '#fff0a8', '#4d7c0f': '#d9efc5', '#15803d': '#addbd1',
  '#0f766e': '#addbd1', '#2563eb': '#c6dfeb', '#4338ca': '#b5d4e4',
  '#7e22ce': '#d7c4df', '#be185d': '#f4dcd7',
};

export const normalizeTitleColor = (color = '') => LEGACY_COLORS[color.toLowerCase()] || color;

export default function TitleColorPicker({ value = '', onChange }) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 8 });
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const placeMenu = () => {
      const button = buttonRef.current?.getBoundingClientRect();
      const menu = menuRef.current?.getBoundingClientRect();
      if (!button || !menu) return;
      const left = Math.max(8, Math.min(button.left, window.innerWidth - menu.width - 8));
      const top = button.bottom + menu.height + 8 <= window.innerHeight
        ? button.bottom + 8
        : Math.max(8, button.top - menu.height - 8);
      setMenuPosition({ top, left });
    };
    const closeOutside = (event) => {
      if (!rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    placeMenu();
    window.addEventListener('resize', placeMenu);
    window.addEventListener('scroll', placeMenu, true);
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      window.removeEventListener('resize', placeMenu);
      window.removeEventListener('scroll', placeMenu, true);
      document.removeEventListener('pointerdown', closeOutside);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
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
        <div
          ref={menuRef}
          style={{ top: menuPosition.top, left: menuPosition.left, visibility: menuPosition.top ? 'visible' : 'hidden' }}
          className="fixed z-[100] flex w-max max-w-[calc(100vw-16px)] flex-nowrap items-center gap-1.5 overflow-x-auto rounded-full border border-[#e5e7eb] bg-white px-2.5 py-2 shadow-xl"
        >
          {TITLE_COLORS.map((color) => (
            <button
              key={color.value || 'none'}
              type="button"
              aria-label={color.label}
              title={color.label}
              aria-pressed={value === color.value}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => { onChange(color.value); setOpen(false); }}
              className={`h-8 w-8 shrink-0 rounded-full border border-black/10 shadow-sm ${value === color.value ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              style={{ backgroundColor: color.value || '#ffffff' }}
            >
              {!color.value && (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 4l16 16M10.5 5.5A8 8 0 1 1 5.6 10" />
                  <path d="M4 9V4h5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
