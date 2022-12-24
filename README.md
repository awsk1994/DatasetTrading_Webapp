# Dataset Trading - React

## Summary 
Similar to stock trading, but for datasets. Not really sure if there’s business value, but an interesting food-for-thought idea.

**Problem**
* As a data provider, 
	* I have useful data (that many people want) and I want to get paid for the data I upload.
	* I don’t want to have to pay to start a smart contract (technically one still needs to pay for gas to get smart contracts running, but can be compensated in the future for it)
* As a data user,
	* I see value/potential in a dataset (and possibly have a need to use it). I want to invest in it. 
	* In the future, if someone purchases ‘access’ rights to this dataset, I will get a cut (similar to dividends). I can also transfer my share to other people (for some price possibly).

## Documentation
https://docs.google.com/document/d/1Q0_zs0o1v3vUQdi2-Vm5QZXBHCwPrFAVkMkrwisUv10/edit?usp=sharing

## Get Started (Simplified)
1. Deploy Factory and MockMarket contract 
    * https://github.com/awsk1994/DatasetTrading
2. In Metamask, change to Goerli Network
3. Start webapp
    * npm install; npm run start
    * Go to localhost:3000

## Workflow
1. Fill in contract info and create Smart Contract
2. Click Contract to view details
3.Invest in it until ‘Initial Investment Target’ is reached
    * Once reached, should see Contract State == Uploading
4. As provider, authorize SP. Use test data below:
    * CID: 0x000181E2039220206B86B273FF34FCE19D6B804EFF5A3F5747ADA4EAA22F1D49C01E52DDB7875B4B
    * Provider: 0x0066
5. As SP, deploy MockMarket contract and trigger publish_storage_deals. Use test data:
    * Raw_auth_params: 0x8240584c8bd82a5828000181e2039220206b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b190800f4420068420066656c6162656c0a1a0008ca0a42000a42000a42000a
    * Callee: (use DealClient contract address)
    * Once triggered, should see state == Purchasable
6. As purchaser (change account in metamask), purchase
7. As provider, close contract


## Change Factory Contract Address
* src/metadata/factory.js --> change 'address' variable's value

## Note
* When Smart Contract change, need to update abi (stored in src/metadata)

## Demo
* Video: https://www.youtube.com/watch?v=fUVw6Xnq3Qw&feature=youtu.be
* Goerli Test Network:
	* Factory Contract Address: 0xdb6dB06e3bA8D1e0859E06cfF04177c624647EEc

## Git Repo
* Smart Contract: https://github.com/awsk1994/DatasetTrading
* https://github.com/awsk1994/DatasetTrading_Webapp