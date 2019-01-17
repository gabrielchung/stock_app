const fs = require('fs');

const bad_result_obj = {success_flag: false};
var result_obj = {success_flag: true};

var stock_code = process.argv[2];

if (stock_code === undefined) {

    //console.log('Please provide stock code');
    process.exit();
}

// Escape special characters
stock_code = encodeURI(stock_code);

//console.log('stock_code:');
//console.log(stock_code);

var got = require('got');
const api_key = fs.readFileSync('api_key.txt');

var valid_stock_code = false;

(async() => {
  var result = await got('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + stock_code + '&apikey=' + api_key);

  const quote_obj = JSON.parse(result.body);
  result_obj['quote_obj'] = quote_obj;
  //console.log(quote_obj);

  const obj_keys = Object.keys(quote_obj['Global Quote']);

  // if (quote_obj['Global Quote']['symbol'] === undefined) {
  if (obj_keys.length === 0) {
    //console.log('Invalid stock code');
    bad_result_obj['msg'] = 'Invalid stock code';
    console.log(bad_result_obj);
    process.exit();
  }

  get_time_series();

})();

function get_time_series() {

  (async() => {
    var result = await got('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stock_code + '&apikey=' + api_key);
    result_obj['time_series'] = JSON.parse(result.body);
    console.log(JSON.stringify(result_obj, null, 2));

  })();

  // request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stock_code + '&apikey=' + api_key, function(error, response, body) {
  //   console.log(body);
  // });

}