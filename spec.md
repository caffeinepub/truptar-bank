# TRUPTAR Bank

## Current State
- DashboardPage has an "Admin Approval Required" info banner on the checking account tab
- AdminPage fails to load Registered Users and Transaction Requests because both components call `useState(() => {...})` instead of `useEffect(() => {...}, [actor])` - a critical bug
- AdminPage dashboard overview (KPI stats: Total Users, Pending Requests, Active Accounts, Transactions Today, Recent Activity) uses 100% hardcoded mock data
- AdminPage Site Visitors section shows fake visitor logs, top pages, and bar chart with made-up numbers
- AdminPage User Management, Loans, KYC, Contacts, Account Opening, Transaction Monitor all use large hardcoded mock arrays
- ProfilePage fails to open (likely a crash or navigation issue)
- OpenAccountPage just submits a passive "application" that goes nowhere; it does not create a real banking account or assign the user role

## Requested Changes (Diff)

### Add
- AdminPage: Load dashboard KPI stats (Total Users, Pending Requests, Active Accounts) by calling `adminGetAllUsers()` and `adminGetPendingRequests()` from the backend on mount; compute counts from real data
- AdminPage: Recent Activity section should be derived from real pending requests (show most recent 10 pending/approved/rejected requests)
- AdminPage: User Management section should use real `adminGetAllUsers()` data instead of mockUsers
- AdminPage: Loans section should use real `getLoanApplications()` backend data
- AdminPage: Contacts section should use real `getContactForms()` backend data
- AdminPage: Account Opening Requests should use real `getAccountApplications()` backend data
- AdminPage: KYC section should derive KYC submissions from `adminGetAllUsers()` profiles (show users whose kycData.kycStatus is not empty)
- AdminPage: Transaction Monitor should use real `adminGetPendingRequests()` data
- OpenAccountPage: After form submission, automatically:
  1. Call `actor.assignCallerUserRole(principal, UserRole.user)` to register user
  2. Call `actor.saveCallerUserProfile(...)` with all submitted details populated into the profile schema
  3. Call `actor.getAccountInfo()` to retrieve their unique account number
  4. Show success state with their new account number
  5. Provide link to go to Dashboard or Profile to complete verification

### Modify
- DashboardPage: Remove the "Admin Approval Required" amber warning banner block from the checking account tab (keep all other content)
- AdminPage: Fix `useState(() => {...})` -> `useEffect(() => {...}, [actor])` bug in BOTH RegisteredUsers and TransactionRequests components so they actually load on mount
- AdminPage: Dashboard overview: Remove all hardcoded mock KPI numbers; replace with real computed values from backend data (loading states while fetching)
- AdminPage: Remove `recentActivity` mock array; replace Recent Activity feed with real data from pending requests (show type, amount, date, status)
- AdminPage: Site Visitors section: Remove ALL fake visitor log rows, fake top pages data, fake bar chart data. Show an empty state / zeroed stats. Add a note: "Visitor tracking is not yet configured. No data has been collected."
- AdminPage: Remove ALL other mock data arrays (mockUsers, mockLoans, mockKYC, mockContacts, mockAccountRequests, mockTransactions, visitorLog, topPages, dailyVisits) and replace the relevant sections with real backend calls
- ProfilePage: Fix whatever is causing it not to open - check for runtime crashes, fix null checks on actor/profile, ensure all hooks and state initialization are safe with default values

### Remove
- AdminPage: All mock/hardcoded data constants at the top of the file (mockUsers, mockLoans, mockKYC, mockContacts, mockAccountRequests, recentActivity, visitorLog, topPages, dailyVisits, etc.)
- DashboardPage: The approval notice `<div>` block with the amber AlertTriangle warning

## Implementation Plan
1. DashboardPage.tsx: Remove the 9-line amber approval notice block
2. AdminPage.tsx:
   a. Fix both `useState` -> `useEffect` bugs in RegisteredUsers and TransactionRequests
   b. Add a new `AdminDashboard` data loader that calls `adminGetAllUsers()` and `adminGetPendingRequests()` on mount; compute KPI stats from real data; show loading skeleton while fetching
   c. Replace Recent Activity with a real feed from pending requests data
   d. Replace User Management with real `adminGetAllUsers()` data - show principal (truncated), account number, balance, name from profile
   e. Replace Loans section with real `getLoanApplications()` data
   f. Replace Contacts section with real `getContactForms()` data
   g. Replace Account Opening section with real `getAccountApplications()` data
   h. Replace KYC section with users from `adminGetAllUsers()` that have KYC data
   i. Replace Transaction Monitor with `adminGetPendingRequests()` data (all statuses)
   j. Site Visitors: Clear all mock data, show zero-state with note
3. ProfilePage.tsx: Fix crash - ensure safe initialization of all state from profile store defaults, add error boundaries/null checks, fix any broken import or hook dependency
4. OpenAccountPage.tsx: Rewrite submit handler to: assign user role, save profile with form data, fetch account number, show success with account number and links to dashboard/profile
