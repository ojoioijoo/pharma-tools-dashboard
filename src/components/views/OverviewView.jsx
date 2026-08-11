import { useState } from 'react';
import MiniCalendar from '../MiniCalendar.jsx';
import OverviewCard from '../OverviewCard.jsx';
import CustomNoteCard from '../CustomNoteCard.jsx';
import { TrashIcon } from '../icons.jsx';

export default function OverviewView({ store, goTo }) {
  const {
    selectedLabel,
    tasksForSelected,
    newTaskText,
    setNewTaskText,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    calLabel,
    dayLabels,
    calCells,
    prevMonth,
    nextMonth,
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
    editTodo,
    editTefteriEntry,
  } = store;

  const cardProps = { dragKey: overviewDragKey, setDragKey: setOverviewDragKey, reorderCards: reorderOverview };

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskDraft, setEditingTaskDraft] = useState('');
  const saveTaskEdit = (id) => {
    const text = editingTaskDraft.trim();
    if (text) editTask(id, text);
    setEditingTaskId(null);
  };

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoDraft, setEditingTodoDraft] = useState('');
  const saveTodoEdit = (id) => {
    const text = editingTodoDraft.trim();
    if (text) editTodo(id, text);
    setEditingTodoId(null);
  };

  const [editingTefteriId, setEditingTefteriId] = useState(null);
  const [editingTefteriName, setEditingTefteriName] = useState('');
  const [editingTefteriAmount, setEditingTefteriAmount] = useState('');
  const startTefteriEdit = (e) => {
    setEditingTefteriId(e.id);
    setEditingTefteriName(e.customer);
    setEditingTefteriAmount(String(e.amount));
  };
  const saveTefteriEdit = (id) => {
    const customer = editingTefteriName.trim();
    const amount = parseFloat(editingTefteriAmount.replace(',', '.'));
    if (customer && !Number.isNaN(amount)) editTefteriEntry(id, { customer, amount });
    setEditingTefteriId(null);
  };

  const renderWidget = (id) => {
    if (id === 'tasks') {
      return (
        <OverviewCard key={id} id={id} {...cardProps}>
          <div className="font-heading font-bold text-[15px] mb-3 text-[var(--text)]">
            Σήμερα · {selectedLabel}
          </div>
          <div className="mb-3 min-h-[40px]">
            {tasksForSelected.map((tk) => (
              <div key={tk.id} className="flex items-start gap-2.5 py-2 border-t border-[var(--line)]">
                <div
                  onClick={() => toggleTask(tk.id)}
                  className={`w-[16px] h-[16px] rounded-[5px] border-2 border-primary shrink-0 mt-0.5 cursor-pointer ${
                    tk.done ? 'bg-primary' : 'bg-[var(--input-bg)]'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  {editingTaskId === tk.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={editingTaskDraft}
                      onChange={(e) => setEditingTaskDraft(e.target.value)}
                      onBlur={() => saveTaskEdit(tk.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); saveTaskEdit(tk.id); }
                        if (e.key === 'Escape') setEditingTaskId(null);
                      }}
                      className="w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[8px] px-2 py-1 text-[13px] font-sans outline-none"
                    />
                  ) : (
                    <div
                      onClick={() => { setEditingTaskId(tk.id); setEditingTaskDraft(tk.text); }}
                      draggable={false}
                      className={`text-[13px] text-[var(--text)] break-words cursor-pointer ${
                        tk.done ? 'line-through text-[var(--muted)]' : ''
                      }`}
                    >
                      {tk.text}
                    </div>
                  )}
                </div>
                <div
                  onClick={() => deleteTask(tk.id)}
                  className="text-[var(--muted)] hover:text-danger cursor-pointer shrink-0 mt-0.5"
                >
                  <TrashIcon />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="Νέα δουλειά..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[10px] px-2.5 py-2 text-[12.5px] font-sans outline-none"
            />
            <div
              onClick={addTask}
              className="bg-primary text-white font-bold text-xs px-3 py-[7px] rounded-[10px] cursor-pointer text-center"
            >
              Προσθήκη
            </div>
          </div>
        </OverviewCard>
      );
    }

    if (id === 'calendar') {
      return (
        <OverviewCard key={id} id={id} {...cardProps} padding="px-[18px] py-4">
          <MiniCalendar
            calLabel={calLabel}
            dayLabels={dayLabels}
            calCells={calCells}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            onSelect={store.selectDate}
          />
        </OverviewCard>
      );
    }

    if (id === 'tefteri') {
      return (
        <OverviewCard key={id} id={id} {...cardProps}>
          <div className="flex items-start justify-between mb-3.5">
            <div>
              <div className="font-heading font-bold text-sm mb-1 text-[var(--text)]">Τεφτέρι</div>
              <a href="#" onClick={(e) => { e.preventDefault(); goTo('tefteri'); }} className="text-[11.5px] font-semibold">
                Όλες →
              </a>
            </div>
            <div className="font-heading font-bold text-sm text-[var(--text)]">{store.tefteriTotal}</div>
          </div>
          <div>
            {store.tefteriEntries.map((e) => (
              <div key={e.id} className="flex items-center gap-2.5 py-[9px] border-t border-[var(--line)]">
                <div
                  onClick={() => store.toggleTefteri(e.id)}
                  className={`w-[18px] h-[18px] rounded-md shrink-0 cursor-pointer border-2 border-primary ${
                    e.paid ? 'bg-primary' : 'bg-transparent'
                  }`}
                />
                {editingTefteriId === e.id ? (
                  <>
                    <input
                      autoFocus
                      type="text"
                      value={editingTefteriName}
                      onChange={(ev) => setEditingTefteriName(ev.target.value)}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter') { ev.preventDefault(); saveTefteriEdit(e.id); }
                        if (ev.key === 'Escape') setEditingTefteriId(null);
                      }}
                      className="flex-1 min-w-0 border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[8px] px-2 py-1 text-[13px] font-sans outline-none"
                    />
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editingTefteriAmount}
                      onChange={(ev) => setEditingTefteriAmount(ev.target.value)}
                      onBlur={() => saveTefteriEdit(e.id)}
                      onKeyDown={(ev) => {
                        if (ev.key === 'Enter') { ev.preventDefault(); saveTefteriEdit(e.id); }
                        if (ev.key === 'Escape') setEditingTefteriId(null);
                      }}
                      className="w-16 shrink-0 border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[8px] px-2 py-1 text-[12.5px] font-sans outline-none text-right"
                    />
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => startTefteriEdit(e)}
                      draggable={false}
                      className={`flex-1 min-w-0 cursor-pointer ${e.paid ? 'line-through text-[var(--muted)]' : ''}`}
                    >
                      <div className="text-[13px] font-semibold text-[var(--text)] truncate">{e.customer}</div>
                    </div>
                    <div
                      onClick={() => startTefteriEdit(e)}
                      draggable={false}
                      className="text-[12.5px] font-bold text-[var(--text)] shrink-0 cursor-pointer"
                    >
                      {e.amountLabel}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </OverviewCard>
      );
    }

    if (id === 'todos') {
      return (
        <OverviewCard key={id} id={id} {...cardProps}>
          <div className="mb-3.5">
            <div className="font-heading font-bold text-sm mb-1 text-[var(--text)]">Εκκρεμότητες</div>
            <a href="#" onClick={(e) => { e.preventDefault(); goTo('todo'); }} className="text-[11.5px] font-semibold">
              Όλες →
            </a>
          </div>
          <div className="mb-3">
            {store.todoPreview.map((t) => (
              <div key={t.id} className="flex items-center gap-2.5 py-[9px] border-t border-[var(--line)]">
                <div
                  onClick={() => store.toggleTodo(t.id)}
                  className={`w-[18px] h-[18px] rounded-md border-2 border-primary shrink-0 cursor-pointer ${
                    t.done ? 'bg-primary' : 'bg-[var(--input-bg)]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  {editingTodoId === t.id ? (
                    <input
                      autoFocus
                      type="text"
                      value={editingTodoDraft}
                      onChange={(e) => setEditingTodoDraft(e.target.value)}
                      onBlur={() => saveTodoEdit(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); saveTodoEdit(t.id); }
                        if (e.key === 'Escape') setEditingTodoId(null);
                      }}
                      className="w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[8px] px-2 py-1 text-[13px] font-sans outline-none mb-0.5"
                    />
                  ) : (
                    <div
                      onClick={() => { setEditingTodoId(t.id); setEditingTodoDraft(t.drug); }}
                      draggable={false}
                      className={`text-[13px] font-semibold break-words cursor-pointer ${
                        t.done ? 'line-through text-[var(--muted)]' : 'text-[var(--text)]'
                      }`}
                    >
                      {t.drug}
                    </div>
                  )}
                  <div className="text-[11px] text-[var(--muted)]">
                    {t.patient ? `${t.patient} · ` : ''}
                    {t.date}
                  </div>
                </div>
                <div
                  onClick={() => store.deleteTodo(t.id)}
                  className="text-[var(--muted)] hover:text-danger cursor-pointer shrink-0"
                >
                  <TrashIcon />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="Νέα εκκρεμότητα..."
              value={store.newTodoText}
              onChange={(e) => store.setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && store.addTodoQuick()}
              className="w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[10px] px-2.5 py-2 text-[12.5px] font-sans outline-none"
            />
            <div
              onClick={store.addTodoQuick}
              className="bg-primary text-white font-bold text-xs px-3 py-[7px] rounded-[10px] cursor-pointer text-center"
            >
              Προσθήκη
            </div>
          </div>
        </OverviewCard>
      );
    }

    const card = customCards.find((c) => c.id === id);
    if (!card) return null;
    return (
      <OverviewCard key={id} id={id} {...cardProps}>
        <CustomNoteCard
          card={card}
          onRename={(title) => renameCustomCard(card.id, title)}
          onAddItem={(text) => addCustomCardItem(card.id, text)}
          onEditItem={(itemId, text) => editCustomCardItem(card.id, itemId, text)}
          onRemove={() => removeCustomCard(card.id)}
        />
      </OverviewCard>
    );
  };

  return (
    <div className="columns-1 sm:columns-2 xl:columns-4 gap-5">
      {overviewOrder.map(renderWidget)}

      <div
        onClick={addCustomCard}
        className="min-w-0 mb-5 min-h-[120px] break-inside-avoid rounded-[20px] border-2 border-dashed border-[var(--line)] flex items-center justify-start px-5 cursor-pointer text-[var(--muted)] hover:text-primary hover:border-primary transition-colors"
      >
        <span className="text-2xl font-bold leading-none">+</span>
      </div>
    </div>
  );
}
