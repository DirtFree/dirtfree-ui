import fs from 'fs/promises';
import path from 'path';

const serviceFile = path.resolve(process.cwd(), 'public/serviceCategory.js');
const source = await fs.readFile(serviceFile, 'utf8');

const marker = 'const SERVICES_DATA = ';
const markerIndex = source.indexOf(marker);
if (markerIndex === -1) {
  throw new Error('Could not find SERVICES_DATA declaration in public/serviceCategory.js');
}

let startIndex = source.indexOf('{', markerIndex);
if (startIndex === -1) {
  throw new Error('Could not find opening brace for SERVICES_DATA');
}

let depth = 0;
let inString = null;
let escaped = false;
let inSingleComment = false;
let inMultiComment = false;
let endIndex = -1;
let cleaned = '';

for (let i = startIndex; i < source.length; i += 1) {
  const ch = source[i];
  const next = source[i + 1];

  if (inSingleComment) {
    if (ch === '\n') {
      inSingleComment = false;
      cleaned += ch;
    }
    continue;
  }

  if (inMultiComment) {
    if (ch === '*' && next === '/') {
      inMultiComment = false;
      i += 1;
    }
    continue;
  }

  if (inString) {
    cleaned += ch;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === inString) {
      inString = null;
    }
    continue;
  }

  if (ch === '/' && next === '/') {
    inSingleComment = true;
    i += 1;
    continue;
  }

  if (ch === '/' && next === '*') {
    inMultiComment = true;
    i += 1;
    continue;
  }

  if (ch === '"' || ch === "'" || ch === '`') {
    inString = ch;
    cleaned += ch;
    continue;
  }

  if (ch === '{') {
    depth += 1;
  } else if (ch === '}') {
    depth -= 1;
    if (depth === 0) {
      cleaned += ch;
      endIndex = i;
      break;
    }
  }

  cleaned += ch;
}

if (endIndex === -1) {
  throw new Error('Could not find closing brace for SERVICES_DATA');
}

const objectText = cleaned;
let servicesData;

try {
  servicesData = (0, eval)(`(${objectText})`);
} catch (err) {
  throw new Error(`Failed to evaluate SERVICES_DATA object: ${err.message}`);
}

function quoteSql(value) {
  if (value === undefined || value === null) return 'NULL';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  return `'${String(value).replace(/'/g, "''")}'`;
}

function quoteJson(value) {
  if (value === undefined || value === null) return 'NULL';
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

const rows = [];
for (const [category, service] of Object.entries(servicesData)) {
  const title = service.title || category;
  const name = service.title || category;
  const tiers = Array.isArray(service.tiers) ? service.tiers : [];

  for (const tier of tiers) {
    rows.push({
      location: 'all',
      category,
      name,
      title,
      tier: tier.name || null,
      price: tier.price ?? null,
      duration: tier.duration ?? null,
      badge: tier.badge ?? null,
      image: tier.image ?? null,
      description: tier.description ?? null,
      details_summary: tier.detailsSummary ?? null,
      included: Array.isArray(tier.included) ? tier.included : null,
      excluded: Array.isArray(tier.excluded) ? tier.excluded : null,
      active: true,
      rating: tier.rating ?? null,
      reviews: tier.reviews ?? null
    });
  }
}

const sql = `-- Generated service insert SQL from public/serviceCategory.js\n` +
  `INSERT INTO public.services (location, category, name, title, tier, price, duration, badge, image, description, details_summary, included, excluded, active, rating, reviews) VALUES\n` +
  rows.map((row) => {
    return `  (${quoteSql(row.location)}, ${quoteSql(row.category)}, ${quoteSql(row.name)}, ${quoteSql(row.title)}, ${quoteSql(row.tier)}, ${quoteSql(row.price)}, ${quoteSql(row.duration)}, ${quoteSql(row.badge)}, ${quoteSql(row.image)}, ${quoteSql(row.description)}, ${quoteSql(row.details_summary)}, ${quoteJson(row.included)}, ${quoteJson(row.excluded)}, ${quoteSql(row.active)}, ${quoteSql(row.rating)}, ${quoteSql(row.reviews)})`;
  }).join(',\n') + ';\n';

if (process.argv.includes('--sql')) {
  process.stdout.write(sql);
  process.exit(0);
}

console.log('Generated', rows.length, 'service rows from public/serviceCategory.js');
console.log('Run with `node supabase/import-services.js --sql > supabase/services-import.sql` to generate SQL.');
