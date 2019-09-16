import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";

class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.handleApproveClick = this.handleApproveClick.bind(this);
  }

  handleApproveClick(event) {
    event.preventDefault();

    console.log("Hullo");
  }

  render() {
    return (
      <div className="App">
        <button type="button" onClick={this.handleApproveClick}>
          Approve
        </button>

        <p />

        Send Dai
        <ContractForm contract={"Lock2Pay"} method={"lockDai"} />
      </div>
    );
  }
}

export default MyComponent;
