// Wilayas (58 official + room for extension up to 69)
export const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira",
  "Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda",
  "Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla",
  "Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela",
  "Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar",
  "Ouled Djellal","Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa",
];

export type MedicineForm = "Tablet" | "Syrup" | "Injection" | "Capsule" | "Inhaler" | "Drops" | "Cream";
export type OwnerType = "pharmacy" | "producer" | "importer" | "wholesaler";

export interface StockEntry {
  ownerId: string;
  ownerName: string;
  ownerType: OwnerType;
  wilaya: string;
  commune: string;
  quantity: number;
  expiry: string;
  batch: string;
  availableForSupply: boolean;
  verified: boolean;
  trustScore: number;
  lastUpdate: string;
}

export interface Medicine {
  id: string;
  commercial: string;
  scientific: string;
  dosage: string;
  form: MedicineForm;
  category: string;
  description: string;
  safety: string;
  stocks: StockEntry[];
  alternativeIds?: string[];
}

const baseDrugs = [
  { c: "Doliprane", s: "Paracetamol", d: "500mg", f: "Tablet", cat: "Analgesic", desc: "مسكّن للألم وخافض للحرارة." },
  { c: "Efferalgan", s: "Paracetamol", d: "1g", f: "Tablet", cat: "Analgesic", desc: "مسكّن للألم وخافض للحرارة." },
  { c: "Dafalgan", s: "Paracetamol", d: "500mg", f: "Capsule", cat: "Analgesic", desc: "Paracetamol-based analgesic." },
  { c: "Augmentin", s: "Amoxicillin + Clavulanic acid", d: "1g", f: "Tablet", cat: "Antibiotic", desc: "مضاد حيوي واسع الطيف." },
  { c: "Clamoxyl", s: "Amoxicillin", d: "500mg", f: "Capsule", cat: "Antibiotic", desc: "Beta-lactam antibiotic." },
  { c: "Advil", s: "Ibuprofen", d: "400mg", f: "Tablet", cat: "NSAID", desc: "مضاد التهاب غير ستيرويدي." },
  { c: "Nurofen", s: "Ibuprofen", d: "200mg", f: "Tablet", cat: "NSAID", desc: "Anti-inflammatory analgesic." },
  { c: "Ventolin", s: "Salbutamol", d: "100mcg", f: "Inhaler", cat: "Bronchodilator", desc: "موسّع للقصبات." },
  { c: "Mopral", s: "Omeprazole", d: "20mg", f: "Capsule", cat: "PPI", desc: "Proton pump inhibitor." },
  { c: "Glucophage", s: "Metformin", d: "850mg", f: "Tablet", cat: "Antidiabetic", desc: "علاج السكري من النوع الثاني." },
  { c: "Aspégic", s: "Acetylsalicylic acid", d: "100mg", f: "Tablet", cat: "Antiplatelet", desc: "Antiplatelet & analgesic." },
  { c: "Zithromax", s: "Azithromycin", d: "500mg", f: "Tablet", cat: "Antibiotic", desc: "Macrolide antibiotic." },
  { c: "Suprax", s: "Cefixime", d: "200mg", f: "Tablet", cat: "Antibiotic", desc: "Cephalosporin antibiotic." },
  { c: "Zyrtec", s: "Cetirizine", d: "10mg", f: "Tablet", cat: "Antihistamine", desc: "مضاد للحساسية." },
  { c: "Clarityne", s: "Loratadine", d: "10mg", f: "Tablet", cat: "Antihistamine", desc: "Non-drowsy antihistamine." },
  { c: "Lantus", s: "Insulin glargine", d: "100UI/ml", f: "Injection", cat: "Antidiabetic", desc: "Long-acting insulin." },
  { c: "Amlor", s: "Amlodipine", d: "5mg", f: "Tablet", cat: "Antihypertensive", desc: "Calcium channel blocker." },
  { c: "Tahor", s: "Atorvastatin", d: "20mg", f: "Tablet", cat: "Statin", desc: "Cholesterol-lowering." },
  { c: "Inipomp", s: "Pantoprazole", d: "40mg", f: "Tablet", cat: "PPI", desc: "Acid suppression." },
  { c: "Spasfon", s: "Phloroglucinol", d: "80mg", f: "Tablet", cat: "Antispasmodic", desc: "Smooth muscle relaxant." },
  { c: "Smecta", s: "Diosmectite", d: "3g", f: "Drops", cat: "Antidiarrheal", desc: "Intestinal adsorbent." },
  { c: "Levothyrox", s: "Levothyroxine", d: "100mcg", f: "Tablet", cat: "Hormone", desc: "Thyroid hormone." },
  { c: "Coversyl", s: "Perindopril", d: "5mg", f: "Tablet", cat: "Antihypertensive", desc: "ACE inhibitor." },
  { c: "Diamicron", s: "Gliclazide", d: "60mg", f: "Tablet", cat: "Antidiabetic", desc: "Sulfonylurea." },
  { c: "Plavix", s: "Clopidogrel", d: "75mg", f: "Tablet", cat: "Antiplatelet", desc: "Platelet inhibitor." },
] as const;

