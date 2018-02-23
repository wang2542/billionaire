var express = require('express');

const webhoseio = require('webhoseio');
const client = webhoseio.config({token: 'cf0134db-bd58-480c-b9ab-2aa7e552dab5'});
var bodyParser = require('body-parser');

var query_params = {
  "q": "“stocks” language:english rating:>4",
  "sort": "crawled"
}
module.exports.getNews = function(callback) {
 client.query('filterWebContent', query_params)
  .then((output) => {
   // console.log(output);
    console.log("go api");
    //console.log(output['posts'][0]['title']); // Print the text of the first post
    //console.log(output['posts'][0]['published']); // Print the text of the first post publication date
    callback(output);
});
}