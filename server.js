const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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
// require("./app/routes/ebook.routes.js")(app);
require("./app/routes/nettruyen.routes.js")(app);
app.listen(port, () => {
  console.log(`my crawler app listening at http://localhost:${port}`)
});
