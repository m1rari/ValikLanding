export type PriceItem = {
  category: string;
  service: string;
  unit: string;
  price: number | null;
  note: string;
  updatedAt: string;
};

type PriceFeed = {
  items: PriceItem[];
  warnings: string[];
  sourceUrl: string;
};

const REVALIDATE_SECONDS = 1800;

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result.map((value) => value.trim());
}

function googleSerialToDate(serial: number): Date {
  const ms = Date.UTC(1899, 11, 30) + Math.round(serial * 86400000);
  return new Date(ms);
}

function normalizePrice(rawPrice: string, warnings: string[], rowNumber: number): number | null {
  if (!rawPrice) {
    return null;
  }

  const normalized = rawPrice.replace(/\s+/g, "").replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    warnings.push(`Row ${rowNumber}: invalid price "${rawPrice}"`);
    return null;
  }

  // Google Sheets may auto-convert values like 4.4 into dates.
  // In CSV this appears as serial numbers (e.g. 46116), restore day.month.
  if (parsed >= 1000) {
    const restoredDate = googleSerialToDate(parsed);
    const day = restoredDate.getUTCDate();
    const month = restoredDate.getUTCMonth() + 1;
    return Number.parseFloat(`${day}.${month}`);
  }

  return parsed;
}

function parsePricesCsv(csvContent: string): PriceFeed {
  const warnings: string[] = [];
  const rows = csvContent
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length === 0) {
    return { items: [], warnings: ["CSV feed is empty"], sourceUrl: "" };
  }

  const [headerLine, ...dataLines] = rows;
  const headers = splitCsvLine(headerLine).map((header) => header.toLowerCase());

  const requiredHeaders = ["category", "service", "unit", "price", "note", "updatedat"];
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    warnings.push(`Missing required columns: ${missingHeaders.join(", ")}`);
  }

  const getHeaderIndex = (name: string) => headers.indexOf(name);
  const indexCategory = getHeaderIndex("category");
  const indexService = getHeaderIndex("service");
  const indexUnit = getHeaderIndex("unit");
  const indexPrice = getHeaderIndex("price");
  const indexNote = getHeaderIndex("note");
  const indexUpdatedAt = getHeaderIndex("updatedat");

  const items: PriceItem[] = dataLines
    .map((line, idx) => {
      const rowNumber = idx + 2;
      const cols = splitCsvLine(line);

      const category = indexCategory >= 0 ? (cols[indexCategory] ?? "").trim() : "";
      const service = indexService >= 0 ? (cols[indexService] ?? "").trim() : "";
      const unit = indexUnit >= 0 ? (cols[indexUnit] ?? "").trim() : "";
      const rawPrice = indexPrice >= 0 ? (cols[indexPrice] ?? "").trim() : "";
      const note = indexNote >= 0 ? (cols[indexNote] ?? "").trim() : "";
      const updatedAt = indexUpdatedAt >= 0 ? (cols[indexUpdatedAt] ?? "").trim() : "";

      if (!category || !service || !unit) {
        warnings.push(`Row ${rowNumber}: skipped due to missing required fields`);
        return null;
      }

      return {
        category,
        service,
        unit,
        price: normalizePrice(rawPrice, warnings, rowNumber),
        note,
        updatedAt,
      } satisfies PriceItem;
    })
    .filter((item): item is PriceItem => item !== null);

  return { items, warnings, sourceUrl: "" };
}

export async function getPricesFromSheet(): Promise<PriceFeed> {
  const sourceUrl = process.env.GOOGLE_SHEET_PRICES_URL;

  if (!sourceUrl) {
    return {
      items: [],
      warnings: ["Environment variable GOOGLE_SHEET_PRICES_URL is missing"],
      sourceUrl: "",
    };
  }

  try {
    const response = await fetch(sourceUrl, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "text/csv,text/plain;q=0.9,*/*;q=0.8" },
    });

    if (!response.ok) {
      return {
        items: [],
        warnings: [`Failed to fetch price feed: ${response.status} ${response.statusText}`],
        sourceUrl,
      };
    }

    const csvText = await response.text();
    const parsed = parsePricesCsv(csvText);
    return { ...parsed, sourceUrl };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fetch error";
    return {
      items: [],
      warnings: [`Failed to read Google Sheet CSV: ${message}`],
      sourceUrl,
    };
  }
}
