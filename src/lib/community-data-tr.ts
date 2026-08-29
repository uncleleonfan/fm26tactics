// === Turkish (tr) content for the Meta page — L1 pilot depth (§2b) ===
// Analytical texts are translated; in-game terms (role names, instructions)
// stay in English, matching how the Turkish FM community refers to them.
// Shape-compatible with community-data.ts exports (types imported from there
// where exported; structural types repeated for the un-exported ones).

import type { FormationInsight, MetaRole, RoleCombo } from "./community-data";

export interface DualFormationTipTr {
  style: string;
  inPossession: string;
  outOfPossession: string;
  tip: string;
}

export interface CommonMistakeTr {
  mistake: string;
  fix: string;
}

export interface CommunityConsensusTr {
  engineRewards: string[];
  enginePunishes: string[];
  topCreators: string[];
  keySources: string[];
}

// === Formation Insights (TR) ===
export const formationInsightsTr: FormationInsight[] = [
  { formation: "3-4-3 / 3-4-2-1 / 3-3-3-1", avgPts: 78.3, avgGD: 39, appearances: 3, verdict: "Yeni meta kralı — Atonement (81,1 PTS) üçlü defans devriminin öncülüğünü yapıyor. Elit hücum ve savunma tek bir dizilişte.", tier: "S" },
  { formation: "4-2-4", avgPts: 77.0, avgGD: 37, appearances: 3, verdict: "En agresif meta dizilişi. 2 forvet + 2 kanat oyuncusuyla 90+ gol potansiyeli ve ilk 10'da hâlâ üç taktik.", tier: "S" },
  { formation: "4-5-1 / 4-1-4-1", avgPts: 78.3, avgGD: 40, appearances: 2, verdict: "En sağlam defansif yapı. CBP87'nin Granny Poison serisi bu şekli domine ediyor — az gol yiyor, her kulüp seviyesinde tutarlı.", tier: "S" },
  { formation: "5-1-2-2", avgPts: 77.8, avgGD: 40, appearances: 1, verdict: "Sürpriz meta adayı. Doğru kurulumla beşli defans sistemleri de elit seviyede olabilir.", tier: "A" },
  { formation: "4-2-3-1", avgPts: 75.9, avgGD: 36, appearances: 1, verdict: "Klasik diziliş hâlâ güçlü. Geçiş yapan oyuncular için en tanıdık kurulum (HIGHWAY STAR ile 75,9 PTS'de berabere).", tier: "A" },
];

// === Meta Player Roles (TR) — in-game terms kept in English ===
export const metaRolesTr: MetaRole[] = [
  {
    name: "Advanced Wing-Back (AWB)",
    category: "in-possession",
    opLevel: "S+",
    overview: "Son derece hücumcu kanat rolü. Topla birlikte kanat oyuncusu gibi pozisyon alır — fiilen 5. veya 6. hücumcunuz olur. Dani Alves, Nuno Mendes düşünün. Maç Motoru 26.1'de test edilip doğrulandı.",
    whyOp: [
      "Son üçüncü bölgede otomatik olarak 2-3-5 veya 3-2-5 yoğunlaşma yapıları oluşturur",
      "Ters kanat oyuncularıyla (IW/IF) iç-dış uyumsuzluğu yaratır",
      "Orta saha çizgisine yakın kurulum pozisyonu ekstra bir orta saha gibi davranıp 2v1 yaratır",
      "Çoğu zaman takımın en çok ileri pas yapan oyuncusu olur",
    ],
    weakness: "Arkasında kocaman bir alan boş kalıyor. Kontralarda defans pozisyonu tamamen terk edilmiş oluyor. Mutlaka bir DM kapatmalı ya da yarı alanı kapatmak için üçlü defans kullanmalısınız.",
    keyInstructions: ["Stay Wider — temas çizgisini tutarak her zaman pas seçeneği olun", "Cross from Byline — motorun orta bias'ını sömürün", "Takım talimatı: Focus play down their flank + Overlap"],
    keyAttributes: ["Crossing", "Stamina", "Off the Ball", "Acceleration", "Pace", "Technique", "Decisions"],
    bestPartners: ["Inverted Winger (IW)", "Inside Forward (IF)", "Defensive Midfielder (DM)", "Stopper Centre-Back (SCB)"],
  },
  {
    name: "Channel Midfielder (CHM)",
    category: "in-possession",
    opLevel: "S",
    overview: "Yarı alan orta sahası. Bek ile stoper arasına dikey koşular yaparak rakip savunma hattındaki dikişleri hedef alır.",
    whyOp: [
      "Her savunma şeklinin en zayıf bölgesini — 'yarı alanı' — özel olarak hedefler",
      "Genişte kalan bir Winger (W) ile birleşip yıkıcı çapraz ara paslar üretir",
      "Rakip savunıcılar adam eşleşmelerini kaybeder — kimin kimi takip edeceği belirsizleşir",
      "Bol miktarda geri kesme (cut-back) ve ceza sahası önü şut fırsatı yaratır",
    ],
    weakness: "Hassas servis gerektirir. Orta saha pas kalitesi düşükse CHM koşuları boşa gider. Fiziksel talebi yüksektir.",
    keyInstructions: ["Get Further Forward", "Move Into Channels", "Roam From Position"],
    keyAttributes: ["Off the Ball", "Decisions", "Anticipation", "Stamina", "Finishing", "First Touch", "Passing"],
    bestPartners: ["Winger (W)", "Deep-Lying Playmaker (DLP)", "False Nine (F9)"],
  },
  {
    name: "Overlapping Centre-Back (OCB)",
    category: "in-possession",
    opLevel: "S",
    overview: "Topla birlikte kanat alanlarına bindirip defans hattından bir bek gibi hücum eden stoper.",
    whyOp: [
      "Sahanın en beklenmedik pozisyonundan hücum tehdidi yaratır",
      "Rakip kanat oyuncuları nadiren geri koşar — bedava orta fırsatları",
      "Üçlü defans sistemleri içinde asimetrik hücum yapıları oluşturur",
      "Rakibin savunma planını tamamen etkisizleştirir — varsayılan bir adam eşleştirmesi yoktur",
    ],
    weakness: "Arkada kalan boşlukları DM veya komşu CB kapatmalı. Yavaş OCB'ler geri dönemiyor. Yalnızca üçlü defans sistemlerinde uygulanabilir.",
    keyInstructions: ["Stay Wider", "Run Wide With Ball", "Cross More Often"],
    keyAttributes: ["Crossing", "Pace", "Stamina", "Dribbling", "Tackling", "Positioning"],
    bestPartners: ["Defensive Drop Midfielder (DDM)", "Cover Centre-Back (CCB)", "Inverted Wing-Back (IWB)"],
  },
];

