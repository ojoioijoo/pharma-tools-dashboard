import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import OverviewView from './components/views/OverviewView.jsx';
import CrmView from './components/views/CrmView.jsx';
import TodoView from './components/views/TodoView.jsx';
import TefteriView from './components/views/TefteriView.jsx';
import FinanceView from './components/views/FinanceView.jsx';
import { usePharmacyStore } from './hooks/usePharmacyStore.js';

export default function Dashboard({ onLogout }) {
  const store = usePharmacyStore();
  const { view, goTo, pageTitle, darkMode, toggleDarkMode, navItems, dragKey, setDragKey, reorderNav, syncStatus } =
    store;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="flex min-h-screen font-sans bg-[var(--page-bg)] text-[var(--text)]">
      <Sidebar
        navItems={navItems}
        dragKey={dragKey}
        setDragKey={setDragKey}
        reorderNav={reorderNav}
        goTo={goTo}
        onLogout={onLogout}
        mobileOpen={mobileNavOpen}
        closeMobile={() => setMobileNavOpen(false)}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-11 pt-5 sm:pt-[34px] pb-8 sm:pb-[50px] overflow-y-auto overflow-x-hidden">
        <TopBar
          pageTitle={pageTitle}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          syncStatus={syncStatus}
          onOpenMenu={() => setMobileNavOpen(true)}
        />

        {view === 'overview' && <OverviewView store={store} goTo={goTo} />}
        {view === 'crm' && <CrmView store={store} />}
        {view === 'todo' && <TodoView store={store} />}
        {view === 'tefteri' && <TefteriView store={store} />}
        {view === 'finance' && <FinanceView store={store} />}
      </main>
    </div>
  );
}
