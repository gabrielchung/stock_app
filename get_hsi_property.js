const cp = require('child_process');
const fs = require('fs');
const eol = require('os').EOL;


const hsi_property_list = fs.readFileSync('hsi_property.txt', 'utf8');
// const stock_array = hsi_property_list.split(eol);
const stock_array = ['0016', '1997']

var time_delay = 0; 
stock_array.forEach(curr_stock_code => {
    setTimeout(get_stock_data, time_delay, curr_stock_code);
    time_delay += 10000;
});

function get_stock_data(stock_code) {
    const hk_stock_code = stock_code + '.HK';
    console.log(hk_stock_code);
    const output = cp.execSync('node get_daily.js ' + hk_stock_code);
    fs.writeFileSync('hsi_property_' + stock_code + '.txt', output);
}
