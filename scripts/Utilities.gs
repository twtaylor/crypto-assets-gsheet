// The repository for the Sheet can be found here: https://github.com/twtaylor/crypto-assets-gsheet
// MIT License

// Change at your own peril
const CONSTANTS_SHEET_NAME = 'Constants' 
const CONSTANTS_SHEET_RANGE = 'A2:B30'

function getCryptoValue(amount, power) {
  // BigInt ctor throws, thanks TC39 
  if (amount === undefined) return undefined;
  const divisor2 = 10 ** power;
  const result = Number(BigInt(amount)) / divisor2;
  return result.toString()
}

function getConstant(name) {
  const constantValues = SpreadsheetApp.getActive().getSheetByName(CONSTANTS_SHEET_NAME).getRange(CONSTANTS_SHEET_RANGE).getValues();

  const constant = constantValues.find((n) => n && n[0] === name)
  
  if (!constant && !constant[1]) throw new Error('Constant not found ' + name)

  return constant[1].toString()
}

function setConstant(name, value) {
  const constantsRange = SpreadsheetApp.getActive().getSheetByName(CONSTANTS_SHEET_NAME).getRange(CONSTANTS_SHEET_RANGE).getValues();
  const constantRelativeRange = SpreadsheetApp.getActive().getSheetByName(CONSTANTS_SHEET_NAME);
  constantsRange.map((constantRow, idx) => {
    if (constantRow[0] == name) {
      const currCell = constantRelativeRange.getRange(2 + idx, 2)
      currCell.setValue(value)
    }
  })
}
