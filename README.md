# Overview

This project uses Google Sheets to track current crypto balances, historical balances and daily changes through the use of free APIs and keep a daily record of historical balances. It's intended for a user to track their own tokens by hand. This is intended to be extensible by the user for their own personal calcs and daily use.

The google sheet can be found here: 

https://docs.google.com/spreadsheets/d/1IPGRLM4FweOsCDYHsoBAv3MJpexd0MHGnoNMLg-QAvk/edit?usp=sharing

## Usage

Open the spreadsheet above, make a copy and run the "Update Inventory" macro once you have entered your API keys into the Constants sheet.
You should audit the Apps Script to ensure the code is working as expected.
Then open the spreadsheet and run the "Update Historical" macro to update the historical sheet.

## Coin support (and relevant block explorers)

You can generate free API keys at the following sites. These can then be entered into the Constants sheet.

* BTC - Blockcypher
* ETH/ERC20 - Etherscan
* ETH2 (Staked ETH) - Beaconchain
* Arbitrum - Arbiscan
* Zora - zora.energy
* Base/ERC20 - Basescan
* Polygon/ERC20 - Polygonscan
* Solana - Alchemy
* Algorand - Algoexplorer.api
* XLM - stellar.org

# User Sheets

## Summary
This is the overview of the user's holdings. Auto-generated and should not require much setup. 

## Inventory
This is a record of the user's current holdings. Each column is described as follows:

* Address - This is the address 
* Base Coin  - This is the base coin (e.g. ETH, BTC, XRP, ETH2, ETH-L2, etc.)
* Token Name - This is the subtoken on the chain. For ETH, this might be something like ERC20 for the Base Coin and UNI for the token name.
* Amount (automated) - This is the calculated amount of the token
* Updated Date (automated) - This is the last time the balance was updated
* Price in USD (automated) - This is the current price of the token in USD
* Location - This is used for the user's own tracking of where the balance of the tokens are located
* Token Address - This is the address of the token on the chain
* Decimals - This is the number of decimals the token uses
* Chain - This is the chain the token is on

## Historical
This is a record of the user's historical holdings. This is created via the "Copy to Historical" macro in the "Crypto" dropdown.

## Master Price Feed
Used for overriding the default price fee found in "Imported Price Feed". This is mainly used for token remappings (if you wanted to record the price of a token like XLM on ERC20, instead of Stellar)

# Operational Sheets
These mostly do not need to be modified by the user in any way.

## Imported Price Feed
Imports price feed data from crypto rates published price list.

## Constants
Variables used by the user to configure the project. API keys are mostly the thing that would be modified here. You would add any API keys you have for your tokens here.

Some constants of note:

* InventorySheetName, HistoricalSheetName, SummarySheetName - These are provided if you want to rename the sheets above.
* CutoffRowName - This is the row that the user's holdings for price updates end at.
* InventorySearchRange - This is the number of rows the script will use to update the inventory at once.
* HistoricalCopyRange - This is the row range the script will copy from the summary to the historical sheet at once.
* NumHistoricalAssetsToCopy - This is the column range the script will copy from the summary to the historical sheet at once. 
* NumSecondsToUpdateOnOpen - This is the time to wait before updating the inventory sheet after opening.
* HistoricalUpdatePeriodMilliseconds - This is the sleep period the historical sheet will update after opening.
* LastHistoricalUpdate - This is used for internal tracking so we're not constantly updating the historical sheet

# License
MIT