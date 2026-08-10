import { LogoIcon, SettingsIcon, LogoutIcon, CloseIcon, NAV_ICONS } from './icons.jsx';

export default function Sidebar({ navItems, dragKey, setDragKey, reorderNav, goTo, onLogout, mobileOpen, closeMobile }) {
  return (
    <>
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`w-[236px] shrink-0 bg-[var(--sidebar-bg)] px-[18px] py-7 flex flex-col gap-1.5 border-r border-[var(--line)]
        fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out
        md:static md:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2.5 px-2 pb-[26px] pt-1.5">
          <div className="w-[38px] h-[38px] rounded-xl bg-primary flex items-center justify-center shrink-0">
            <LogoIcon stroke="#FFFFFF" />
          </div>
          <div className="font-heading font-bold text-[16.5px] leading-tight text-[var(--text)] flex-1">
            Φαρμακείο
            <br />
            Μελενικίτσι
          </div>
          <div
            onClick={closeMobile}
            className="md:hidden shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] cursor-pointer"
          >
            <CloseIcon />
          </div>
        </div>

        {navItems.map((item) => {
          const Icon = NAV_ICONS[item.key];
          return (
            <div
              key={item.key}
              draggable
              onDragStart={() => setDragKey(item.key)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                reorderNav(dragKey, item.key);
                setDragKey(null);
              }}
              onDragEnd={() => setDragKey(null)}
              onClick={() => {
                goTo(item.key);
                closeMobile();
              }}
              className={`flex items-center gap-3 px-3.5 py-[11px] rounded-2xl cursor-pointer text-[14.5px] font-semibold ${
                item.dragging ? 'opacity-40' : 'opacity-100'
              } ${
                item.active
                  ? 'bg-[var(--active-nav)] text-[var(--text)]'
                  : 'text-[var(--muted)]'
              }`}
            >
              <Icon className="shrink-0" />
              {item.label}
            </div>
          );
        })}

        <div className="flex-1" />

        <div className="flex items-center gap-3 px-3.5 py-[11px] rounded-2xl text-[14.5px] font-semibold text-[var(--muted)] cursor-pointer">
          <SettingsIcon />
          Ρυθμίσεις
        </div>
        <div
          onClick={onLogout}
          className="flex items-center gap-3 px-3.5 pt-[11px] pb-1 text-[14.5px] font-semibold text-[var(--muted)] cursor-pointer"
        >
          <LogoutIcon />
          Αποσύνδεση
        </div>
      </aside>
    </>
  );
}
