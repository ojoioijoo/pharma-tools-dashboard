import { useState } from 'react';

export default function CustomNoteCard({ card, onRename, onAddItem, onRemove }) {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onAddItem(text);
    setDraft('');
  };

  return (
    <>
      <div className="flex items-start justify-between gap-2 mb-3.5">
        <input
          value={card.title}
          onChange={(e) => onRename(e.target.value)}
          className="font-heading font-bold text-sm text-[var(--text)] bg-transparent outline-none min-w-0 flex-1"
        />
        <div onClick={onRemove} className="text-[var(--muted)] hover:text-[var(--text)] cursor-pointer text-xs shrink-0 mt-0.5">
          ✕
        </div>
      </div>
      <div className="mb-3">
        {card.items.map((it) => (
          <div key={it.id} className="flex items-start gap-2.5 py-2 border-t border-[var(--line)]">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
            <div className="text-[13px] text-[var(--text)] min-w-0 flex-1 break-words whitespace-pre-wrap">
              {it.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          placeholder="Νέα σημείωση..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[10px] px-2.5 py-2 text-[12.5px] font-sans outline-none"
        />
        <div
          onClick={submit}
          className="bg-primary text-white font-bold text-xs px-3 py-[7px] rounded-[10px] cursor-pointer text-center"
        >
          Προσθήκη
        </div>
      </div>
    </>
  );
}
