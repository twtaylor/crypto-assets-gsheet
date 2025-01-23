// The repository for the Sheet can be found here: https://github.com/twtaylor/crypto-assets-gsheet
// MIT License

/** 
 * Adds our Menu Items to our Spreadsheet
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('Crypto')
      .addItem('Update Balances', 'menu_forceUpdateAllBalances')
      .addItem('Copy to Historical', 'menu_updateBalancesAndCopyToHistorical')
      .addToUi();

  if (checkHistoricalUpdate()) {
    updateBalancesAndCopyToHistorical()
  }
}

/**
 * Checks to see if we need to perform a historical update based on the 
 * period set in HistoricalUpdatePeriodMilliseconds for the last updated
 * time LastHistoricalUpdate
 */
function checkHistoricalUpdate() {
  console.log('Checking for historical update')

    const rightNow = (new Date().valueOf());
    const lastHistoricalUpdate = getConstant('LastHistoricalUpdate')
    const lastUpdated = new Date(parseInt(lastHistoricalUpdate, 10))
    if (!lastHistoricalUpdate || lastUpdated === 'Invalid Date') {
      setConstant('LastHistoricalUpdate', rightNow)
      return true
    }

    const numSecondsToUpdate = parseInt(getConstant('HistoricalUpdatePeriodMilliseconds'), 10)
    if (rightNow > (lastUpdated.valueOf() + numSecondsToUpdate)) {
      setConstant('LastHistoricalUpdate', rightNow)
      return true
    }

    return false
}

function menu_updateBalancesAndCopyToHistorical() {
  updateBalancesAndCopyToHistorical()
}

function menu_forceUpdateAllBalances() {
  return updateAllBalances(true)
}

function updateBalancesAndCopyToHistorical() {
  updateAllBalances()
  copyToHistorical()
}

/** Strictly used for deployment purposes */
function cleanOutSheet() {
  // 1) Delete Summary - Advanced
  const advancedSummarySheet = SpreadsheetApp.getActive().getSheetByName('Summary - Advanced')
  SpreadsheetApp.getActiveSpreadsheet().deleteSheet(advancedSummarySheet)
  
  // 2) Delete Inventory
  const inventorySheetName = getConstant('InventorySheetName')
  let inventorySheet = SpreadsheetApp.getActive().getSheetByName(inventorySheetName)
  SpreadsheetApp.getActiveSpreadsheet().deleteSheet(inventorySheet)

  // 3) Rename Inventory - Demo -> Inventory
  const newInventorySheet = SpreadsheetApp.getActive().getSheetByName('Inventory - Demo')
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(newInventorySheet);
  SpreadsheetApp.getActiveSpreadsheet().renameActiveSheet(inventorySheetName)

  // 4) Historical A2:A1000 Delete rows
  const historicalSheetName = getConstant('HistoricalSheetName')
  SpreadsheetApp.getActive().getSheetByName(historicalSheetName).getRange("A2:N1000").clearContent();
  
  // 5) 
  // Constants - Clear - EtherscanApiKey, ArbiscanApiKey, BasescanApiKey, PolygonScanApiKey,  AlchemySolanaApiKey
  // Constants - Clear - LastHistoricalUpdate
  setConstant('EtherscanApiKey', '')
  setConstant('ArbiscanApiKey', '')
  setConstant('BasescanApiKey', '')
  setConstant('PolygonScanApiKey', '')
  setConstant('AlchemySolanaApiKey', '')
  setConstant('LastHistoricalUpdate', '')
}

/**
 * Copies price and crypto asset data from the Summary sheet over to the Historical sheet
 */
function copyToHistorical() {
  const historicalSheetName = getConstant('HistoricalSheetName')
  const summarySheetName = getConstant('SummarySheetName')
  const historicalCopyRange = getConstant('HistoricalCopyRange')

  const colsToCopy = SpreadsheetApp.getActive().getSheetByName(summarySheetName).getRange(historicalCopyRange).getValues();
  const historicalRangeRelative =  SpreadsheetApp.getActive().getSheetByName(historicalSheetName);

  // get the last row filled out in Historical
  const historicalRows = SpreadsheetApp.getActive().getSheetByName(historicalSheetName).getRange("A2:A1000").getValues();
  const firstBlankRow = historicalRows.findIndex(n => n[0] === '')

  const rowOffset = 2 + firstBlankRow;
  const currDate = historicalRangeRelative.getRange(rowOffset, 1)
  currDate.setValue(new Date().toLocaleString());

  colsToCopy.map((row, colId) => {
    // start in the D column to allow for sum col to calc proper
    const colOffset = colId + 4;

    const currCell = historicalRangeRelative.getRange(rowOffset, colOffset)

    if (row[0] !== '') {
      currCell.setValue(row[0])
    }
  })
}

/**
 * Updates all balances for our Inventory sheet by calling the relevant APIs
 */
