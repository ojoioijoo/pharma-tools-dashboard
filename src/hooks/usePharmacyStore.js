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
  archive: 'Αρχείο',
};

const NAV_LABELS = {
  overview: 'Επισκόπηση',
  crm: 'Πελάτες',
  todo: 'Εκκρεμότητες',
  finance: 'Οικονομικά',
  tefteri: 'Τεφτέρι',
  archive: 'Αρχείο',
};

const MONTH_NAMES = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
  'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος',
];
const DAY_LABELS = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σα', 'Κυ'];

const pad = (n) => (n < 10 ? '0' + n : '' + n);
const fmtDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const fmtDateTime = (ts) => {
  const d = new Date(ts);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Υπολογίζεται στη φόρτωση του module (κάθε reload της σελίδας παίρνει τη σωστή ημέρα).
const TODAY = todayISO();

function moveItem(order, fromKey, toKey) {
  if (!fromKey || fromKey === toKey) return order;
  const next = [...order];
  next.splice(next.indexOf(fromKey), 1);
  next.splice(next.indexOf(toKey), 0, fromKey);
  return next;
}

// Σημειώσεις ημερολογίου σε περασμένη ημερομηνία που δεν έχουν τικαριστεί
// μεταφέρονται αυτόματα στις εκκρεμότητες.
function migrateOverdueTasks(tasks, todos) {
  const overdue = tasks.filter((t) => t.dateISO < TODAY && !t.done);
  if (!overdue.length) return { tasks, todos };
  const overdueIds = new Set(overdue.map((t) => t.id));
  const migrated = overdue.map((t) => ({
    id: `mig-${t.id}-${Date.now()}`,
    drug: t.text,
    patient: '',
    qty: '',
    dateISO: t.dateISO,
    status: 'pending',
  }));
  return {
    tasks: tasks.filter((t) => !overdueIds.has(t.id)),
    todos: [...migrated, ...todos],
  };
}

export function usePharmacyStore() {
  const [view, setView] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [navOrder, setNavOrder] = useState(['overview', 'crm', 'todo', 'finance', 'tefteri', 'archive']);
  const [dragKey, setDragKey] = useState(null);
  const [crmQuery, setCrmQuery] = useState('');
  const [calYear, setCalYear] = useState(Number(TODAY.slice(0, 4)));
  const [calMonth, setCalMonth] = useState(Number(TODAY.slice(5, 7)) - 1);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [newTaskText, setNewTaskText] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [todos, setTodos] = useState(initialTodos);
  const [newTodoText, setNewTodoText] = useState('');
  const [tefteri, setTefteri] = useState(initialTefteri);
  const [newTefteriCustomer, setNewTefteriCustomer] = useState('');
  const [newTefteriAmount, setNewTefteriAmount] = useState('');
  const [customers, setCustomers] = useState(initialCustomers);
  const [archive, setArchive] = useState([]);
  const [overviewOrder, setOverviewOrder] = useState(['tasks', 'calendar', 'todos', 'tefteri']);
  const [overviewDragKey, setOverviewDragKey] = useState(null);
  const [customCards, setCustomCards] = useState([]);

  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | synced | error
  const hydrated = useRef(false);
  const pendingSaves = useRef(0);

  const persist = (name, value) => {
    if (!hydrated.current) return;
    pendingSaves.current += 1;
    setSyncStatus('syncing');
    saveCollection(name, value)
      .then(() => {
        pendingSaves.current = Math.max(0, pendingSaves.current - 1);
        if (pendingSaves.current === 0) setSyncStatus('synced');
      })
      .catch(() => {
        pendingSaves.current = Math.max(0, pendingSaves.current - 1);
        setSyncStatus('error');
      });
  };

  // Προειδοποίηση αν ο χρήστης κλείσει/κάνει refresh ενώ εκκρεμεί αποθήκευση,
  // ώστε να μη χάνεται ό,τι μόλις γράφτηκε.
  useEffect(() => {
    const handler = (e) => {
      if (syncStatus === 'syncing') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [syncStatus]);

  // Αρχικό φόρτωμα από το Redis (μέσω /api). Αν αποτύχει (π.χ. τοπικό `vite dev`
  // χωρίς `vercel dev`), κρατάμε τα mock δεδομένα ως έχουν.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let ft = [];
      let ftd = [];
      let tf = [];
      let cu = [];
      let cc = [];
      let oo = [];
      let ar = [];
      try {
        [ft, ftd, tf, cu, cc, oo, ar] = await Promise.all([
          fetchCollection('tasks'),
          fetchCollection('todos'),
          fetchCollection('tefteri'),
          fetchCollection('customers'),
          fetchCollection('cards'),
          fetchCollection('overviewOrder'),
          fetchCollection('archive'),
        ]);
        if (cancelled) return;
        setSyncStatus('synced');
      } catch {
        // API μη διαθέσιμο — παραμένουμε στα τοπικά mock δεδομένα.
        if (cancelled) return;
        setSyncStatus('error');
      }
      if (cancelled) return;

      const { tasks: t, todos: td } = migrateOverdueTasks(
        ft.length ? ft : initialTasks,
        ftd.length ? ftd : initialTodos,
      );
      setTasks(t);
      setTodos(td);
      if (!ft.length) saveCollection('tasks', t).catch(() => {});
      if (!ftd.length) saveCollection('todos', td).catch(() => {});

      if (tf.length) setTefteri(tf);
      else saveCollection('tefteri', initialTefteri).catch(() => {});
      if (cu.length) setCustomers(cu);
      else saveCollection('customers', initialCustomers).catch(() => {});
      setCustomCards(cc);
      setArchive(ar);
      const cardIds = cc.map((c) => c.id);
      const baseKeys = ['tasks', 'calendar', 'todos', 'tefteri'];
      const validKeys = new Set([...baseKeys, ...cardIds]);
      setOverviewOrder((prev) => {
        const source = oo.length ? oo : prev;
        const kept = source.filter((k) => validKeys.has(k));
        const missing = [...baseKeys, ...cardIds].filter((k) => !kept.includes(k));
        return [...kept, ...missing];
      });

      hydrated.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => persist('tasks', tasks), [tasks]);
  useEffect(() => persist('todos', todos), [todos]);
  useEffect(() => persist('tefteri', tefteri), [tefteri]);
  useEffect(() => persist('customers', customers), [customers]);
  useEffect(() => persist('cards', customCards), [customCards]);
  useEffect(() => persist('overviewOrder', overviewOrder), [overviewOrder]);
  useEffect(() => persist('archive', archive), [archive]);

  const archiveItem = (type, item) =>
    setArchive((prev) => [
      { id: `arc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, item, deletedAt: Date.now() },
      ...prev,
    ]);

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
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              items: [{ id: Date.now(), text, createdAt: Date.now(), updatedAt: Date.now() }, ...c.items],
            }
          : c,
      ),
    );

  const editCustomCardItem = (cardId, itemId, text) =>
    setCustomCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              items: c.items.map((it) =>
                it.id === itemId ? { ...it, text, updatedAt: Date.now() } : it,
              ),
            }
          : c,
      ),
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
    setTasks((prev) => [...prev, { id: Date.now(), dateISO: selectedDate, text, done: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const editTask = (id, text) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));

  const deleteTask = (id) => {
    const item = tasks.find((t) => t.id === id);
    if (item) archiveItem('task', item);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const overdueTodos = todos
    .filter((t) => t.dateISO < TODAY)
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO))
    .map((t) => ({ ...t, date: fmtDate(t.dateISO), done: t.status === 'done' }));
  const todoPreview = todos.map((t) => ({ ...t, date: fmtDate(t.dateISO), done: t.status === 'done' }));

  const toggleTodo = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t)));

  const editTodo = (id, drug) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, drug } : t)));

  const deleteTodo = (id) => {
    const item = todos.find((t) => t.id === id);
    if (item) archiveItem('todo', item);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const addTodoQuick = () => {
    const text = newTodoText.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: Date.now(), drug: text, patient: '', qty: '', dateISO: TODAY, status: 'pending' },
      ...prev,
    ]);
    setNewTodoText('');
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

  const addTefteriEntry = () => {
    const customer = newTefteriCustomer.trim();
    const amount = parseFloat(newTefteriAmount.replace(',', '.'));
    if (!customer || Number.isNaN(amount)) return;
    setTefteri((prev) => [
      { id: Date.now(), customer, amount, dateISO: TODAY, note: '', paid: false },
      ...prev,
    ]);
    setNewTefteriCustomer('');
    setNewTefteriAmount('');
  };

  const deleteTefteriEntry = (id) => {
    const item = tefteri.find((e) => e.id === id);
    if (item) archiveItem('tefteri', item);
    setTefteri((prev) => prev.filter((e) => e.id !== id));
  };

  const editTefteriEntry = (id, { customer, amount, note }) =>
    setTefteri((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, customer, amount, note: note !== undefined ? note : e.note } : e,
      ),
    );

  const ARCHIVE_TYPE_LABELS = { task: 'Δουλειά', todo: 'Εκκρεμότητα', tefteri: 'Τεφτέρι' };

  const archiveEntries = useMemo(
    () =>
      archive.map((a) => {
        let title = '';
        let subtitle = '';
        if (a.type === 'task') {
          title = a.item.text;
          subtitle = fmtDate(a.item.dateISO);
        } else if (a.type === 'todo') {
          title = a.item.drug;
          subtitle = [a.item.patient, fmtDate(a.item.dateISO)].filter(Boolean).join(' · ');
        } else if (a.type === 'tefteri') {
          title = a.item.customer;
          subtitle = '€' + a.item.amount.toFixed(2).replace('.', ',');
        }
        return {
          id: a.id,
          typeLabel: ARCHIVE_TYPE_LABELS[a.type] || a.type,
          title,
          subtitle,
          deletedAtLabel: fmtDateTime(a.deletedAt),
        };
      }),
    [archive],
  );

  const filteredCustomers = useMemo(() => {
    const q = crmQuery.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, crmQuery]);

  return {
    view,
    goTo,
    pageTitle: TITLES[view],
    darkMode,
    toggleDarkMode,
    syncStatus,

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
    toggleTask,
    editTask,
    deleteTask,

    todoPreview,
    newTodoText,
    setNewTodoText,
    addTodoQuick,

    overviewOrder,
    overviewDragKey,
    setOverviewDragKey,
    reorderOverview,
    customCards,
    addCustomCard,
    renameCustomCard,
    addCustomCardItem,
    editCustomCardItem,
    removeCustomCard,

    crmQuery,
    setCrmQuery,
    filteredCustomers,

    overdueTodos,
    toggleTodo,
    editTodo,
    deleteTodo,

    tefteriEntries,
    tefteriTotal,
    toggleTefteri,
    editTefteriEntry,
    addTefteriEntry,
    deleteTefteriEntry,
    newTefteriCustomer,
    setNewTefteriCustomer,
    newTefteriAmount,
    setNewTefteriAmount,

    archiveEntries,

    salesWeek,
    financeMonths,
    financeSummary,
    transactions,
  };
}
