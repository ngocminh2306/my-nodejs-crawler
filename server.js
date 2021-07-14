const express = require('express');
const schedule = require('node-schedule');
const cors = require('cors');
const bodyParser = require('body-parser');
const DtruyenTextEbook = require("./app/_dtruyen/dtruyen.text-ebook");
const DTruyenChapter = require("./app/_dtruyen/dtruyen.chapter");
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (req, res) => {
        res.json({ 'message': 'ok' });
    })
    // require("./app/routes/customer.routes.js")(app);
require("./app/routes/category.routes.js")(app);
require("./app/routes/kites.routes.js")(app);
require("./app/routes/nettruyen.routes.js")(app);
require("./app/routes/dtruyen.routers.js")(app);

app.listen(port, () => {
    // console.log(`my crawler app listening at http://localhost:${port}`)
    // const job = schedule.scheduleJob('1 * * * * *', function(fireDate) {
    //     console.log('Job 1');
    //     // DtruyenTextEbook.CrawlEbookByCategory('https://dtruyen.com/tien-hiep/',1,28)
    // });
    // let i = 100;
    // const job2 = schedule.scheduleJob('1 * * * * *', function(fireDate) {
    //     console.log('JOB2');
    //     DtruyenTextEbook.CrawlEbookByCategory('https://dtruyen.com/ngon-tinh/', i, i);
    //     i++;
    // });
    
    // const job3 = schedule.scheduleJob('1/5 * * * * *', function(fireDate) {
    //     console.log('JOB3');
    //     DtruyenTextEbook.CrawlEbookByCategory('https://dtruyen.com/do-thi/', 1, 42)
    // });
    // const job4 = schedule.scheduleJob('1/10 * * * * *', function(fireDate) {
    //     console.log('JOB4');
    //     DtruyenTextEbook.CrawlEbookByCategory('https://dtruyen.com/lich-su/', 1, 6)
    // });
    // let i = 1;
    // const job6 = schedule.scheduleJob('1 * * * * *', function(fireDate) {
    //     console.log('JOB6');
    //     DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/van-co-chi-ton/'+ i+'/');
    //     if(i ==126) {
    //         i = 1;
    //     }else{
    //         i++;
    //     }
    // });
    // let j = 1;
    // schedule.scheduleJob('2 * * * * *', function(fireDate) {
    //     console.log('JOB7');
    //     DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/than-hoang/'+ j+'/');
    //     if(j ==57) {
    //         j = 1;
    //     }else{
    //         j++;
    //     }
    // });

    // let k = 1;
    // schedule.scheduleJob('1 * * * * *', function(fireDate) {
    //     console.log('JOB7');
    //     DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/kiem-dao-doc-ton/'+ k+'/');
    //     if(k ==61) {
    //        k = 1;
    //     }else{
    //         k++;
    //     }
    // });

    // let l = 1;
    // schedule.scheduleJob('3 * * * * *', function(fireDate) {
    //     console.log('JOB7');
    //     DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/hop-dong-hon-nhan-100-ngay/'+ l+'/');
    //     if(l ==14) {
    //         l = 1;
    //     }else{
    //         l++;
    //     }
    // });

    let n = 1,m = 1,j = 1,k = 1,h = 1,x = 1,y = 1,z = 1;
    schedule.scheduleJob('1 * * * * *', function(fireDate) {
        // if(n <= 69) {
        //     console.log(n)
        //     DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/linh-chu/'+ n+'/');
        //     n++;
        // }else{
        //     if(m <= 33) {
        //         DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/tao-than/'+ m+'/');
        //         m++
        //     }else{
        //         if(j <= 11) {
        //             DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/vo-yeu-xinh-dep-cua-tong-giam-doc-tan-ac-wt1/'+ j+'/');
        //             j++
        //         }else{
        //             if(k <= 120) {
        //                 DTruyenChapter.CrawlAndSaveChapter2('	https://dtruyen.com/hang-ty-cung-chieu-vo-nam-than-hon-sau-101-wt1/'+ k+'/');
        //                 k++
        //             }else{
        //                 if(h <= 28) {
        //                     DTruyenChapter.CrawlAndSaveChapter2('	https://dtruyen.com/chao-buoi-sang-tong-thong-dai-nhan/'+ h+'/');
        //                     h++
        //                 }
        //             }
        //         }
        //     }
        // }

        if(n <= 12) {
            console.log(n)
            DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/nguoi-chong-mau-lanh-wt1/'+ n+'/');
            n++;
        }else{
            if(m <= 24) {
                DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/tong-tai-dai-nhan-the-luc-tot-wt1/'+ m+'/');
                m++
            }else{
                if(j <= 21) {
                    DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/duong-chon-thanh-hau-ta-mi-lanh-de-on-nhu-yeu/'+ j+'/');
                    j++
                }else{
                    if(k <= 9) {
                        DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/hop-dong-tinh-nhan/'+ k+'/');
                        k++
                    }else{
                        if(h <= 42) {
                            DTruyenChapter.CrawlAndSaveChapter2('https://dtruyen.com/vo-thuong-wt1/'+ h+'/');
                            h++
                        }
                    }
                }
            }
        }
    });

});

// https://dtruyen.com/than-y-quy-nu-cung-chieu-that-hoang-phi/
// https://dtruyen.com/vu-nghich-can-khon/
// https://dtruyen.com/the-gioi-hoan-my/
// https://dtruyen.com/tien-ha-phong-bao/
// https://dtruyen.com/chan-linh-cuu-bien/
// https://dtruyen.com/nguoi-chong-mau-lanh-wt1/
// https://dtruyen.com/tong-tai-dai-nhan-the-luc-tot-wt1/
// https://dtruyen.com/duong-chon-thanh-hau-ta-mi-lanh-de-on-nhu-yeu/
// https://dtruyen.com/hop-dong-tinh-nhan/
// https://dtruyen.com/vo-thuong-wt1/
// https://dtruyen.com/thien-ha/
// https://dtruyen.com/thuc-hoan-gia-yeu/
// https://dtruyen.com/thien-ton-trung-sinh/
// https://dtruyen.com/tu-dai-tai-phiet-dang-ky-ket-hon-tre/
// https://dtruyen.com/quy-y-quan-vuong-phi/
// https://dtruyen.com/dai-than-om-vao-long-101-nu-hon-sau/
// https://dtruyen.com/sac-dep-kho-cuong/
// https://dtruyen.com/hoa-son-tien-mon/
// https://dtruyen.com/xuyen-nhanh-nam-than-bung-chay-di/
// https://dtruyen.com/dung-lam-osin-nua-lam-nguoi-yeu-anh-di/
// https://dtruyen.com/than-hoang/
// https://dtruyen.com/cong-tu-dien-khung/
// https://dtruyen.com/dac-cong-ta-phi/
// https://dtruyen.com/sieu-cap-cuong-gia/
// https://dtruyen.com/chin-tuoi-tieu-yeu-hau/
// https://dtruyen.com/trung-sinh-sieu-sao-vo-yeu-cua-am-da-de-vuong/
// https://dtruyen.com/tieu-thiep-khong-de-lam/
// https://dtruyen.com/neu-oc-sen-co-tinh-yeu/
// https://dtruyen.com/ket-hon-chop-nhoang-tong-tai-ly-hon-di-wt1/
// https://dtruyen.com/hoang-kim-dong-wt1/
// https://dtruyen.com/thanh-mai-muon-treo-tuong/
// https://dtruyen.com/tieu-yeu-tinh-hoa-thuy-xem-tram-thu-phuc-nang/