const CommonCrawler = require('../helper/common.crawler');
const Post = require('../models/post.model');
const KitesPage = function () { };

KitesPage.FindPage = (url) => {
    return new Promise((resolve, reject) => {
        CommonCrawler.LoadPage(url).then(res => {
            const $ = res;
            let el = $("#article-home li a").attr('href');
            console.log(el)
            resolve(el)
        }).catch(error => {
            reject(error)
        })
    })
}
//https://www.kites.vn/doc/tong-hop/trang-4.html?id_cate=0&page=4&in_limit=false
KitesPage.CrawlerListPosts = (url) => {
    return new Promise((resolve, reject) => {
        CommonCrawler.LoadPage(url).then(res => {
            const $ = res;
            let el2 = $("#article-home li .atc-title a");
            let postsList = [];
            el2.each(function() {
                postsList.push({ url: `http://www.kites.vn${$(this).attr('href')}`, info: $(this).text() });
            });
            resolve(postsList)
        }).catch(error => {
            reject(error)
        })
    })
}

KitesPage.CrawlerPost = (url) => {
    return new Promise((resolve, reject) => {
        CommonCrawler.LoadPage(url).then(res => {
            const $ = res;
            let element = $(".contents .article-detail");
            let post;
            element.each(function() {
                //postsList.push({ url: `http://www.kites.vn${$(this).attr('href')}`, info: $(this).text() });
                post = new Post({
                    post_title: $(this).find('.atc-title h2').text()
                 })
            });
            console.log(postsList)
            resolve(post)
        }).catch(error => {
            reject(error)
        })
    })
}
module.exports = KitesPage;