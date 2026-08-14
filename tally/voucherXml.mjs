// Builds a TallyPrime "Import Data" envelope for a Sales voucher.
//
// This is the classic Tally XML schema, which both on-premise TallyPrime
// (gateway on port 9000) and Tally-on-cloud endpoints accept. If your cloud
// provider expects a different payload shape, this is the ONLY file that needs
// to change - tally/client.mjs just transports whatever this returns.
//
// Accounting-only entries are used (no ALLINVENTORYENTRIES), so the voucher
// imports without needing every SKU to exist as a Stock Item in Tally first.
// Ledger names come from settings and must already exist in the company.

export const DEFAULT_TALLY_CONFIG = {
  enabled: false,
  endpoint: "",
  authHeader: "",
  authToken: "",
  companyName: "",
  voucherType: "Sales",
  salesLedger: "Sales",
  cgstLedger: "Output CGST",
  sgstLedger: "Output SGST",
  igstLedger: "Output IGST",
  roundOffLedger: "Round Off",
  shippingLedger: "Freight & Delivery",
  sellerState: "",
  hsnCode: "7113",
  pricesIncludeGst: true,
  autoSyncOnPaid: true,
  maxAttempts: 5,
};

export function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Tally wants dates as YYYYMMDD.
export function tallyDate(dateISO) {
  const date = dateISO ? new Date(`${dateISO}T00:00:00`) : new Date();
  const safe = Number.isNaN(date.getTime()) ? new Date() : date;
  return `${safe.getFullYear()}${String(safe.getMonth() + 1).padStart(2, "0")}${String(safe.getDate()).padStart(2, "0")}`;
}

function ledgerEntry({ name, amount, isDebit, extra = "" }) {
  // Tally sign convention: debits carry ISDEEMEDPOSITIVE=Yes and a negative AMOUNT.
  const signed = isDebit ? -Math.abs(amount) : Math.abs(amount);
  return `
          <ALLLEDGERENTRIES.LIST>
            <LEDGERNAME>${escapeXml(name)}</LEDGERNAME>
            <ISDEEMEDPOSITIVE>${isDebit ? "Yes" : "No"}</ISDEEMEDPOSITIVE>
            <AMOUNT>${signed.toFixed(2)}</AMOUNT>${extra}
          </ALLLEDGERENTRIES.LIST>`;
}

function addressLines(customer) {
  return [customer?.address, customer?.city, customer?.state, customer?.pincode]
    .filter(Boolean)
    .map((line) => `            <ADDRESS>${escapeXml(line)}</ADDRESS>`)
    .join("\n");
}

/**
 * @param {object} invoice - invoice record created by the server
 * @param {object} config  - settings.tally (merged over DEFAULT_TALLY_CONFIG)
 * @returns {string} XML envelope ready to POST to Tally
 */
