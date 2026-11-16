export const TASK_COLORS = ['default', 'red', 'yellow', 'green', 'blue'];

export default function TaskColorPicker({ value = 'default', onChange }) {
  return (
    <select
      aria-label="Χρώμα φόντου εργασίας"
      title="Χρώμα φόντου εργασίας"
      value={TASK_COLORS.includes(value) ? value : 'default'}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
      className="shrink-0 max-w-[88px] rounded-md border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] text-xs p-1 cursor-pointer"
    >
      <option value="default">Χρώμα</option>
      <option value="red">Κόκκινο</option>
      <option value="yellow">Κίτρινο</option>
      <option value="green">Πράσινο</option>
      <option value="blue">Μπλε</option>
    </select>
  );
}
