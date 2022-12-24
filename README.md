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

## Smart Contract Git Repo

* https://github.com/awsk1994/DatasetTrading

## Change Factory Contract Address

* src/metadata/factory.js --> change 'address' variable's value

## Note

* When Smart Contract change, need to update abi (stored in src/metadata)