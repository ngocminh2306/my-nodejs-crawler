const fs = require('fs');
const request = require('request');

const Helper = function() {

};

Helper.downloadImage = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    generate(5, (uniqueId) => {
      let timeNow = new Date();
      let dir = `public/images/${timeNow.getFullYear()}/${timeNow.getMonth() + 1}/${timeNow.getDate()}`
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
      }
      request(uri).pipe(fs.createWriteStream(dir + '/' + uniqueId+filename)).on('close', callback);
    })
  });
};

function generate(count, k) {
  let _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let str = '';

  for(let i = 0; i < count; i++) {
      str += _sym[parseInt(Math.random() * (_sym.length))];
  }
  k(str);
}

module.exports = Helper;