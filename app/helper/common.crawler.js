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
        let datass= [];
        let promises = [];
        // let promises = urls.map(value => {
            // return new Promise((_resolve, _reject) =>{
                const c2 = new Crawler({
                    maxConnections: 3,
                    rateLimit: 100,
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
                        let p = new Promise((_resolve, _reject) =>{
                            if (error) {
                                _reject(error);
                            } else {
                                const $ = res.$;
                                console.log(`Tải trang thành công: LENGTH ${res.body.length}`)
                                _resolve($);
                            }
                        })
                        console.log('push')
                        datass.push(res.$)
                        promises.push(p);
                        console.log('promises length: ' + promises.length)
                        done();
                    }
                });
                // Queue just one URL, with default callback
                urls.map((v,i) => {
                    c2.queue({url:v, urlIndex: i});
                })
                c2.on('drain', (res) => {
                    // For example, release a connection to database.
                    console.log(datass.length)
                });
            // })
        // })
        Promise.all(promises).then(data => {
            console.log('data: '+data);
            resolve(data);
        }).catch(err => {
            console.log('err: '+err);
            reject(err);
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