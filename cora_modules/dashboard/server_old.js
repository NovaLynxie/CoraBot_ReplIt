const express = require('express');
const app = express();

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
  //res.send('Code 200. Success!')
  //res.render('test.pug');
  res.render('status.pug');
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server connected to port ${port}`);
});