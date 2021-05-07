import React, { Component } from 'react';
import RewardsCalc from './RewardsCalc';
import {generateLedger} from './function';

var inputText = "";

class RewardsInOut extends Component {
  constructor (props){
    super(props);
    this.state = {
      ledger: []
    };
  }

  /** IN:Plaintext representation of transaction data from text area to be parsed
   * OUT:Internal representation of transaction data to be operated on
   */
  handleSubmit() {
    let ledger = generateLedger(inputText);
    
    this.setState({ledger:ledger});
    return;
  }

  render() {
    return (
      <div>
        <div className="round">
          <label>Insert Transaction Data:</label>
          <div>
            <textarea
              className="inputbox"
              placeholder="Transaction #, Customer, Amount, MM/DD/YYYY
..."
              onChange={event => inputText = event.target.value}
              rows={20}
              cols={80}
            />
          </div>
          <button type="button" onClick={() => this.handleSubmit()}>Submit</button>
        </div>
        <div className="roundTable">
          <RewardsCalc ledger={this.state.ledger} />
        </div>
      </div>
    );
  }

}

export default RewardsInOut;