var express = require('express');

const webhoseio = require('webhoseio');
const client = webhoseio.config({token: 'b183014a-29fc-4839-9ca1-2687e8311817'});
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