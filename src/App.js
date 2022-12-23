import React from "react";
import web3 from "./web3";
import factory from "./factory";
import Client from "./client";

class App extends React.Component {
  state = {
    provider: "",

    description: "",
    initialInvestmentTarget: 0,
    purchasePrice: 0,

    dealClients: [],
    dealClientsDesc: [],
    message: "",
    selectedClientAddr: 0,
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
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Fetching data..." });
    await factory.methods.createClient(
      this.state.description, this.state.initialInvestmentTarget, this.state.purchasePrice
    ).send({
      from: accounts[0]
    });
    this.setState({ message: "Created!" });
    await this.getClients();
    await this.getClientsDesc();
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

  select = (addr) => {
    this.setState({selectedClientAddr: addr});
  }

  render() {
    return (
      <div>
        <div>
          <h1>Dataset Trading</h1>
        </div>
        <hr/>
        <div>
          <form onSubmit={this.onCreate}>
            <h2>Create a Dataset</h2>
            <div>
              <label>Description</label>
              <input
                value={this.state.description}
                onChange={(event) => this.setState({ description: event.target.value })}
              />
            </div>
            <div>
              <label>Initial Investment Target</label>
              <input
                value={this.state.initialInvestmentTarget}
                onChange={(event) => this.setState({ initialInvestmentTarget: event.target.value })}
              />
            </div>
            <div>
              <label>Purchase Price</label>
              <input
                value={this.state.purchasePrice}
                onChange={(event) => this.setState({ purchasePrice: event.target.value })}
              />
            </div>
            <button>Create Dataset</button>
          </form>
          <hr/>
        </div>
        {/* <div>
          <button onClick={this.getClients}>Get Clients</button>
        </div> */}
        <h2>Datasets</h2>
        <p>click to view dataset</p>
        <div>
          { this.state.dealClients.map((addr, index) => <div><button key={addr} onClick={() => this.select(addr)}>{this.state.dealClientsDesc[index]}</button></div>) }
        </div>
        <hr/>
        { this.state.selectedClientAddr !== 0 ?  <Client key={this.state.selectedClientAddr} contractAddr={this.state.selectedClientAddr}/> : null }

        {/* <p>message: {this.state.message}</p> */}
      </div>
    );
  }
}
export default App;
