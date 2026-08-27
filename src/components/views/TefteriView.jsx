import { useState } from 'react';
import { TrashIcon } from '../icons.jsx';
import { useDragReorder } from '../../hooks/useDragReorder.js';

export default function TefteriView({ store }) {
  const {
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
  } = store;

  const { dragHandlers, rowClass } = useDragReorder(reorderTefteri);

  const [editingId, setEditingId] = useState(null);
  const [draftCustomer, setDraftCustomer] = useState('');
  const [draftNote, setDraftNote] = useState('');
  const [draftAmount, setDraftAmount] = useState('');

  const startEdit = (e) => {
    setEditingId(e.id);
    setDraftCustomer(e.customer);
    setDraftNote(e.note || '');
    setDraftAmount(String(e.amount));
  };

  const saveEdit = (id) => {
    const customer = draftCustomer.trim();
    const amount = parseFloat(draftAmount.replace(',', '.'));
    if (customer && !Number.isNaN(amount)) {
      editTefteriEntry(id, { customer, amount, note: draftNote.trim() });
    }
    setEditingId(null);
  };

  const inputClass =
    'w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[8px] px-2 py-1 text-[13px] font-sans outline-none';

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm text-[var(--muted)]">Σύνολο χρωστούμενων</div>
        <div className="font-heading font-bold text-2xl text-[var(--text)]">{tefteriTotal}</div>
      </div>
      <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-2 px-4 sm:px-6 py-4 border-b border-[var(--line)]">
          <input
            type="text"
            placeholder="Όνομα πελάτη..."
            value={newTefteriCustomer}
            onChange={(e) => setNewTefteriCustomer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTefteriEntry()}
            className="flex-1 min-w-0 box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-xl px-4 py-[11px] text-sm font-sans outline-none"
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ποσό (€)..."
            value={newTefteriAmount}
            onChange={(e) => setNewTefteriAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTefteriEntry()}
            className="sm:w-32 box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-xl px-4 py-[11px] text-sm font-sans outline-none"
          />
          <div
            onClick={addTefteriEntry}
            className="bg-primary text-white font-bold text-sm px-5 py-[11px] rounded-xl cursor-pointer text-center shrink-0"
          >
            Προσθήκη
          </div>
        </div>
        {tefteriEntries.map((e) => (
          <div
            key={e.id}
            {...dragHandlers(e.id)}
            className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-[var(--line)] ${rowClass(e.id)}`}
          >
            <div
              onClick={() => toggleTefteri(e.id)}
              className={`w-[22px] h-[22px] rounded-[7px] shrink-0 cursor-pointer border-2 border-primary ${
                e.paid ? 'bg-primary' : 'bg-transparent'
              }`}
            />
            {editingId === e.id ? (
              <>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <input
                    autoFocus
                    type="text"
                    value={draftCustomer}
                    onChange={(ev) => setDraftCustomer(ev.target.value)}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter') { ev.preventDefault(); saveEdit(e.id); }
                      if (ev.key === 'Escape') setEditingId(null);
                    }}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={draftNote}
                    onChange={(ev) => setDraftNote(ev.target.value)}
                    onBlur={() => saveEdit(e.id)}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter') { ev.preventDefault(); saveEdit(e.id); }
                      if (ev.key === 'Escape') setEditingId(null);
                    }}
                    className={inputClass}
                  />
                </div>
                <div className="hidden sm:block shrink-0 text-xs text-[var(--muted)] w-[60px] text-right">{e.date}</div>
                <input
                  type="text"
                  inputMode="decimal"
                  value={draftAmount}
                  onChange={(ev) => setDraftAmount(ev.target.value)}
                  onBlur={() => saveEdit(e.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter') { ev.preventDefault(); saveEdit(e.id); }
                    if (ev.key === 'Escape') setEditingId(null);
                  }}
                  className="shrink-0 w-16 sm:w-20 border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[8px] px-2 py-1 text-[13px] font-sans outline-none text-right"
                />
              </>
            ) : (
              <>
                <div
                  onClick={() => startEdit(e)}
                  draggable={false}
                  className={`flex-1 min-w-0 cursor-pointer ${e.paid ? 'line-through' : ''}`}
                >
                  <div className="text-[14.5px] font-bold text-[var(--text)] break-words">{e.customer}</div>
                  <div className="text-[12.5px] text-[var(--muted)] break-words">{e.note}</div>
                </div>
                <div className="hidden sm:block shrink-0 text-xs text-[var(--muted)] w-[60px] text-right">{e.date}</div>
                <div
                  onClick={() => startEdit(e)}
                  draggable={false}
                  className="shrink-0 text-[15px] font-bold w-16 sm:w-20 text-right text-[var(--text)] cursor-pointer"
                >
                  {e.amountLabel}
                </div>
              </>
            )}
            <div
              onClick={() => deleteTefteriEntry(e.id)}
              className="text-[var(--muted)] hover:text-danger cursor-pointer shrink-0"
            >
              <TrashIcon />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