export function buildSalesVoucherXml(invoice, config = {}) {
  const cfg = { ...DEFAULT_TALLY_CONFIG, ...config };
  const totals = invoice.totals || {};
  const customer = invoice.customer || {};
  const partyName = customer.name || "Cash Sale";

  const narration = `Online order ${invoice.orderId || invoice.number} via manosidiamonds.com`
    + (invoice.paymentMethod ? ` | Payment: ${invoice.paymentMethod}` : "");

  const entries = [
    // Party is debited for the full invoice value.
    ledgerEntry({
      name: partyName,
      amount: totals.total,
      isDebit: true,
      extra: `
            <BILLALLOCATIONS.LIST>
              <NAME>${escapeXml(invoice.number)}</NAME>
              <BILLTYPE>New Ref</BILLTYPE>
              <AMOUNT>${(-Math.abs(totals.total)).toFixed(2)}</AMOUNT>
            </BILLALLOCATIONS.LIST>`,
    }),
    ledgerEntry({ name: cfg.salesLedger, amount: totals.taxableValue, isDebit: false }),
  ];

  if (totals.cgst) entries.push(ledgerEntry({ name: cfg.cgstLedger, amount: totals.cgst, isDebit: false }));
  if (totals.sgst) entries.push(ledgerEntry({ name: cfg.sgstLedger, amount: totals.sgst, isDebit: false }));
  if (totals.igst) entries.push(ledgerEntry({ name: cfg.igstLedger, amount: totals.igst, isDebit: false }));
  if (totals.shipping) entries.push(ledgerEntry({ name: cfg.shippingLedger, amount: totals.shipping, isDebit: false }));
  if (totals.roundOff) {
    entries.push(ledgerEntry({
      name: cfg.roundOffLedger,
      amount: Math.abs(totals.roundOff),
      isDebit: totals.roundOff < 0,
    }));
  }

  return `<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${escapeXml(cfg.companyName)}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="${escapeXml(cfg.voucherType)}" ACTION="Create" OBJVIEW="Invoice Voucher View">
            <DATE>${tallyDate(invoice.dateISO)}</DATE>
            <EFFECTIVEDATE>${tallyDate(invoice.dateISO)}</EFFECTIVEDATE>
            <VOUCHERTYPENAME>${escapeXml(cfg.voucherType)}</VOUCHERTYPENAME>
            <VOUCHERNUMBER>${escapeXml(invoice.number)}</VOUCHERNUMBER>
            <REFERENCE>${escapeXml(invoice.number)}</REFERENCE>
            <REFERENCEDATE>${tallyDate(invoice.dateISO)}</REFERENCEDATE>
            <PARTYLEDGERNAME>${escapeXml(partyName)}</PARTYLEDGERNAME>
            <PARTYNAME>${escapeXml(partyName)}</PARTYNAME>
            <BASICBUYERNAME>${escapeXml(partyName)}</BASICBUYERNAME>
            <PARTYMAILINGNAME>${escapeXml(partyName)}</PARTYMAILINGNAME>
            <STATENAME>${escapeXml(customer.state || "")}</STATENAME>
            <PLACEOFSUPPLY>${escapeXml(invoice.placeOfSupply || customer.state || "")}</PLACEOFSUPPLY>
            <COUNTRYOFRESIDENCE>India</COUNTRYOFRESIDENCE>
            <PARTYPINCODE>${escapeXml(customer.pincode || "")}</PARTYPINCODE>
            <BASICBUYERSSALESTAXNO>${escapeXml(customer.gstin || "")}</BASICBUYERSSALESTAXNO>
            <PERSISTEDVIEW>Invoice Voucher View</PERSISTEDVIEW>
            <ISINVOICE>Yes</ISINVOICE>
            <NARRATION>${escapeXml(narration)}</NARRATION>
            <BASICBUYERADDRESS.LIST>
${addressLines(customer)}
            </BASICBUYERADDRESS.LIST>${entries.join("")}
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
}

/**
 * Tally replies with XML, not JSON. A successful import has CREATED >= 1;
 * failures surface in LINEERROR / EXCEPTIONS.
 */
export function parseTallyResponse(xml) {
  const text = String(xml || "");
  const pick = (tag) => {
    const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
    return match ? match[1].trim() : "";
  };
  const created = Number(pick("CREATED") || 0);
  const altered = Number(pick("ALTERED") || 0);
  const errors = Number(pick("ERRORS") || 0);
  const exceptions = Number(pick("EXCEPTIONS") || 0);
  const lineError = pick("LINEERROR");
  const voucherId = pick("LASTVCHID") || pick("VCHID") || "";

  return {
    ok: (created > 0 || altered > 0) && errors === 0 && !lineError,
    created,
    altered,
    errors,
    exceptions,
    voucherId,
    message: lineError || (created > 0 ? "Voucher created in Tally" : "Tally accepted the request but created no voucher"),
    raw: text.slice(0, 2000),
  };
}
