/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.01960784313725, "KoPercent": 0.9803921568627451};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9856492824641232, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "projects"], "isController": false}, {"data": [1.0, 500, 1500, "clients"], "isController": false}, {"data": [1.0, 500, 1500, "DeleteBook"], "isController": false}, {"data": [0.0, 500, 1500, "CountValuesBookAfterDelete"], "isController": false}, {"data": [1.0, 500, 1500, "guestbookDB"], "isController": false}, {"data": [0.9466292134831461, 500, 1500, "sendComm"], "isController": true}, {"data": [0.9466292134831461, 500, 1500, "sendComment"], "isController": false}, {"data": [1.0, 500, 1500, "Open pages SC"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "openPages Book"], "isController": true}, {"data": [1.0, 500, 1500, "login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "login-0"], "isController": false}, {"data": [1.0, 500, 1500, "login"], "isController": false}, {"data": [1.0, 500, 1500, "home"], "isController": false}, {"data": [1.0, 500, 1500, "hello-1"], "isController": false}, {"data": [1.0, 500, 1500, "Open pages "], "isController": true}, {"data": [1.0, 500, 1500, "hello-0"], "isController": false}, {"data": [1.0, 500, 1500, "SoapRequest"], "isController": false}, {"data": [1.0, 500, 1500, "guestbook"], "isController": false}, {"data": [1.0, 500, 1500, "CountValuesBook"], "isController": false}, {"data": [1.0, 500, 1500, "hello"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2142, 21, 0.9803921568627451, 23.574229691876784, 1, 40017, 5.0, 6.0, 8.0, 22.570000000000164, 7.124279090806287, 49.697563860123665, 3.0253812836341143], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["projects", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 1053.1782670454545, 40.57173295454546], "isController": false}, {"data": ["clients", 356, 0, 0.0, 5.502808988764047, 4, 16, 5.0, 6.0, 7.0, 9.430000000000007, 1.186401703619525, 7.108106533290898, 0.5283195086430696], "isController": false}, {"data": ["DeleteBook", 2, 0, 0.0, 9.0, 8, 10, 9.0, 10.0, 10.0, 10.0, 0.016664861306691776, 1.7087992550806995E-4, 0.0], "isController": false}, {"data": ["CountValuesBookAfterDelete", 2, 2, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 0.0166659722511562, 1.9530436231823676E-4, 0.0], "isController": false}, {"data": ["guestbookDB", 694, 0, 0.0, 3.4798270893371757, 1, 45, 2.0, 5.0, 12.0, 25.09999999999991, 2.319278417008933, 10.854079133261594, 0.743487838409122], "isController": false}, {"data": ["sendComm", 356, 19, 5.337078651685394, 6.306179775280901, 3, 96, 5.0, 9.0, 14.0, 26.720000000000027, 1.189390370615376, 5.6372550171141915, 1.078420102868903], "isController": true}, {"data": ["sendComment", 356, 19, 5.337078651685394, 3.6994382022471917, 1, 93, 2.0, 7.0, 11.0, 23.0, 1.1913486669276927, 0.37272784124944364, 0.711245716499175], "isController": false}, {"data": ["Open pages SC", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 332.4869791666667, 17.252604166666668], "isController": true}, {"data": ["openPages Book", 3, 0, 0.0, 13371.666666666666, 44, 40017, 54.0, 40017.0, 40017.0, 40017.0, 0.010726429564900263, 0.3161503380613051, 0.011344456268346664], "isController": true}, {"data": ["login-1", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 334.9609375, 145.751953125], "isController": false}, {"data": ["Login", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 152.78764204545456, 110.52911931818183], "isController": true}, {"data": ["login-0", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 56.803385416666664, 105.46875], "isController": false}, {"data": ["login", 1, 0, 0.0, 11.0, 11, 11, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 152.78764204545456, 110.52911931818183], "isController": false}, {"data": ["home", 360, 0, 0.0, 6.355555555555557, 4, 81, 6.0, 6.0, 7.0, 28.939999999999372, 1.1997560496032473, 26.54108768717028, 0.4815427113153659], "isController": false}, {"data": ["hello-1", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 143.88020833333334, 84.63541666666667], "isController": false}, {"data": ["Open pages ", 356, 0, 0.0, 21.308988764044948, 16, 117, 19.0, 28.30000000000001, 36.0, 62.30000000000007, 1.1860222612380606, 43.64252454083281, 1.9203368253249067], "isController": true}, {"data": ["hello-0", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 85.205078125, 114.013671875], "isController": false}, {"data": ["SoapRequest", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 36.0, 27.777777777777775, 16.981336805555557, 16.655815972222225], "isController": false}, {"data": ["guestbook", 359, 0, 0.0, 5.479108635097494, 4, 21, 5.0, 6.0, 6.0, 14.39999999999975, 1.1981203860684295, 4.811202175306038, 0.5498012067141465], "isController": false}, {"data": ["CountValuesBook", 3, 0, 0.0, 107.33333333333334, 1, 319, 2.0, 319.0, 319.0, 319.0, 0.012500677120010668, 1.46492310000125E-4, 0.0], "isController": false}, {"data": ["hello", 1, 0, 0.0, 15.0, 15, 15, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 80.2734375, 64.2578125], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /0/", 2, 9.523809523809524, 0.09337068160597572], "isController": false}, {"data": ["500", 19, 90.47619047619048, 0.8870214752567693], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2142, 21, "500", 19, "Test failed: text expected to contain /0/", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CountValuesBookAfterDelete", 2, 2, "Test failed: text expected to contain /0/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["sendComment", 356, 19, "500", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
