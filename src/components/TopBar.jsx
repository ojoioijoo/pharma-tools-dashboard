import { SunIcon, MoonIcon } from './icons.jsx';

export default function TopBar({ pageTitle, darkMode, toggleDarkMode }) {
  return (
    <div className="flex items-start justify-between mb-[30px]">
      <div>
        <div className="text-[13.5px] text-[var(--muted)] mb-1">Καλημέρα Στέφανε!</div>
        <div className="font-heading font-bold text-[27px] text-[var(--text)]">{pageTitle}</div>
      </div>
      <div className="flex items-center gap-3.5">
        <div className="bg-[var(--card-bg)] border border-[var(--line)] px-4 py-[9px] rounded-xl text-[13.5px] font-semibold text-[var(--text)]">
          Τρίτη, 31 Ιουλίου 2026
        </div>
        <div
          onClick={toggleDarkMode}
          className="w-[38px] h-[38px] rounded-xl bg-[var(--card-bg)] border border-[var(--line)] flex items-center justify-center cursor-pointer text-[var(--text)]"
        >
          {darkMode ? <MoonIcon /> : <SunIcon />}
        </div>
        <div className="w-[38px] h-[38px] rounded-full bg-primary flex items-center justify-center font-heading font-bold text-sm text-[#1D2144]">
          ΕΠ
        </div>
      </div>
    </div>
  );
}
