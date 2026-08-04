import { useEffect, useMemo, useRef, useState } from 'react';
import {
  initialTasks,
  initialTodos,
  initialTefteri,
  initialCustomers,
  salesWeek,
  financeMonths,
  financeSummary,
  transactions,
} from '../data/mockData.js';
import { fetchCollection, saveCollection } from '../api.js';

const TITLES = {
  overview: 'Επισκόπηση',
  crm: 'Πελάτες & Σημειώσεις',
  todo: 'Εκκρεμότητες',
  finance: 'Οικονομικά Φαρμακείου',
  tefteri: 'Τεφτέρι',
};

const NAV_LABELS = {
  overview: 'Επισκόπηση',
  crm: 'Πελάτες',
  todo: 'Εκκρεμότητες',
  finance: 'Οικονομικά',
  tefteri: 'Τεφτέρι',
};

const MONTH_NAMES = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
  'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
];
const DAY_LABELS = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'];

// Πρωτότυπο "σήμερα" — θα αντικατασταθεί από πραγματική ημερομηνία όταν συνδεθεί το backend.
const TODAY = '2026-07-31';

const pad = (n) => (n < 10 ? '0' + n : '' + n);
const fmtDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

function moveItem(order, fromKey, toKey) {
  if (!fromKey || fromKey === toKey) return order;
  const next = [...order];
  next.splice(next.indexOf(fromKey), 1);
  next.splice(next.indexOf(toKey), 0, fromKey);
  return next;
}

