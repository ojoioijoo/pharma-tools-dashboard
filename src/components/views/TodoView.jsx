import { TrashIcon } from '../icons.jsx';
import { useDragReorder } from '../../hooks/useDragReorder.js';

export default function TodoView({ store }) {
  const { overdueTodos, toggleTodo, deleteTodo, reorderTodos } = store;
  const { dragHandlers, rowClass } = useDragReorder(reorderTodos);

  return (
    <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card overflow-hidden">
      {overdueTodos.map((t) => (
        <div
          key={t.id}
          {...dragHandlers(t.id)}
          className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-[var(--line)] ${rowClass(t.id)}`}
        >
          <div
            onClick={() => toggleTodo(t.id)}
            className={`w-[22px] h-[22px] rounded-[7px] shrink-0 cursor-pointer border-2 border-primary ${
              t.done ? 'bg-primary' : 'bg-[var(--input-bg)]'
            }`}
          />
          <div className="flex-1 min-w-0">
            <div
              className={`text-[14.5px] font-bold break-words ${t.done ? 'line-through text-[var(--muted)]' : 'text-[var(--text)]'}`}
            >
              {t.drug} · {t.qty}
            </div>
            <div className="text-[12.5px] text-[var(--muted)]">{t.patient}</div>
          </div>
          <div className="shrink-0 text-xs font-bold px-[13px] py-1.5 rounded-full bg-[var(--input-bg)] text-[var(--text)]">
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
