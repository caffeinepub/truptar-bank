import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
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

  let accounts = Map.empty<Principal, BankAccount>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var contactForms = List.empty<ContactFormSubmission>();
  var accountApplications = List.empty<AccountApplication>();
  var loanApplications = List.empty<LoanApplication>();

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
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func deposit(amount : Float, description : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit");
    };
    if (amount <= 0) {
      Runtime.trap("Invalid deposit amount");
    };

    let account = getOrCreateAccount(caller);
    let newTransaction : Transaction = {
      date;
      description;
      amount;
      isDeposit = true;
    };

    account.transactions.add(newTransaction);
    account.balance := account.balance + amount;
  };

  public shared ({ caller }) func withdraw(amount : Float, description : Text, date : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can withdraw");
    };
    if (amount <= 0) {
      Runtime.trap("Invalid withdrawal amount");
    };

    let account = getOrCreateAccount(caller);

    if (account.balance < amount) {
      Runtime.trap("Insufficient funds");
    };

    let newTransaction : Transaction = {
      date;
      description;
      amount;
      isDeposit = false;
    };

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

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let submission : ContactFormSubmission = {
      name;
      email;
      message;
    };
    contactForms.add(submission);
  };

  public shared ({ caller }) func applyForAccount(fullName : Text, email : Text, accountType : Text) : async () {
    let application : AccountApplication = {
      fullName;
      email;
      accountType;
    };
    accountApplications.add(application);
  };

  public shared ({ caller }) func applyForLoan(fullName : Text, email : Text, loanType : Text, amount : Float) : async () {
    let application : LoanApplication = {
      fullName;
      email;
      loanType;
      amount;
    };
    loanApplications.add(application);
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
        let newAccount : BankAccount = {
          var balance = 5240.75;
          var transactions = List.empty<Transaction>();
        };
        accounts.add(caller, newAccount);
        newAccount;
      };
    };
  };
};
