const Crawler = require('crawler');
const fs = require('fs');
const header_hardcode = require('./header-hardcode');
const CommonCrawler = function() {

};
/**
 * Load 1 trang và trả vè html $ trang đó
 */
CommonCrawler.LoadPage = (url)=> {
    return new Promise((resolve, reject) =>{
        const c2 = new Crawler({
            maxConnections: 1,
            rateLimit: 5000,
            jQuery: {
                name: 'cheerio',
                options: {
                    normalizeWhitespace: true,
                    xmlMode: true,
                    decodeEntities: false
                }
            },
            // This will be called for each crawled page
            callback: 
            (error, res, done) => {
                if (error) {
                    reject(error);
                } else {
                    const $ = res.$;
                    console.log(`Tải trang thành công: ${url}: LENGTH ${res.body.length}`)
                    resolve($);
                }
                done();
            }
        });
        // Queue just one URL, with default callback
        c2.queue(url);
    })
}

CommonCrawler.LoadPages = (urls)=>{
    return new Promise((resolve, reject) =>{
        const c2 = new Crawler({
            maxConnections: 1,
            rateLimit: 5000,
            jQuery: {
                name: 'cheerio',
                options: {
                    normalizeWhitespace: true,
                    xmlMode: true,
                    decodeEntities: false
                }
            },
            // This will be called for each crawled page
            callback: 
            (error, res, done) => {
                if (error) {
                    reject(error);
                } else {
                    const $ = res.$;
                    console.log(`Tải trang thành công: ${url}: LENGTH ${res.body.length}`)
                    resolve($);
                }
                done();
            }
        });
        // Queue just one URL, with default callback
        urls.map((v,i) => {

            c2.queue({url:url, urlIndex: i});
        })
    })
}

CommonCrawler.CrwalerRawImage = (uris, filename, callback) => {
    let promises = [];
    promises = uris.map((uri, index) => {
        return new Promise((resolve, reject) =>{
            let timeNow = new Date();
            let dir = `public/data/${timeNow.getMonth() + 1}/${timeNow.getDate()}/${timeNow.getHours()}/${timeNow.getMinutes()}`;
            let fileName = `public/data/${timeNow.getMonth() + 1}/${timeNow.getDate()}/${timeNow.getHours()}/${timeNow.getMinutes()}/${filename}_${index}.jpg`;
            const c2 = new Crawler({
                headers: header_hardcode.header1,
                encoding: null,
                maxConnections: 10,
                retries: 10,
                jQuery: false,// set false to suppress warning message.
                callback: (error, res, done) => {
                    if (error) {
                        console.log('error: ', error)
                        reject(error);
                    } else {
                        try{
                            if (!fs.existsSync(dir)){
                                fs.mkdirSync(dir, { recursive: true });
                            }
                            if (!fs.existsSync(res.options.filename)){
                                fs.createWriteStream(res.options.filename, { emitClose: true }).write(res.body);
                                resolve(res.options.filename);
                            }
                        }catch(e){
                            console.log({ e: e})
                            reject(e);
                        }
                    }
                    done();
                }
            });
            // Queue just one URL, with default callback
            c2.queue({uri: uri, filename: fileName});
        })
    })
    Promise.all(promises).then(data => {
        callback(null, data.toString())
    }).catch(err => {
        console.log('err: ', err)
        callback(null, null)
    })
}

function delay(t, v) {
    return new Promise(function(resolve) { 
        setTimeout(resolve.bind(null, v), t)
    });
 }

module.exports = CommonCrawler;