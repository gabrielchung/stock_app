const fs = require('fs');

var stock_code = process.argv[2];

if (stock_code === undefined) {

    console.log('Please provide stock code');
    process.exit();
}

// Escape special characters
stock_code = encodeURI(stock_code);

console.log('stock_code:');
console.log(stock_code);

var got = require('got');
const api_key = fs.readFileSync('api_key.txt');

var valid_stock_code = false;

// await request('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + stock_code + '&apikey=' + api_key, function(error, response, body) {
//   const quote_obj = JSON.parse(body);
//   // console.log(quote_obj);
//   if (quote_obj['Global Quote']['symbol'] === undefined) {
//     console.log('Invalid stock code');
//     process.exit();
//   }
// });

(async() => {
  var result = await got('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + stock_code + '&apikey=' + api_key);

  const quote_obj = JSON.parse(result.body);
  console.log(quote_obj);

  const obj_keys = Object.keys(quote_obj['Global Quote']);

  // if (quote_obj['Global Quote']['symbol'] === undefined) {
  if (obj_keys.length === 0) {
    console.log('Invalid stock code');
    process.exit();
  }

  get_time_series();

})();

function get_time_series() {

  (async() => {
    var result = await got('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stock_code + '&apikey=' + api_key);
    console.log(result.body);
    // console.log(result);
    // quote_obj = JSON.parse(body);
    //   // console.log(quote_obj);
    // if (quote_obj['Global Quote']['symbol'] === undefined) {
    //   console.log('Invalid stock code');
    //   process.exit();
    // }

  })();

  // request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stock_code + '&apikey=' + api_key, function(error, response, body) {
  //   console.log(body);
  // });

}