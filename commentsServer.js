const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));

let db = null;
let collection = null;

async function startServer() {
  // Set the db and collection variables before starting the server.
  // mongodb://<dbuser>:<dbpassword>@ds123722.mlab.com:23722/heroku_ssjp7hlt
  //mongodb://dbuser:dbpass@ref:mongolab-objective-18820:port/dbname
  db = await MongoClient.connect('mongodb://noag:helloThere@ds123722.mlab.com:23722/heroku_ssjp7hlt');
  collection = db.collection('comments');
  // Now every route can safely use the db and collection objects.
  await app.listen(3000);
  console.log('Listening on port 3000');
}
startServer();

async function getAllComments(req, res) {
const cursor = await collection.find();
const allComments = [];
while(await cursor.hasNext()){
	const result = await cursor.next();
	console.log(result);
	allComments.push(result);
}
console.log(allComments);
res.json( allComments );
}
app.get('/getAllComments', getAllComments);

async function getQuery(req, res) {
  const field = req.params.field
  const value = req.params.value
  console.log('in delete, field ' + field + ' value: ' +value);
  
  const cursor = await collection.findOne({field: value});
  res.json(cursor);
}
app.get('/:field/:value',  getQuery);


async function onPost(req, res) {
  const messageBody = req.body;
  console.log(messageBody);

  const author = messageBody.author;
  const text = messageBody.text;
  // could do some error checkign here
  const query = { author: author };
  const newEntry = { author: author , text: text };
  const params = { upsert: true };
  const response =
      await collection.update(query, newEntry, params);

  res.json({ success: true });
}
app.post('/api', jsonParser, onPost);

async function onDelete(req, res) {
  const field = req.params.field
  let value = req.params.value
  console.log('in delete, field ' + field + ' value: ' +value);
  
  let response = {};
  if(field === '_id'){
	response = await collection.deleteOne({'_id': mongodb.ObjectID(value)});
	console.log('converting value to ' + value);
  }  
  else{
	response = await collection.deleteOne({field: value});
  }
  
  res.json( { status: response} );
}
app.delete('/:field/:value',  onDelete);
