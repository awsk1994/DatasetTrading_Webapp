import React from "react";
import web3 from "./web3";
import factory from "./metadata/factory";
import Client from "./client";

class App extends React.Component {
  state = {
    provider: "",

    description: "",
    initialInvestmentTarget: 0,
    purchasePrice: 0,

    dealClients: [],
    dealClientsDesc: [],
    selectedClientAddr: 0,

    message: "",
  };

  async componentDidMount() {
    console.log("contract address: ", factory._address);
    const dealClients = await factory.methods.getClients().call();
    const dealClientsDesc = await factory.methods.getClientsDesc().call();

    this.setState({ dealClients, dealClientsDesc });
    console.log("deal clients:", dealClients, "desc", dealClientsDesc)
  }

  onCreate = async (event) => {
    event.preventDefault(); // TODO: what does this do?
    this.setState({ message: "Processing..." });
    const accounts = await web3.eth.getAccounts();
    await factory.methods.createClient(
      this.state.description, this.state.initialInvestmentTarget, this.state.purchasePrice
    ).send({
      from: accounts[0]
    });
    await this.getClients();
    await this.getClientsDesc();
    this.setState({ message: "Created!" });
  };

  getClients = async() => {
    const dealClients = await factory.methods.getClients().call();
    this.setState({ dealClients });
    console.log("deal clients:", dealClients)
  }

  getClientsDesc = async() => {
    const dealClientsDesc = await factory.methods.getClientsDesc().call();
    this.setState({ dealClientsDesc });
    console.log("dealClientsDesc:", dealClientsDesc)
  }

  getAllClients = async() => {
    await this.getClients();
    await this.getClientsDesc();
  }

  select = (addr) => {
    this.setState({selectedClientAddr: addr});
  }

  render() {
    return (
      <div>
        <h1>Dataset Trading</h1>
        <hr/>

        <div>
          <form onSubmit={this.onCreate}>
            <h2>Create a Dataset</h2>
            <label>Description</label>
            <input
              value={this.state.description}
              onChange={(event) => this.setState({ description: event.target.value })}
            />
            <br/>
            <label>Initial Investment Target</label>
            <input
              value={this.state.initialInvestmentTarget}
              onChange={(event) => this.setState({ initialInvestmentTarget: event.target.value })}
            />
            <br/>
            <label>Purchase Price</label>
            <input
              value={this.state.purchasePrice}
              onChange={(event) => this.setState({ purchasePrice: event.target.value })}
            />
            <br/>
            <button>Create Dataset</button>
          </form>
          <hr/>
        </div>

        <div>
          <h2>Datasets</h2>
          <p>click to view dataset</p>
          {/* <button onClick={this.getAllClients}>Refresh</button> */}
          {
            this.state.dealClients.length !== 0 ? 
            <div>
              { this.state.dealClients.map((addr, index) => <div key={addr}><button key={addr} onClick={() => this.select(addr)}>{this.state.dealClientsDesc[index]}</button></div>) }
              <br/>
            </div> : null 
          }
          <hr/>
        </div>
        
        { this.state.selectedClientAddr !== 0 ?  <Client key={this.state.selectedClientAddr} contractAddr={this.state.selectedClientAddr}/> : null }

        <p> debug: {this.state.message}</p>
      </div>
    );
  }
}
export default App;
