import React, { Component } from 'react';
import {assignTransactions} from './function';

var rewardsList = [];

class RewardsCalc extends Component {

  /** Assign Transactions per customer */
  handleAssign = () => {
    var ledger = this.props.ledger;
    rewardsList = assignTransactions(ledger);
  }

  render() {
    this.handleAssign();
    return(
      <div>
        <table>
          <tbody>
            <tr>
              <th>Customer</th>
              <th>Total Points</th>
              <th>Monthly Points</th>
            </tr>
            {rewardsList}
          </tbody>
        </table>
      </div>
    );
  }

}

export default RewardsCalc;