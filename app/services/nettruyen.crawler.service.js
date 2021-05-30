const Crawler = require('crawler');
const Category = require("../models/category.model.js");
const Ebook = require("../models/ebook.model.js");
const EbookDetail = require("../models/ebookDetail.model.js");

const nettruyen = function() {

 };
nettruyen.crawler = result =>{
    let category;
    let insertedObj = [];
    const c = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: 
        (error, res, done) => {
            if (error) {
                console.log(error);
            } else {
                const $ = res.$;
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                $($('.dropdown-menu.megamenu')[0]).find( "li" ).each((i, e)=>{ 
                    let description = $(e).find('a').attr('data-title')
                    let url = $(e).find('a').attr('href')
                    let name = $(e).find('a').attr('title')?$(e).find('a').attr('title'):$(e).find('a strong').text()
                    let slug = '';
                    if(url){
                        slug = url.split('/').pop()
                    }
                    let pageCount = 1;
                        const c2 = new Crawler({
                            maxConnections: 10,
                            // This will be called for each crawled page
                            callback: 
                            (error, res, done) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    const $ = res.$;
                                    //console.log($(".pagination li a[title='Trang cuối']"))
                                    let el = $(".pagination li a[title='Trang cuối']").attr('href');
                                    if(el){
                                        
                                        if(el.split('=')){
                                            pageCount = Number(el.split('=').pop())
                                        }else{
                                            pageCount = 1;
                                        }
                                    }
                                    Category.findBySlug(slug, (err, data) => {
                                        category = new Category({
                                            name: name,
                                            slug: slug,
                                            description: description,
                                            source: url,
                                            pageCount: pageCount
                                        });
                                        if(!data || data.length ==0) {
                
                                            Category.create(category, (err, data) => {
                                                if (err)
                                                   console.log('Error');
                                                else  
                                                insertedObj.push(category);
                                            });
                                        }else{
                                            if(pageCount != 0 && data.pageCount != pageCount){
                                                Category.updateById(data.id, category, (err, data) =>{
                                                    if (err)
                                                    console.log('Error');
                                                 else  
                                                    insertedObj.push(category);
                                                })
                                            }
                                        }
                                    })
                                    
                                }
                                done();
                            }
                        });
                        // Queue just one URL, with default callback
                        c2.queue(url);
                })
                result(null, insertedObj);
            }
            done();
        }
    });
    // Queue just one URL, with default callback
    c.queue('http://www.nettruyentop.com/');
    
}
nettruyen.crawlerEbook = (cateId, result) =>{
    Category.findById(cateId, (err, data) => {
        if (err){
            result(err, null);
        }
        else {
            
            for(let page = 1 ;page <=data.pageCount; page++) {
                let insertedObj = [];
                const c = new Crawler({
                    maxConnections: 10,
                    // This will be called for each crawled page
                    callback: 
                    (error, res, done) => {
                        if (error) {
                            console.log(error);
                        } else {
                            let ebook;
                            const $ = res.$;
                            $('.ModuleContent .items .row .item').each((i,e)=>{
                                let source = $(e).find('.jtip').attr('href');
                                let name = $(e).find('.jtip').text();
                                let view = $(e).find('.image .pull-left').text().split(' ')[1].replace('.','');
                                view = Number(view);
                                let imageUrl =  $(e).find('.image img').attr('src');
                                let orginImageUrl = $(e).find('.image img').attr('data-original');
                                let slug = $(e).find('.jtip').attr('href').split('/').pop();
                                
                                //check item đã có chưa
                                Ebook.findByKeyWord(slug, (err, data)=>{
                                    if(!data || data.length ==0) {
                                        ebook = new Ebook({
                                            title: name,
                                            alt: name,
                                            source: source,
                                            imageUrl:imageUrl,
                                            originImageUrl: orginImageUrl,
                                            view: view,
                                            slug: slug,
                                            page: page
                                        })
                                        Ebook.create(ebook, (err, data) => {
                                            if (err)
                                               console.log('Error');
                                            else  
                                            insertedObj.push(ebook);
                                        });
                                    }
                                })
                            })
                        }
                        done();
                    }
                });
                // Queue just one URL, with default callback
                c.queue(data.source+'?page='+page);
            }
        }
    })
}

nettruyen.crawlerEbookDetail = (fromId, toId, result) =>{
    let ebookDetail;
    let insertedObj = [];
    Ebook.findByRangeId(fromId, toId, (err, data) => {
        if (err){
            result(err, null);
        }
        else {
            data.forEach(element => {
                const c = new Crawler({
                    maxConnections: 10,
                    // This will be called for each crawled page
                    callback: 
                    (error, res, done) => {
                            if (error) {
                                console.log(error);
                            } else {
                                const $ = res.$;
                                let title = $('#item-detail .title-detail').text();
                                let imageUrl = $('#item-detail .detail-info img').attr('src');
                                let content = $('#item-detail .detail-content p').text();
                                let author = $('#item-detail .detail-info .author a').text();
                                let cates = $('#item-detail .detail-info .list-info .kind .col-xs-8').text();
                                let view = element.view;
                                let rate = Number($("#item-detail .col-info span[itemprop='ratingValue']").text());
                                let orther_name = $('#item-detail .detail-info h2.other-name').text();
                                let status_str = $('#item-detail .detail-info .list-info .status p.col-xs-8').text();
                                console.log('rate: ', rate);
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
                                    slug: element.slug
                                })
                                console.log(ebookDetail)
                                EbookDetail.create(ebookDetail, (err, data) => {
                                    if (err)
                                       console.log('Error');
                                    else  {
                                        insertedObj.push(ebookDetail);
                                        
                                    }
                                        
                                });
                                // $($('.dropdown-menu.megamenu')[0]).find( "li" ).each((i, e)=>{ 
                                //     let description = $(e).find('a').attr('data-title')
                                //     let url = $(e).find('a').attr('href')
                                //     let name = $(e).find('a').attr('title')?$(e).find('a').attr('title'):$(e).find('a strong').text()
                                //     let slug = '';
                                //     if(url){
                                //         slug = url.split('/').pop()
                                //     }
                                // })
                            }
                            done();
                        }
                    });
                    // Queue just one URL, with default callback
                    c.queue(element.source);
                    // result(null, insertedObj);
            });
        }
    })
}

module.exports = nettruyen;