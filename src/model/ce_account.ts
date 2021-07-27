import { AccountType, Status } from "../interface";

export interface CeAccount {
    id?: number,
    accountType: AccountType,
    address: string,
    email: string,
    twitter: string,
    web: string,
    display: string,
    accountDisplay: string,
    judgements: string,
    balance: string,
    balanceLock: string,
    bonded: string,
    reserved: string,
    democracyLock: string,
    electionLock: string,
    unbonding: string,
    isCouncilMember: Status,
    isEvmContract: Status,
    isRegistrar: Status,
    isTechcommMember: Status,
    legal: number,
    nonce: number,
}

