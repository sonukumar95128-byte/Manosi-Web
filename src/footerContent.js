// Content for the footer's "Customer Service" and "Policies" links.
//
// Every one of these used to collapse into either the Concierge form or the
// Diamond Guide, regardless of which link was clicked - "Privacy Policy" and
// "Shipping Policy" both opened a page about cut, clarity, colour and carat.
// This is real copy instead, grounded in what the site actually does
// (GST-inclusive pricing, IGI certificates already in the catalogue, the
// 48hr / made-to-order split ProductCard already shows, the 30-day return
// and lifetime exchange promises already on the homepage).
//
// A few facts only Sonu can supply - registered business name and address,
// CIN/GST number, a grievance officer, a support phone line - are left as
// clearly marked placeholders rather than invented. Replace every
// [bracketed] value before this goes live; a Privacy Policy or Terms page
// with fabricated legal details is worse than one that is honestly a draft.

export const footerPages = {
  faq: {
    eyebrow: "Customer Care",
    title: "Frequently Asked Questions",
    intro: "Common questions about our diamonds, sizing, delivery and care. Still stuck? The Concierge team is a message away.",
    qa: [
      ["Are these real, natural diamonds?", "Yes. Every piece uses certified natural diamonds - never lab-grown or simulated - selected for everyday brilliance rather than only occasion wear."],
      ["How do I know the gold is genuine?", "All gold is BIS hallmarked, so the purity (14KT, 18KT or 22KT as listed on the product) is independently verified, not just claimed."],
      ["Does my piece come with a certificate?", "Certified pieces list their lab (for example IGI) on the product page under Certifications. Look for the certificate detail in the specifications list before you buy."],
      ["How long does delivery take?", "In-stock pieces ship within 48 hours of a confirmed order. Made-to-order pieces take longer - the product page tells you which applies before you check out."],
      ["Can I return or exchange a piece?", "Yes - unworn pieces in original packaging with the certificate intact can be returned within 30 days, and we offer a lifetime exchange beyond that. See our Return Policy for the full process."],
      ["What payment methods do you accept?", "UPI, credit/debit cards and net banking, plus cash on delivery where available - your exact options are shown at checkout."],
      ["Are your prices inclusive of GST?", "Yes, every listed price already includes GST; there is no surprise tax add-on at checkout."],
      ["Can I get a piece customised?", "Yes - visit Bespoke to start a request, or use Concierge to describe what you have in mind and we will get back to you."],
      ["How should I care for lightweight daily-wear jewellery?", "Keep it away from perfume and chemicals, remove it before swimming or sleeping, wipe with a soft cloth after wear, and store pieces separately so they don't scratch each other."],
      ["Is it safe to pay on this site?", "Payments are processed through standard UPI, card and net banking channels - we do not see or store your card or UPI PIN."],
    ],
  },

  shipping: {
    eyebrow: "Customer Care",
    title: "Shipping",
    intro: "How we get a piece from us to you, safely and on time.",
    sections: [
      ["Delivery timeline", "Pieces marked “Ships in 48 hrs” on the product page are dispatched within two business days of a confirmed, paid order. Pieces marked “Made to order” are crafted after your order is placed - the product page states this upfront so there are no surprises."],
      ["Coverage", "We currently ship across India. If your PIN code has any serviceability restriction, our team will reach out on the phone number you provide at checkout before your order is dispatched."],
      ["Packaging and insurance", "Every order is insured for transit and packed discreetly and securely for fine jewellery - nothing on the outer packaging indicates what's inside."],
      ["Free shipping", "Orders above the free-shipping threshold shown in your cart ship at no extra cost; smaller orders carry a flat shipping fee shown before you pay."],
      ["Tracking your order", "You'll receive order and dispatch updates by WhatsApp or a call to the number on your order. For a status check any time, reach Concierge with your order ID."],
      ["If something arrives damaged", "Do not accept a package with visibly tampered packaging. If a piece arrives damaged, contact us within 48 hours of delivery with photos and we will arrange a replacement or refund."],
    ],
  },

  returns: {
    eyebrow: "Customer Care",
    title: "Returns & Exchange",
    intro: "A short version of our full Return Policy, for a quick answer.",
    sections: [
      ["30-day returns", "Unworn pieces in original packaging, with tags and certificate intact, can be returned within 30 days of delivery for a refund."],
      ["Lifetime exchange", "Beyond 30 days, we offer a lifetime exchange against the current value of another piece from the collection, subject to a quality check."],
      ["What can't be returned", "Bespoke and customised pieces made to your specification are final sale, since they cannot be resold as new."],
      ["How to start a return", "Message Concierge with your order ID and reason for return. We'll arrange an insured pickup - you don't need to arrange courier yourself."],
      ["Refund timeline", "Once the returned piece passes inspection, refunds are issued to your original payment method within 7-10 business days."],
      ["See also", "Full terms are in our Return Policy."],
    ],
  },

  "store-locator": {
    eyebrow: "Visit Us",
    title: "Store Locator",
    intro: "Manosi Diamonds is an online-first jewellery house, so there isn't a retail counter to walk into just yet.",
    sections: [
      ["Shop from home", "Every piece is photographed and described in enough detail to buy with confidence - specifications, gold weight, diamond details and certification are all on the product page."],
      ["Talk to a person first", "Prefer a conversation before you buy? Use Concierge to request a styling call - we'll help you choose based on your daily wear, budget and skin tone over WhatsApp or a phone call."],
      ["Bring Manosi to your city", "Interested in stocking or partnering with us in your city? See our Franchise page."],
    ],
  },

  certifications: {
    eyebrow: "Trust & Quality",
    title: "Certifications",
    intro: "Two independent checks stand behind every piece: the diamond, and the gold.",
    sections: [
      ["Diamond certification", "Certified pieces are graded by an independent gemological lab (for example IGI) and list that certificate on the product page. The certificate confirms the diamonds are natural and states their colour and clarity grade."],
      ["Gold hallmarking", "All gold is BIS hallmarked, India's official purity certification, so the karat marked on a piece (14KT, 18KT or 22KT) is independently verified rather than only stated by us."],
      ["Where to check", "Look under the Specifications section on any product page for its exact gold karat, gold colour, diamond colour, diamond clarity and lab certificate."],
      ["Verifying your certificate", "A physical certificate, where applicable, ships with your order. For questions about a specific piece's certification, quote your order ID to Concierge."],
    ],
  },

  "privacy-policy": {
    eyebrow: "Policies",
    title: "Privacy Policy",
    intro: "How we handle the information you share with us. This section uses placeholders in [brackets] for the legal details specific to the registered business - replace them before publishing.",
    sections: [
      ["Who this policy covers", "This policy applies to visitors and customers of manosidiamonds.com, operated by [registered business name], [registered business address]."],
      ["What we collect", "When you place an order or contact Concierge, we collect your name, phone number, email address and delivery address. We do not collect or store your card, UPI or net banking credentials - those are handled directly by the payment provider."],
      ["How we use it", "Your details are used to process and deliver your order, send order updates by WhatsApp, email or phone, respond to Concierge enquiries, and improve the pieces and content we show you."],
      ["What we store in your browser", "Your wishlist and compare list are saved in your browser only (not on our servers), so they stay private to your device and are lost if you clear your browser's site data."],
      ["Who we share it with", "We share only what's needed to fulfil your order: your address with our shipping partner, and payment details directly with the payment gateway you choose. We do not sell your information to anyone."],
      ["Your rights", "You can ask us to access, correct or delete the personal data we hold about you at any time by contacting [support email / phone] or through Concierge."],
      ["Grievance officer", "For privacy concerns under applicable Indian law, contact our grievance officer: [name], [email], [phone]."],
      ["Changes to this policy", "We may update this policy as the business grows; the version on this page is always the current one."],
    ],
  },

  terms: {
    eyebrow: "Policies",
    title: "Terms & Conditions",
    intro: "The terms that apply when you use this site or place an order. Bracketed items need the business's real legal details before publishing.",
    sections: [
      ["Acceptance", "By browsing or ordering from manosidiamonds.com, operated by [registered business name], you agree to these terms."],
      ["Product information", "We describe every piece as accurately as we can - gold weight, karat, diamond details and certification are listed on each product page. Natural diamonds vary slightly piece to piece; small variations in stone placement or exact carat are normal and not a defect."],
      ["Pricing", "All prices shown are inclusive of GST. Prices tied to the daily gold rate may be updated without prior notice; the price confirmed at checkout is what you pay."],
      ["Orders and payment", "An order is confirmed once payment is received (or, for cash on delivery where offered, once the order is placed). We reserve the right to cancel an order - for example if a made-to-order piece can no longer be crafted - with a full refund."],
      ["Payment methods", "We accept UPI, credit/debit cards, net banking and, where available, cash on delivery. Payments are processed by third-party payment providers under their own security standards."],
      ["Intellectual property", "All photography, designs and text on this site belong to [registered business name] and may not be reused without permission."],
      ["Limitation of liability", "We are not liable for delays or losses caused by circumstances outside our reasonable control, such as courier delays or events of force majeure."],
      ["Governing law", "These terms are governed by the laws of India, and disputes are subject to the courts of [city/jurisdiction]."],
      ["Contact", "Questions about these terms can be sent through Concierge or to [support email]."],
    ],
  },

  "return-policy": {
    eyebrow: "Policies",
    title: "Return Policy",
    intro: "The full detail behind our 30-day return and lifetime exchange promise.",
    sections: [
      ["Eligibility window", "Returns are accepted within 30 days of delivery. Beyond 30 days, pieces remain eligible for a lifetime exchange against the current value of another piece."],
      ["Condition required", "The piece must be unworn, undamaged, and returned in its original packaging with all tags and its certificate (where applicable) intact. Pieces that show signs of wear cannot be accepted."],
      ["Non-returnable items", "Bespoke and customised pieces made to your specification are final sale and are not eligible for return, since they cannot be resold."],
      ["How to request a return", "Message Concierge with your order ID and the reason for return. We'll confirm eligibility and arrange an insured reverse pickup at no cost to you for defective or incorrect items."],
      ["Who pays return shipping", "Returns due to a defect or an error on our part are picked up at our cost. For a change-of-mind return, a reverse shipping fee may apply and will be confirmed before pickup."],
      ["Inspection and refund", "Once the returned piece passes a quality check, your refund is issued to the original payment method within 7-10 business days. For cash on delivery orders, refunds are made by bank transfer - we'll ask for your account details."],
      ["Exchange instead of refund", "Prefer to exchange rather than refund? Let Concierge know when you raise the request and we'll adjust any price difference."],
    ],
  },

  "shipping-policy": {
    eyebrow: "Policies",
    title: "Shipping Policy",
    intro: "The formal version of our Shipping page, for reference.",
    sections: [
      ["Dispatch timelines", "In-stock pieces (marked “Ships in 48 hrs”) are dispatched within two business days of order confirmation. Made-to-order pieces are dispatched once crafting is complete; the estimated timeframe is shared when you order."],
      ["Serviceable area", "We currently ship across India. In the rare case a PIN code cannot be serviced, we will contact you to arrange an alternative before charging your payment method."],
      ["Shipping charges", "Orders above the free-shipping threshold shown in your cart ship free. Orders below it carry a flat shipping charge, shown at checkout before you pay."],
      ["Insurance", "Every shipment is insured for its full order value against loss or damage in transit."],
      ["Address changes", "If you need to change your delivery address after ordering, contact Concierge with your order ID as soon as possible - we can only update it before the order is dispatched."],
      ["Delays", "While we aim to meet the timelines above, courier delays from events outside our control (weather, regional disruptions, public holidays) can occasionally push delivery back; we'll keep you informed if that happens."],
      ["Lost in transit", "If a shipment is confirmed lost by our courier partner, we will send a replacement or a full refund, whichever you prefer."],
    ],
  },

  franchise: {
    eyebrow: "Partner With Us",
    title: "Franchise & Partnerships",
    intro: "Interested in bringing Manosi Diamonds to your city, or stocking our pieces in your store? We'd like to hear from you.",
    sections: [
      ["What we look for", "We're looking to partner with people who already understand fine jewellery retail - whether that's an existing store wanting to stock certified natural diamonds, or an entrepreneur interested in a dedicated Manosi outlet."],
      ["What happens next", "Send us a short note about your city, your retail experience and what you have in mind, using the form below. Our team will reach out to discuss specifics - including investment, terms and territory - on a call, since these vary by location and format."],
      ["No fixed package yet", "We don't have a one-size-fits-all franchise package published here - every conversation starts from your specific situation rather than a fixed brochure."],
    ],
  },
};
