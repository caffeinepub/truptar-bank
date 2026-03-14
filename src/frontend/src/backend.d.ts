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
export interface SavingsAccountInfo {
    lastInterestCredited: string;
    balance: number;
    accountId: string;
    totalInterestEarned: number;
    createdAt: string;
    updatedAt: string;
    interestRate: number;
}
export interface BusinessPayment {
    date: string;
    recipient: string;
    description: string;
    amount: number;
}
export interface AdvisoryBooking {
    consultationTopic: string;
    name: string;
    businessType: string;
    preferredDate: string;
}
export interface BusinessAccount {
    incomingPayments: Array<BusinessPayment>;
    outgoingPayments: Array<BusinessPayment>;
    businessBalance: number;
}
export interface AccountApplication {
    fullName: string;
    email: string;
    accountType: string;
}
export interface LoanApplication {
    fullName: string;
    email: string;
    loanType: string;
    amount: number;
}
export interface BusinessLoanApplication {
    status: LoanStatus;
    businessName: string;
    businessType: string;
    submittedAt: string;
    loanAmountRequested: number;
    annualRevenue: number;
    loanPurpose: string;
}
export interface PayrollRecord {
    employeeName: string;
    salaryAmount: number;
    paymentDate: string;
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
export enum LoanStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminGetAdvisoryBookings(): Promise<Array<AdvisoryBooking>>;
    adminGetAllBusinessLoanApplications(): Promise<Array<[Principal, Array<BusinessLoanApplication>]>>;
    adminUpdateBusinessLoanStatus(appIndex: bigint, newStatus: LoanStatus, user: Principal): Promise<void>;
    applyForAccount(fullName: string, email: string, accountType: string): Promise<void>;
    applyForLoan(fullName: string, email: string, loanType: string, amount: number): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    creditMonthlyInterest(currentDate: string): Promise<number>;
    deposit(amount: number, description: string, date: string): Promise<void>;
    depositToSavings(amount: number, date: string): Promise<void>;
    getAccountApplications(): Promise<Array<AccountApplication>>;
    getBalance(): Promise<number>;
    getBusinessAccount(): Promise<BusinessAccount>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactForms(): Promise<Array<ContactFormSubmission>>;
    getLoanApplications(): Promise<Array<LoanApplication>>;
    getMyBusinessLoanApplications(): Promise<Array<BusinessLoanApplication>>;
    getPayrollHistory(): Promise<Array<PayrollRecord>>;
    getSavingsAccount(): Promise<SavingsAccountInfo | null>;
    getSavingsTransactions(): Promise<Array<Transaction>>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    openSavingsAccount(currentDate: string): Promise<SavingsAccountInfo>;
    processPayroll(employeeName: string, salaryAmount: number, paymentDate: string): Promise<void>;
    recordIncomingBusinessPayment(amount: number, from: string, date: string, description: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    scheduleAdvisoryMeeting(name: string, businessType: string, consultationTopic: string, preferredDate: string): Promise<void>;
    sendBusinessPayment(amount: number, recipient: string, date: string, description: string): Promise<void>;
    submitBusinessLoanApplication(businessName: string, businessType: string, annualRevenue: number, loanAmountRequested: number, loanPurpose: string, submittedAt: string): Promise<void>;
    submitContactForm(name: string, email: string, message: string): Promise<void>;
    transferFromSavings(amount: number, toAccountId: string, date: string): Promise<void>;
    withdraw(amount: number, description: string, date: string): Promise<void>;
    withdrawFromSavings(amount: number, date: string): Promise<void>;
}
