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
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <div className="text-[13px] text-[var(--text)] min-w-0 flex-1 break-words">{tk.text}</div>
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

    if (id === 'notes') {
      return (
        <OverviewCard key={id} id={id} {...cardProps}>
          <div className="mb-3.5">
            <div className="font-heading font-bold text-sm mb-1 text-[var(--text)]">Πρόσφατες σημειώσεις</div>
            <a href="#" onClick={(e) => { e.preventDefault(); goTo('crm'); }} className="text-[11.5px] font-semibold">
              Όλες →
            </a>
          </div>
          <div className="mb-3">
            {store.visibleNotes.map((n) => (
              <div key={n.id} className="flex items-start gap-2.5 py-2.5 border-t border-[var(--line)]">
                <div
                  onClick={() => store.toggleQuickNote(n.id)}
                  className="w-[18px] h-[18px] rounded-md border-2 border-primary shrink-0 bg-[var(--input-bg)] cursor-pointer mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11.5px] text-[var(--text)] break-words whitespace-pre-wrap">{n.text}</div>
                </div>
                <div
                  onClick={() => store.deleteQuickNote(n.id)}
                  className="text-[var(--muted)] hover:text-danger cursor-pointer shrink-0 mt-0.5"
                >
                  <TrashIcon />
                </div>
              </div>
            ))}
            {store.customerPreview.map((c) => (
              <div key={c.id} className="flex gap-2.5 py-2.5 border-t border-[var(--line)]">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 text-[var(--text)]"
                  style={{ background: c.color }}
                >
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--text)]">{c.name}</div>
                  <div className="text-[11.5px] text-[var(--muted)] overflow-hidden text-ellipsis whitespace-nowrap">
                    {c.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              placeholder="Νέα σημείωση..."
              value={store.newNoteText}
              onChange={(e) => store.setNewNoteText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && store.addQuickNote()}
              className="w-full box-border border border-[var(--line)] bg-[var(--input-bg)] text-[var(--text)] rounded-[10px] px-2.5 py-2 text-[12.5px] font-sans outline-none"
            />
            <div
              onClick={store.addQuickNote}
              className="bg-primary text-white font-bold text-xs px-3 py-[7px] rounded-[10px] cursor-pointer text-center"
            >
              Προσθήκη
            </div>
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
                  className="w-[18px] h-[18px] rounded-md border-2 border-primary shrink-0 bg-[var(--input-bg)] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--text)] break-words">{t.drug}</div>
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
