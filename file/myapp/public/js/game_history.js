
console.log("11111111111111");

/*
temp = document.getElementById("game_history_content")

var myHTML = '<tbody>\n<tr>\n';
for (var i = 0; i < 2; i++) {
  myHTML +=  '<th>' + "1" + '</th>' + '\n'
}

myHTML += "\n</tr>\n</tbody>"

console.log(myHTML)
temp.innerHTML = myHTML

*/









var div_search_bar = new Vue({
    el: '#game_history_content',
    data: {
        entries : null
    },
    methods: {
        fetch: function() {
            $.ajax({
                url: "/transaction/history/recent",
                type: "GET",
            
                success : function(res) {
                    
                    div_search_bar.entries = res
                    console.log(div_search_bar.entries);
                },
                error: function(err) {
                  console.log(err)
                }
              });
        }
    }
});

div_search_bar.fetch()
 


