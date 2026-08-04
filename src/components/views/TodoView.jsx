import { TrashIcon } from '../icons.jsx';

export default function TodoView({ store }) {
  const { overdueTodos, toggleTodo, deleteTodo } = store;

  return (
    <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card overflow-hidden">
      {overdueTodos.map((t) => (
        <div key={t.id} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--line)]">
          <div
            onClick={() => toggleTodo(t.id)}
            className={`w-[22px] h-[22px] rounded-[7px] shrink-0 cursor-pointer border-2 border-primary ${
              t.done ? 'bg-primary' : 'bg-[var(--input-bg)]'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div
              className={`text-[14.5px] font-bold ${t.done ? 'line-through text-[var(--muted)]' : 'text-[var(--text)]'}`}
            >
              {t.drug} · {t.qty}
            </div>
            <div className="text-[12.5px] text-[var(--muted)]">{t.patient}</div>
          </div>
          <div className="text-xs font-bold px-[13px] py-1.5 rounded-full bg-[var(--input-bg)] text-[var(--text)]">
            {t.date}
          </div>
          <div
            onClick={() => deleteTodo(t.id)}
            className="text-[var(--muted)] hover:text-danger cursor-pointer shrink-0"
          >
            <TrashIcon />
          </div>
        </div>
      ))}
    </div>
  );
}
