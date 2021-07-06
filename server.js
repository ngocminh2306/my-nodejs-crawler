const express = require('express');
const schedule = require('node-schedule');
const cors = require('cors');
const bodyParser = require('body-parser');
const DtruyenTextEbook = require("./app/_dtruyen/dtruyen.text-ebook");
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
  res.json({'message': 'ok'});
})
// require("./app/routes/customer.routes.js")(app);
require("./app/routes/category.routes.js")(app);
require("./app/routes/kites.routes.js")(app);
require("./app/routes/nettruyen.routes.js")(app);
require("./app/routes/dtruyen.routers.js")(app);

app.listen(port, () => {
  console.log(`my crawler app listening at http://localhost:${port}`)
  const job = schedule.scheduleJob('1 * * * * *', function(fireDate){
    console.log('Job 1');
    DtruyenTextEbook.CrawlEbookByCategory('https://dtruyen.com/tien-hiep/',1,28)
  });
  const job2 = schedule.scheduleJob('1 * * * * *', function(fireDate){
    console.log('JOB2');
    DtruyenTextEbook.CrawlEbookByCategory('https://dtruyen.com/ngon-tinh/',1,359)
  });
  const job3 = schedule.scheduleJob('1/5 * * * * *', function(fireDate){
    console.log('JOB3');
    DtruyenTextEbook.CrawlEbookByCategory('https://dtruyen.com/do-thi/',1,42)
  });
  const job4 = schedule.scheduleJob('1/10 * * * * *', function(fireDate){
    console.log('JOB4');
    DtruyenTextEbook.CrawlEbookByCategory('https://dtruyen.com/lich-su/',1,6)
  });
});
