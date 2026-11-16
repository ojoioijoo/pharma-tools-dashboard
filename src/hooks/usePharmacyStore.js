import { useEffect, useMemo, useRef, useState } from 'react';
import {
  salesWeek,
  financeMonths,
  financeSummary,
  transactions,
} from '../data/mockData.js';
import { useSyncedCollection } from './useSyncedCollection.js';
import { TASK_COLORS } from '../components/TaskColorPicker.jsx';

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

// Ίδιο με το moveItem, αλλά για πίνακες αντικειμένων με .id (tasks/todos/tefteri).
function moveById(list, fromId, toId) {
  if (!fromId || fromId === toId) return list;
  const fromIdx = list.findIndex((x) => x.id === fromId);
  const toIdx = list.findIndex((x) => x.id === toId);
  if (fromIdx === -1 || toIdx === -1) return list;
  const next = [...list];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(next.findIndex((x) => x.id === toId), 0, moved);
  return next;
}

// Σημειώσεις ημερολογίου σε περασμένη ημερομηνία που δεν έχουν τικαριστεί
// μεταφέρονται αυτόματα στις εκκρεμότητες.
function migrateOverdueTasks(tasks, todos) {
  const overdue = tasks.filter((t) => t.dateISO < TODAY && !t.done);
  if (!overdue.length) return { tasks, todos };
  const overdueIds = new Set(overdue.map((t) => t.id));
  const migrated = overdue.map((t) => ({
    id: `mig-${t.id}`,
    drug: t.text,
    patient: '',
    qty: '',
    dateISO: t.dateISO,
    status: 'pending',
    color: t.color || 'default',
  }));
  return {
    tasks: tasks.filter((t) => !overdueIds.has(t.id)),
    todos: [...migrated.filter((item) => !todos.some((todo) => todo.id === item.id)), ...todos],
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
  const [tasks, setTasks, tasksStatus, tasksReady] = useSyncedCollection('tasks');
  const [todos, setTodos, todosStatus, todosReady] = useSyncedCollection('todos');
  const [newTodoText, setNewTodoText] = useState('');
  const [tefteri, setTefteri, tefteriStatus] = useSyncedCollection('tefteri');
  const [newTefteriCustomer, setNewTefteriCustomer] = useState('');
  const [newTefteriAmount, setNewTefteriAmount] = useState('');
  const [customers, setCustomers, customersStatus] = useSyncedCollection('customers');
  const [archive, setArchive, archiveStatus] = useSyncedCollection('archive');
  const [overviewOrder, setOverviewOrder, orderStatus] = useSyncedCollection('overviewOrder', ['tasks', 'calendar', 'todos', 'tefteri']);
  const [overviewDragKey, setOverviewDragKey] = useState(null);
  const [customCards, setCustomCards, customCardsStatus, customCardsReady] = useSyncedCollection('cards');

  const statuses = [tasksStatus, todosStatus, tefteriStatus, customersStatus, archiveStatus, customCardsStatus, orderStatus];
  const syncStatus = statuses.includes('error') ? 'error' : statuses.includes('syncing') ? 'syncing' : 'synced';
  const migrated = useRef(false);

  useEffect(() => {
    if (!tasksReady || !todosReady || migrated.current) return;
    migrated.current = true;
    const next = migrateOverdueTasks(tasks, todos);
    setTasks(next.tasks);
    setTodos(next.todos);
  }, [tasksReady, todosReady, tasks, todos, setTasks, setTodos]);

  useEffect(() => {
    if (!customCardsReady) return;
    const base = ['tasks', 'calendar', 'todos', 'tefteri'];
    const valid = new Set([...base, ...customCards.map((c) => c.id)]);
    setOverviewOrder((prev) => [...prev.filter((id) => valid.has(id)), ...[...valid].filter((id) => !prev.includes(id))]);
  }, [customCards, customCardsReady, setOverviewOrder]);

  useEffect(() => {
    const handler = (event) => {
      if (syncStatus !== 'synced') {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [syncStatus]);

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
    const id = `custom-${crypto.randomUUID()}`;
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
              items: [{ id: crypto.randomUUID(), text, createdAt: Date.now(), updatedAt: Date.now() }, ...c.items],
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
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), dateISO: selectedDate, text, done: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const editTask = (id, text) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));

  const setTaskColor = (id, color) => {
    if (!TASK_COLORS.includes(color)) return;
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, color } : t));
  };

  const setTodoColor = (id, color) => {
    if (!TASK_COLORS.includes(color)) return;
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, color } : t));
  };

  const deleteTask = (id) => {
    const item = tasks.find((t) => t.id === id);
    if (item) archiveItem('task', item);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderTasks = (fromId, toId) => setTasks((prev) => moveById(prev, fromId, toId));

  const overdueTodos = todos
    .filter((t) => t.dateISO < TODAY)
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

  const reorderTodos = (fromId, toId) => setTodos((prev) => moveById(prev, fromId, toId));

  const addTodoQuick = () => {
    const text = newTodoText.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), drug: text, patient: '', qty: '', dateISO: TODAY, status: 'pending' },
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
      { id: crypto.randomUUID(), customer, amount, dateISO: TODAY, note: '', paid: false },
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

  const reorderTefteri = (fromId, toId) => setTefteri((prev) => moveById(prev, fromId, toId));

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
    setTaskColor,
    setTodoColor,
    deleteTask,
    reorderTasks,

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
    reorderTodos,

    tefteriEntries,
    tefteriTotal,
    toggleTefteri,
    editTefteriEntry,
    addTefteriEntry,
    deleteTefteriEntry,
    reorderTefteri,
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
