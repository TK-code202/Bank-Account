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

// Account.prototype.accountName = function () {
//     return this.name;
// };

// function storeHistory (accountId){
//     const account = bankAccount.findAccount(accountId);
//     account.history.push(account.balance);
//     $(".history").html(account.history);
// }






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

    // $("#tickbox").on("click", ".checked", function () {
    //     let completed = toDoList.markAsCompleted(this.id);
    //     $(".task-status").html(completed);
       
        
    // });

    $("#buttons").on("click", ".deleteButton", function () {
        bankAccount.deleteAccount(this.id);
        $(".account-info").hide();
        displayAccountDetails(bankAccount);
    });
}

function Deposit(accountId, amount) {
    const account = bankAccount.findAccount(accountId);
    let initial = parseInt(account.balance);
    let deposit = parseInt(amount);
    account.balance = deposit + initial;
    let newHistory = ", Credit: ₦ " + amount;
    account.history.push(newHistory);
    showAccount(accountId);
}

function Withdraw(accountId, amount) {
    const account = bankAccount.findAccount(accountId);
    let initial = parseInt(account.balance);
    let withdrawal = parseInt(amount);
    if (withdrawal > initial) {
        $("#failure-alert").show();
    } else {
        account.balance = initial - withdrawal;
        let newHistory = ", Debit: ₦ " + amount;
        account.history.push(newHistory);
        showAccount(accountId);
        $("#success-alert").show();
    };
    
}

function Transfer (accountIdOne, accountIdTwo, amount) {
    const accountOne = bankAccount.findAccount(accountIdOne);
    // const accountTwo = bankAccount.findAccount(accountIdTwo);
    let sender = parseInt(accountOne.balance);
    let payment = parseInt(amount);

    if (payment > sender ) {
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
        $("input#deposit").val("");
        $("select#type").val("");

        let newAccount = new Account(inputtedName, inputtedDeposit, inputtedType);
        bankAccount.addAccounts(newAccount);
        displayAccountDetails(bankAccount);
        $("#welcome-alert").show();
        // console.log(bankAccount.tasks);
    });



    $("form.formDeposit").submit(function (event) {
        event.preventDefault();
        const inputtedAccount = $("input#depositAccount").val();
        const inputtedDeposit = $("input#depositAmount").val();

        
        $("input#depositAccount").val("");
        $("input#depositAmount").val("");

        Deposit(inputtedAccount, inputtedDeposit);
        // displayAccountDetails(bankAccount);
        $("#success-alert").show();
    });

    $("form.formWithdrawal").submit(function (event) {
        event.preventDefault();
        const inputtedAccount = $("input#withdrawalAccount").val();
        const inputtedDeposit = $("input#withdrawalAmount").val();

        
        $("input#withdrawalAccount").val("");
        $("input#withdrawalAmount").val("");

        Withdraw(inputtedAccount, inputtedDeposit);
        // displayAccountDetails(bankAccount);
    });

    $("form.formTransfer").submit(function (event) {
        event.preventDefault();
        const inputtedAccountOne = $("input#senderAccount").val();
        const inputtedAccountTwo = $("input#recipientAccount").val();
        const inputtedTransfer = $("input#transferAmount").val();

        
        $("input#senderAccount").val("");
        $("input#recipientAccount").val("");
        $("input#transferAmount").val("");

        Transfer(inputtedAccountOne, inputtedAccountTwo, inputtedTransfer);
        displayAccountDetails(bankAccount);
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