export function usePharmacyStore() {
  const [view, setView] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [navOrder, setNavOrder] = useState(['overview', 'crm', 'todo', 'finance', 'tefteri']);
  const [dragKey, setDragKey] = useState(null);
  const [crmQuery, setCrmQuery] = useState('');
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(6);
  const [selectedDate, setSelectedDate] = useState('2026-07-31');
  const [newTaskText, setNewTaskText] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [todos, setTodos] = useState(initialTodos);
  const [newTodoText, setNewTodoText] = useState('');
  const [tefteri, setTefteri] = useState(initialTefteri);
  const [customers, setCustomers] = useState(initialCustomers);
  const [quickNotes, setQuickNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [overviewOrder, setOverviewOrder] = useState(['tasks', 'calendar', 'notes', 'todos']);
  const [overviewDragKey, setOverviewDragKey] = useState(null);
  const [customCards, setCustomCards] = useState([]);

  const hydrated = useRef(false);

  // Αρχικό φόρτωμα από το Redis (μέσω /api). Αν αποτύχει (π.χ. τοπικό `vite dev`
  // χωρίς `vercel dev`), κρατάμε τα mock δεδομένα ως έχουν.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, td, tf, cu] = await Promise.all([
          fetchCollection('tasks'),
          fetchCollection('todos'),
          fetchCollection('tefteri'),
          fetchCollection('customers'),
        ]);
        if (cancelled) return;
        if (t.length) setTasks(t);
        else saveCollection('tasks', initialTasks).catch(() => {});
        if (td.length) setTodos(td);
        else saveCollection('todos', initialTodos).catch(() => {});
        if (tf.length) setTefteri(tf);
        else saveCollection('tefteri', initialTefteri).catch(() => {});
        if (cu.length) setCustomers(cu);
        else saveCollection('customers', initialCustomers).catch(() => {});
      } catch {
        // API μη διαθέσιμο — παραμένουμε στα τοπικά mock δεδομένα.
      } finally {
        if (!cancelled) hydrated.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated.current) saveCollection('tasks', tasks).catch(() => {});
  }, [tasks]);
  useEffect(() => {
    if (hydrated.current) saveCollection('todos', todos).catch(() => {});
  }, [todos]);
  useEffect(() => {
    if (hydrated.current) saveCollection('tefteri', tefteri).catch(() => {});
  }, [tefteri]);
  useEffect(() => {
    if (hydrated.current) saveCollection('customers', customers).catch(() => {});
  }, [customers]);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  const goTo = (key) => setView(key);

  const reorderNav = (fromKey, toKey) => setNavOrder((order) => moveItem(order, fromKey, toKey));

  const reorderOverview = (fromKey, toKey) =>
    setOverviewOrder((order) => moveItem(order, fromKey, toKey));

  const addCustomCard = () => {
    const id = `custom-${Date.now()}`;
    setCustomCards((prev) => [...prev, { id, title: 'Νέα κάρτα', items: [] }]);
    setOverviewOrder((prev) => [...prev, id]);
  };

  const renameCustomCard = (id, title) =>
    setCustomCards((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));

  const addCustomCardItem = (id, text) =>
    setCustomCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, items: [{ id: Date.now(), text }, ...c.items] } : c)),
    );

  const removeCustomCard = (id) => {
    setCustomCards((prev) => prev.filter((c) => c.id !== id));
    setOverviewOrder((prev) => prev.filter((k) => k !== id));
  };

  const navItems = useMemo(
    () =>
      navOrder.map((key) => ({
        key,
        label: NAV_LABELS[key],
        active: view === key,
        dragging: dragKey === key,
      })),
    [navOrder, view, dragKey],
  );

  const prevMonth = () =>
    setCalMonth((m) => {
      if (m === 0) {
        setCalYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });

  const nextMonth = () =>
    setCalMonth((m) => {
      if (m === 11) {
        setCalYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });

  const calLabel = `${MONTH_NAMES[calMonth]} ${calYear}`;
  const selectedLabel = `${parseInt(selectedDate.slice(8, 10), 10)} ${MONTH_NAMES[parseInt(selectedDate.slice(5, 7), 10) - 1]}`;

  const calCells = useMemo(() => {
    const firstWeekday = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ blank: true, key: `b${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${calYear}-${pad(calMonth + 1)}-${pad(d)}`;
      cells.push({
        key: iso,
        day: d,
        iso,
        isToday: iso === TODAY,
        isSelected: iso === selectedDate,
        hasTasks: tasks.some((t) => t.dateISO === iso),
      });
    }
    return cells;
  }, [calYear, calMonth, selectedDate, tasks]);

  const selectDate = (iso) => setSelectedDate(iso);

  const tasksForSelected = tasks.filter((t) => t.dateISO === selectedDate);

  const addTask = () => {
    const text = newTaskText.trim();
    if (!text) return;
    setTasks((prev) => [...prev, { id: Date.now(), dateISO: selectedDate, text }]);
    setNewTaskText('');
  };

  const pendingTodos = todos.filter((t) => t.status === 'pending');
  const overdueTodos = pendingTodos
    .filter((t) => t.dateISO < TODAY)
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
    .map((t) => ({ ...t, date: fmtDate(t.dateISO) }));
  const todoPreview = pendingTodos.map((t) => ({ ...t, date: fmtDate(t.dateISO) }));

  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)));

  const addTodoQuick = () => {
    const text = newTodoText.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: Date.now(), drug: text, patient: '', qty: '', dateISO: TODAY, status: 'pending' },
      ...prev,
    ]);
    setNewTodoText('');
  };

  const addQuickNote = () => {
    const text = newNoteText.trim();
    if (!text) return;
    setQuickNotes((prev) => [{ id: Date.now(), text }, ...prev]);
    setNewNoteText('');
  };

  const tefteriEntries = useMemo(
    () =>
      [...tefteri]
        .sort((a, b) => Number(a.paid) - Number(b.paid))
        .map((e) => ({
          ...e,
          date: fmtDate(e.dateISO),
          amountLabel: '€' + e.amount.toFixed(2).replace('.', ','),
        })),
    [tefteri],
  );
  const tefteriTotal =
    '€' +
    tefteri
      .filter((e) => !e.paid)
      .reduce((sum, e) => sum + e.amount, 0)
      .toFixed(2)
      .replace('.', ',');

  const toggleTefteri = (id) =>
    setTefteri((prev) => prev.map((e) => (e.id === id ? { ...e, paid: !e.paid } : e)));

  const filteredCustomers = useMemo(() => {
    const q = crmQuery.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, crmQuery]);
  const customerPreview = customers.slice(0, 3);

  return {
    view,
    goTo,
    pageTitle: TITLES[view],
    darkMode,
    toggleDarkMode,

    navItems,
    dragKey,
    setDragKey,
    reorderNav,

    calLabel,
    calCells,
    dayLabels: DAY_LABELS,
    prevMonth,
    nextMonth,
    selectedLabel,
    selectDate,
    tasksForSelected,
    newTaskText,
    setNewTaskText,
    addTask,

    customerPreview,
    todoPreview,
    newTodoText,
    setNewTodoText,
    addTodoQuick,

    quickNotes,
    newNoteText,
    setNewNoteText,
    addQuickNote,

    overviewOrder,
    overviewDragKey,
    setOverviewDragKey,
    reorderOverview,
    customCards,
    addCustomCard,
    renameCustomCard,
    addCustomCardItem,
    removeCustomCard,

    crmQuery,
    setCrmQuery,
    filteredCustomers,

    overdueTodos,
    toggleTodo,

    tefteriEntries,
    tefteriTotal,
    toggleTefteri,

    salesWeek,
    financeMonths,
    financeSummary,
    transactions,
  };
}
