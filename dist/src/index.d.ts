export * from './library/engine';
export * from './library/interface';
export declare const getAccountInfo: (message: import('./library/interface').TMessageType) => import('./library/interface').IAccountInfo;
export declare const getBalanceInfo: (message: import('./library/interface').TMessageType, keyWordType?: import('./library/interface').IBalanceKeyWordsType) => string | null;
export declare const getMerchantInfo: (message: import('./library/interface').TMessageType) => {
    merchant: string | null;
    referenceNo: string | null;
};
