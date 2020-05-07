const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
// const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'management'
});
connection.connect();


const multer = require('multer');
const upload = multer({ dest: './upload' })

app.get('/api/customers', (req, res) => {

  connection.query(
    "SELECT * FROM customer ",
    (err, rows, fields) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.send(rows);
    }
  );

});

app.use('/image', express.static('./upload'));

app.post('/api/customers', upload.single('image'), (req, res) => {
  let sql = "INSERT INTO customer (image, number, name, price, count) VALUES (?, ?, ?, ?, ?)";
  let image = '/image/';
  let number = req.body.number;
  let name = req.body.name;
  let price = req.body.price;
  let count = req.body.count;
  let params = [image, number, name, price, count];
  console.log(params)
  connection.query(sql, params,
    (err, rows) => {
      res.send(rows);
      console.log(rows);
    }
  );
}
);

app.post('/api/product', (req, res) => {
  let number = req.body.number;
  let sql = `SELECT * FROM customer WHERE ean=?`
  connection.query(sql, [number],
    (err, rows) => {
      res.send(rows);
      console.log(rows);
    }
  );
}
);

app.post('/api/scanner', (req, res) => {
  let sql = "INSERT INTO sn (name) VALUES (?)";
  var name = req.body.name
  console.log(req.body)
  let params = [name];
  console.log(params)
  connection.query(sql, params,
    (err, rows) => {
      res.send(rows);
      console.log(rows);
    }
  );


}


);




app.delete('/api/customers/:id', (req, res) => {
  let sql = 'UPDATE customer SET isDeleted = 1 WHERE id = ?';
  let params = [req.params.id];
  connection.query(sql, params,
    (err, rows, fields) => {
      res.send(rows);
    }
  )
});

app.listen(5000, () => console.log(`Listening on port ${port}`));