const ownerSeed: { type: OwnerType; names: string[] }[] = [
  { type: "pharmacy", names: ["Pharmacie El Shifa","Pharmacie Centrale","Pharmacie Ibn Sina","Pharmacie El Hayat","Pharmacie El Amal","Pharmacie El Nour"] },
  { type: "producer", names: ["Saidal","Biopharm","Hikma Pharma","LAD Pharma"] },
  { type: "importer", names: ["Imex Pharma","SARL Algéro-Médic","Pharma Import DZ"] },
  { type: "wholesaler", names: ["Sopharm","Grossiste El Baraka","Distri-Med","SARL Pharma Distribution"] },
];

function rand(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildStocks(idx: number): StockEntry[] {
  const stocks: StockEntry[] = [];
  // Deterministic spread across some wilayas
  const targetCount = 8 + Math.floor(rand(idx * 7) * 10);
  for (let i = 0; i < targetCount; i++) {
    const w = WILAYAS[Math.floor(rand(idx * 13 + i) * WILAYAS.length)];
    const ownerGroup = ownerSeed[Math.floor(rand(idx * 17 + i * 3) * ownerSeed.length)];
    const ownerName = ownerGroup.names[Math.floor(rand(idx * 19 + i * 5) * ownerGroup.names.length)];
    const qty = Math.floor(rand(idx * 23 + i * 7) * 1200);
    stocks.push({
      ownerId: `${ownerGroup.type}-${idx}-${i}`,
      ownerName: `${ownerName} - ${w}`,
      ownerType: ownerGroup.type,
      wilaya: w,
      commune: `Commune ${(i % 10) + 1}`,
      quantity: qty,
      expiry: `2026-${String(((i % 12) + 1)).padStart(2, "0")}-15`,
      batch: `LOT-${idx}${i}-${Math.floor(rand(idx + i) * 9999)}`,
      availableForSupply: qty > 50 && i % 3 !== 0,
      verified: i % 4 !== 0,
      trustScore: 60 + Math.floor(rand(idx + i * 2) * 40),
      lastUpdate: `2026-06-${String((i % 28) + 1).padStart(2, "0")}`,
    });
  }
  // Ensure Sétif=0 and Oran high for Paracetamol-family (mirrors the spec)
  if (baseDrugs[idx]?.s === "Paracetamol") {
    return [
      ...stocks.filter(s => s.wilaya !== "Sétif" && s.wilaya !== "Oran" && s.wilaya !== "Alger"),
      { ownerId: `pharm-x-${idx}`, ownerName: "Pharmacie El Shifa - Oran", ownerType: "pharmacy", wilaya: "Oran", commune: "Sidi El Houari", quantity: 500, expiry: "2026-08-15", batch: `LOT-OR-${idx}-500`, availableForSupply: true, verified: true, trustScore: 92, lastUpdate: "2026-06-02" },
      { ownerId: `prod-x-${idx}`, ownerName: "Saidal - Oran", ownerType: "producer", wilaya: "Oran", commune: "Es Senia", quantity: 300, expiry: "2027-01-10", batch: `LOT-SD-${idx}-300`, availableForSupply: true, verified: true, trustScore: 98, lastUpdate: "2026-06-01" },
      { ownerId: `whole-x-${idx}`, ownerName: "Sopharm - Oran", ownerType: "wholesaler", wilaya: "Oran", commune: "Bir El Djir", quantity: 200, expiry: "2026-12-20", batch: `LOT-SP-${idx}-200`, availableForSupply: true, verified: true, trustScore: 88, lastUpdate: "2026-06-03" },
      { ownerId: `pharm-y-${idx}`, ownerName: "Pharmacie Centrale - Alger", ownerType: "pharmacy", wilaya: "Alger", commune: "Bab El Oued", quantity: 260, expiry: "2026-10-12", batch: `LOT-AL-${idx}-260`, availableForSupply: true, verified: true, trustScore: 90, lastUpdate: "2026-06-02" },
      { ownerId: `imp-y-${idx}`, ownerName: "Imex Pharma - Alger", ownerType: "importer", wilaya: "Alger", commune: "Hydra", quantity: 160, expiry: "2026-11-30", batch: `LOT-IM-${idx}-160`, availableForSupply: true, verified: true, trustScore: 86, lastUpdate: "2026-06-01" },
    ];
  }
  return stocks;
}

export const MEDICINES: Medicine[] = baseDrugs.map((d, idx) => ({
  id: `med-${idx}`,
  commercial: d.c,
  scientific: d.s,
  dosage: d.d,
  form: d.f as MedicineForm,
  category: d.cat,
  description: d.desc,
  safety: "Read the leaflet carefully. Consult a healthcare professional in case of doubt.",
  stocks: buildStocks(idx),
}));

// Wire alternatives by shared scientific name
MEDICINES.forEach((m) => {
  m.alternativeIds = MEDICINES.filter(o => o.id !== m.id && o.scientific.split(" ")[0] === m.scientific.split(" ")[0]).map(o => o.id);
});

export function searchMedicines(q: string): Medicine[] {
  const query = q.trim().toLowerCase();
  if (!query) return MEDICINES;
  return MEDICINES.filter(m =>
    m.commercial.toLowerCase().includes(query) ||
    m.scientific.toLowerCase().includes(query) ||
    m.category.toLowerCase().includes(query) ||
    m.dosage.toLowerCase().includes(query) ||
    m.form.toLowerCase().includes(query)
  );
}

export function aggregateByWilaya(med: Medicine) {
  const map = new Map<string, { total: number; pharmacy: number; producer: number; importer: number; wholesaler: number }>();
  WILAYAS.forEach(w => map.set(w, { total: 0, pharmacy: 0, producer: 0, importer: 0, wholesaler: 0 }));
  med.stocks.forEach(s => {
    const e = map.get(s.wilaya)!;
    e.total += s.quantity;
    e[s.ownerType] += s.quantity;
  });
  return map;
}

// ---- Mock supply requests ----
export type SupplyStatus = "sent" | "review" | "contacted" | "waiting" | "accepted" | "arranging" | "done" | "rejected";

export interface SupplyRequest {
  id: string;
  medicineId: string;
  medicineName: string;
  requesterName: string;
  requesterRole: string;
  fromWilaya: string;
  toWilaya: string;
  quantity: number;
  status: SupplyStatus;
  createdAt: string;
  supplierName?: string;
}

export const MOCK_REQUESTS: SupplyRequest[] = [
  { id: "req-001", medicineId: "med-0", medicineName: "Doliprane 500mg", requesterName: "Pharmacie El Hayat", requesterRole: "pharmacy", fromWilaya: "Oran", toWilaya: "Sétif", quantity: 500, status: "contacted", createdAt: "2026-06-01", supplierName: "Saidal - Oran" },
  { id: "req-002", medicineId: "med-3", medicineName: "Augmentin 1g", requesterName: "Pharmacie Ibn Sina", requesterRole: "pharmacy", fromWilaya: "Alger", toWilaya: "Tizi Ouzou", quantity: 200, status: "accepted", createdAt: "2026-05-28", supplierName: "Sopharm - Alger" },
  { id: "req-003", medicineId: "med-7", medicineName: "Ventolin 100mcg", requesterName: "Pharmacie El Nour", requesterRole: "pharmacy", fromWilaya: "Constantine", toWilaya: "Batna", quantity: 80, status: "done", createdAt: "2026-05-20", supplierName: "Biopharm - Constantine" },
  { id: "req-004", medicineId: "med-9", medicineName: "Glucophage 850mg", requesterName: "Grossiste El Baraka", requesterRole: "wholesaler", fromWilaya: "Blida", toWilaya: "Médéa", quantity: 1200, status: "review", createdAt: "2026-06-03" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", title: "تم تفعيل اشتراكك Silver", body: "تم تأكيد الدفع وتفعيل خطة Silver.", time: "اليوم 09:12", read: false },
  { id: "n2", title: "طلب التزويد #req-001 تم التواصل مع المورد", body: "إدارة MediSave تواصلت مع Saidal - Oran.", time: "أمس 17:40", read: false },
  { id: "n3", title: "Doliprane 500mg متوفر في Alger", body: "كمية جديدة أضيفت بواسطة Pharmacie Centrale.", time: "أمس 11:00", read: true },
];
