import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    provider: "",
    initialInvestmentTarget: 0,
    purchasePrice: 0,
    invested: 0,
    description: "",
    example: "",
    investors: {},
    contractAddr: "",
    contractState: 0,

    cidraw: "",
    SP: "",
    investAmt: "",
    message: "",
    value: 0,
  };
  async componentDidMount() {
    console.log(lottery._address);
    const provider = await lottery.methods.provider().call();
    const description = await lottery.methods.description().call();
    const initialInvestmentTarget = await lottery.methods.initialInvestmentTarget().call();
    const example = await lottery.methods.example().call();
    const invested = await lottery.methods.invested().call();
    const contractState = await lottery.methods.state().call(); // TODO: enum casting
    const purchasePrice = await lottery.methods.purchasePrice().call(); // TODO: enum casting

    // const players = await lottery.methods.getPlayers().call();
    // const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ provider, description, initialInvestmentTarget, purchasePrice, example, invested, contractState, contractAddr: lottery._address});
    console.log("provider", provider);
    // this.setState({ manager, players, balance });
  }

  onInvest = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await lottery.methods.invest().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.investAmt, "wei"),
    });
    this.setState({ message: "Invested!" });
  };

  onPurchase = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await lottery.methods.purchase().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.purchasePrice, "wei"),
    });
    this.setState({ message: "Purchased!" });
  };

  onClose = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await lottery.methods.cancel().send({
      from: accounts[0],
    });
    this.setState({ message: "Closed!" });
  };

  onAuthorize = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await lottery.methods.authorizeSP(this.state.cidraw, this.state.SP).send({  // TODO: need to contract to bytes?
      from: accounts[0],
    });
    this.setState({ message: "Authorized!" });
  };

  render() {
    return (
      <div>
        <div>
          <h2>Dataset Trading Contract</h2>
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
            </div>
            <button>Enter</button>
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
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}
export default App;
