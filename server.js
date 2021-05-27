const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})
require("./app/routes/customer.routes.js")(app);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
