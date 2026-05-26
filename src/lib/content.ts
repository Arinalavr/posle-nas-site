import exhibitionData from "../../data/exhibition.json";
import itemsData from "../../data/items.json";
import quotesData from "../../data/quotes.json";

export type ExhibitionEntry = {
  type: "quote" | "item";
  id: string;
};

export type Item = {
  id: string;
  informant_id: string;
  slug: string;
  title: string;
  photo: string;
  photo_alt: string;
  story: string;
  order: number;
  featured: boolean;
};

export type Quote = {
  id: string;
  informant_id: string;
  text: string;
  arc: "early_emigration" | "things" | "feelings" | "loss_of_friends";
  order: number;
};

export const exhibition = exhibitionData as ExhibitionEntry[];
export const items = itemsData as Item[];
export const quotes = quotesData as Quote[];

export const intro = [
  "После нас остаются не только чемоданы, пустые квартиры и переписки, которые всё реже продолжаются. Остаются сковородки, растения, игрушки, книги, маски, термосы, кошки и другие вещи, случайно перешедшие из одной жизни в другую. Через них видно, как люди в эмиграции пытаются не только уехать, но и снова обжиться: поставить цветок на балкон, найти друзей, купить что-то тяжёлое, что не поместится в чемодан.",
  "Эта выставка — о предметах, которые пережили расставания и стали маленькими следами чужого присутствия. О том, как временное место постепенно становится домом. И о том, что даже после отъезда что-то тёплое всё равно остаётся.",
];

export const itemDimensions: Record<string, { width: number; height: number }> = {
  item_R01_koshka: { width: 1237, height: 2200 },
  item_R02_ganteli: { width: 2200, height: 1650 },
  item_R02_sintezator: { width: 2200, height: 1650 },
  item_R04_svinki: { width: 2200, height: 1650 },
  item_R04_mishki: { width: 2200, height: 1650 },
  item_R05_skovorodka: { width: 2200, height: 991 },
  item_R06_oliva_tree: { width: 2200, height: 1650 },
  item_R06_tsvety: { width: 2200, height: 1650 },
  item_R07_termos: { width: 2200, height: 1650 },
  item_R07_raketka: { width: 1650, height: 2200 },
  item_R08_tsvetok: { width: 1650, height: 2200 },
  item_R09_panelka: { width: 2200, height: 1650 },
  item_R09_kartina: { width: 2200, height: 1650 },
  item_R11_koltsa: { width: 2200, height: 1827 },
  item_R13_zhilet: { width: 1650, height: 2200 },
  item_R13_igli: { width: 1650, height: 2200 },
  item_R14_kamni: { width: 2200, height: 1650 },
  item_R15_kogtetochka: { width: 1431, height: 2200 },
  item_R17_maska: { width: 1650, height: 2200 },
};

export const arcLabels: Record<Quote["arc"], string> = {
  early_emigration: "временность",
  things: "вещи",
  feelings: "ощущения",
  loss_of_friends: "расставания",
};

export function getPhotoSizeClass(itemId: string) {
  const dimensions = itemDimensions[itemId] ?? { width: 4, height: 3 };
  const ratio = dimensions.width / dimensions.height;

  if (ratio < 0.65) return "max-w-[190px]";
  if (ratio < 0.9) return "max-w-[220px]";
  if (ratio > 1.8) return "max-w-[340px]";
  return "max-w-[310px]";
}

export function getCardPhotoSizeClass(itemId: string) {
  const dimensions = itemDimensions[itemId] ?? { width: 4, height: 3 };
  const ratio = dimensions.width / dimensions.height;

  if (ratio < 0.65) return "max-w-[300px]";
  if (ratio < 0.9) return "max-w-[360px]";
  if (ratio > 1.8) return "max-w-[540px]";
  return "max-w-[460px]";
}
