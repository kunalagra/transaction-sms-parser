var i = /* @__PURE__ */ ((t) => (t.CARD = "CARD", t.WALLET = "WALLET", t.ACCOUNT = "ACCOUNT", t))(i || {}), u = /* @__PURE__ */ ((t) => (t.AVAILABLE = "AVAILABLE", t.OUTSTANDING = "OUTSTANDING", t))(u || {});
const A = [
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
], y = ["outstanding"], L = ["paytm", "simpl", "lazypay", "amazon_pay"], N = ["upi", "ref no", "upi ref", "upi ref no", "refno", "transaction number"], m = [
  {
    regex: /credit\scard/g,
    word: "c_card",
    type: i.CARD
  },
  {
    regex: /amazon\spay/g,
    word: "amazon_pay",
    type: i.WALLET
  },
  {
    regex: /uni\scard/g,
    word: "uni_card",
    type: i.CARD
  },
  {
    regex: /niyo\scard/g,
    word: "niyo",
    type: i.ACCOUNT
  },
  {
    regex: /slice\scard/g,
    word: "slice_card",
    type: i.CARD
  },
  {
    regex: /one\s*card/g,
    word: "one_card",
    type: i.CARD
  }
], T = (t) => !Number.isNaN(Number(t)), v = (t) => {
  const [e, l] = [t[0], t[t.length - 1]];
  let n = Number.isNaN(Number(l)) ? t.slice(0, -1) : t;
  return n = Number.isNaN(Number(e)) ? n.slice(1) : n, n;
}, O = (t) => {
  const e = t.replace("ac", "");
  return Number.isNaN(Number(e)) ? "" : e;
}, x = (t) => {
  let e = t.toLowerCase();
  return e = e.replace(/-/g, ""), e = e.replace(/!/g, ""), e = e.replace(/:/g, " "), e = e.replace(/\//g, ""), e = e.replace(/=/g, " "), e = e.replace(/[{}]/g, " "), e = e.replace(/\n/g, " "), e = e.replace(/\r/g, " "), e = e.replace(/ending /g, ""), e = e.replace(/x|[*]/g, ""), e = e.replace(/is /g, ""), e = e.replace(/with /g, ""), e = e.replace(/no. /g, ""), e = e.replace(/\bac\b|\bacct\b|\baccount\b/g, "ac"), e = e.replace(/₹(?=\s*\d+)/g, "rs. "), e = e.replace(/by(?=\s*\d+)/g, "rs. "), e = e.replace(/rs(?=\w)/g, "rs. "), e = e.replace(/rs /g, "rs. "), e = e.replace(/inr(?=\w)/g, "rs. "), e = e.replace(/inr /g, "rs. "), e = e.replace(/rs. /g, "rs."), e = e.replace(/rs.(?=\w)/g, "rs. "), e = e.replace(/debited/g, " debited "), e = e.replace(/credited/g, " credited "), m.forEach((l) => {
    e = e.replace(l.regex, l.word);
  }), e.split(" ").filter((l) => l !== "");
}, p = (t) => {
  let e = [];
  return typeof t == "string" ? e = x(t) : e = t, e;
}, b = (t) => {
  const [e, l] = t.split(".");
  return `${e}.${(l ?? "").padEnd(2, "0")}`;
}, E = (t, e, l = 1) => {
  const r = t.split(e, 2)[1];
  if (r) {
    const a = /[^0-9a-zA-Z]+/gi;
    return r.trim().split(a, l).join(" ");
  }
  return "";
}, I = (t) => {
  let e = "";
  const l = t.findIndex(
    (r) => r === "card" || m.filter((a) => a.type === i.CARD).some((a) => a.word === r ? (e = a.word, !0) : !1)
  ), n = { type: null, name: null, number: null };
  return l !== -1 ? (n.number = t[l + 1], n.type = i.CARD, Number.isNaN(Number(n.number)) ? {
    type: e ? n.type : null,
    name: e,
    number: null
  } : n) : { type: null, name: null, number: null };
}, h = (t) => {
  const e = p(t);
  let l = -1, n = {
    type: null,
    name: null,
    number: null
  };
  for (const [r, a] of e.entries())
    if (a === "ac")
      if (r + 1 < e.length) {
        const s = v(
          e[r + 1]
        );
        if (Number.isNaN(Number(s)))
          continue;
        l = r, n.type = i.ACCOUNT, n.number = s;
        break;
      } else
        continue;
    else if (a.includes("ac")) {
      const s = O(a);
      if (s === "")
        continue;
      l = r, n.type = i.ACCOUNT, n.number = s;
      break;
    }
  if (l === -1 && (n = I(e)), !n.type) {
    const r = e.find((a) => L.includes(a));
    r && (n.type = i.WALLET, n.name = r);
  }
  if (!n.type) {
    const r = m.filter((a) => a.type === i.ACCOUNT).find((a) => e.includes(a.word));
    n.type = (r == null ? void 0 : r.type) ?? null, n.name = (r == null ? void 0 : r.word) ?? null;
  }
  return n.number && n.number.length > 4 && (n.number = n.number.slice(-4)), n;
}, R = (t, e, l) => {
  let n = "", r = !1, a = 0, s = "", c = t;
  for (; c < l; ) {
    if (s = e[c], s >= "0" && s <= "9")
      r = !0, n += s;
    else if (r) {
      if (s === ".") {
        if (a === 1)
          break;
        n += s, a += 1;
      } else if (s !== ",")
        break;
    }
    c += 1;
  }
  return n;
}, B = (t, e = u.AVAILABLE) => {
  const n = `(${(e === u.AVAILABLE ? A : y).join("|")})`.replace("/", "\\/"), r = "([\\d]+\\.[\\d]+|[\\d]+)";
  let a = new RegExp(`${n}\\s*${r}`, "gi"), s = t.match(a);
  if (s && s.length > 0) {
    const c = s[0].split(" ").pop();
    return Number.isNaN(Number(c)) ? "" : c;
  }
  if (a = new RegExp(`${r}\\s*${n}`, "gi"), s = t.match(a), s && s.length > 0) {
    const c = s[0].split(" ")[0];
    return Number.isNaN(Number(c)) ? "" : c;
  }
  return null;
}, f = (t, e = u.AVAILABLE) => {
  const n = p(t).join(" ");
  let r = -1, a = "";
  const s = e === u.AVAILABLE ? A : y;
  for (const g of s)
    if (r = n.indexOf(g), r !== -1) {
      r += g.length;
      break;
    } else
      continue;
  let c = r, o = -1, d = n.substr(c, 3);
  for (c += 3; c < n.length; ) {
    if (d = d.slice(1), d += n[c], d === "rs.") {
      o = c + 2;
      break;
    }
    c += 1;
  }
  return o === -1 ? (a = B(n) ?? "", a ? b(a) : null) : (a = R(o, n, n.length), a ? b(a) : null);
}, w = (t) => {
  const e = p(t), l = e.join(" "), n = {
    merchant: null,
    referenceNo: null
  };
  if (e.includes("vpa")) {
    const a = e.indexOf("vpa");
    if (a < e.length - 1) {
      const s = e[a + 1], [c] = s.replaceAll(/\(|\)/gi, " ").split(" ");
      n.merchant = c;
    }
  }
  let r = "";
  for (let a = 0; a < N.length; a += 1) {
    const s = N[a];
    l.indexOf(s) > 0 && (r = s);
  }
  if (r) {
    const a = E(l, r);
    if (T(a))
      n.referenceNo = a;
    else if (n.merchant) {
      const [s] = a.split(/[^0-9]/gi).sort((c, o) => o.length - c.length)[0];
      s && (n.referenceNo = s);
    } else
      n.merchant = a;
  }
  return n;
}, D = (t) => {
  const l = p(t).indexOf("rs.");
  if (l === -1)
    return "";
  let n = t[l + 1];
  return n = n.replace(/,/g, ""), Number.isNaN(Number(n)) ? (n = t[l + 2], n = n == null ? void 0 : n.replace(/,/g, ""), Number.isNaN(Number(n)) ? "" : b(n)) : b(n);
}, M = (t) => {
  const e = /(?:credited|credit|deposited|received\srs|added|received|refund|repayment)/gi, l = /(?:debited|debit|deducted)/gi, n = /(?:payment|spent|paid|used\s+at|charged|sent\srs|transaction\son|transaction\sfee|tran|booked|purchased|sent\s+to|purchase\s+of)/gi, r = typeof t != "string" ? t.join(" ") : t;
  return l.test(r) ? "debit" : e.test(r) ? "credit" : n.test(r) ? "debit" : null;
}, k = (t) => {
  const e = p(t);
  let l = e.indexOf("to");
  if (l === -1 && (l = e.indexOf("from"), l === -1))
    return null;
  const n = t[l + 1];
  return ["kotak", "your", "bank", "sbi", "canara"].includes(n) ? null : n;
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
  const e = x(t), l = h(e), n = f(
    e,
    u.AVAILABLE
  ), r = D(e), s = [n, r, l.number].filter(
    (C) => C !== ""
  ).length >= 2 ? M(e) : null, c = { available: n, outstanding: null };
  l && l.type === i.CARD && (c.outstanding = f(
    e,
    u.OUTSTANDING
  ));
  const o = k(e), { merchant: d, referenceNo: g } = w(t);
  return {
    account: l,
    balance: c,
    transaction: {
      type: s,
      amount: r,
      merchant: d,
      referenceNo: g,
      detail: o
    }
  };
}, V = h, U = f, K = w;
export {
  i as IAccountType,
  u as IBalanceKeyWordsType,
  V as getAccountInfo,
  U as getBalanceInfo,
  K as getMerchantInfo,
  D as getTransactionAmount,
  k as getTransactionDetails,
  S as getTransactionInfo,
  M as getTransactionType
};
