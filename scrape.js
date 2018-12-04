const rp = require('request-promise');
const cheerio = require('cheerio');
var mysql = require('mysql');
const rowData = [];
const secondColumn = [];
const thirdColumn = [];
const fourthColumn = [];
var path = require('path');
var url = require('url');  
var fs = require('fs');
var express = require('express')
var app = express();
var session = require('express-session');
app.use(express.static(__dirname+"/scripts"));
app.use(session({ secret: 'ok', resave:false, saveUninitialized:true}));
//app.get("/",function(request,response){
	//response.sendFile(path.join(__dirname+"/scripts/Demographics.html"));
//})
app.listen(8080);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "scrapingDb"
});
// connect to database
con.connect();
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
const options = {
    uri: `https://ndb.nal.usda.gov/ndb/search/list`,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  rp(options)
  .then(($) => {
    
    var tableNDA= $('.badge').length;
    $('.table td:nth-child(2) a').each(function(){
        secondColumn.push($(this).text());
        // console.log($(this).html());
    })
	$('.table td:nth-child(3) a').each(function(){
        thirdColumn.push($(this).text());
        // console.log($(this).html());
    })
	$('.table td:nth-child(4) a').each(function(){
        fourthColumn.push($(this).text());
        // console.log($(this).html());
    })
 //console.log(SecondColumn.length);
    //console.log(SecondColumn.length);
   for(var i=0; i<secondColumn.length; i++){
	  var obj1 = [];
	  var obj2 = [];
	  var obj3 = [];
	  var objconcat = [];
	  var objconcat1 = [];
	  obj1 = secondColumn[i];
	  obj2 = thirdColumn[i];
	  obj3 = fourthColumn[i];
	  
	  objconcat = obj1.concat(obj2);
	  objconcat1 = objconcat.concat(obj3);
	  rowData.push([obj1,obj2,obj3]);  
  }
  console.log(rowData);
  var sql = "INSERT INTO food_details (NDB_ID,food_desc,manufacturer) VALUES ?";
var values = rowData;
con.query(sql, [values], function(err) {
    if (err) throw err;
    con.end();
});
  //console.log(rowData);

  })
 
  .catch((err) => {
    console.log(err);
  });
