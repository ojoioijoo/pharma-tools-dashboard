import { useMemo } from 'react';
import { SunIcon, MoonIcon, SyncIcon, CheckIcon, WarningIcon, MenuIcon } from './icons.jsx';
import TitleColorPicker from './TitleColorPicker.jsx';

const BACKGROUND_COLORS = [
  { value: '#ffffff', label: 'Λευκό' },
  { value: '#c65391', label: 'Ροζ' },
  { value: '#f2a6a2', label: 'Κοραλλί' },
  { value: '#ee9c70', label: 'Πορτοκαλί' },
  { value: '#fff0a8', label: 'Κίτρινο' },
  { value: '#d9efc5', label: 'Λαχανί' },
  { value: '#addbd1', label: 'Μέντα' },
  { value: '#c6dfeb', label: 'Γαλάζιο' },
  { value: '#b5d4e4', label: 'Μπλε' },
  { value: '#d7c4df', label: 'Λιλά' },
  { value: '#e6e2d5', label: 'Μπεζ' },
  { value: '#eceef0', label: 'Γκρι' },
];

const SYNC_CONFIG = {
  syncing: { Icon: SyncIcon, label: 'Αποθήκευση...', className: 'animate-spin' },
  synced: { Icon: CheckIcon, label: 'Συγχρονισμένο', className: '' },
  error: { Icon: WarningIcon, label: 'Σφάλμα αποθήκευσης', className: '' },
};

function SyncBadge({ status }) {
  const config = SYNC_CONFIG[status];
  if (!config) return null;
  const { Icon, label, className } = config;
  return (
    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1d2144] bg-white border border-[#1d2144]/10 rounded-xl px-3 py-2" title={label}>
      <Icon className={className} />
      <span className="hidden lg:inline">{label}</span>
    </div>
  );
}

export default function TopBar({ pageTitle, darkMode, toggleDarkMode, backgroundColor, setBackgroundColor, syncStatus, onOpenMenu }) {
  const dateLabel = useMemo(() => {
    const formatted = new Intl.DateTimeFormat('el-GR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, []);

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6 sm:mb-[30px]">
      <div className="flex items-center gap-3 min-w-0">
        <div
          onClick={onOpenMenu}
          className="md:hidden shrink-0 w-[38px] h-[38px] rounded-xl bg-[var(--card-bg)] border border-[var(--line)] flex items-center justify-center cursor-pointer text-[var(--text)]"
        >
          <MenuIcon />
        </div>
        <div className="min-w-0">
          <div className="inline-flex text-[13.5px] font-semibold text-[#1d2144] bg-white rounded-lg px-2.5 py-1 mb-1">Καλημέρα Στέφανε!</div>
          <div className="w-fit max-w-full font-heading font-bold text-[22px] sm:text-[27px] text-[#1d2144] bg-white border border-[#1d2144]/10 rounded-xl px-3 py-1.5 truncate">
            {pageTitle}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <SyncBadge status={syncStatus} />
        <TitleColorPicker value={backgroundColor} onChange={setBackgroundColor} colors={BACKGROUND_COLORS} ariaLabel="Χρώμα φόντου" />
        <div className="hidden sm:block bg-[var(--card-bg)] border border-[var(--line)] px-4 py-[9px] rounded-xl text-[13.5px] font-semibold text-[var(--text)]">
          {dateLabel}
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
