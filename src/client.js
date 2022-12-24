import React from "react";
import web3 from "./web3";
// import lottery from "./lottery";
import dealClientAbi from "./dealClientAbi";

class Client extends React.Component {
  constructor(props) {
    super();
    // let contractAddr = props.route.params.contractAddr;
    console.log("contract addr", props.contractAddr);
    // super();
    this.state = {
      contractAddr: props.contractAddr,
      provider: "",
      initialInvestmentTarget: 0,
      purchasePrice: 0,
      invested: 0,
      description: "",
      example: "",
      contractState: 0,
  
      investors: [],
      purchasers: [],

      cidraw: "",
      SP: "",
      investAmt: "",
      message: "",
      value: 0,
    };
    this.dealClient = new web3.eth.Contract(dealClientAbi, props.contractAddr);
  }

  async componentDidMount() {
    console.log("contract address: ", this.state.contractAddr);

    const provider = await this.dealClient.methods.provider().call();
    const description = await this.dealClient.methods.description().call();
    const initialInvestmentTarget = await this.dealClient.methods.initialInvestmentTarget().call();
    const example = await this.dealClient.methods.example().call();
    const invested = await this.dealClient.methods.invested().call();
    const contractState = await this.dealClient.methods.state().call(); // TODO: enum casting
    const purchasePrice = await this.dealClient.methods.purchasePrice().call(); // TODO: enum casting

    const investors = await this.dealClient.methods.getInvestors().call();
    const purchasers = await this.dealClient.methods.getPurchasers().call();
    console.log(investors);

    this.setState({ provider, description, initialInvestmentTarget, purchasePrice, example, invested, contractState, investors, purchasers });
    console.log("provider address", provider);  
  
  }

  onInvest = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await this.dealClient.methods.invest().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.investAmt, "wei"),
    });
    this.setState({ message: "Invested!" });
  };

  onPurchase = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await this.dealClient.methods.purchase().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.purchasePrice, "wei"),
    });
    this.setState({ message: "Purchased!" });
  };

  onClose = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await this.dealClient.methods.cancel().send({
      from: accounts[0],
    });
    this.setState({ message: "Closed!" });
  };

  onAuthorize = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await this.dealClient.methods.authorizeSP(this.state.cidraw, this.state.SP).send({  // TODO: need to contract to bytes?
      from: accounts[0],
    });
    this.setState({ message: "Authorized!" });
  };

  render() {
    return (
      <div style={{margin: 30, border: '1px solid black'}}>
        <div>
          <h2>Dataset - {this.state.description}</h2>
          <p>State: {this.state.contractState}</p>
          <p>Description: {this.state.description}</p>
          <p>Example: {this.state.example}</p>
          <p>Provider: {this.state.provider}</p>
          <p>contractAddr: {this.state.contractAddr}</p>
          <hr/>
          <p>Invested: {this.state.invested} wei</p>
          <p>initialInvestmentTarget: {this.state.initialInvestmentTarget} wei</p>
          <hr/>
        </div>
        <div>
          <form onSubmit={this.onInvest}>
            <h2>Invest</h2>
            <div>
              <p>{this.state.initialInvestmentTarget - this.state.invested} wei until done!</p>
              <label>Amount of wei to invest</label>
              <input
                value={this.state.investAmt}
                onChange={(event) => this.setState({ investAmt: event.target.value })}
              />
              <button>Enter</button>
            </div>
          </form>
          <hr/>
        </div>
        <div>
          <form onSubmit={this.onPurchase}>
            <h2>Purchase</h2>
            <p>Price: {this.state.purchasePrice}</p>
            <button>Enter</button>
          </form>
          <hr/>
        </div>
        <div>
          <form onSubmit={this.onClose}>
            <button>Close Contract</button>
          </form>
          <hr/>
        </div>
        <div>
          <form onSubmit={this.onAuthorize}>
            <div>
              <label>SP:</label>
              <input
                value={this.state.SP}
                onChange={(event) => this.setState({ SP: event.target.value })}
              />
              <label>cid raw:</label>
              <input
                value={this.state.cidraw}
                onChange={(event) => this.setState({ cidraw: event.target.value })}
              />
            </div>
            <button>Authorize</button>
          </form>
          <hr/>
        </div>
        <div>
          <h2>investors</h2>
          <p>{this.state.investors}</p>
          <h2>purchasers</h2>
          <p>{this.state.purchasers}</p>
        </div>
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}
export default Client;
