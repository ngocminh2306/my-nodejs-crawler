const Crawler = require('crawler');
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

module.exports = CommonCrawler;