function updateAllBalances(skipCheck = false) {
  // change the end range to the cut off line
  const inventorySheetName = getConstant('InventorySheetName')
  const searchRange = getConstant('InventorySearchRange')
  const cutoffRowName = getConstant('CutoffRowName')
  const numSecondsToUpdate = getConstant('NumSecondsToUpdateOnOpen')

  const rows = SpreadsheetApp.getActive().getSheetByName(inventorySheetName).getRange(searchRange).getValues();
  const invSheetRelative = SpreadsheetApp.getActive().getSheetByName(inventorySheetName);
  
  let cutoffFound = false;

  rows.map((row, rowId) => {
    if (cutoffFound) return;

    const rowOffset = 2 + rowId;
    const addr = invSheetRelative.getRange(rowOffset, 1).getValue();
    const coin = invSheetRelative.getRange(rowOffset, 2).getValue();
    const subCoin = invSheetRelative.getRange(rowOffset, 3).getValue();
    const lastAmount = invSheetRelative.getRange(rowOffset, 4);
    const lastDate = invSheetRelative.getRange(rowOffset, 5);
    const contractAddress = invSheetRelative.getRange(rowOffset, 8).getValue();
    const decimals = invSheetRelative.getRange(rowOffset, 9).getValue();
    const chain = invSheetRelative.getRange(rowOffset, 10).getValue();

    // Track our cutoff row
    if (addr == cutoffRowName) {
      cutoffFound = true;
      console.log('Cutoff row found... stopping updating.')
      return;
    }

    // do not update if in the last period unless forced to
    const rightNow = (new Date().valueOf());
    const lastUpdated = new Date(lastDate.getValue())
    if (!skipCheck && lastUpdated !== 'Invalid Date' && rightNow > (lastUpdated.valueOf() + numSecondsToUpdate)) {
      console.log(`- Skipping since last updated ${lastUpdated} is within 2 minutes ${rightNow}`)
      return;
    }

    const balance = getBalance(rowId, chain, coin, subCoin, addr, contractAddress, decimals, lastAmount)
    if (balance.error) {
      if (balance.error != 'No-op') {
        console.error(balance.error)
      }
      
      return
    }

    if (isNaN(balance.value)) {
      console.log(`${rowId} - Not a number...`)
      return;
    }

    console.log(balance.msg)

    lastDate.setValue(new Date().toUTCString());
    lastAmount.setValue(balance.value);
  })
}

/**
 * Gets the balance for a specific coin in a chain over an API
 */
function getBalance(rowId, chain, coin, subCoin, addr, contractAddress, decimals, lastAmount) {
  let value = 0;
  let cryptoValue = 0;
  let logMsg = rowId + ' '

  try {
    switch (coin) {
      case "ETH":
        if (subCoin !== 'ETH') return;
        logMsg += 'Updating ETH ' + addr
        value = getEthBalances(addr);
        cryptoValue = getCryptoValue(value, 18);
        break;
      case "ETH2":
        if (subCoin !== 'ETH') return;
        logMsg += 'Updating ETH2 (staked) ' + addr
        value = getBeaconchainValidatorStats(addr);
        // API returns gwei, not wei
        cryptoValue = getCryptoValue(value, 9);
        break;
      case "BTC":
        logMsg +=  'Updating BTC ' + addr
        value = getBtcBalances(addr);
        cryptoValue = getCryptoValue(value, 8);
        break;
      case "ERC20":
        if (subCoin === 'ETH') return;
        logMsg += 'Updating ERC20 for addr...' + addr
        cryptoValue = getErcBalances(addr, contractAddress, decimals);
        break;
      case "SOL":
        logMsg += "Update solana " + addr
        value = getSolanaBalances(addr)
        cryptoValue = getCryptoValue(value, 9);
        break;
      case "XLM":
        logMsg += "Update Stellar " + addr
        cryptoValue = getStellarBalances(addr)
        break;
      case "ETH-L2":
        logMsg += 'Updating ETH balance for addr ' + addr + ' on chain ' + chain
        switch (chain) {
          case "Zora":
            value = getZoraBalances(addr)
            cryptoValue = getCryptoValue(value, 18);
            break;
          case "Base":
            if (subCoin === 'ETH') {
              value = getBaseBalances(addr)
              cryptoValue = getCryptoValue(value, 18);
            } else {
              cryptoValue = getBaseErcBalances(addr, contractAddress, decimals);
            }
            break;
          case "Arbitrum":
            value = getArbitrumBalances(addr)
            cryptoValue = getCryptoValue(value, 18);
            break;
          case "Matic":
            value = getPolygonAddress(addr)
            cryptoValue = getCryptoValue(value, 18);
            break;
          default:
            return {
              error: 'Unsupported ETH-L2'
            }
        }
        break;       
      default:
        // We skip this coin because we don't support it in the spreadsheet so it's essentially a no-op
        return {
          error: 'No-op'
        }
    }
  } catch (e) {
    const err = `${rowId} - Exception caught for ${coin}:${subCoin} at ${addr} with amount ${lastAmount.getValue()}`;
    console.error(e)
    // don't set lastDate to keep trying to retrieve it later
    return {
      error: err
    }
  }

  return {
    value: cryptoValue,
    msg: logMsg,
    error: null
  }
}
