const fs = require('fs');

const bad_result_obj = {success_flag: false};
var result_obj = {success_flag: true};

var stock_code = process.argv[2];

if (stock_code === undefined) {
    process.exit();
}

// Escape special characters
stock_code = encodeURI(stock_code);

var got = require('got');
const api_key = fs.readFileSync('api_key.txt');

var valid_stock_code = false;

(async() => {
  var result = await got('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + stock_code + '&apikey=' + api_key);

  const quote_obj = JSON.parse(result.body);
  result_obj['quote_obj'] = clean_up_global_quote_obj(quote_obj);

  const obj_keys = Object.keys(quote_obj['Global Quote']);

  if (obj_keys.length === 0) {
    bad_result_obj['msg'] = 'Invalid stock code';
    console.log(bad_result_obj);
    process.exit();
  }

  get_time_series();

})();

function get_time_series() {

  (async() => {
    var result = await got('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + stock_code + '&apikey=' + api_key);
    result_obj['time_series'] = clean_up_time_series_obj(JSON.parse(result.body));
    console.log(JSON.stringify(result_obj, null, 2));

  })();

}

// Clean up unnecessary index
function clean_up_global_quote_obj(global_quote_obj) {

  var result_obj = {};

  result_obj['Global Quote'] = {};

  // Copy all values to the new object.
  Object.keys(global_quote_obj['Global Quote']).forEach(curr_attribute_key => {
    result_obj['Global Quote'][curr_attribute_key.substr(4)] = global_quote_obj['Global Quote'][curr_attribute_key];
  });

  return result_obj;
}

// Clean up unnecessary index
function clean_up_time_series_obj(time_series_obj) {

  var result_obj = {};

  result_obj['Meta Data'] = {};
  result_obj['Time Series (Daily)'] = {};

  // Copy all values to the new object.
  Object.keys(time_series_obj['Meta Data']).forEach(curr_attribute_key => {
    result_obj['Meta Data'][curr_attribute_key.substr(3)] = time_series_obj['Meta Data'][curr_attribute_key];
  });

  // Copy all values to the new object.
  Object.keys(time_series_obj['Time Series (Daily)']).forEach(curr_date_key => {
    
    result_obj['Time Series (Daily)'][curr_date_key] = {};

    Object.keys(time_series_obj['Time Series (Daily)'][curr_date_key]).forEach(curr_attribute_key => {
      result_obj['Time Series (Daily)'][curr_date_key][curr_attribute_key.substr(3)] = time_series_obj['Time Series (Daily)'][curr_date_key][curr_attribute_key];
    });
  });

  return result_obj;
}