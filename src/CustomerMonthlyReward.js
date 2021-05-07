import React, { Component } from 'react';

/** Month integer to string literal dictionary */

/** IN:Reward totals and month value for a single month
 * OUT:Display of input values
 */
class CustomerMonthlyReward extends Component {

  render() {
    return (
      <div>
        {this.props.monthStr} {this.props.year}: {this.props.value} pts
      </div>
    );
  }
  
}

export default CustomerMonthlyReward;