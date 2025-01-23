// The repository for the Sheet can be found here: https://github.com/twtaylor/crypto-assets-gsheet
// MIT License

function testApiKeys() {
  // cryptoValue
  // console.log(getCryptoValue2("232322394923327847823848234828", 18))
  // console.log(getCryptoValue2("23", 18))
  // console.log(getCryptoValue2("2323223949", 18))
  // console.log(getCryptoValue2(2323223949, 18))
  // console.log(getCryptoValue2(22234442323232322323223949, 18))
  // console.log(getCryptoValue2(223232322323223949, 6))

  // apiKey
  console.log(getApiKey('Etherscan'))
  console.log(getApiKey('Arbiscan'))
  console.log(getApiKey('Basescan'))
  console.log(getApiKey('AlchemySolana'))
  console.log(getApiKey('PolygonScan'))
}

function testSetConstant() {
  setConstant('LastHistoricalUpdate', 234234234)
}

function testBalance() {
   var bal = getBeaconchainValidatorStats('');
  console.log(bal)
  return bal;

  // getConstant("EtherscanApiKey");
  // console.log(getApiKey('Etherscan'));
}

function testHistoricalUpdate() {
  console.log(checkHistoricalUpdate())
}