// === Role Synergy Best Combos (TR) ===
export const bestRoleCombosTr: RoleCombo[] = [
  { combo: "ACB + IFB", phase: "possession", description: "İleri CB + Ters Bek", effect: "ACB DM bölgesine girip orta saha üstünlüğü kurar, IFB içeri kapanıp üçlü defans oluşturur" },
  { combo: "HB + IWB", phase: "possession", description: "Half-Back + Ters Kanat Beki", effect: "Yüksek presi kolayca aşan 3-2 dinlenme savunması (rest defence) yapısı kurar" },
  { combo: "BBM + IWB", phase: "possession", description: "Box-to-Box Orta Saha + Ters Kanat Beki", effect: "BBM gol için ileri koşar, IWB içeri kapanıp kapatır — kusursuz rotasyon" },
  { combo: "IWB + W", phase: "possession", description: "Ters Kanat Beki + Kanat Oyuncusu", effect: "IWB ters yönüne kaçıp orta sahayı çeker, Winger 1v1 izolasyonu için genişte kalır" },
  { combo: "WB + IF/IW", phase: "possession", description: "Kanal Beki + İç Forvet / Ters Kanat", effect: "IF içeri kesip beki peşinden sürükler, WB üstünden orta için bindirir — klasik overlap" },
  { combo: "DLP + DM", phase: "possession", description: "Derin Playmaker + Defansif Orta Saha", effect: "Kusursuz denge. DLP yaratmak için serbest kalır, DM koruyucu kalkan sağlar" },
  { combo: "DLF + IF", phase: "possession", description: "Derin Forvet + İç Forvet", effect: "DLF derine inip bir stoperi dışarı çeker, IF açılan boşluğa dalar" },
  { combo: "DLF + SS", phase: "possession", description: "Derin Forvet + Gölge Forvet", effect: "Asimetrik hareket işaretlemeyi zorlaştırır — biri iner, diğeri dikey rotasyonla boşluğa patlar" },
  { combo: "F9 + P", phase: "possession", description: "False Nine + Avcı (Poacher)", effect: "Yaratıcı-bitenici ayrımı tüm savunma hattını dikey olarak gerer" },
  { combo: "AP + P", phase: "possession", description: "İleri Playmaker + Avcı (Poacher)", effect: "Klasik pas veren-koşan ikilisi — her boşluk kaleciyle 1'e 1 olur" },
  { combo: "DDM + PFB", phase: "defense", description: "Defansif Drop Orta Saha + Presçi Bek", effect: "DDM düşüp üçlü defans kurar, PFB yüksek agresif pres yapmakta serbest kalır" },
  { combo: "SCB + CCB", phase: "defense", description: "Stopper CB + Cover CB", effect: "Katmanlı savunma — SCB oyunu kesmek için çıkar, CCB arkadan süpürür" },
];

