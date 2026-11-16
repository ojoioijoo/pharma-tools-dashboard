export const TASK_COLORS = ['default', 'red', 'yellow', 'green', 'blue'];

export default function TaskColorPicker({ value = 'default', onChange }) {
  return (
    <button
      type="button"
      aria-label={value === 'red' ? 'Αφαίρεση κόκκινου φόντου' : 'Κόκκινο φόντο'}
      title={value === 'red' ? 'Αφαίρεση κόκκινου φόντου' : 'Κόκκινο φόντο'}
      aria-pressed={value === 'red'}
      onClick={(e) => { e.stopPropagation(); onChange(value === 'red' ? 'default' : 'red'); }}
      onPointerDown={(e) => e.stopPropagation()}
      onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-md border cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${value === 'red' ? 'bg-red-600 border-red-600 text-white' : 'border-[var(--line)] bg-[var(--input-bg)] text-red-500 hover:bg-red-100 dark:hover:bg-red-950'}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={value === 'red' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 21V3m0 1c5-4 9 4 14 0v11c-5 4-9-4-14 0" />
      </svg>
    </button>
  );
}
