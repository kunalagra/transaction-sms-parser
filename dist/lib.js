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
], y = ["outstanding"], C = ["paytm", "simpl", "lazypay", "amazon_pay"], N = ["upi", "ref no", "upi ref", "upi ref no", "refno", "transaction number"], m = [
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
], L = (t) => !Number.isNaN(Number(t)), T = (t) => {
  const [e, l] = [t[0], t[t.length - 1]];
  let n = Number.isNaN(Number(l)) ? t.slice(0, -1) : t;
  return n = Number.isNaN(Number(e)) ? n.slice(1) : n, n;
}, v = (t) => {
  const e = t.replace("ac", "");
  return Number.isNaN(Number(e)) ? "" : e;
}, h = (t) => {
  let e = t.toLowerCase();
  return e = e.replace(/-/g, ""), e = e.replace(/!/g, ""), e = e.replace(/:/g, " "), e = e.replace(/\//g, ""), e = e.replace(/=/g, " "), e = e.replace(/[{}]/g, " "), e = e.replace(/\n/g, " "), e = e.replace(/\r/g, " "), e = e.replace(/ending /g, ""), e = e.replace(/x|[*]/g, ""), e = e.replace(/is /g, ""), e = e.replace(/with /g, ""), e = e.replace(/no. /g, ""), e = e.replace(/\bac\b|\bacct\b|\baccount\b/g, "ac"), e = e.replace(/by(?=\w)/g, "rs. "), e = e.replace(/rs(?=\w)/g, "rs. "), e = e.replace(/rs /g, "rs. "), e = e.replace(/inr(?=\w)/g, "rs. "), e = e.replace(/inr /g, "rs. "), e = e.replace(/rs. /g, "rs."), e = e.replace(/rs.(?=\w)/g, "rs. "), e = e.replace(/debited/g, " debited "), e = e.replace(/credited/g, " credited "), m.forEach((l) => {
    e = e.replace(l.regex, l.word);
  }), e.split(" ").filter((l) => l !== "");
}, b = (t) => {
  let e = [];
  return typeof t == "string" ? e = h(t) : e = t, e;
}, g = (t) => {
  const [e, l] = t.split(".");
  return `${e}.${(l ?? "").padEnd(2, "0")}`;
}, E = (t, e, l = 1) => {
  const a = t.split(e, 2)[1];
  if (a) {
    const r = /[^0-9a-zA-Z]+/gi;
    return a.trim().split(r, l).join(" ");
  }
  return "";
}, I = (t) => {
  let e = "";
  const l = t.findIndex(
    (a) => a === "card" || m.filter((r) => r.type === i.CARD).some((r) => r.word === a ? (e = r.word, !0) : !1)
  ), n = { type: null, name: null, number: null };
  return l !== -1 ? (n.number = t[l + 1], n.type = i.CARD, Number.isNaN(Number(n.number)) ? {
    type: e ? n.type : null,
    name: e,
    number: null
  } : n) : { type: null, name: null, number: null };
}, x = (t) => {
  const e = b(t);
  let l = -1, n = {
    type: null,
    name: null,
    number: null
  };
  for (const [a, r] of e.entries())
    if (r === "ac")
      if (a + 1 < e.length) {
        const c = T(
          e[a + 1]
        );
        if (Number.isNaN(Number(c)))
          continue;
        l = a, n.type = i.ACCOUNT, n.number = c;
        break;
      } else
        continue;
    else if (r.includes("ac")) {
      const c = v(r);
      if (c === "")
        continue;
      l = a, n.type = i.ACCOUNT, n.number = c;
      break;
    }
  if (l === -1 && (n = I(e)), !n.type) {
    const a = e.find((r) => C.includes(r));
    a && (n.type = i.WALLET, n.name = a);
  }
  if (!n.type) {
    const a = m.filter((r) => r.type === i.ACCOUNT).find((r) => e.includes(r.word));
    n.type = (a == null ? void 0 : a.type) ?? null, n.name = (a == null ? void 0 : a.word) ?? null;
  }
  return n.number && n.number.length > 4 && (n.number = n.number.slice(-4)), n;
}, O = (t, e, l) => {
  let n = "", a = !1, r = 0, c = "", s = t;
  for (; s < l; ) {
    if (c = e[s], c >= "0" && c <= "9")
      a = !0, n += c;
    else if (a) {
      if (c === ".") {
        if (r === 1)
          break;
        n += c, r += 1;
      } else if (c !== ",")
        break;
    }
    s += 1;
  }
  return n;
}, R = (t, e = u.AVAILABLE) => {
  const n = `(${(e === u.AVAILABLE ? A : y).join("|")})`.replace("/", "\\/"), a = "([\\d]+\\.[\\d]+|[\\d]+)";
  let r = new RegExp(`${n}\\s*${a}`, "gi"), c = t.match(r);
  if (c && c.length > 0) {
    const s = c[0].split(" ").pop();
    return Number.isNaN(Number(s)) ? "" : s;
  }
  if (r = new RegExp(`${a}\\s*${n}`, "gi"), c = t.match(r), c && c.length > 0) {
    const s = c[0].split(" ")[0];
    return Number.isNaN(Number(s)) ? "" : s;
  }
  return null;
}, f = (t, e = u.AVAILABLE) => {
  const n = b(t).join(" ");
  let a = -1, r = "";
  const c = e === u.AVAILABLE ? A : y;
  for (const p of c)
    if (a = n.indexOf(p), a !== -1) {
      a += p.length;
      break;
    } else
      continue;
  let s = a, o = -1, d = n.substr(s, 3);
  for (s += 3; s < n.length; ) {
    if (d = d.slice(1), d += n[s], d === "rs.") {
      o = s + 2;
      break;
    }
    s += 1;
  }
  return o === -1 ? (r = R(n) ?? "", r ? g(r) : null) : (r = O(o, n, n.length), r ? g(r) : null);
}, w = (t) => {
  const e = b(t), l = e.join(" "), n = {
    merchant: null,
    referenceNo: null
  };
  if (e.includes("vpa")) {
    const r = e.indexOf("vpa");
    if (r < e.length - 1) {
      const c = e[r + 1], [s] = c.replaceAll(/\(|\)/gi, " ").split(" ");
      n.merchant = s;
    }
  }
  let a = "";
  for (let r = 0; r < N.length; r += 1) {
    const c = N[r];
    l.indexOf(c) > 0 && (a = c);
  }
  if (a) {
    const r = E(l, a);
    if (L(r))
      n.referenceNo = r;
    else if (n.merchant) {
      const [c] = r.split(/[^0-9]/gi).sort((s, o) => o.length - s.length)[0];
      c && (n.referenceNo = c);
    } else
      n.merchant = r;
  }
  return n;
}, B = (t) => {
  const l = b(t).indexOf("rs.");
  if (l === -1)
    return "";
  let n = t[l + 1];
  return n = n.replace(/,/g, ""), Number.isNaN(Number(n)) ? (n = t[l + 2], n = n == null ? void 0 : n.replace(/,/g, ""), Number.isNaN(Number(n)) ? "" : g(n)) : g(n);
}, D = (t) => {
  const e = /(?:credited|credit|deposited|added|received|refund|repayment)/gi, l = /(?:debited|debit|deducted)/gi, n = /(?:payment|spent|paid|used\s+at|charged|transaction\son|transaction\sfee|tran|booked|purchased|sent\s+to|purchase\s+of)/gi, a = typeof t != "string" ? t.join(" ") : t;
  return l.test(a) ? "debit" : e.test(a) ? "credit" : n.test(a) ? "debit" : null;
}, M = (t) => {
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
        referenceNo: null
      }
    };
  const e = h(t), l = x(e), n = f(
    e,
    u.AVAILABLE
  ), a = B(e), c = [n, a, l.number].filter(
    (p) => p !== ""
  ).length >= 2 ? D(e) : null, s = { available: n, outstanding: null };
  l && l.type === i.CARD && (s.outstanding = f(
    e,
    u.OUTSTANDING
  ));
  const { merchant: o, referenceNo: d } = w(t);
  return {
    account: l,
    balance: s,
    transaction: {
      type: c,
      amount: a,
      merchant: o,
      referenceNo: d
    }
  };
}, S = x, V = f, U = w;
export {
  i as IAccountType,
  u as IBalanceKeyWordsType,
  S as getAccountInfo,
  V as getBalanceInfo,
  U as getMerchantInfo,
  B as getTransactionAmount,
  M as getTransactionInfo,
  D as getTransactionType
};
