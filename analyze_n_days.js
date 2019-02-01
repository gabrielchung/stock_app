const stock_code = process.argv[2];
const stock_data_filename = process.argv[3];
const day_length = process.argv[4];
const show_price_flag = (process.argv[5] === 'true');

const fs = require('fs');

const data_str = fs.readFileSync(stock_data_filename, 'utf-8');
const data_obj = JSON.parse(data_str);
const time_series = data_obj['time_series']['Time Series (Daily)'];
const date_list = Object.keys(time_series);

var date_data = [];
var stock_data = [];

// get first 7 days
for (var i=0; i<day_length; i++) {
  date_data.push(date_list[i]);
}

date_data = date_data.reverse();

var curr_date_data;

date_data.forEach( date => {
  curr_date_data = JSON.parse(JSON.stringify(time_series[date]));
  curr_date_data['date'] = date;
  stock_data.push(curr_date_data);
});

// console.log(stock_data);

// get period low
var period_low = stock_data[0]['low'];
var period_low_date = stock_data[0]['date'];
var period_low_date_index = 0;

var curr_stock_data;

for (var i=0; i<stock_data.length; i++) {
  curr_stock_data = stock_data[i];
  if (curr_stock_data['low'] < period_low) {
    period_low = curr_stock_data['low'];
    period_low_date = curr_stock_data['date'];
    period_low_date_index = i;
  }
}

// console.log({period_low: {price: period_low, date: period_low_date, index: period_low_date_index}});

// get period high
var period_high = stock_data[0]['high'];
var period_high_date = stock_data[0]['date'];
var period_high_date_index = 0;

var curr_stock_data;

for (var i=0; i<stock_data.length; i++) {
  curr_stock_data = stock_data[i];
  if (curr_stock_data['high'] > period_high) {
    period_high = curr_stock_data['high'];
    period_high_date = curr_stock_data['date'];
    period_high_date_index = i;
  }
}

// console.log({period_high: {price: period_high, date: period_high_date, index: period_high_date_index}});

// start

var period_start = stock_data[0]['open'];
var period_start_date = stock_data[0]['date'];
var period_start_date_index = 0;

const period_start_obj = {price: period_start, date: period_start_date, index: period_start_date_index};
if (show_price_flag) {
  console.log({period_start: period_start_obj});
}

// end

var period_end = stock_data[stock_data.length-1]['close'];
var period_end_date = stock_data[stock_data.length-1]['date'];
var period_end_date_index = stock_data.length-1;

const period_end_obj = {price: period_end, date: period_end_date, index: period_end_date_index};
if (show_price_flag) {
  console.log({period_end: period_end_obj});
}

// get period low-high difference
//
// Not needed for now

// get period start-end difference and percentage
const period_start_end_diff_obj = {
                                     diff: period_end_obj['price'] - period_start_obj['price']
                                    ,diff_percentage: (period_end_obj['price'] - period_start_obj['price']) / period_start_obj['price'] * 100
                                  };

console.log(
            JSON.stringify(
              {
                 stock_code: stock_code
                ,period_start_end_diff: period_start_end_diff_obj
                ,period_start_date: period_start_date
                ,period_end_date: period_end_date
              }
            )
              );

// days of increase

// days of decrease