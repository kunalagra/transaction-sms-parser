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
], y = ["outstanding"], C = ["paytm", "simpl", "lazypay", "amazon_pay"], m = ["ref", "upi", "ref no", "upi ref", "upi ref no", "refno", "transaction number", "utr"], h = [
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
  return e = e.replace(/\s{2,}/g, " "), e = e.replace(/-/g, ""), e = e.replace(/!/g, ""), e = e.replace(/:/g, " "), e = e.replace(/\//g, ""), e = e.replace(/=/g, " "), e = e.replace(/[{}]/g, " "), e = e.replace(/\n/g, " "), e = e.replace(/\r/g, " "), e = e.replace(/ending /g, ""), e = e.replace(new RegExp("(?<![a-wyzA-WYZ])x|[*]", "g"), ""), e = e.replace(/\bis\b /g, ""), e = e.replace(/with /g, ""), e = e.replace(/\bac\b|\bacc\b|\bacct\b|\baccount\b/g, "ac"), e = e.replace(/no. /g, ""), e = e.replace(/(ac)(x+)(\d+)/g, "$1 $2$3"), e = e.replace(/(ac) no\b/g, "$1"), e = e.replace(/₹(?=\s*\d+)/g, "rs. "), e = e.replace(/by(?=\s*\d+)/g, "rs. "), e = e.replace(/rs(?=\w)/g, "rs. "), e = e.replace(/rs /g, "rs. "), e = e.replace(/inr(?=\w)/g, "rs. "), e = e.replace(/inr /g, "rs. "), e = e.replace(/rs. /g, "rs."), e = e.replace(/rs.(?=\w)/g, "rs. "), e = e.replace(/debited/g, " debited "), e = e.replace(/credited/g, " credited "), h.forEach((s) => {
    e = e.replace(s.regex, s.word);
  }), e.split(" ").filter((s) => s !== "");
}, b = (t) => {
  let e = [];
  return typeof t == "string" ? e = w(t) : e = t, e;
}, f = (t) => {
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
        const l = T(
          e[r + 1]
        );
        if (Number.isNaN(Number(l)))
          continue;
        s = r, n.type = c.ACCOUNT, n.number = l;
        break;
      } else
        continue;
    else if (a.includes("ac")) {
      const l = O(a);
      if (l === "")
        continue;
      s = r, n.type = c.ACCOUNT, n.number = l;
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
  let n = "", r = !1, a = 0, l = "", o = t;
  for (; o < s; ) {
    if (l = e[o], l >= "0" && l <= "9")
      r = !0, n += l;
    else if (r) {
      if (l === ".") {
        if (a === 1)
          break;
        n += l, a += 1;
      } else if (l !== ",")
        break;
    }
    o += 1;
  }
  return n;
}, B = (t, e = u.AVAILABLE) => {
  const n = `(${(e === u.AVAILABLE ? N : y).join("|")})`.replace("/", "\\/"), r = "([\\d]+\\.[\\d]+|[\\d]+)";
  let a = new RegExp(`${n}\\s*${r}`, "gi"), l = t.match(a);
  if (l && l.length > 0) {
    const o = l[0].split(" ").pop();
    return Number.isNaN(Number(o)) ? "" : o;
  }
  if (a = new RegExp(`${r}\\s*${n}`, "gi"), l = t.match(a), l && l.length > 0) {
    const o = l[0].split(" ")[0];
    return Number.isNaN(Number(o)) ? "" : o;
  }
  return null;
}, g = (t, e = u.AVAILABLE) => {
  const n = b(t).join(" ");
  let r = -1, a = "";
  const l = e === u.AVAILABLE ? N : y;
  for (const p of l)
    if (r = n.indexOf(p), r !== -1) {
      r += p.length;
      break;
    } else
      continue;
  let o = r, i = -1, d = n.substr(o, 3);
  for (o += 3; o < n.length; ) {
    if (d = d.slice(1), d += n[o], d === "rs.") {
      i = o + 2;
      break;
    }
    o += 1;
  }
  return i === -1 ? (a = B(n) ?? "", a ? f(a) : null) : (a = R(i, n, n.length), a ? f(a) : null);
}, x = (t) => {
  const e = b(t), s = e.join(" "), n = {
    merchant: null,
    referenceNo: null
  };
  if (e.includes("vpa")) {
    const a = e.indexOf("vpa");
    if (a < e.length - 1) {
      const l = e[a + 1], [o] = l.replaceAll(/\(|\)/gi, " ").split(" ");
      n.merchant = o;
    }
  }
  let r = "";
  for (let a = 0; a < m.length; a += 1) {
    const l = m[a];
    s.indexOf(l) > 0 && (r = l);
  }
  if (r) {
    const a = E(s, r);
    if (L(a))
      n.referenceNo = a;
    else if (n.merchant) {
      const [l] = a.split(/[^0-9]/gi).sort((o, i) => i.length - o.length)[0];
      l && (n.referenceNo = l);
    } else
      n.referenceNo = a;
  }
  return n;
}, D = (t) => {
  const s = b(t).indexOf("rs.");
  if (s === -1)
    return "";
  let n = t[s + 1];
  return n = n.replace(/,/g, ""), Number.isNaN(Number(n)) ? (n = t[s + 2], n = n == null ? void 0 : n.replace(/,/g, ""), Number.isNaN(Number(n)) ? "" : f(n)) : f(n);
}, M = (t) => {
  const e = /(?:credited|credit|deposited|received\srs|added|received|refund|repayment)/gi, s = /\b(?:debited|debit|deducted|sent)\b/gi, n = /(?:payment|spent|paid|used\s+at|charged|sent\srs|transaction\son|transaction\sfee|tran|booked|purchased|sent\s+to|purchase\s+of)/gi, r = typeof t != "string" ? t.join(" ") : t;
  return e.test(r) ? "credit" : s.test(r) || n.test(r) ? "debit" : null;
}, $ = (t) => {
  const e = b(t);
  let s = [
    e.indexOf("to"),
    e.indexOf("by"),
    e.indexOf("from"),
    e.indexOf("at")
  ];
  for (let r = 0; r < s.length; r++)
    if (s[r] != -1) {
      const a = t[s[r] + 1], l = [
        "i",
        "me",
        "my",
        "myself",
        "we",
        "our",
        "ours",
        "rs.",
        "u",
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
      if (n.test(a) || l.includes(a))
        continue;
      return a;
    }
  return null;
}, S = (t) => {
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
  ), r = D(e), l = [n, r, s.number].filter(
    (v) => v !== ""
  ).length >= 2 ? M(e) : null, o = { available: n, outstanding: null };
  s && s.type === c.CARD && (o.outstanding = g(
    e,
    u.OUTSTANDING
  ));
  const i = $(e), { merchant: d, referenceNo: p } = x(t);
  return {
    account: s,
    balance: o,
    transaction: {
      type: l,
      amount: r,
      merchant: d,
      referenceNo: p,
      detail: i
    }
  };
}, k = A, V = g, U = x;
export {
  c as IAccountType,
  u as IBalanceKeyWordsType,
  k as getAccountInfo,
  V as getBalanceInfo,
  U as getMerchantInfo,
  D as getTransactionAmount,
  $ as getTransactionDetails,
  S as getTransactionInfo,
  M as getTransactionType
};
