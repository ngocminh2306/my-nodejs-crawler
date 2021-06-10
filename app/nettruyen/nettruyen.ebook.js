const CommonCrawler = require('./common.crawler');
const EbookDetail = require("../models/ebookDetail.model.js");
const NetTruyenEbook = function () { };

NetTruyenEbook.CrawlerEbook = (ebook_source_url) => {
    return new Promise((resovle, reject) => {
        CommonCrawler.LoadPage(ebook_source_url).then(res => {
            let $ = res;
            let lstEbook = [];
            let title = $('#item-detail .title-detail').text();
            let imageUrl = $('#item-detail .detail-info img').attr('src');
            let content = $('#item-detail .detail-content p').text();
            let author = $('#item-detail .detail-info .author a').text();
            let cates = $('#item-detail .detail-info .list-info .kind .col-xs-8').text();
            let view = 0
            $('#item-detail .detail-info .list-info .row .col-xs-8').each((i, e) => {
                console.log(i)
                if(i == 4){
                    view = $(e).text();
                }
            })
            
            let rate = Number($("#item-detail .col-info span[itemprop='ratingValue']").text());
            let orther_name = $('#item-detail .detail-info h2.other-name').text();
            let status_str = $('#item-detail .detail-info .list-info .status p.col-xs-8').text();
            let ebookDetail = new EbookDetail({
                title: title,
                imageUrl: imageUrl,
                content: content,
                orther_name: orther_name,
                author: author,
                cates: cates,
                view: view,
                rate: rate,
                status_str: status_str,
                slug: ''
            })
            lstEbook.push(ebookDetail);
            resovle(lstEbook)
        }).then(err => reject(err));
    })
}

module.exports = NetTruyenEbook;