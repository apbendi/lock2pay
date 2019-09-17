import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { promisify } from 'util';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

import {
  AccountData,
  ContractData,
  ContractForm,
} from "@drizzle/react-components";

function advanceBlock (web3) {
  return promisify(web3.currentProvider.send.bind(web3.currentProvider))({
    jsonrpc: '2.0',
    method: 'evm_mine',
  });
}

async function jumpBlocks(web3) {
    for(var i = 0; i < 1000; i++) {
      await advanceBlock(web3);
    }
}

class MyComponent extends Component {

  constructor(props, context) {
    super(props);

    this.web3 = context.drizzle.web3;
    this.lock2PayContract = context.drizzle.contracts.Lock2Pay;

    this.handleApproveClick = this.handleApproveClick.bind(this);
    this.handleJumpAheadClick = this.handleJumpAheadClick.bind(this);
    this.renderContractBalances = this.renderContractBalances.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
  }

  handleApproveClick(event) {
    event.preventDefault();
    let web3 = this.web3;

    var daiTokenABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"owner_","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name_","type":"bytes32"}],"name":"setName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"authority_","type":"address"}],"name":"setAuthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"push","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"move","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"guy","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"wad","type":"uint256"}],"name":"pull","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"symbol_","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"authority","type":"address"}],"name":"LogSetAuthority","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"}],"name":"LogSetOwner","type":"event"},{"anonymous":true,"inputs":[{"indexed":true,"name":"sig","type":"bytes4"},{"indexed":true,"name":"guy","type":"address"},{"indexed":true,"name":"foo","type":"bytes32"},{"indexed":true,"name":"bar","type":"bytes32"},{"indexed":false,"name":"wad","type":"uint256"},{"indexed":false,"name":"fax","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"}];
    var daiTokenAddr = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359";
    var daiTokenContract = new web3.eth.Contract(daiTokenABI, daiTokenAddr);

    var approveAmount = web3.utils.toWei("1000", "ether");

    let approval = daiTokenContract.methods.approve(this.lock2PayContract.address, approveAmount);
    approval.send({from: this.props.accounts[0]});
  }

  handleJumpAheadClick(event) {
    event.preventDefault();
    jumpBlocks(this.web3);
  }

  handleSendClick(event) {
    event.preventDefault();

    this.lock2PayContract.methods.lockDai.cacheSend(this.web3.utils.toWei("1000", "ether"));
  }

  renderContractBalances(balanceData) {
    return (
        <span>
          <strong>cDai Locked</strong>: {balanceData.cDaiBalance}<br />
          <strong>cDai Owed</strong>: {balanceData.cDaiOutstanding}
        </span>
      );
  }

  render() {
    var blockNumber = 0

    if(this.props.currentBlock.number !== undefined) {
      blockNumber = this.props.currentBlock.number;
    }

    return (
      <div className="App">
        <Container className="mt-4">

        <Row className="justify-content-center">
          <Col md="6">
            <Card>
              <Card.Body>
                <Card.Title>Current Block</Card.Title>
                <Card.Text>{blockNumber}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <p />

        <Row className="justify-content-center">
          <Col md="6">
              <Card>
                <Card.Body>
                  <Card.Title>User Interface</Card.Title>
                  <Card.Text>
                    <Button onClick={this.handleApproveClick}>Approve 1000 Dai</Button>
                    <p />
                    <Button onClick={this.handleSendClick}>Lock 1000 Dai</Button>
                    <p />
                    Redeem Dai
                    <ContractForm contract={"Lock2Pay"} method={"redeemDai"} />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <p />

          <Row className="justify-content-center">
            <Col md="6">
              <Card>
                <Card.Body>
                  <Card.Title>Contract State</Card.Title>
                  <Card.Text>
                    <ContractData contract={"Lock2Pay"}
                                  method={"contractBalances"}
                                  render={this.renderContractBalances} />
                    <p />
                    <strong>NFTs Minted</strong>:{" "}
                    <ContractData contract={"LockNFT"} method={"totalSupply"} />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <p />

          <Row className="justify-content-center">
            <Col md="6">
              <Card>
                <Card.Body>
                  <Card.Title>Admin Interface</Card.Title>
                  <Card.Text>
                    Approve cDai
                    <ContractForm contract={"Lock2Pay"} method={"approveCDai"} />
                    <p />
                    Redeem Profit
                    <ContractForm contract={"Lock2Pay"} method={"withdrawProfit"} />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <p />

          <Row className="justify-content-center">
            <Col md="6">
              <Card>
                <Card.Body>
                  <Card.Title>Config Interface</Card.Title>
                  <Card.Text>
                  NFT Address:{" "}
                  <ContractData contract={"Lock2Pay"} method={"nftAddr"} />
                  <ContractForm contract={"Lock2Pay"} method={"setNFTAddr"} />
                  <p />
                  MinterAddress:{" "}
                  <ContractData contract={"LockNFT"} method={"minter"} />
                  <ContractForm contract={"LockNFT"} method={"setMinter"} />
                  </Card.Text>
                  <Button onClick={this.handleJumpAheadClick}>Jump Blocks</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

MyComponent.contextTypes = {
  drizzle: PropTypes.object,
}

export default MyComponent;
