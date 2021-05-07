import Customer from './Customer';
import CustomerMonthlyReward from './CustomerMonthlyReward';


/** REWARDS INOUT */
const argCount = 4;
const maxTransactionAmount = 1000000;

/** IN:Plaintext representation of transaction data from text area to be parsed
 * OUT:Internal representation of transaction data to be operated on
 */
export function checkDate(dateString) {
  var dateArray = dateString.split("/");
  if (dateArray.length !== 3) {
    throw new Error('Invalid date in entry:');
  }
  let month = parseInt(dateArray[0].trim());
  let day = parseInt(dateArray[1].trim());
  let year = dateArray[2].trim();

  if (isNaN(month) || isNaN(year) || isNaN(day) || !(month < 13 && month > 0) || !(day < 32 && day > 0)) {
    throw new Error('Invalid date in entry:');
  }

  return true;
}
export function checkAmount(amount) {
  if (isNaN(amount)) {
    throw new Error('Invalid transaction amount:');
  }
  if (!(amount >= 0 && amount < maxTransactionAmount)){
    throw new Error('Transaction amount out of range (Maximum 1000000):');
  }
  return true;
}
export function check(values, line) {
  var pass = true;
  try {
    if (values.length !== argCount) {
      throw new Error ('Missing entries or formatting in entry:')
    }
    checkDate(values[3].trim());
    checkAmount(values[2].trim());

  } catch (e) {
      alert(e.message + "\n\"" + line + "\"");
    pass = false;
  } finally {
    return pass;
  }
}

export function generateLedger(inputText) {
  if (inputText === "") {
    alert("Please provide transaction data.");
    return [];
  }
  var localLedger = [];
    var lines = inputText.split('\n');

    for (let id in lines) {
      if (lines[id]) {
        var values = lines[id].split(',');

        if (check(values, lines[id])) {
          var date = values[3].split("/");
          let month = parseInt(date[0].trim());
          let year = date[2].trim();
          let amount = values[2].trim();

          var transaction = {
            transactionId: values[0].trim(), 
            customerId: values[1].trim(), 
            transactionAmount: amount, 
            date: month,
            year: year
          };
        } else {
          return;
        }
          
        localLedger.push(transaction);
      }
    }
  return localLedger;
}


/** REWARDS CALC */

/** Iterate through ledger and prepare a list of customer IDs */
export function generateCustomerList(ledger) {
    var localCustomerList = [];
    for (let id in ledger) {
      if (localCustomerList.some(item => item === ledger[id].customerId)) {
        /** do nothing */
      }
      else {
        localCustomerList.push(ledger[id].customerId);
      }
    }
    return localCustomerList;
  }

/** Iterate through identified customers, prepare the division of transactions pertinent to them, to be operated upon in CustomerRewards */
export function generateCustomerComponents(ledger, customerList) {
    var localRewardsList = [];
    for (let cid in customerList) {
      let transactionsList = [];
      let currentCustomerId = customerList[cid];
      for (let lid in ledger) {
        if (ledger[lid].customerId === currentCustomerId) {
          transactionsList.push(ledger[lid]);
        }
      }
      localRewardsList.push(<Customer key={currentCustomerId} customerId={currentCustomerId} ledger={transactionsList} />);
    }
    return localRewardsList;
  }

/** IN:Receives full ledger of all transactions. 
 * OUT:Ledgers split by customer into CustomerRewards components 
 */
export function assignTransactions(ledger) {
  var customerList = generateCustomerList(ledger);
  var rewardsList = generateCustomerComponents(ledger, customerList);
  return rewardsList;
}


/** CUSTOMER */

const rewardsScaling1 = 1;
const rewardsScaling2 = 2;
const rewardsThreshold1 = 50;
const rewardsThreshold2 = 100;

var dictionary = {
  1:"January", 
  2:"February", 
  3:"March", 
  4:"April", 
  5:"May", 
  6:"June", 
  7:"July", 
  8:"August", 
  9:"September", 
  10:"October", 
  11:"November", 
  12:"December"
};

/** Returns the number of rewards points earned from a transaction amount */
export function calculateRewards(transaction) {
    var rewards = 0;
    if (transaction > rewardsThreshold2) {
      rewards = ((transaction - rewardsThreshold2)*rewardsScaling2) + (rewardsThreshold2-rewardsThreshold1)*rewardsScaling1;
    } else if (transaction > rewardsThreshold1) {
      rewards = ((transaction - rewardsThreshold1)*rewardsScaling1);
    }
  return rewards;
}

/** Given a list of transactions, assign reward points per transaction to an existing or new month object */
export function assignToMonth(ledger) {
  let workingArray = [];
  
  for (let id in ledger) {
    let transactionAmount = Math.trunc(ledger[id].transactionAmount);
    let transactionRewards = calculateRewards(transactionAmount);
    let transactionMonth = ledger[id].date;
    let transactionYear = ledger[id].year;
    let index = -1;

    if (workingArray !== []) {
      for (let id in workingArray) {
        if (workingArray[id].calendar === transactionMonth && workingArray[id].year === transactionYear) {
          index = id;
        }
      }
    }

    if (index === -1) {
      var reward = {calendar:transactionMonth, year:transactionYear, value:transactionRewards};
      workingArray.push(reward);
    } else {
      workingArray[index].value += transactionRewards;
    }
  }

  return workingArray;
}

/** Used to calculate customer's total reward points from their monthly totals */
export function sumMonthly(monthlyTotals) {
  var sum = 0;
  for (let id in monthlyTotals){
    sum += monthlyTotals[id].value;
  }
  return sum;
}

/** Populate array containing components that display the monthly totals */
export function pushMonthly(monthlyTotals) {
  let componentArray = [];
  for (let id in monthlyTotals) {
    let dateKey = monthlyTotals[id].year + monthlyTotals[id].calendar;
    let month = dictionary[monthlyTotals[id].calendar];
    
    componentArray.push(
      <CustomerMonthlyReward 
        key={dateKey} 
        monthStr={month}
        year={monthlyTotals[id].year}
        value={monthlyTotals[id].value}
      />
    );
  }
  return componentArray;
}
