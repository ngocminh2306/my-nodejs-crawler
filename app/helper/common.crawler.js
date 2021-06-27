const Crawler = require('crawler');
const fs = require('fs');
const CommonCrawler = function() {

};
/**
 * Load 1 trang và trả vè html $ trang đó
 */
CommonCrawler.LoadPage = (url)=>{
    return new Promise((resolve, reject) =>{
        const c2 = new Crawler({
            maxConnections: 10,
            rateLimit: 1000,
            // This will be called for each crawled page
            callback: 
            (error, res, done) => {
                if (error) {
                    reject(error);
                } else {
                    const $ = res.$;
                    console.log(`Tải trang thành công: ${url}`)
                    resolve($);
                }
                done();
            }
        });
        // Queue just one URL, with default callback
        c2.queue(url);
    })
}

CommonCrawler.CrwalerRawImage = (uris, filename, callback) => {
    let promises = [];617757
    let i =0;
    promises = uris.map(uri => {
        return new Promise((resolve, reject) =>{
            const c2 = new Crawler({
                encoding: null,
                maxConnections: 1,
                jQuery: false,// set false to suppress warning message.
                callback: 
                (error, res, done) => {
                    if (error) {
                        reject(error);
                    } else {
                        let timeNow = new Date();
                        let dir = `public/data/${timeNow.getMonth() + 1}/${timeNow.getDate()}/${timeNow.getHours()}/${timeNow.getMinutes()}`
                        if (!fs.existsSync(dir)){
                            fs.mkdirSync(dir, { recursive: true });
                        }
                        fs.createWriteStream(`${dir}/${filename}_${i}.jpg`, {
                            emitClose: true
                          }).write(res.body);

                        resolve(`${dir}/${filename}_${i}.jpg`);
                        i++;
                    }
                    done();
                }
            });
            // Queue just one URL, with default callback
            c2.queue(uri);
        })
    })
    Promise.all(promises).then(data => {
        callback(null, data.toString())
    }).catch(err => {
        console.log('err: ', err)
        callback(null, null)
    })
}

module.exports = CommonCrawler;