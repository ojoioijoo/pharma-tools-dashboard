import { TrashIcon } from '../icons.jsx';
import TaskColorPicker from '../TaskColorPicker.jsx';

export default function TodoView({ store }) {
  const { overdueTodos, toggleTodo, deleteTodo } = store;

  return (
    <div className="flex flex-col gap-2">
      {overdueTodos.map((t) => (
        <div
          key={t.id}
          {...store.itemDrag('todos', t.id)}
          {...store.itemDrop('todos', t.id)}
          data-task-color={t.color}
          className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 rounded-xl border border-[var(--line)] bg-[var(--card-bg)] shadow-sm ${store.itemDragClass('todos', t.id)}`}
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
          <TaskColorPicker value={t.color} onChange={(color) => store.setTodoColor(t.id, color)} />
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
