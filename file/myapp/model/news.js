var express = require('express');

const webhoseio = require('webhoseio');
const client = webhoseio.config({token: '5658dc29-47e9-4c39-bc56-fc66b296d4ec'});
var bodyParser = require('body-parser');

var query_params = {
  "q": "\"stock\" language:english site_type:news site:cnn.com",
	"sort": "crawled"
}
module.exports.getNews = function(callback) {
 client.query('filterWebContent', query_params)
  .then((output) => {
    //console.log(output);
    //console.log("go api");
    //console.log(output['posts'][0]['title']); // Print the text of the first post
    //console.log(output['posts'][0]['published']); // Print the text of the first post publication date
    callback(output);
});
}