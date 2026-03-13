import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactFormSubmission {
    name: string;
    email: string;
    message: string;
}
export interface LoanApplication {
    fullName: string;
    email: string;
    loanType: string;
    amount: number;
}
export interface AccountApplication {
    fullName: string;
    email: string;
    accountType: string;
}
export interface UserProfile {
    name: string;
}
export interface Transaction {
    date: string;
    description: string;
    isDeposit: boolean;
    amount: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyForAccount(fullName: string, email: string, accountType: string): Promise<void>;
    applyForLoan(fullName: string, email: string, loanType: string, amount: number): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deposit(amount: number, description: string, date: string): Promise<void>;
    getAccountApplications(): Promise<Array<AccountApplication>>;
    getBalance(): Promise<number>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactForms(): Promise<Array<ContactFormSubmission>>;
    getLoanApplications(): Promise<Array<LoanApplication>>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(name: string, email: string, message: string): Promise<void>;
    withdraw(amount: number, description: string, date: string): Promise<void>;
}
