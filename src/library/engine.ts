import getAccount from "./account";
import getBalance from "./balance";
import {
  IAccountType,
  IBalance,
  IBalanceKeyWordsType,
  ITransactionInfo,
  TMessageType,
  TTransactionType,
  TMessageDetails,
} from "./interface";
import extractMerchantInfo from "./merchant";
import { getProcessedMessage, padCurrencyValue, processMessage } from "./utils";

export const getTransactionAmount = (message: TMessageType): string => {
  const processedMessage = getProcessedMessage(message);
  const index = processedMessage.indexOf("rs.");

  // If "rs." does not exist
  // Return ""
  if (index === -1) {
    return "";
  }
  let money = message[index + 1];

  money = money.replace(/,/g, "");

  // If data is false positive
  // Look ahead one index and check for valid money
  // Else return the found money
  if (Number.isNaN(Number(money))) {
    money = message[index + 2];
    money = money?.replace(/,/g, "");

    // If this is also false positive, return ""
    // Else return the found money
    if (Number.isNaN(Number(money))) {
      return "";
    }
    return padCurrencyValue(money);
  }
  return padCurrencyValue(money);
};

export const getTransactionType = (message: TMessageType): TTransactionType => {
  const creditPattern =
    /(?:credited|credit|deposited|received\srs|added|received|refund|repayment)/gi;
  const debitPattern = /(?:debited|debit|deducted)/gi;
  const miscPattern =
    /(?:payment|spent|paid|used\s+at|charged|sent\srs|transaction\son|transaction\sfee|tran|booked|purchased|sent\s+to|purchase\s+of)/gi;

  const messageStr = typeof message !== "string" ? message.join(" ") : message;

  if (debitPattern.test(messageStr)) {
    return "debit";
  }
  if (creditPattern.test(messageStr)) {
    return "credit";
  }
  if (miscPattern.test(messageStr)) {
    return "debit";
  }

  return null;
};

export const getTransactionDetails = (message: TMessageType): TMessageDetails => {
  const processedMessage = getProcessedMessage(message);
  let indices = [
    processedMessage.indexOf("to"),
    processedMessage.indexOf("by"),
    processedMessage.indexOf("from")
  ];
  for (let i = 0; i < indices.length; i++) {
    if (indices[i] != -1) {
      const details = message[indices[i] + 1];
      const ignore = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours',
        'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself',
        'yourselves', 'ac', 'sms', 'call',
        'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
        'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are',
        'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
        'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for',
        'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to',
        'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
        'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
        'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
        's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y',
        'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't",
        'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't",
        'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't", "kotak", "canara", "sbi", "au"];
      var regex = /^\d{10}$/;
      if (regex.test(details)) continue
      if (ignore.includes(details)) continue;
      return details;
    }
  }
  return null

}

export const getTransactionInfo = (message: string): ITransactionInfo => {
  if (!message || typeof message !== "string") {
    return {
      account: {
        type: null,
        number: null,
        name: null,
      },
      balance: null,
      transaction: {
        type: null,
        amount: null,
        merchant: null,
        referenceNo: null,
        detail: null
      },
    };
  }

  const processedMessage = processMessage(message);
  const account = getAccount(processedMessage);
  const availableBalance = getBalance(
    processedMessage,
    IBalanceKeyWordsType.AVAILABLE,
  );
  const transactionAmount = getTransactionAmount(processedMessage);
  const isValid =
    [availableBalance, transactionAmount, account.number].filter(
      (x) => x !== "",
    ).length >= 2;
  const transactionType = isValid ? getTransactionType(processedMessage) : null;
  const balance: IBalance = { available: availableBalance, outstanding: null };

  if (account && account.type === IAccountType.CARD) {
    balance.outstanding = getBalance(
      processedMessage,
      IBalanceKeyWordsType.OUTSTANDING,
    );
  }
  const detail = getTransactionDetails(processedMessage)

  const { merchant, referenceNo } = extractMerchantInfo(message);

  // console.log(account, balance, transactionAmount, transactionType);
  // console.log('-----------------------------------------------------');
  return {
    account,
    balance,
    transaction: {
      type: transactionType,
      amount: transactionAmount,
      merchant: merchant,
      referenceNo: referenceNo,
      detail: detail
    },
  };
};
