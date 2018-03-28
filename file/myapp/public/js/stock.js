console.log("Hello1");


$.ajax({
    url: "/stock/chart",
    type: "GET",

    success : function(res) {
        console.log(res.length);
        console.log(res[0]);
        build_chart(res);

    },
    error: function(err) {
      console.log(err)
    }
  });



function build_chart(data) {

    AmCharts.ready(function () {
        generateChartData();
        createStockChart();
    });

    var chartData = [];

    function generateChartData() {
        /*
        var firstDate = new Date(2012, 0, 1);
        firstDate.setDate(firstDate.getDate() - 500);
        firstDate.setHours(0, 0, 0, 0);

        for (var i = 0; i < 500; i++) {
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + i);

            var a = Math.round(Math.random() * (40 + i)) + 100 + i;
            var b = Math.round(Math.random() * 100000000);

            chartData.push({
                date: newDate,
                value: a,
                volume: b
            });
        }*/

       
       for (var i = 0; i < data.length; i++) {
            var date = new Date(data[i].date);
            date.setDate(date.getDate() + 1);
            console.log(date)


            a = data[i].price;
            b = data[i].volumne;
            
            chartData.push({
                date: date,
                value: a,
                volume: b
            });
       }
       

    }

    var chart;

    function createStockChart() {
        chart = new AmCharts.AmStockChart();


        // DATASETS //////////////////////////////////////////
        var dataSet = new AmCharts.DataSet();

        //dataSet.color = "#b0de09";
        dataSet.color = "#FF0000";

        dataSet.fieldMappings = [{
            fromField: "value",
            toField: "value"
        }, {
            fromField: "volume",
            toField: "volume"
        }];
        dataSet.dataProvider = chartData;
        dataSet.categoryField = "date";

        // set data sets to the chart
        chart.dataSets = [dataSet];

        // PANELS ///////////////////////////////////////////
        // first stock panel
        var stockPanel1 = new AmCharts.StockPanel();
        stockPanel1.showCategoryAxis = false;
        stockPanel1.title = "Value";
        stockPanel1.percentHeight = 70;

        // graph of first stock panel
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "value";
        stockPanel1.addStockGraph(graph1);

        // create stock legend
        var stockLegend1 = new AmCharts.StockLegend();
        stockLegend1.valueTextRegular = " ";
        stockLegend1.markerType = "none";
        stockPanel1.stockLegend = stockLegend1;


        // second stock panel
        var stockPanel2 = new AmCharts.StockPanel();
        stockPanel2.title = "Volume";
        //stockPanel2.addTitle("Volume", 5, "red", 1, true);
        stockPanel2.percentHeight = 30;
        var graph2 = new AmCharts.StockGraph();
        graph2.valueField = "volume";
        graph2.type = "column";
        graph2.fillAlphas = 1;
        stockPanel2.addStockGraph(graph2);

        // create stock legend
        var stockLegend2 = new AmCharts.StockLegend();
        stockLegend2.valueTextRegular = " ";
        stockLegend2.markerType = "none";
        stockPanel2.stockLegend = stockLegend2;


        //SET COLOR
        
        stockPanel1.color = "#42f45f";
        stockPanel2.color = "#42f45f";
        graph1.valueField.color = "#FF0000"
        graph2.valueField.color = "#FF0000"
        // set panels to the chart
        chart.panels = [stockPanel1, stockPanel2];


        // OTHER SETTINGS ////////////////////////////////////
        var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
        scrollbarSettings.graph = graph1;
        scrollbarSettings.updateOnReleaseOnly = false;
        chart.chartScrollbarSettings = scrollbarSettings;

        var cursorSettings = new AmCharts.ChartCursorSettings();
        cursorSettings.valueBalloonsEnabled = true;
        cursorSettings.graphBulletSize = 1;
        chart.chartCursorSettings = cursorSettings;


        
        // PERIOD SELECTOR ///////////////////////////////////
        var periodSelector = new AmCharts.PeriodSelector();
        periodSelector.periods = [{
            period: "DD",
            count: 10,
            label: "10 days"
        }, {
            period: "MM",
            count: 1,
            label: "1 month"
        }, {
            period: "YYYY",
            count: 1,
            selected:true,
            label: "1 year"
        }, {
            period: "YTD",
            label: "YTD"
        }, {
            period: "MAX",
            label: "MAX"
        }];
        chart.periodSelector = periodSelector;
        

        var panelsSettings = new AmCharts.PanelsSettings();
        panelsSettings.marginRight = 16;
        panelsSettings.marginLeft = 16;
        panelsSettings.usePrefixes = true;
        chart.panelsSettings = panelsSettings;

        chart.write('chartdiv');
    }

}