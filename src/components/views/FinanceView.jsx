export default function FinanceView() {
  return (
    <div className="bg-[var(--card-bg)] rounded-[20px] shadow-card overflow-hidden h-[calc(100vh-170px)]">
      <iframe
        src="https://pharma-dashboard-chi.vercel.app/"
        title="Οικονομικά"
        className="w-full h-full border-0"
      />
    </div>
  );
}
