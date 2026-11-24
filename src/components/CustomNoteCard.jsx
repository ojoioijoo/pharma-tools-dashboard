import { useState } from 'react';
import { TrashIcon } from './icons.jsx';
import TaskColorPicker from './TaskColorPicker.jsx';

const TITLE_COLORS = [
  { value: '', label: 'Χωρίς χρώμα' },
  { value: '#fee2e2', label: 'Απαλό κόκκινο' },
  { value: '#ffedd5', label: 'Απαλό πορτοκαλί' },
  { value: '#fef3c7', label: 'Απαλό κίτρινο' },
  { value: '#ecfccb', label: 'Απαλό λαχανί' },
  { value: '#dcfce7', label: 'Απαλό πράσινο' },
  { value: '#ccfbf1', label: 'Απαλό τιρκουάζ' },
  { value: '#dbeafe', label: 'Απαλό μπλε' },
  { value: '#e0e7ff', label: 'Απαλό ίντιγκο' },
  { value: '#ede9fe', label: 'Απαλό μωβ' },
  { value: '#fce7f3', label: 'Απαλό ροζ' },
];

const fmtEditedAt = (ts) =>
  new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts));

export default function CustomNoteCard({ card, store, onRename, onAddItem, onEditItem, onRemove, onRemoveItem }) {
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
      <div
        className="flex items-center justify-between gap-2 mb-3.5 rounded-lg px-2 py-1.5"
        style={{ backgroundColor: card.titleColor || 'transparent' }}
      >
        <input
          value={card.title}
          onChange={(e) => onRename(e.target.value)}
          className="font-heading font-bold text-sm text-[#1d2144] bg-transparent outline-none min-w-0 flex-1"
        />
        <select
          aria-label="Χρώμα φόντου τίτλου"
          title="Χρώμα φόντου τίτλου"
          value={card.titleColor || ''}
          onChange={(e) => store.setCustomCardTitleColor(card.id, e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="max-w-[115px] text-[10px] rounded-md border border-black/10 bg-white/80 text-[#1d2144] px-1.5 py-1 outline-none shrink-0"
        >
          {TITLE_COLORS.map((color) => (
            <option key={color.value || 'none'} value={color.value}>{color.label}</option>
          ))}
        </select>
        <div onClick={onRemove} className="text-[var(--muted)] hover:text-[var(--text)] cursor-pointer text-xs shrink-0 mt-0.5">
          ✕
        </div>
      </div>
      <div className="mb-3">
        {card.items.map((it) => (
          <div key={it.id} {...store.itemDrag(card.id, it.id)} {...store.itemDrop(card.id, it.id)} data-task-color={it.color} className={`flex items-start gap-2.5 py-2 border-t border-[var(--line)] cursor-grab ${store.itemDragClass(card.id, it.id)}`}>
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
            <TaskColorPicker value={it.color} onChange={(color) => store.setCustomCardItemColor(card.id, it.id, color)} />
            <button
              type="button"
              aria-label="Διαγραφή σημείωσης"
              title="Διαγραφή σημείωσης"
              onClick={(e) => { e.stopPropagation(); onRemoveItem(it.id); }}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-[var(--muted)] hover:text-danger cursor-pointer shrink-0"
            >
              <TrashIcon />
            </button>
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
