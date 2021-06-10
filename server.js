const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})
require("./app/routes/customer.routes.js")(app);
require("./app/routes/category.routes.js")(app);
// require("./app/routes/ebook.routes.js")(app);
require("./app/routes/ebookDetail.routes.js")(app);
require("./app/routes/nettruyen.routes.js")(app);
app.listen(port, () => {
  console.log(`my crawler app listening at http://localhost:${port}`)
});
