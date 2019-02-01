const cp = require('child_process');
const fs = require('fs');
const eol = require('os').EOL;


const hsi_property_list = fs.readFileSync('my_stock_list.txt', 'utf8');
const stock_array = hsi_property_list.split(eol);

var time_delay = 0; 
stock_array.forEach(curr_stock_code => {

    // const hk_stock_code = curr_stock_code + '.HK';
    const us_stock_code = curr_stock_code;
    console.log(us_stock_code);

    const filename = 'stock_' + curr_stock_code + '.txt';

    if (fs.existsSync(filename)) {
        const file_content = fs.readFileSync(filename, 'utf8');
        if (file_content.length !== 0) {
            console.log(us_stock_code + ': File with data already exists. Skip asking quote again.');
            return; //continue in the loop
        }
    }

    setTimeout(get_stock_data, time_delay, us_stock_code, filename);
    time_delay += 20000;
});

function get_stock_data(stock_code, filename) {
    console.log(stock_code + ': Working ...');
    const output = cp.execSync('node get_daily.js ' + stock_code);
    fs.writeFileSync(filename, output);
    console.log(stock_code + ': Complete');
}
