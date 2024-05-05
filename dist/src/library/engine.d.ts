import { ITransactionInfo, TMessageType, TTransactionType, TMessageDetails } from './interface';

export declare const getTransactionAmount: (message: TMessageType) => string;
export declare const getTransactionType: (message: TMessageType) => TTransactionType;
export declare const getTransactionDetails: (message: TMessageType) => TMessageDetails;
export declare const getTransactionInfo: (message: string) => ITransactionInfo;
