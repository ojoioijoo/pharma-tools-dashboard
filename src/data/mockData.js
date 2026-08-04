export const initialTasks = [
  { id: 1, dateISO: '2026-07-31', text: 'Απογραφή ψυγείου φαρμάκων' },
  { id: 2, dateISO: '2026-08-05', text: 'Παραγγελία φαρμακαποθήκης' },
  { id: 3, dateISO: '2026-08-12', text: 'Ραντεβού με προμηθευτή εξοπλισμού' },
];

export const initialTodos = [
  { id: 1, drug: 'Augmentin 1g', patient: 'Γ. Νικολάου', qty: '2 κουτιά', dateISO: '2026-07-24', status: 'pending' },
  { id: 2, drug: 'Depon 500mg', patient: 'Μ. Ζαχαρίου', qty: '1 κουτί', dateISO: '2026-07-25', status: 'pending' },
  { id: 3, drug: 'Ventolin spray', patient: 'Α. Κωστάκη', qty: '1 τεμ.', dateISO: '2026-07-20', status: 'done' },
  { id: 4, drug: 'Xanax 0,5mg', patient: 'Ε. Δημητρίου', qty: '1 κουτί', dateISO: '2026-07-31', status: 'pending' },
  { id: 5, drug: 'Nurofen 400mg', patient: 'Σ. Παππά', qty: '1 κουτί', dateISO: '2026-07-18', status: 'done' },
  { id: 6, drug: 'Lantus SoloStar', patient: 'Θ. Οικονόμου', qty: '1 πένα', dateISO: '2026-07-31', status: 'pending' },
  { id: 7, drug: 'Aspirin 100mg', patient: 'Κ. Βλάχου', qty: '2 κουτιά', dateISO: '2026-07-26', status: 'pending' },
  { id: 8, drug: 'Betadine', patient: 'Ν. Ρίζου', qty: '1 τεμ.', dateISO: '2026-07-15', status: 'done' },
];

export const initialTefteri = [
  { id: 1, customer: 'Νίκος Παπαδόπουλος', amount: 45, dateISO: '2026-07-20', note: 'Αγορά χωρίς μετρητά', paid: false },
  { id: 2, customer: 'Ελένη Σταύρου', amount: 18.5, dateISO: '2026-07-26', note: 'Θα πληρώσει Παρασκευή', paid: false },
  { id: 3, customer: 'Γιώργος Μιχαήλ', amount: 60, dateISO: '2026-07-10', note: 'Εξοφλήθηκε', paid: true },
  { id: 4, customer: 'Δέσποινα Ρήγα', amount: 12.3, dateISO: '2026-07-29', note: '', paid: false },
];

export const initialCustomers = [
  { id: 1, name: 'Γεωργία Νικολάου', initials: 'ΓΝ', color: '#5B6EF5', lastVisit: '24/07/2026', tags: ['Χρόνια αγωγή', 'Υπέρταση'], note: 'Παίρνει τακτικά αντιυπερτασικά, να θυμίζουμε επανάληψη κάθε μήνα.' },
  { id: 2, name: 'Μαρία Ζαχαρίου', initials: 'ΜΖ', color: '#8B93F0', lastVisit: '25/07/2026', tags: ['Αλλεργία σε πενικιλίνη'], note: 'Προσοχή σε εναλλακτικά αντιβιοτικά, ενημερωμένος φάκελος.' },
  { id: 3, name: 'Αντώνης Κωστάκης', initials: 'ΑΚ', color: '#3E4FD1', lastVisit: '20/07/2026', tags: ['Άσθμα'], note: 'Χρήση Ventolin κατ’ επίκληση, τελευταία συνταγή έληξε.' },
  { id: 4, name: 'Ελένη Δημητρίου', initials: 'ΕΔ', color: '#8B93F0', lastVisit: '27/07/2026', tags: ['Ψυχοφάρμακα'], note: 'Χρειάζεται νέα ιατρική συνταγή για επόμενη χορήγηση.' },
  { id: 5, name: 'Σοφία Παππά', initials: 'ΣΠ', color: '#8B93F0', lastVisit: '18/07/2026', tags: ['Χρόνια αγωγή', 'Διαβήτης'], note: 'Ελέγχει σάκχαρο τακτικά, ζήτησε ενημέρωση για νέα ταινίες μέτρησης.' },
  { id: 6, name: 'Θάνος Οικονόμου', initials: 'ΘΟ', color: '#3E4FD1', lastVisit: '29/07/2026', tags: ['Διαβήτης', 'Ινσουλίνη'], note: 'Χρειάζεται μηνιαία δανεικά πένας ινσουλίνης μέχρι νέα παραγγελία.' },
];

// Οικονομικά — παραμένουν στατικά mock δεδομένα, θα συνδεθούν αργότερα με το άλλο dashboard.
export const financeSummary = {
  cashNow: '€1.284,50',
  monthIncome: '€18.420',
  monthExpense: '€5.310',
  netProfit: '€13.110',
};

const salesRaw = [62, 78, 55, 90, 71, 96, 48];
const salesDays = ['Δευ', 'Τρι', 'Τετ', 'Πεμ', 'Παρ', 'Σαβ', 'Κυρ'];
const maxSales = Math.max(...salesRaw);
export const salesWeek = salesRaw.map((v, i) => ({ day: salesDays[i], pct: Math.round((v / maxSales) * 100) }));

const monthsRaw = [
  { month: 'Φεβ', income: 15200, expense: 4800 },
  { month: 'Μαρ', income: 16800, expense: 5100 },
  { month: 'Απρ', income: 14500, expense: 4600 },
  { month: 'Μαι', income: 17600, expense: 5400 },
  { month: 'Ιουν', income: 16200, expense: 4900 },
  { month: 'Ιουλ', income: 18420, expense: 5310 },
];
const maxFin = Math.max(...monthsRaw.map((m) => Math.max(m.income, m.expense)));
export const financeMonths = monthsRaw.map((m) => ({
  month: m.month,
  incomePct: Math.round((m.income / maxFin) * 100),
  expensePct: Math.round((m.expense / maxFin) * 100),
}));

export const transactions = [
  { label: 'Πώληση συνταγής – Νικολάου Γ.', date: 'Σήμερα, 10:42', amountLabel: '+€38,20', kind: 'income' },
  { label: 'Παραγγελία φαρμακαποθήκης', date: 'Σήμερα, 09:15', amountLabel: '−€620,00', kind: 'expense' },
  { label: 'Πώληση παραφαρμακευτικών', date: 'Χθες, 18:03', amountLabel: '+€54,90', kind: 'income' },
  { label: 'Λογαριασμός ΔΕΗ', date: 'Χθες, 12:00', amountLabel: '−€142,30', kind: 'expense' },
  { label: 'Πώληση συνταγής – Ζαχαρίου Μ.', date: '29/07, 16:20', amountLabel: '+€22,60', kind: 'income' },
];