// === Community Consensus (TR) ===
export const communityConsensusTr: CommunityConsensusTr = {
  engineRewards: [
    "Yüksek pres + Counter-press en güçlü talimat kombosu (topluluk uzlaşısı)",
    "Hız / İvme / Dayanıklılık FM26 maç motorunda ağır şekilde ağırlıklandırılıyor",
    "4-2-4 dizilişi topluluk testlerinde en uç sonuçları üretiyor (sezon başına 90+ gol)",
    "Ters Kanatlar (IW/IF) + bindiren bekler kanat yoğunlaşması yaratıyor — meta cevabı",
    "Yakın direk korner rutinleri son derece etkili (sezon başına 10-15 gol getirisi)",
    "Üçlü orta sahalar neredeyse tüm testlerde ikili orta sahaları geçiyor",
  ],
  enginePunishes: [
    "Yavaş savunıcılar + Yüksek defans hattı = arkaya atılan ölümcül uzun toplar",
    "Delici olmayan saf topa sahip olma son derece verimsiz",
    "İkili orta sahalar üçlü orta sahalar tarafından eziliyor (klasik 4-4-2 sorunu)",
    "Çok Hücumcu mentalite arkada kocaman boşluklar bırakıyor",
    "Desteği olmayan yalnız forvetler sıfır üretim yapıyor",
  ],
  topCreators: ["ZaZ", "CBP87", "A Smile", "wjechal123", "Feiwuxiaomei", "Gerrard"],
  keySources: [
    "FM-Arena (fm-arena.com) — En yetkin taktik test verisi",
    "FM Scout (fmscout.com) — En büyük taktik indirme kütüphanesi",
    "Sortitoutsi — Plug-and-play taktik paylaşım topluluğu",
    "Passion4FM — Derinlemesine rol ve taktik analizi",
    "FM Blog — Taktik incelemeleri ve eğitimler",
    "Josh Daly — Meta taktik videoları ve indirmeleri",
  ],
};

// === Dual Formation System (TR) ===
export const dualFormationTipsTr: DualFormationTipTr[] = [
  {
    style: "Gegenpress / Yüksek Pres",
    inPossession: "4-2-3-1 veya 4-3-3",
    outOfPossession: "4-4-2 Kompakt Blok",
    tip: "Topla birlikte oyunu 10 numara üzerinden kurun. Topsuzken kanat oyuncuları içeri kapanıp kompakt bir 4-4-2 savunma bloğu oluşturur",
  },
  {
    style: "Kontrollü Topa Sahip Olma",
    inPossession: "4-3-3 (Hücum Yayılımı)",
    outOfPossession: "5-2-3 (Defansif Kompaktlık)",
    tip: "Topla birlikte kanat bekler genişliği açmak için yükselir. Topsuzken geri düşerek beşli defans oluştururlar",
  },
  {
    style: "Kontra Atak",
    inPossession: "3-4-3 (Hızlı Çıkış)",
    outOfPossession: "5-4-1 (Derin Blok)",
    tip: "Topla birlikte her iki kanat beki de ileri uçar. Topsuzken beşli defansa + çift pivot kalkanına geri dönerler",
  },
];

// === Common Mistakes (TR) ===
export const commonMistakesTr: CommonMistakeTr[] = [
  { mistake: "Tüm talimatları 'Dengeli'de bırakmak", fix: "Takımınızın taktik kimliği yok. Önce bir temel felsefe belirleyin, sonra eşleşen talimatları seçin." },
  { mistake: "Oyuncu özelliklerini kontrol etmeden taktik kopyalamak", fix: "Önce temel özellikleri kontrol edin. Yüksek pres taktikleri takım genelinde 13-15+ Dayanıklılık gerektirir." },
  { mistake: "Yüksek pres + Derin defans hattını birlikte kullanmak", fix: "Yüksek pres yüksek hatla, derin hat düşük blokla eşleşmeli. Aksi halde orta sahada kocaman boşluklar oluşur." },
  { mistake: "Yüksek pres sisteminde yavaş savunıcı oynatmak", fix: "Savunıcıların Hızı 12+ olmalı. Aksi halde hızlı forvetler tarafından parçalanmak kaçınılmazdır." },
  { mistake: "Bir yenilgiden sonra her şeyi çöpe atmak", fix: "Bir seferde 1-2 talimat değiştirin. Bir taktiğe yerleşmesi için 5-10 maç verin." },
  { mistake: "Dayanıklılık yönetimini ihmal etmek", fix: "Yüksek yoğunluklu taktikler maç başına 3-4 oyuncu rotasyonu gerektirir. 60. dakikadan sonra oyuncu değiştirmemek = garantili çöküş." },
];
