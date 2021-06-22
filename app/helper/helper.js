const fs = require('fs');
const fetch = require('node-fetch');
const { extension } = require('mime-types');
const { basename, extname, join } = require('path');

const header_hardcode = require('./header-hardcode.js');
const Helper = function() {

};

Helper.downloadImage = async (uris, filename, callback) => {
  let res = [];
  let i =0;
  for(let uri of uris) {
    console.log('fetch image...')
    const response = await fetch(uri, { headers: header_hardcode.header1 });
    const buffer = await response.buffer();
    let timeNow = new Date();
    let dir = `public/data/${timeNow.getMonth() + 1}/${timeNow.getDate()}/${timeNow.getHours()}/${timeNow.getMinutes()}`
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/${filename}_${i}.jpg`, buffer, () =>  {});
    res.push(`${dir}/${filename}_${i}.jpg`);
    i++;
  }
  callback(res)
};
Helper.downloadEbookImage = async (uri, slug, callback) => {
  let res = '';
  console.log('fetch image: ' + uri)
  const response = await fetch(uri, { headers: header_hardcode.header1 });
  const buffer = await response.buffer();
  let timeNow = new Date();
  let dir = `public/img/${timeNow.getMonth() + 1}/${timeNow.getDate()}`
  const isexits = await fs.existsSync(dir);
  if (!isexits){
    fs.mkdirSync(dir, { recursive: true });
  }

  const contentType = response.headers['content-type'];
  const ext = extension(contentType);
  let filename = generate(6);
  fs.writeFile(`${dir}/${slug}-${filename}.jpg`, buffer, () =>  {});
  res = `${dir}/${slug}-${filename}.jpg`;
  callback(null, res)
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