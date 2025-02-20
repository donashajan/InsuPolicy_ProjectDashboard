const express = require('express');
const app = express();
const router = express.Router();

const {google} = require('googleapis');
const fs = require('fs');

const dotenv = require('dotenv');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const { version } = require('os');
var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Set view engine to ejs
app.set("view engine", "ejs"); 

//Tell Express where we keep our index.ejs
//app.set("views", __dirname + "/viewPages/"); 

 // Load environment variables from a .env file into process.env
 dotenv.config();

//path of the html pages
const path = __dirname + '/views/';
let insertId;

const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',  // Path to your service account key file.
  scopes: ['https://www.googleapis.com/auth/spreadsheets']  // Scope for Google Sheets API.
});


//Listening port 
const PORT = 8080;
const HOST = '0.0.0.0';

//database connection
const database = mysql.createConnection({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  port: '3306'
}
);

// function to add the details
app.post('/add', async(req, res) => {
  const query = `INSERT INTO login_details (firstname, lastname,dob,email,coverage_amount,country,policy,gender) VALUES (?, ?, ?, ?, ?, ?, ? ,?)`;
   database.query(query, [req.body.firstname, req.body.lastname, req.body.dob,req.body.email,req.body.coverageAmount,req.body.country, req.body.policy, req.body.gender], (err, results) => {
    if (err) throw err;
    else{
    insertId = results.insertId;
    console.log(" in add " + insertId);
     // Send a response to the client
     res.render(path + "successPage",{insertId : insertId});
    }
  });

 writeToSheet([[req.body.firstname, req.body.lastname,req.body.dob,req.body.email,req.body.coverageAmount,req.body.country,req.body.policy,req.body.gender]]);

   
});
// function to get  the details
app.get('/getdetails', (req, res) => {
  console.log(" in get "+insertId);
  const query = `SELECT * FROM login_details where id= ?`;
  database.query(query, [insertId],(err, data) => {
    if (err) throw err;
    else{
      console.log(data[0]);
    return res.render(path+"viewDetails", { data: data[0]});
    }
    
});
  
});
// Asynchronous function to write data to a Google Sheet.
async function writeToSheet(values) {
  const sheets = google.sheets({ version: 'v4', auth });  // Creates a Sheets API client instance.
  const spreadsheetId = '14Ra-qyrieHep7BuAlmWov2JkYysVK4W_EH43h3t96Rw';  // The ID of the spreadsheet.
  const range = 'Sheet1!A1';  // The range in the sheet where data will be written.
  const valueInputOption = 'USER_ENTERED';  // How input data should be interpreted.
  const resource = { values };  // The data to be written.
  console.log(values);

  try {
      const res = await sheets.spreadsheets.values.append({
          spreadsheetId, range, valueInputOption, resource
      })
      return res;  // Returns the response from the Sheets API.
  } catch (error) {
      console.error('error', error);  // Logs errors.
  }
}

// Fetch data from MySQL and render it in the dashboard
app.get('/all', (req, res) => {
  const query = 'SELECT * FROM login_details';

  database.query(query, [insertId],(err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching data');
    }
    else{
      console.log(data);
    // Render the dashboard view with data from the database
    res.render('dashboard', { applications: data });
    }
  });
});

router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});

  router.get('/', function(req,res){
    res.sendFile(path + 'index.html');
  });
  
  app.use(express.static(path));
app.use('/', router);



app.listen(PORT,HOST);
console.log('Running on http://localhost:' + PORT);
