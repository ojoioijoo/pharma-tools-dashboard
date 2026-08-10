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
    removeCustomCard,
  } = store;

  const cardProps = { dragKey: overviewDragKey, setDragKey: setOverviewDragKey, reorderCards: reorderOverview };

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
                <div
                  className={`text-[13px] text-[var(--text)] min-w-0 flex-1 break-words ${
                    tk.done ? 'line-through text-[var(--muted)]' : ''
                  }`}
                >
                  {tk.text}
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
                <div className={`flex-1 min-w-0 ${e.paid ? 'line-through text-[var(--muted)]' : ''}`}>
                  <div className="text-[13px] font-semibold text-[var(--text)] truncate">{e.customer}</div>
                </div>
                <div className="text-[12.5px] font-bold text-[var(--text)] shrink-0">{e.amountLabel}</div>
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
                  <div
                    className={`text-[13px] font-semibold break-words ${
                      t.done ? 'line-through text-[var(--muted)]' : 'text-[var(--text)]'
                    }`}
                  >
                    {t.drug}
                  </div>
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
          onRemove={() => removeCustomCard(card.id)}
        />
      </OverviewCard>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
      {overviewOrder.map(renderWidget)}

      <div
        onClick={addCustomCard}
        className="min-w-0 min-h-[120px] rounded-[20px] border-2 border-dashed border-[var(--line)] flex items-center justify-center cursor-pointer text-[var(--muted)] hover:text-primary hover:border-primary transition-colors"
      >
        <span className="text-2xl font-bold leading-none">+</span>
      </div>
    </div>
  );
}
