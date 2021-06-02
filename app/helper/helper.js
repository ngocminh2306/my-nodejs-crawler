const fs = require('fs');
const fetch = require('node-fetch');
const header1 = require('./header-hardcode.js');
const Helper = function() {

};

Helper.downloadImage = async (uris, filename, callback) => {
  let res = [];
  let i =0;
  for(let uri of uris) {
    const response = await fetch(uri, { 
      headers: header1
      });
    const buffer = await response.buffer();
    // let uniqueId = generate(5);
    let timeNow = new Date();
    let dir = `public/images/${timeNow.getFullYear()}/${timeNow.getMonth() + 1}/${timeNow.getDate()}`
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${filename}_${i}.jpg`, buffer, () =>  {});
    res.push(`${dir}/${filename}_${i}.jpg`);
    i++;
  }
  callback(res)
};

function generate(count) {
  let _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  for(let i = 0; i < count; i++) {
      str += _sym[parseInt(Math.random() * (_sym.length))];
  }
  return str;
}

module.exports = Helper;