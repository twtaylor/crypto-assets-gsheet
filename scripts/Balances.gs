// The repository for the Sheet can be found here: https://github.com/twtaylor/crypto-assets-gsheet
// MIT License

function getApiKey(name) {
  return getConstant(name + 'ApiKey')
}

function getEthBalances(ethaddress){
  const apiKey = getApiKey('Etherscan')
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch("https://api.etherscan.io/api?module=account&action=balance&address=" + ethaddress + "&tag=latest&apikey=" + apiKey), opts);
  return obj["result"];
}

function getErcBalances(ethAddress, contractAddress, decimalPlaces){
  const apiKey = getApiKey('Etherscan')
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch("https://api.etherscan.io/api?module=account&action=tokenbalance&address=" + ethAddress.trim() + "&contractaddress=" + contractAddress.trim() + "&tag=latest&apikey=" + apiKey), opts);
  const result = Number(obj.result);
  return result / (10 ** decimalPlaces);
} 

function getArbitrumBalances(ethaddress){
  const apiKey = getApiKey('Arbiscan')
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch("https://api.arbiscan.io/api?module=account&action=balance&address=" + ethaddress + "&tag=latest&apikey=" + apiKey), opts);
  return obj["result"];
}

function getZoraBalances(address) {
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch("https://explorer.zora.energy/api/v2/addresses/" + address), opts);
  return obj["coin_balance"];
}

function getBaseBalances(ethaddress){
  const apiKey = getApiKey('Basescan')
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch("https://api.basescan.org/api?module=account&action=balance&address=" + ethaddress + "&tag=latest&apikey=" + apiKey), opts);
  return obj["result"];
}

function getBaseErcBalances(ethAddress, contractAddress, decimalPlaces){
  const apiKey = getApiKey('Basescan')
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch("https://api.basescan.org/api?module=account&action=tokenbalance&address=" + ethAddress.trim() + "&contractaddress=" + contractAddress.trim() + "&tag=latest&apikey=" + apiKey), opts);
  const result = Number(obj.result);
  return result / (10 ** decimalPlaces);
} 

function getPolygonAddress(ethaddress){
  const apiKey = getApiKey('PolygonScan')
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch("https://api.polygonscan.com/api?module=account&action=balance&address=" + ethaddress + "&tag=latest&apikey=" + apiKey), opts);
  return obj.result;
}

function getPolygonErc(ethAddress, contractAddress, decimalPlaces){
  const apiKey = getApiKey('PolygonScan')
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch("https://api.polygonscan.com/api?module=account&action=tokenbalance&address=" + ethAddress + "&contractaddress=" + contractAddress + "&tag=latest&apikey=" + apiKey, opts));
  const result = parseInt(obj.result, 10);
  return result / (10 ** decimalPlaces);
}

function getBeaconchainValidatorStats(ethAddress){
  var opts = { 'muteHttpExceptions': true };
  var obj = JSON.parse (UrlFetchApp.fetch('https://beaconcha.in/api/v1/validator/' + ethAddress, opts));
  return obj.data.balance;
}

function getBtcBalances(btcAddress) {
  var opts = { 'muteHttpExceptions': true };
  var response = UrlFetchApp.fetch("https://api.blockcypher.com/v1/btc/main/addrs/" + btcAddress + "/balance", opts);
  var responseStr = response.toString();
  var obj = JSON.parse(responseStr);
  return obj.balance;
}

function getSolanaBalances(address) {
  const apiKey = getApiKey('AlchemySolana')
  const data = { 
    "jsonrpc": "2.0",
      "id": 1,
      'method': "getBalance",
      'params': [
          address,
      ]
    }
  const opts = { 
    'muteHttpExceptions': true, 
    'payload': JSON.stringify(data), 
    'method': "post",
    'contentType': 'application/json',
  };
  var response = UrlFetchApp.fetch("https://solana-mainnet.g.alchemy.com/v2/" + apiKey, opts);
  var responseStr = response.toString();
  var obj = JSON.parse(responseStr);
  return obj.result.value;
}

function getAlgoBalances(algoAddress) {
 var opts = { 'muteHttpExceptions': true };
 var response = UrlFetchApp.fetch("https://algoindexer.algoexplorerapi.io/v2/accounts/" + algoAddress, opts);
 var responseStr = response.toString();
  var obj = JSON.parse(responseStr);
  return obj.account.amount; 
}

function getStellarBalances(address) {
  var opts = { 'muteHttpExceptions': true };
  var response = UrlFetchApp.fetch("https://horizon.stellar.org/accounts/" + address, opts);
  var responseStr = response.toString();
  var obj = JSON.parse(responseStr);
  return obj.balances[0].balance;
}
