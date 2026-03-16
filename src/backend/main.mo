import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    personalInfo : {
      firstName : Text;
      lastName : Text;
      fullName : Text;
      dob : Text;
      gender : Text;
      country : Text;
      city : Text;
      address : Text;
      postalCode : Text;
    };
    username : Text;
    contactInfo : {
      email : Text;
      phone : Text;
      countryCode : Text;
    };
    emailVerified : Bool;
    kycData : {
      country : Text;
      dob : Text;
      idNumber : Text;
      idType : Text;
      kycStatus : Text;
    };
    preferences : {
      notifTransactions : Bool;
      notifSecurity : Bool;
      notifPromo : Bool;
      language : Text;
    };
    twoFAMethod : Text;
    twoFAEnabled : Bool;
    totpSecret : Text;
    emailTwoFAEnabled : Bool;
  };

  type Transaction = {
    date : Text;
    description : Text;
    amount : Float;
    isDeposit : Bool;
  };

  type BankAccount = {
    var balance : Float;
    var transactions : List.List<Transaction>;
  };

  type SavingsAccount = {
    accountId : Text;
    var balance : Float;
    interestRate : Float;
    var lastInterestCredited : Text;
    var totalInterestEarned : Float;
    var updatedAt : Text;
    createdAt : Text;
    var transactions : List.List<Transaction>;
  };

  public type SavingsAccountInfo = {
    accountId : Text;
    balance : Float;
    interestRate : Float;
    lastInterestCredited : Text;
    totalInterestEarned : Float;
    updatedAt : Text;
    createdAt : Text;
  };

  type ContactFormSubmission = {
    name : Text;
    email : Text;
    message : Text;
  };

  type AccountApplication = {
    fullName : Text;
    email : Text;
    accountType : Text;
  };

  type LoanApplication = {
    fullName : Text;
    email : Text;
    loanType : Text;
    amount : Float;
  };

  type MutableBusinessAccount = {
    var businessBalance : Float;
    var incomingPayments : List.List<BusinessPayment>;
    var outgoingPayments : List.List<BusinessPayment>;
  };

  public type BusinessAccount = {
    businessBalance : Float;
    incomingPayments : [BusinessPayment];
    outgoingPayments : [BusinessPayment];
  };

  public type BusinessPayment = {
    amount : Float;
    recipient : Text;
    date : Text;
    description : Text;
  };

  public type BusinessLoanApplication = {
    businessName : Text;
    businessType : Text;
    annualRevenue : Float;
    loanAmountRequested : Float;
    loanPurpose : Text;
    status : LoanStatus;
    submittedAt : Text;
  };

  public type LoanStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type PayrollRecord = {
    employeeName : Text;
    salaryAmount : Float;
    paymentDate : Text;
  };

  public type AdvisoryBooking = {
    name : Text;
    businessType : Text;
    consultationTopic : Text;
    preferredDate : Text;
  };

  public type RequestType = {
    #deposit;
    #withdrawal;
  };

  public type RequestStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type PendingRequest = {
    requestId : Text;
    owner : Principal;
    requestType : RequestType;
    amount : Float;
    description : Text;
    date : Text;
    status : RequestStatus;
  };

  public type AccountInfo = {
    accountNumber : Text;
    balance : Float;
  };

  public type AdminUserRecord = {
    principal : Principal;
    accountNumber : Text;
    balance : Float;
    profile : ?UserProfile;
  };

  let accounts = Map.empty<Principal, BankAccount>();
  let savingsAccounts = Map.empty<Principal, SavingsAccount>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accountNumbers = Map.empty<Principal, Text>();
  var contactForms = List.empty<ContactFormSubmission>();
  var accountApplications = List.empty<AccountApplication>();
  var loanApplications = List.empty<LoanApplication>();
  let businessAccounts = Map.empty<Principal, MutableBusinessAccount>();
  let businessLoanApplications = Map.empty<Principal, List.List<BusinessLoanApplication>>();
  let payrollRecords = Map.empty<Principal, List.List<PayrollRecord>>();
  let advisoryBookings = Map.empty<Text, List.List<AdvisoryBooking>>();
  var pendingRequests = List.empty<PendingRequest>();
  var requestCounter : Nat = 0;

  // --- Account Number Generation ---

  func generateAccountNumber(caller : Principal) : Text {
    // Derive a 10-digit account number from principal bytes
    let bytes = caller.toBlob();
    var hash : Nat = 0;
    for (b in bytes.values()) {
      hash := (hash * 31 + b.toNat()) % 9000000000;
    };
    hash := hash + 1000000000; // ensure 10 digits
    hash.toText();
  };

  func getOrCreateAccountNumber(caller : Principal) : Text {
    switch (accountNumbers.get(caller)) {
      case (?num) { num };
      case (null) {
        let num = generateAccountNumber(caller);
        accountNumbers.add(caller, num);
        num;
      };
    };
  };

  public query ({ caller }) func getAccountInfo() : async AccountInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view account info");
    };
    let account = getOrCreateAccount(caller);
    let accountNumber = getOrCreateAccountNumber(caller);
    { accountNumber; balance = account.balance };
  };

  // --- Pending Requests ---

  public shared ({ caller }) func requestDeposit(amount : Float, description : Text, date : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request deposits");
    };
    if (amount <= 0) { Runtime.trap("Invalid deposit amount") };
    requestCounter += 1;
    let requestId = "REQ-" # requestCounter.toText();
    let req : PendingRequest = {
      requestId;
      owner = caller;
      requestType = #deposit;
      amount;
      description;
      date;
      status = #pending;
    };
    pendingRequests.add(req);
    requestId;
  };

  public shared ({ caller }) func requestWithdrawal(amount : Float, description : Text, date : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };
    if (amount <= 0) { Runtime.trap("Invalid withdrawal amount") };
    let account = getOrCreateAccount(caller);
    if (account.balance < amount) { Runtime.trap("Insufficient funds") };
    requestCounter += 1;
    let requestId = "REQ-" # requestCounter.toText();
    let req : PendingRequest = {
      requestId;
      owner = caller;
      requestType = #withdrawal;
      amount;
      description;
      date;
      status = #pending;
    };
    pendingRequests.add(req);
    requestId;
  };

  public query ({ caller }) func getPendingRequests() : async [PendingRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    let result = List.empty<PendingRequest>();
    for (req in pendingRequests.values()) {
      if (req.owner == caller) { result.add(req) };
    };
    result.toArray();
  };

  public shared ({ caller }) func adminConfirmRequest(requestId : Text, approve : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can confirm requests");
    };
    let updated = List.empty<PendingRequest>();
    var found = false;
    for (req in pendingRequests.values()) {
      if (req.requestId == requestId and req.status == #pending) {
        found := true;
        let newStatus : RequestStatus = if (approve) #approved else #rejected;
        updated.add({ req with status = newStatus });
        if (approve) {
          let account = getOrCreateAccount(req.owner);
          switch (req.requestType) {
            case (#deposit) {
              let t : Transaction = { date = req.date; description = req.description; amount = req.amount; isDeposit = true };
              account.transactions.add(t);
              account.balance := account.balance + req.amount;
            };
            case (#withdrawal) {
              if (account.balance >= req.amount) {
                let t : Transaction = { date = req.date; description = req.description; amount = req.amount; isDeposit = false };
                account.transactions.add(t);
                account.balance := account.balance - req.amount;
              };
            };
          };
        };
      } else {
        updated.add(req);
      };
    };
    if (not found) { Runtime.trap("Request not found or already processed") };
    pendingRequests := updated;
  };

  public query ({ caller }) func adminGetPendingRequests() : async [PendingRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending requests");
    };
    pendingRequests.toArray();
  };

  public query ({ caller }) func adminGetAllUsers() : async [AdminUserRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    let results = List.empty<AdminUserRecord>();
    // Collect all principals that have accounts or profiles
    let seen = Map.empty<Principal, Bool>();
    for ((p, _) in accounts.entries()) { seen.add(p, true) };
    for ((p, _) in userProfiles.entries()) { seen.add(p, true) };
    for ((p, _) in seen.entries()) {
      let accountNumber = switch (accountNumbers.get(p)) {
        case (?n) { n };
        case (null) { "N/A" };
      };
      let balance = switch (accounts.get(p)) {
        case (?acc) { acc.balance };
        case (null) { 0.0 };
      };
      let profile = userProfiles.get(p);
      results.add({ principal = p; accountNumber; balance; profile });
    };
    results.toArray();
  };

  // --- Profile ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    // Ensure account number is assigned on first profile save
    ignore getOrCreateAccountNumber(caller);
    userProfiles.add(caller, profile);
  };

  // --- Checking Account ---

  public shared ({ caller }) func deposit(amount : Float, description : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit");
    };
    if (amount <= 0) {
      Runtime.trap("Invalid deposit amount");
    };
    let account = getOrCreateAccount(caller);
    let newTransaction : Transaction = { date; description; amount; isDeposit = true };
    account.transactions.add(newTransaction);
    account.balance := account.balance + amount;
  };

  public shared ({ caller }) func withdraw(amount : Float, description : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can withdraw");
    };
    if (amount <= 0) { Runtime.trap("Invalid withdrawal amount") };
    let account = getOrCreateAccount(caller);
    if (account.balance < amount) { Runtime.trap("Insufficient funds") };
    let newTransaction : Transaction = { date; description; amount; isDeposit = false };
    account.transactions.add(newTransaction);
    account.balance := account.balance - amount;
  };

  public query ({ caller }) func getBalance() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };
    getOrCreateAccount(caller).balance;
  };

  public query ({ caller }) func getTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };
    getOrCreateAccount(caller).transactions.toArray();
  };

  // --- Savings Account ---

  public shared ({ caller }) func openSavingsAccount(currentDate : Text) : async SavingsAccountInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (savingsAccounts.get(caller)) {
      case (?existing) {
        { accountId = existing.accountId; balance = existing.balance; interestRate = existing.interestRate;
          lastInterestCredited = existing.lastInterestCredited; totalInterestEarned = existing.totalInterestEarned;
          updatedAt = existing.updatedAt; createdAt = existing.createdAt };
      };
      case (null) {
        let pid = caller.toText();
        let accountId = "SAV-" # Text.fromIter(pid.chars().take(8));
        let newAcc : SavingsAccount = {
          accountId;
          var balance = 0.0;
          interestRate = 0.035;
          var lastInterestCredited = "None";
          var totalInterestEarned = 0.0;
          var updatedAt = currentDate;
          createdAt = currentDate;
          var transactions = List.empty<Transaction>();
        };
        savingsAccounts.add(caller, newAcc);
        { accountId; balance = 0.0; interestRate = 0.035; lastInterestCredited = "None";
          totalInterestEarned = 0.0; updatedAt = currentDate; createdAt = currentDate };
      };
    };
  };

  public query ({ caller }) func getSavingsAccount() : async ?SavingsAccountInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (savingsAccounts.get(caller)) {
      case (?acc) {
        ?{ accountId = acc.accountId; balance = acc.balance; interestRate = acc.interestRate;
           lastInterestCredited = acc.lastInterestCredited; totalInterestEarned = acc.totalInterestEarned;
           updatedAt = acc.updatedAt; createdAt = acc.createdAt };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func depositToSavings(amount : Float, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    if (amount <= 0) { Runtime.trap("Invalid amount") };
    let acc = getOrCreateSavings(caller, date);
    acc.transactions.add({ date; description = "Deposit"; amount; isDeposit = true });
    acc.balance := acc.balance + amount;
    acc.updatedAt := date;
  };

  public shared ({ caller }) func withdrawFromSavings(amount : Float, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    if (amount <= 0) { Runtime.trap("Invalid amount") };
    let acc = getOrCreateSavings(caller, date);
    if (acc.balance < amount) { Runtime.trap("Insufficient funds") };
    acc.transactions.add({ date; description = "Withdrawal"; amount; isDeposit = false });
    acc.balance := acc.balance - amount;
    acc.updatedAt := date;
  };

  public query ({ caller }) func getSavingsTransactions() : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (savingsAccounts.get(caller)) {
      case (?acc) { acc.transactions.toArray() };
      case (null) { [] : [Transaction] };
    };
  };

  public shared ({ caller }) func transferFromSavings(amount : Float, toAccountId : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    if (amount <= 0) { Runtime.trap("Invalid amount") };
    let acc = getOrCreateSavings(caller, date);
    if (acc.balance < amount) { Runtime.trap("Insufficient savings") };
    acc.transactions.add({ date; description = "Transfer to " # toAccountId; amount; isDeposit = false });
    acc.balance := acc.balance - amount;
    acc.updatedAt := date;
    // Credit the checking account
    let checkingAccount = getOrCreateAccount(caller);
    checkingAccount.transactions.add({ date; description = "Transfer from savings"; amount; isDeposit = true });
    checkingAccount.balance := checkingAccount.balance + amount;
  };

  public shared ({ caller }) func creditMonthlyInterest(currentDate : Text) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (savingsAccounts.get(caller)) {
      case (?acc) {
        let interest = acc.balance * (acc.interestRate / 12.0);
        if (interest > 0) {
          acc.transactions.add({ date = currentDate; description = "Monthly Interest"; amount = interest; isDeposit = true });
          acc.balance := acc.balance + interest;
          acc.totalInterestEarned := acc.totalInterestEarned + interest;
          acc.lastInterestCredited := currentDate;
          acc.updatedAt := currentDate;
        };
        interest;
      };
      case (null) { 0.0 };
    };
  };

  // --- Business Account ---

  public query ({ caller }) func getBusinessAccount() : async BusinessAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view business accounts");
    };
    let account = getOrCreateBusinessAccount(caller);
    {
      businessBalance = account.businessBalance;
      incomingPayments = account.incomingPayments.toArray();
      outgoingPayments = account.outgoingPayments.toArray();
    };
  };

  public shared ({ caller }) func sendBusinessPayment(amount : Float, recipient : Text, date : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send business payments");
    };
    if (amount <= 0.0) {
      Runtime.trap("Invalid payment amount");
    };
    let account = getOrCreateBusinessAccount(caller);
    if (account.businessBalance < amount) {
      Runtime.trap("Insufficient business balance");
    };
    let payment : BusinessPayment = { amount; recipient; date; description };
    account.outgoingPayments.add(payment);
    account.businessBalance := account.businessBalance - amount;
  };

  public shared ({ caller }) func recordIncomingBusinessPayment(amount : Float, from : Text, date : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record incoming payments");
    };
    if (amount <= 0.0) {
      Runtime.trap("Invalid payment amount");
    };
    let account = getOrCreateBusinessAccount(caller);
    let payment : BusinessPayment = { amount; recipient = from; date; description };
    account.incomingPayments.add(payment);
    account.businessBalance := account.businessBalance + amount;
  };

  public shared ({ caller }) func submitBusinessLoanApplication(
    businessName : Text,
    businessType : Text,
    annualRevenue : Float,
    loanAmountRequested : Float,
    loanPurpose : Text,
    submittedAt : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit loan applications");
    };
    let application : BusinessLoanApplication = {
      businessName;
      businessType;
      annualRevenue;
      loanAmountRequested;
      loanPurpose;
      status = #pending;
      submittedAt;
    };
    let currentApps = switch (businessLoanApplications.get(caller)) {
      case (?apps) { apps };
      case (null) { List.empty<BusinessLoanApplication>() };
    };
    currentApps.add(application);
    businessLoanApplications.add(caller, currentApps);
  };

  public query ({ caller }) func getMyBusinessLoanApplications() : async [BusinessLoanApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (businessLoanApplications.get(caller)) {
      case (?apps) { apps.toArray() };
      case (null) { [] : [BusinessLoanApplication] };
    };
  };

  public shared ({ caller }) func adminUpdateBusinessLoanStatus(appIndex : Nat, newStatus : LoanStatus, user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update loan status");
    };

    switch (businessLoanApplications.get(user)) {
      case (?userApps) {
        if (appIndex >= userApps.size()) {
          Runtime.trap("Application index out of bounds");
        };

        let updatedApps = List.empty<BusinessLoanApplication>();
        var currentIndex = 0;

        for (app in userApps.values()) {
          if (currentIndex == appIndex) {
            updatedApps.add({ app with status = newStatus });
          } else {
            updatedApps.add(app);
          };
          currentIndex += 1;
        };

        businessLoanApplications.add(user, updatedApps);
      };
      case (null) { Runtime.trap("No applications found for user") };
    };
  };

  public query ({ caller }) func adminGetAllBusinessLoanApplications() : async [(Principal, [BusinessLoanApplication])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all loan applications");
    };
    businessLoanApplications.entries().map<(Principal, List.List<BusinessLoanApplication>), (Principal, [BusinessLoanApplication])>(
      func((user, apps)) { (user, apps.toArray()) }
    ).toArray();
  };

  public shared ({ caller }) func processPayroll(employeeName : Text, salaryAmount : Float, paymentDate : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can process payroll");
    };
    let businessAccount = getOrCreateBusinessAccount(caller);
    if (businessAccount.businessBalance < salaryAmount) {
      Runtime.trap("Insufficient business balance");
    };
    let payrollRecord : PayrollRecord = {
      employeeName;
      salaryAmount;
      paymentDate;
    };
    let currentRecords = switch (payrollRecords.get(caller)) {
      case (?records) { records };
      case (null) { List.empty<PayrollRecord>() };
    };
    currentRecords.add(payrollRecord);
    payrollRecords.add(caller, currentRecords);
    businessAccount.businessBalance := businessAccount.businessBalance - salaryAmount;
  };

  public query ({ caller }) func getPayrollHistory() : async [PayrollRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (payrollRecords.get(caller)) {
      case (?records) { records.toArray() };
      case (null) { [] : [PayrollRecord] };
    };
  };

  public shared func scheduleAdvisoryMeeting(
    name : Text,
    businessType : Text,
    consultationTopic : Text,
    preferredDate : Text,
  ) : async () {
    // No authorization check - allows guests to schedule advisory meetings
    let booking : AdvisoryBooking = {
      name;
      businessType;
      consultationTopic;
      preferredDate;
    };
    let currentBookings = switch (advisoryBookings.get(businessType)) {
      case (?bookings) { bookings };
      case (null) { List.empty<AdvisoryBooking>() };
    };
    currentBookings.add(booking);
    advisoryBookings.add(businessType, currentBookings);
  };

  public query ({ caller }) func adminGetAdvisoryBookings() : async [AdvisoryBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view advisory bookings");
    };
    let allBookings = List.empty<AdvisoryBooking>();
    for ((businessType, bookings) in advisoryBookings.entries()) {
      allBookings.addAll(bookings.values());
    };
    allBookings.toArray();
  };

  // --- Forms ---

  public shared func submitContactForm(name : Text, email : Text, message : Text) : async () {
    // No authorization check - allows guests to submit contact forms
    contactForms.add({ name; email; message });
  };

  public shared func applyForAccount(fullName : Text, email : Text, accountType : Text) : async () {
    // No authorization check - allows guests to apply for accounts
    accountApplications.add({ fullName; email; accountType });
  };

  public shared func applyForLoan(fullName : Text, email : Text, loanType : Text, amount : Float) : async () {
    // No authorization check - allows guests to apply for loans
    loanApplications.add({ fullName; email; loanType; amount });
  };

  public query ({ caller }) func getContactForms() : async [ContactFormSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact forms");
    };
    contactForms.toArray();
  };

  public query ({ caller }) func getAccountApplications() : async [AccountApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view account applications");
    };
    accountApplications.toArray();
  };

  public query ({ caller }) func getLoanApplications() : async [LoanApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view loan applications");
    };
    loanApplications.toArray();
  };

  func getOrCreateAccount(caller : Principal) : BankAccount {
    switch (accounts.get(caller)) {
      case (?account) { account };
      case (null) {
        // Ensure account number is assigned
        ignore getOrCreateAccountNumber(caller);
        let newAccount : BankAccount = {
          var balance = 0.0;
          var transactions = List.empty<Transaction>();
        };
        accounts.add(caller, newAccount);
        newAccount;
      };
    };
  };

  func getOrCreateSavings(caller : Principal, date : Text) : SavingsAccount {
    switch (savingsAccounts.get(caller)) {
      case (?acc) { acc };
      case (null) {
        let pid = caller.toText();
        let accountId = "SAV-" # Text.fromIter(pid.chars().take(8));
        let newAcc : SavingsAccount = {
          accountId;
          var balance = 0.0;
          interestRate = 0.035;
          var lastInterestCredited = "None";
          var totalInterestEarned = 0.0;
          var updatedAt = date;
          createdAt = date;
          var transactions = List.empty<Transaction>();
        };
        savingsAccounts.add(caller, newAcc);
        newAcc;
      };
    };
  };

  func getOrCreateBusinessAccount(caller : Principal) : MutableBusinessAccount {
    switch (businessAccounts.get(caller)) {
      case (?account) { account };
      case (null) {
        let newAccount : MutableBusinessAccount = {
          var businessBalance = 0.0;
          var incomingPayments = List.empty<BusinessPayment>();
          var outgoingPayments = List.empty<BusinessPayment>();
        };
        businessAccounts.add(caller, newAccount);
        newAccount;
      };
    };
  };
};
