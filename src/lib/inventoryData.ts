import { faker } from '@faker-js/faker';

faker.seed(42);

export const CATEGORIES = [
  'Electronics',
  'Apparel',
  'Furniture',
  'Food & Beverage',
  'Sports',
  'Home & Garden',
  'Automotive',
  'Health & Beauty',
  'Office Supplies',
  'Toys & Games',
] as const;

export type Category = typeof CATEGORIES[number];

const CATEGORY_CONFIG = [
  { name: 'Electronics',     intentWeight: 0.20, priceMin: 50,  priceMax: 1800 },
  { name: 'Apparel',         intentWeight: 0.18, priceMin: 10,  priceMax: 300  },
  { name: 'Furniture',       intentWeight: 0.08, priceMin: 80,  priceMax: 2000 },
  { name: 'Food & Beverage', intentWeight: 0.22, priceMin: 2,   priceMax: 80   },
  { name: 'Sports',          intentWeight: 0.10, priceMin: 15,  priceMax: 500  },
  { name: 'Home & Garden',   intentWeight: 0.09, priceMin: 20,  priceMax: 600  },
  { name: 'Automotive',      intentWeight: 0.05, priceMin: 30,  priceMax: 1200 },
  { name: 'Health & Beauty', intentWeight: 0.08, priceMin: 5,   priceMax: 150  },
  { name: 'Office Supplies', intentWeight: 0.05, priceMin: 5,   priceMax: 100  },
  { name: 'Toys & Games',    intentWeight: 0.05, priceMin: 10,  priceMax: 200  },
];

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  supplier: string;
  lastRestocked: string;
};

function generateStockQuantity(): number {
  const roll = faker.number.float({ min: 0, max: 1 });
  if (roll < 0.005) return 0;
  if (roll < 0.12) return faker.number.int({ min: 1, max: 5 });
  if (roll < 0.22) return faker.number.int({ min: 6, max: 20 });
  if (roll < 0.45) return faker.number.int({ min: 21, max: 80 });
  if (roll < 0.75) return faker.number.int({ min: 81, max: 250 });
  return faker.number.int({ min: 251, max: 500 });
}

function pickCategory(): typeof CATEGORY_CONFIG[0] {
  const r = faker.number.float({ min: 0, max: 1 });
  let cumulative = 0;
  for (const cat of CATEGORY_CONFIG) {
    cumulative += cat.intentWeight;
    if (r <= cumulative) return cat;
  }
  return CATEGORY_CONFIG[0];
}

const SUPPLIERS = [
  "GlobalTrade Co.",
  "MidWest Supply",
  "FastShip LLC",
  "PrimeSource",
  "ValueDist Inc.",
  "DirectLink",
  "BulkBuy Partners",
];

let _cache: InventoryItem[] | null = null;

export function getInventoryData(count: number = 50000): InventoryItem[] {
  if (_cache) return _cache;

  _cache = Array.from({ length: count }, () => {
    const cat = pickCategory();
    const price = parseFloat(
      faker.number.float({ min: cat.priceMin, max: cat.priceMax, fractionDigits: 2 }).toFixed(2)
    );
    const stock = generateStockQuantity();

    return {
      id:           faker.string.uuid(),
      name:         faker.commerce.productName(),
      sku:          `${cat.name.slice(0, 3).toUpperCase()}-${faker.string.alphanumeric(4).toUpperCase()}`,
      category:     cat.name,
      price,
      stock,
      reorderPoint: faker.number.int({ min: 10, max: 60 }),
      supplier:     SUPPLIERS[faker.number.int({ min: 0, max: SUPPLIERS.length - 1 })],
      lastRestocked: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
    };
  });

  return _cache;
}
