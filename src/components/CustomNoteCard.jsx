import { useState } from 'react';

const fmtEditedAt = (ts) =>
  new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts));

export default function CustomNoteCard({ card, onRename, onAddItem, onEditItem, onRemove }) {
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState('');

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    onAddItem(text);
    setDraft('');
  };

  const startEdit = (it) => {
    setEditingId(it.id);
    setEditDraft(it.text);
  };

  const saveEdit = () => {
    const text = editDraft.trim();
    if (text) onEditItem(editingId, text);
    setEditingId(null);
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
            <div className="min-w-0 flex-1">
              {editingId === it.id ? (
                <textarea
                  autoFocus
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      saveEdit();
                    }
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[8px] px-2 py-1.5 text-[13px] font-sans outline-none resize-none"
                  rows={2}
                />
              ) : (
                <div
                  onClick={() => startEdit(it)}
                  draggable={false}
                  className="text-[13px] text-[var(--text)] break-words whitespace-pre-wrap cursor-pointer"
                >
                  {it.text}
                </div>
              )}
              {(it.createdAt || it.updatedAt) && (
                <div className="text-[10.5px] text-[var(--muted)] mt-0.5">
                  {fmtEditedAt(it.createdAt || it.updatedAt)}
                  {it.createdAt && it.updatedAt && it.updatedAt !== it.createdAt && (
                    <> · επεξ. {fmtEditedAt(it.updatedAt)}</>
                  )}
                </div>
              )}
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
