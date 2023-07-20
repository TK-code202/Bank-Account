// Business Logic for BankAccount ---------
function BankAccount() {
    this.accounts = {};
    this.currentId = 2023000;
}

BankAccount.prototype.assignId = function () {
    this.currentId += 1;
    return this.currentId;
};

BankAccount.prototype.addAccounts = function (account) {
    account.id = this.assignId();
    this.accounts[account.id] = account;
};


BankAccount.prototype.findAccount = function (id) {
    if (this.accounts[id] != undefined) {
        return this.accounts[id];
    }
    return false;
};




BankAccount.prototype.deleteAccount = function (id) {
    if (this.accounts[id] === undefined) {
        return false;
    }
    delete this.accounts[id];
    return true;
};




// Business Logic for Accounts ---------
function Account(name, balance, type) {
    this.name = name;
    this.balance = balance;
    this.type = type;
    this.history = ['Deposit: ₦ '+ balance]
}

Account.prototype.depositMoney = function (amount) {
    let initial = parseInt(this.balance);
    let deposit = parseInt(amount);
    this.balance = deposit + initial;
    let recent = ", Credit: ₦ " + amount;
    this.history.push(recent);
}

Account.prototype.withdrawMoney = function (amount) { 
    let initial = parseInt(this.balance);
    let withdrawal = parseInt(amount);
    this.balance = initial - withdrawal;
    let recent = ", Debit: ₦ " + amount;
    this.history.push(recent);
}



// User Interface Logic ---------
let bankAccount = new BankAccount();

function displayAccountDetails(bankAccountToDisplay) {
    let accountsList = $("ul#accountsList");
    let htmlForAccountInfo = "";
    Object.keys(bankAccountToDisplay.accounts).forEach(function (key) {
        const account = bankAccountToDisplay.findAccount(key);
        htmlForAccountInfo += "<li id=" + account.id + ">" + account.name +"  </li> ";
    });
    accountsList.html(htmlForAccountInfo);
}


function showAccount(accountId) {
    const account = bankAccount.findAccount(accountId);
    $(".account-info").fadeIn(1000);
    $(".account-name").html(account.name);
    $(".current-balance").html(account.balance);
    $(".account-type").html(account.type);
    $(".account-id").html(account.id);
    $(".history").html(account.history);
    let buttons = $("#buttons");
    buttons.empty();
    buttons.append("<button class='deleteButton' id=" +  account.id + ">Delete Account</button>");

}

function attachTaskListeners() {
    $("ul#accountsList").on("click", "li", function () {
        showAccount(this.id);
    });

    $("#buttons").on("click", ".deleteButton", function () {
        bankAccount.deleteAccount(this.id);
        $(".account-info").hide();
        displayAccountDetails(bankAccount);
    });
}

function Deposit(accountId, amount) {
    const account = bankAccount.findAccount(accountId);
    account.depositMoney(amount);
    showAccount(accountId);
}

function Withdraw(accountId, amount) {
    const account = bankAccount.findAccount(accountId);
    let initial = parseInt(account.balance);
    let withdrawal = parseInt(amount);
    if (withdrawal > initial) {
        $("#failure-alert").show();
    } else {
        account.withdrawMoney(amount);
        showAccount(accountId);
        $("#success-alert").show();
    };
    
}

function Transfer (accountIdOne, accountIdTwo, amount) {
    const accountOne = bankAccount.findAccount(accountIdOne);
    let senderBalance = parseInt(accountOne.balance);
    let payment = parseInt(amount);

    if (payment > senderBalance ) {
        $("#failure-alert").show();
    } else {
        Withdraw(accountIdOne, amount);
        Deposit(accountIdTwo, amount);
    }
} 

$(document).ready(function () {
    attachTaskListeners();
    $("form#formOne").submit(function (event) {
        event.preventDefault();
        const inputtedName = $("input#full-name").val();
        const inputtedDeposit = $("input#deposit").val();
        const inputtedType = $("select#type").val();

        $("input#full-name").val("");
        $("input#pin").val("");
        $("input#pin02").val("");
        $("input#deposit").val("");
        $("select#type").val("");

        let newAccount = new Account(inputtedName, inputtedDeposit, inputtedType);
        bankAccount.addAccounts(newAccount);
        displayAccountDetails(bankAccount);
        $("#welcome-alert").show();
    });



    $("form.formDeposit").submit(function (event) {
        event.preventDefault();
        const inputtedAccount = $("input#depositAccount").val();
        const inputtedDeposit = $("input#depositAmount").val();

        
        $("input#depositAccount").val("");
        $("input#pin03").val("");
        $("input#depositAmount").val("");

        Deposit(inputtedAccount, inputtedDeposit);
        $("#success-alert").show();
    });

    $("form.formWithdrawal").submit(function (event) {
        event.preventDefault();
        const inputtedAccount = $("input#withdrawalAccount").val();
        const inputtedDeposit = $("input#withdrawalAmount").val();

        
        $("input#withdrawalAccount").val("");
        $("input#pin04").val("");
        $("input#withdrawalAmount").val("");

        Withdraw(inputtedAccount, inputtedDeposit);
    });

    $("form.formTransfer").submit(function (event) {
        event.preventDefault();
        const inputtedAccountOne = $("input#senderAccount").val();
        const inputtedAccountTwo = $("input#recipientAccount").val();
        const inputtedTransfer = $("input#transferAmount").val();

        
        $("input#senderAccount").val("");
        $("input#pin05").val("");
        $("input#recipientAccount").val("");
        $("input#transferAmount").val("");

        Transfer(inputtedAccountOne, inputtedAccountTwo, inputtedTransfer);
    });



    //UI Toggle Buttons
    $(".btn-close").click(function() {
        $(".alert").hide();
    });

    $("#depositView").click(function() {
        $(".formDeposit").show();
        $(".formWithdrawal").hide();
        $(".formTransfer").hide();
        
    });

    $("#withdrawalView").click(function() {
        $(".formDeposit").hide();
        $(".formWithdrawal").show();
        $(".formTransfer").hide();
        
    });

    $("#transferView").click(function() {
        $(".formDeposit").hide();
        $(".formWithdrawal").hide();
        $(".formTransfer").show();
        
    });

});
