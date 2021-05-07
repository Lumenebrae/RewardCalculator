import React, { Component } from 'react';
import {assignToMonth, sumMonthly, pushMonthly} from './function';

var monthlyRewards = []; /** Container for <CustomerMonthlyReward> components */
var totalRewards = 0; /** Total number of rewards points the customer earned from the given transaction history */

/** Calculation process manager */
function handleCalculate(ledgerProp) {
  var ledger = ledgerProp;
  var localMonthly = [];

  localMonthly = assignToMonth(ledger);
  totalRewards = sumMonthly(localMonthly);
  monthlyRewards = pushMonthly(localMonthly);
  return totalRewards;
}

/** IN:Ledger with transactions belonging to customer 
 * OUT:monthly rewards and total rewards  
 */
class Customer extends Component {

  render() {
    handleCalculate(this.props.ledger);
    return (
      <tr>
        <td>{this.props.customerId} </td>
        <td>{totalRewards} pts</td>
        <td>{monthlyRewards}</td>
      </tr>
    );
  }

}

export default Customer;