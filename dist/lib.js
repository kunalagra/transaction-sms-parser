var c = /* @__PURE__ */ ((t) => (t.CARD = "CARD", t.WALLET = "WALLET", t.ACCOUNT = "ACCOUNT", t))(c || {}), u = /* @__PURE__ */ ((t) => (t.AVAILABLE = "AVAILABLE", t.OUTSTANDING = "OUTSTANDING", t))(u || {});
const N = [
  "avbl bal",
  "available balance",
  "available limit",
  "available credit limit",
  "limit available",
  "a/c bal",
  "ac bal",
  "available bal",
  "avl bal",
  "updated balance",
  "total balance",
  "new balance",
  "bal",
  "avl lmt",
  "available"
], y = ["outstanding"], C = ["paytm", "simpl", "lazypay", "amazon_pay"], m = ["upi", "ref no", "upi ref", "upi ref no", "refno", "transaction number", "utr", "ref"], h = [
  {
    regex: /credit\scard/g,
    word: "c_card",
    type: c.CARD
  },
  {
    regex: /amazon\spay/g,
    word: "amazon_pay",
    type: c.WALLET
  },
  {
    regex: /uni\scard/g,
    word: "uni_card",
    type: c.CARD
  },
  {
    regex: /niyo\scard/g,
    word: "niyo",
    type: c.ACCOUNT
  },
  {
    regex: /slice\scard/g,
    word: "slice_card",
    type: c.CARD
  },
  {
    regex: /one\s*card/g,
    word: "one_card",
    type: c.CARD
  }
], L = (t) => !Number.isNaN(Number(t)), T = (t) => {
  const [e, s] = [t[0], t[t.length - 1]];
  let n = Number.isNaN(Number(s)) ? t.slice(0, -1) : t;
  return n = Number.isNaN(Number(e)) ? n.slice(1) : n, n;
}, O = (t) => {
  const e = t.replace("ac", "");
  return Number.isNaN(Number(e)) ? "" : e;
}, w = (t) => {
  let e = t.toLowerCase();
  return e = e.replace(/-/g, ""), e = e.replace(/!/g, ""), e = e.replace(/:/g, " "), e = e.replace(/\//g, ""), e = e.replace(/=/g, " "), e = e.replace(/[{}]/g, " "), e = e.replace(/\n/g, " "), e = e.replace(/\r/g, " "), e = e.replace(/ending /g, ""), e = e.replace(/x|[*]/g, ""), e = e.replace(/\bis\b /g, ""), e = e.replace(/with /g, ""), e = e.replace(/\bac\b|\bacc\b|\bacct\b|\baccount\b/g, "ac"), e = e.replace(/no. /g, ""), e = e.replace(/(ac) no\b/g, "$1"), e = e.replace(/₹(?=\s*\d+)/g, "rs. "), e = e.replace(/by(?=\s*\d+)/g, "rs. "), e = e.replace(/rs(?=\w)/g, "rs. "), e = e.replace(/rs /g, "rs. "), e = e.replace(/inr(?=\w)/g, "rs. "), e = e.replace(/inr /g, "rs. "), e = e.replace(/rs. /g, "rs."), e = e.replace(/rs.(?=\w)/g, "rs. "), e = e.replace(/debited/g, " debited "), e = e.replace(/credited/g, " credited "), h.forEach((s) => {
    e = e.replace(s.regex, s.word);
  }), e.split(" ").filter((s) => s !== "");
}, b = (t) => {
  let e = [];
  return typeof t == "string" ? e = w(t) : e = t, e;
}, p = (t) => {
  const [e, s] = t.split(".");
  return `${e}.${(s ?? "").padEnd(2, "0")}`;
}, E = (t, e, s = 1) => {
  const r = t.split(e, 2)[1];
  if (r) {
    const a = /[^0-9a-zA-Z]+/gi;
    return r.trim().split(a, s).join(" ");
  }
  return "";
}, I = (t) => {
  let e = "";
  const s = t.findIndex(
    (r) => r === "card" || h.filter((a) => a.type === c.CARD).some((a) => a.word === r ? (e = a.word, !0) : !1)
  ), n = { type: null, name: null, number: null };
  return s !== -1 ? (n.number = t[s + 1], n.type = c.CARD, Number.isNaN(Number(n.number)) ? {
    type: e ? n.type : null,
    name: e,
    number: null
  } : n) : { type: null, name: null, number: null };
}, A = (t) => {
  const e = b(t);
  let s = -1, n = {
    type: null,
    name: null,
    number: null
  };
  for (const [r, a] of e.entries())
    if (a === "ac")
      if (r + 1 < e.length) {
        const o = T(
          e[r + 1]
        );
        if (Number.isNaN(Number(o)))
          continue;
        s = r, n.type = c.ACCOUNT, n.number = o;
        break;
      } else
        continue;
    else if (a.includes("ac")) {
      const o = O(a);
      if (o === "")
        continue;
      s = r, n.type = c.ACCOUNT, n.number = o;
      break;
    }
  if (s === -1 && (n = I(e)), !n.type) {
    const r = e.find((a) => C.includes(a));
    r && (n.type = c.WALLET, n.name = r);
  }
  if (!n.type) {
    const r = h.filter((a) => a.type === c.ACCOUNT).find((a) => e.includes(a.word));
    n.type = (r == null ? void 0 : r.type) ?? null, n.name = (r == null ? void 0 : r.word) ?? null;
  }
  return n.number && n.number.length > 4 && (n.number = n.number.slice(-4)), n;
}, R = (t, e, s) => {
  let n = "", r = !1, a = 0, o = "", l = t;
  for (; l < s; ) {
    if (o = e[l], o >= "0" && o <= "9")
      r = !0, n += o;
    else if (r) {
      if (o === ".") {
        if (a === 1)
          break;
        n += o, a += 1;
      } else if (o !== ",")
        break;
    }
    l += 1;
  }
  return n;
}, B = (t, e = u.AVAILABLE) => {
  const n = `(${(e === u.AVAILABLE ? N : y).join("|")})`.replace("/", "\\/"), r = "([\\d]+\\.[\\d]+|[\\d]+)";
  let a = new RegExp(`${n}\\s*${r}`, "gi"), o = t.match(a);
  if (o && o.length > 0) {
    const l = o[0].split(" ").pop();
    return Number.isNaN(Number(l)) ? "" : l;
  }
  if (a = new RegExp(`${r}\\s*${n}`, "gi"), o = t.match(a), o && o.length > 0) {
    const l = o[0].split(" ")[0];
    return Number.isNaN(Number(l)) ? "" : l;
  }
  return null;
}, g = (t, e = u.AVAILABLE) => {
  const n = b(t).join(" ");
  let r = -1, a = "";
  const o = e === u.AVAILABLE ? N : y;
  for (const f of o)
    if (r = n.indexOf(f), r !== -1) {
      r += f.length;
      break;
    } else
      continue;
  let l = r, i = -1, d = n.substr(l, 3);
  for (l += 3; l < n.length; ) {
    if (d = d.slice(1), d += n[l], d === "rs.") {
      i = l + 2;
      break;
    }
    l += 1;
  }
  return i === -1 ? (a = B(n) ?? "", a ? p(a) : null) : (a = R(i, n, n.length), a ? p(a) : null);
}, x = (t) => {
  const e = b(t), s = e.join(" "), n = {
    merchant: null,
    referenceNo: null
  };
  if (e.includes("vpa")) {
    const a = e.indexOf("vpa");
    if (a < e.length - 1) {
      const o = e[a + 1], [l] = o.replaceAll(/\(|\)/gi, " ").split(" ");
      n.merchant = l;
    }
  }
  let r = "";
  for (let a = 0; a < m.length; a += 1) {
    const o = m[a];
    s.indexOf(o) > 0 && (r = o);
  }
  if (r) {
    const a = E(s, r);
    if (L(a))
      n.referenceNo = a;
    else if (n.merchant) {
      const [o] = a.split(/[^0-9]/gi).sort((l, i) => i.length - l.length)[0];
      o && (n.referenceNo = o);
    } else
      n.referenceNo = a;
  }
  return n;
}, D = (t) => {
  const s = b(t).indexOf("rs.");
  if (s === -1)
    return "";
  let n = t[s + 1];
  return n = n.replace(/,/g, ""), Number.isNaN(Number(n)) ? (n = t[s + 2], n = n == null ? void 0 : n.replace(/,/g, ""), Number.isNaN(Number(n)) ? "" : p(n)) : p(n);
}, M = (t) => {
  const e = /(?:credited|credit|deposited|received\srs|added|received|refund|repayment)/gi, s = /(?:debited|debit|deducted|sent)/gi, n = /(?:payment|spent|paid|used\s+at|charged|sent\srs|transaction\son|transaction\sfee|tran|booked|purchased|sent\s+to|purchase\s+of)/gi, r = typeof t != "string" ? t.join(" ") : t;
  return s.test(r) ? "debit" : e.test(r) ? "credit" : n.test(r) ? "debit" : null;
}, S = (t) => {
  const e = b(t);
  let s = [
    e.indexOf("to"),
    e.indexOf("by"),
    e.indexOf("from")
  ];
  for (let r = 0; r < s.length; r++)
    if (s[r] != -1) {
      const a = t[s[r] + 1], o = [
        "i",
        "me",
        "my",
        "myself",
        "we",
        "our",
        "ours",
        "rs.",
        "ourselves",
        "you",
        "you're",
        "you've",
        "you'll",
        "you'd",
        "your",
        "yours",
        "yourself",
        "yourselves",
        "ac",
        "sms",
        "call",
        "it",
        "it's",
        "its",
        "itself",
        "they",
        "them",
        "their",
        "theirs",
        "themselves",
        "what",
        "which",
        "who",
        "whom",
        "this",
        "that",
        "that'll",
        "these",
        "those",
        "am",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "being",
        "have",
        "has",
        "had",
        "having",
        "do",
        "does",
        "did",
        "doing",
        "a",
        "an",
        "the",
        "and",
        "but",
        "if",
        "or",
        "because",
        "as",
        "until",
        "while",
        "of",
        "at",
        "by",
        "for",
        "with",
        "about",
        "against",
        "between",
        "into",
        "through",
        "during",
        "before",
        "after",
        "above",
        "below",
        "to",
        "from",
        "up",
        "down",
        "in",
        "out",
        "on",
        "off",
        "over",
        "under",
        "again",
        "further",
        "then",
        "once",
        "here",
        "there",
        "when",
        "where",
        "why",
        "how",
        "all",
        "any",
        "both",
        "each",
        "few",
        "more",
        "most",
        "other",
        "some",
        "such",
        "no",
        "nor",
        "not",
        "only",
        "own",
        "same",
        "so",
        "than",
        "too",
        "very",
        "s",
        "t",
        "can",
        "will",
        "just",
        "don",
        "don't",
        "should",
        "should've",
        "now",
        "d",
        "ll",
        "m",
        "o",
        "re",
        "ve",
        "y",
        "ain",
        "aren",
        "aren't",
        "couldn",
        "couldn't",
        "didn",
        "didn't",
        "doesn",
        "doesn't",
        "hadn",
        "hadn't",
        "hasn",
        "hasn't",
        "haven",
        "haven't",
        "isn",
        "isn't",
        "wasn",
        "wasn't",
        "weren",
        "weren't",
        "won",
        "won't",
        "wouldn",
        "wouldn't",
        "kotak",
        "canara",
        "sbi",
        "au"
      ];
      var n = /^\d{10}$/;
      if (n.test(a) || o.includes(a))
        continue;
      return a;
    }
  return null;
}, k = (t) => {
  if (!t || typeof t != "string")
    return {
      account: {
        type: null,
        number: null,
        name: null
      },
      balance: null,
      transaction: {
        type: null,
        amount: null,
        merchant: null,
        referenceNo: null,
        detail: null
      }
    };
  const e = w(t), s = A(e), n = g(
    e,
    u.AVAILABLE
  ), r = D(e), o = [n, r, s.number].filter(
    (v) => v !== ""
  ).length >= 2 ? M(e) : null, l = { available: n, outstanding: null };
  s && s.type === c.CARD && (l.outstanding = g(
    e,
    u.OUTSTANDING
  ));
  const i = S(e), { merchant: d, referenceNo: f } = x(t);
  return {
    account: s,
    balance: l,
    transaction: {
      type: o,
      amount: r,
      merchant: d,
      referenceNo: f,
      detail: i
    }
  };
}, V = A, U = g, $ = x;
export {
  c as IAccountType,
  u as IBalanceKeyWordsType,
  V as getAccountInfo,
  U as getBalanceInfo,
  $ as getMerchantInfo,
  D as getTransactionAmount,
  S as getTransactionDetails,
  k as getTransactionInfo,
  M as getTransactionType
};
