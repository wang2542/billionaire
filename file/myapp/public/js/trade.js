
var shell = document.getElementById("shell")

var symbol = null
var transaction = null 
var quantity = null
var price = null

function preview() {
    symbol = document.getElementById("trade_symbol").value
    transaction = document.getElementById("trade_transaction").value
    quantity = document.getElementById("trade_quantity").value
    price = 1

    document.getElementById("preview_symbol").value = symbol
    document.getElementById("preview_price").value = price
    document.getElementById("preview_quantity").value = quantity
    document.getElementById("preview_transaction").value = transaction


    //display
    document.getElementById("div_preview").style.display = "inline"
    document.getElementById("shell").style.display = "inline"

    console.log("1111")
}

function cancel(){
    document.getElementById("div_preview").style.display = "none"
    document.getElementById("shell").style.display = "none"
}
