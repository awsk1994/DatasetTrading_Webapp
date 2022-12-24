import React from "react";
import web3 from "./web3";
import dealClientAbi from "./metadata/dealClientAbi";

const contractStates = ["INVESTING", "UPLOADING", "PURCHASABLE", "REFUNDING", "CLOSED"]

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
      contractState: "FETCHING CONTRACT...",
  
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
    const contractStateEnum = await this.dealClient.methods.state().call(); // TODO: enum casting
    const purchasePrice = await this.dealClient.methods.purchasePrice().call(); // TODO: enum casting

    const investors = await this.dealClient.methods.getInvestors().call();
    const purchasers = await this.dealClient.methods.getPurchasers().call();

    const SP = await this.dealClient.methods.SP().call();
    const cidraw = await this.dealClient.methods.cidRaw().call();

    this.setState({ provider, description, initialInvestmentTarget, purchasePrice, example, invested, contractState: contractStates[contractStateEnum], investors, purchasers, cidraw, SP });
    console.log("provider address", provider);  
  }

  onInvest = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    this.setState({ message: "Processing..." });
    const accounts = await web3.eth.getAccounts();
    await this.dealClient.methods.invest().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.investAmt, "wei"),
    });
    this.setState({ message: "Invested!" });
  };

  onPurchase = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    this.setState({ message: "Processing..." });
    const accounts = await web3.eth.getAccounts();
    await this.dealClient.methods.purchase().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.purchasePrice, "wei"),
    });
    this.setState({ message: "Purchased!" });
  };

  onClose = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    this.setState({ message: "Processing..." });
    const accounts = await web3.eth.getAccounts();
    await this.dealClient.methods.cancel().send({
      from: accounts[0],
    });
    this.setState({ message: "Closed!" });
  };

  onAuthorize = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    this.setState({ message: "Processing..." });
    const accounts = await web3.eth.getAccounts();
    await this.dealClient.methods.authorizeSP(this.state.cidraw, this.state.SP).send({  // TODO: need to contract to bytes?
      from: accounts[0],
    });
    this.setState({ message: "Authorized!" });
  };

  render() {
    return (
      <div>
        {this.state.contractState != "FETCHING CONTRACT..." ? <div style={{margin: 30, border: '1px solid black'}}>
        <h2>Dataset - {this.state.description}</h2>
        <hr/>
        <h3>Information</h3>
        <div style={{margin: 30}}>
          <div>
            <p>State: {this.state.contractState}</p>
            <hr/>
          </div>
          <div>
            <p>Description: {this.state.description}</p>
            <p>Example: {this.state.example}</p>
            <p>Provider: {this.state.provider}</p>
            <p>Contract Address: {this.state.contractAddr}</p>
            <hr/>
          </div>
          <div>
            <p>Initial Investment Target: {this.state.initialInvestmentTarget} wei</p>
            <p>Invested: {this.state.invested} wei</p>
            <p>investors: {this.state.investors}</p>
            <p>purchasers: {this.state.purchasers}</p>
            <hr/>
          </div>
          <div>
            <p>SP: {this.state.SP}</p>
            <p>cidraw: {this.state.cidraw}</p>
            <hr/>
          </div>
        </div>

        <h3>Action</h3>
        <div style={{margin: 30}}>          
          <form onSubmit={this.onInvest}>
            <h4>Invest ({this.state.initialInvestmentTarget - this.state.invested} wei until done)</h4>
            <label>Amount of wei to invest </label>
            <input
              value={this.state.investAmt}
              onChange={(event) => this.setState({ investAmt: event.target.value })}
            />
            <button>Invest</button>
            <hr/>
          </form>

          <form onSubmit={this.onAuthorize}>
            <h4>Authorize SP</h4>
            <label>SP </label>
            <input
              value={this.state.SP}
              onChange={(event) => this.setState({ SP: event.target.value })}
            />
            <br/>
            <label>cid raw </label>
            <input
              value={this.state.cidraw}
              onChange={(event) => this.setState({ cidraw: event.target.value })}
            />
            <br/>
            <button>Authorize</button>
            <hr/>
          </form>

          <form onSubmit={this.onPurchase}>
            <h4>Purchase (price: {this.state.purchasePrice})</h4>
            <button>Purchase</button>
            <hr/>
          </form>

          <form onSubmit={this.onClose}>
            <h4>Close Contract</h4>
            <button>Close</button>
            <hr/>
          </form>
        </div>        
        <p>debug: {this.state.message}</p>
      </div> : <div><h2>Fetching Contract... please wait patientl</h2><hr/></div> }
    </div>
    );
  }
}
export default Client;
