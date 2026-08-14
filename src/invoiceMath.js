// Invoice + GST maths. Shared by the storefront (checkout preview) and the
// server (invoice creation), so both always agree on the numbers.

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export function toAmount(value) {
  return Number(String(value ?? "").replace(/[^0-9.]/g, "")) || 0;
}

export function round2(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function formatAmount(value) {
  return `₹${round2(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Splits a line into taxable value + GST.
 * When prices are GST-inclusive (this store shows "Inclusive of all taxes"),
 * the taxable value is back-calculated out of the displayed price.
 */
export function splitLine({ grossAmount, gstRate, pricesIncludeGst }) {
  const rate = Number(gstRate) || 0;
  if (!rate) return { taxable: round2(grossAmount), tax: 0 };
  if (pricesIncludeGst) {
    const taxable = grossAmount / (1 + rate / 100);
    return { taxable: round2(taxable), tax: round2(grossAmount - taxable) };
  }
  return { taxable: round2(grossAmount), tax: round2((grossAmount * rate) / 100) };
}

/**
 * Builds the full tax breakup for an invoice.
 * Intra-state (seller state === place of supply) splits into CGST + SGST,
 * otherwise the whole tax lands in IGST.
 */
export function computeInvoiceTotals({
  items = [],
  gstRate = 3,
  sellerState = "",
  placeOfSupply = "",
  shipping = 0,
  pricesIncludeGst = true,
}) {
  const rate = Number(gstRate) || 0;
  const interState = Boolean(sellerState && placeOfSupply)
    && sellerState.trim().toLowerCase() !== placeOfSupply.trim().toLowerCase();

  const lines = items.map((item) => {
    const quantity = Number(item.quantity) || 1;
    const grossAmount = toAmount(item.rate ?? item.price) * quantity;
    const { taxable, tax } = splitLine({ grossAmount, gstRate: rate, pricesIncludeGst });
    return {
      sku: item.sku || item.id || "",
      name: item.name || "",
      hsn: item.hsn || "",
      quantity,
      rate: round2(taxable / quantity),
      grossAmount: round2(grossAmount),
      taxableValue: taxable,
      taxAmount: tax,
    };
  });

  const taxableValue = round2(lines.reduce((sum, line) => sum + line.taxableValue, 0));
  const taxTotal = round2(lines.reduce((sum, line) => sum + line.taxAmount, 0));
  const shippingAmount = round2(toAmount(shipping));

  const cgst = interState ? 0 : round2(taxTotal / 2);
  const sgst = interState ? 0 : round2(taxTotal - cgst);
  const igst = interState ? taxTotal : 0;

  const beforeRounding = round2(taxableValue + cgst + sgst + igst + shippingAmount);
  const total = Math.round(beforeRounding);
  const roundOff = round2(total - beforeRounding);

  return {
    lines,
    interState,
    gstRate: rate,
    taxableValue,
    cgst,
    sgst,
    igst,
    taxTotal,
    shipping: shippingAmount,
    roundOff,
    total,
  };
}
