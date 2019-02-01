const day_length = process.argv[2];

const fs = require('fs');
const cp = require('child_process');
const c_eol = require('os').EOL;

// const result_filename = 'result_' + (new Date()).toString().split(' ').join('_') + '.txt';
// const result_filename = 'result.json';
const result_filename = 'result.csv';

const file_list = fs.readdirSync('.');

var result_acc = [];

file_list.forEach(file => {
  if ( ! (file.startsWith('stock') && file.endsWith('.txt')) ) {
    return;
  }

  const stock_code = file.substring(6).split('.')[0];
  const cmd = 'node ./analyze_n_days.js ' + stock_code + ' ' + file + ' ' + day_length;

  console.log(stock_code);
  console.log(file);
  console.log(cmd);

  const result = cp.execSync(cmd);

  result_acc.push(JSON.parse(result));

});

// fs.writeFileSync('./' + result_filename, JSON.stringify(result_acc, null, 2), );

// CSV
var csv_result = '';

csv_result += 'stock_code' + ',' + ['period_start_end_diff'] + ',' + 'period_start_end_diff_percentage' + c_eol;

result_acc.forEach( curr_stock => {
  csv_result += curr_stock['stock_code'] + ',' + curr_stock['period_start_end_diff']['diff'] + ',' + curr_stock['period_start_end_diff']['diff_percentage'] + c_eol;
});

fs.writeFileSync('./' + result_filename, csv_result);