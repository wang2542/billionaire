$(function () {
    "use strict";


    $(".peity-btc")
        .peity("line", {
            width: '100%',
            height: '100'
        });

    $(".peity-ltc")
        .peity("line", {
            width: '100%',
            height: '100'
        });
    $(".peity-neo")
        .peity("line", {
            width: '100%',
            height: '100'
        });
    $(".peity-dash")
        .peity("line", {
            width: '100%',
            height: '100'
        });
    $(".peity-eth")
        .peity("line", {
            width: '100%',
            height: '100'
        });
    $(".peity-xrp")
        .peity("line", {
            width: '100%',
            height: '100'
        });


    /////////////////
    // BTC Live
    /////////////////
    var updatingBtc = $(".btc-live-price")
        .peity("line", {
            width: "100%",
            height: '75'
        })

    setInterval(function () {
        var random = Math.round(Math.random() * 20)
        var values = updatingBtc.text()
            .split(",")
        values.shift()
        values.push(random)

        updatingBtc
            .text(values.join(","))
            .change()
    }, 2000);



    //////////////////
    // NEO Live
    ///////////////

    var updatingNeo = $(".neo-live-price")
        .peity("line", {
            width: "100%",
            height: '75'
        })

    setInterval(function () {
        var random = Math.round(Math.random() * 20)
        var values = updatingNeo.text()
            .split(",")
        values.shift()
        values.push(random)

        updatingNeo
            .text(values.join(","))
            .change()
    }, 2000);

    /////////////////
    // XRP Live
    ////////////////
    var updatingXrp = $(".xrp-live-price")
        .peity("line", {
            width: "100%",
            height: '75'
        })

    setInterval(function () {
        var random = Math.round(Math.random() * 20)
        var values = updatingXrp.text()
            .split(",")
        values.shift()
        values.push(random)

        updatingXrp
            .text(values.join(","))
            .change()
    }, 2000);

    /////////////////
    // LTC Live
    /////////////////
    var updatingLtc = $(".ltc-live-price")
        .peity("line", {
            width: "100%",
            height: '75'
        })

    setInterval(function () {
        var random = Math.round(Math.random() * 20)
        var values = updatingLtc.text()
            .split(",")
        values.shift()
        values.push(random)

        updatingLtc
            .text(values.join(","))
            .change()
    }, 2000);

    /////////////////
    // GDC Live
    /////////////////
    var updatingGdc = $(".gdc-live-price")
        .peity("line", {
            width: "100%",
            height: '75'
        })

    setInterval(function () {
        var random = Math.round(Math.random() * 20)
        var values = updatingGdc.text()
            .split(",")
        values.shift()
        values.push(random)

        updatingGdc
            .text(values.join(","))
            .change()
    }, 2000);


    /////////////////
    // DAO Live
    /////////////////
    var updatingDao = $(".dao-live-price")
        .peity("line", {
            width: "100%",
            height: '75'
        })

    setInterval(function () {
        var random = Math.round(Math.random() * 20)
        var values = updatingDao.text()
            .split(",")
        values.shift()
        values.push(random)

        updatingDao
            .text(values.join(","))
            .change()
    }, 2000);


    /////////////////
    // BAT Live
    /////////////////
    var updatingBat = $(".bat-live-price")
        .peity("line", {
            width: "100%",
            height: '75'
        })

    setInterval(function () {
        var random = Math.round(Math.random() * 20)
        var values = updatingBat.text()
            .split(",")
        values.shift()
        values.push(random)

        updatingBat
            .text(values.join(","))
            .change()
    }, 2000);


    /////////////////
    // ADC Live
    /////////////////
    var updatingAdc = $(".adc-live-price")
        .peity("line", {
            width: "100%",
            height: '75'
        })

    setInterval(function () {
        var random = Math.round(Math.random() * 20)
        var values = updatingAdc.text()
            .split(",")
        values.shift()
        values.push(random)

        updatingAdc
            .text(values.join(","))
            .change()
    }, 2000);



})
