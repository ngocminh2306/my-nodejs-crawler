const fs = require('fs');
const fetch = require('node-fetch');
const { extension } = require('mime-types');
const { basename, extname, join } = require('path');

const header_hardcode = require('./header-hardcode.js');
const Helper = function() {

};
const delay = ms => {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve()
      }, ms)
  })
}
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
  try{
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
  }catch(e){
    callback(e, null)
  }
};


Helper.downloadChapterContent = async (uris, filename, callback) => {
  let res = [];
  let i =0;
  try{
    for(let uri of uris) {
      console.log('fetch image...' + uri)
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
    console.log({ res: res})
    callback(null, res)
  }catch(e){
    console.log({ e: e})
    callback(e, null)
  }
};

function generate(count) {
  let _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  for(let i = 0; i < count; i++) {
      str += _sym[parseInt(Math.random() * (_sym.length))];
  }
  return str;
}
function replaceAll(str) {
  let mapObj = {cat:"dog",dog:"goat",goat:"cat"};
  let re = new RegExp(Object.keys(mapObj).join("|"),"gi");

  return str.replace(re, function(matched){
      return mapObj[matched.toLowerCase()];
  });
}
module.exports = Helper;