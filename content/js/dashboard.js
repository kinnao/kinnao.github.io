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
    cell.colSpan = 6;
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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9915384615384616, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "17 Login"], "isController": true}, {"data": [1.0, 500, 1500, "64 Review-1"], "isController": false}, {"data": [1.0, 500, 1500, "64 Review-0"], "isController": false}, {"data": [0.92, 500, 1500, "1 Home"], "isController": true}, {"data": [1.0, 500, 1500, "17 Login-1-0"], "isController": false}, {"data": [1.0, 500, 1500, "17 Login-1-1"], "isController": false}, {"data": [1.0, 500, 1500, "50 Book Detail-0"], "isController": false}, {"data": [1.0, 500, 1500, "64 Review-0-1"], "isController": false}, {"data": [1.0, 500, 1500, "64 Review-0-0"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-5"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-4"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-7"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-6"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-9"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-8"], "isController": false}, {"data": [1.0, 500, 1500, "17 Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-11"], "isController": false}, {"data": [1.0, 500, 1500, "17 Login-1"], "isController": false}, {"data": [0.92, 500, 1500, "1 Home-0"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-1"], "isController": false}, {"data": [1.0, 500, 1500, "1 Home-0-10"], "isController": false}, {"data": [1.0, 500, 1500, "50 Book Detail"], "isController": true}, {"data": [1.0, 500, 1500, "1 Home-0-0"], "isController": false}, {"data": [1.0, 500, 1500, "64 Review"], "isController": true}, {"data": [1.0, 500, 1500, "1 Home-0-3"], "isController": false}, {"data": [0.94, 500, 1500, "1 Home-0-2"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1100, 0, 0.0, 50.714545454545515, 1, 1588, 146.79999999999995, 265.95000000000005, 697.1000000000008, 108.67417506421656, 15390.330931387078, 73.30007502222881], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["17 Login", 50, 0, 0.0, 132.31999999999994, 115, 231, 163.7, 196.54999999999993, 231.0, 5.878894767783657, 107.18648956496178, 7.957175925925926], "isController": true}, {"data": ["64 Review-1", 50, 0, 0.0, 8.260000000000003, 4, 25, 17.699999999999996, 22.89999999999999, 25.0, 6.021919788028423, 70.34002205528121, 2.6639938124774174], "isController": false}, {"data": ["64 Review-0", 50, 0, 0.0, 15.959999999999997, 8, 52, 46.8, 49.0, 52.0, 5.990893841361131, 71.76786596872753, 6.300969401509705], "isController": false}, {"data": ["1 Home", 50, 0, 0.0, 412.99999999999994, 257, 1588, 877.9999999999998, 1381.499999999999, 1588.0, 4.970178926441352, 7546.455738226889, 23.676301565606362], "isController": true}, {"data": ["17 Login-1-0", 50, 0, 0.0, 122.82000000000001, 109, 223, 142.7, 177.64999999999984, 223.0, 5.8844297987525005, 1.9882936624691068, 2.856017197246087], "isController": false}, {"data": ["17 Login-1-1", 50, 0, 0.0, 6.38, 3, 23, 11.0, 20.89999999999999, 23.0, 5.973715651135007, 77.86248319892474, 2.905185931899642], "isController": false}, {"data": ["50 Book Detail-0", 50, 0, 0.0, 9.660000000000002, 4, 38, 30.699999999999996, 34.24999999999998, 38.0, 5.976571838393498, 69.8103278896725, 2.6322596671049485], "isController": false}, {"data": ["64 Review-0-1", 50, 0, 0.0, 9.260000000000002, 4, 30, 27.9, 30.0, 30.0, 6.004563468235859, 70.13728871442297, 2.943643418998439], "isController": false}, {"data": ["64 Review-0-0", 50, 0, 0.0, 6.460000000000001, 3, 21, 17.9, 20.0, 21.0, 5.99592277251469, 1.7917503597553663, 3.366851166206979], "isController": false}, {"data": ["1 Home-0-5", 50, 0, 0.0, 3.6799999999999993, 1, 10, 9.0, 10.0, 10.0, 5.946010227137591, 24.32986606611963, 2.1252341241526933], "isController": false}, {"data": ["1 Home-0-4", 50, 0, 0.0, 3.2199999999999998, 1, 11, 5.0, 8.349999999999987, 11.0, 5.943889681407513, 32.56369249286733, 2.1709128328578218], "isController": false}, {"data": ["1 Home-0-7", 50, 0, 0.0, 12.979999999999999, 7, 45, 20.9, 24.449999999999996, 45.0, 5.9467174119885815, 2293.5281131065653, 2.1777529584919124], "isController": false}, {"data": ["1 Home-0-6", 50, 0, 0.0, 3.020000000000001, 1, 15, 5.0, 6.8999999999999915, 15.0, 5.952380952380952, 31.255812872023807, 2.1391369047619047], "isController": false}, {"data": ["1 Home-0-9", 50, 0, 0.0, 9.379999999999995, 6, 15, 15.0, 15.0, 15.0, 5.951672419950006, 1744.8280896619451, 2.243501517676467], "isController": false}, {"data": ["1 Home-0-8", 50, 0, 0.0, 12.819999999999997, 8, 34, 20.799999999999997, 26.89999999999999, 34.0, 5.947424765076722, 2433.013643764125, 2.1722039669323183], "isController": false}, {"data": ["17 Login-0", 50, 0, 0.0, 2.7000000000000006, 1, 6, 4.0, 4.0, 6.0, 5.964451866873434, 28.98933295061434, 2.2774420702612432], "isController": false}, {"data": ["1 Home-0-11", 50, 0, 0.0, 3.5, 2, 7, 5.0, 5.449999999999996, 7.0, 5.961607249314415, 446.24726138666983, 2.2064933080958626], "isController": false}, {"data": ["17 Login-1", 50, 0, 0.0, 129.62000000000006, 113, 228, 161.59999999999997, 193.54999999999993, 228.0, 5.8809691837214775, 78.64073343036932, 5.714418298635615], "isController": false}, {"data": ["1 Home-0", 50, 0, 0.0, 412.99999999999994, 257, 1588, 877.9999999999998, 1381.499999999999, 1588.0, 5.015045135406218, 7614.578207278084, 23.890029463390167], "isController": false}, {"data": ["1 Home-0-1", 50, 0, 0.0, 3.960000000000001, 3, 9, 5.899999999999999, 6.8999999999999915, 9.0, 5.203455094182537, 780.0660107061088, 1.900480669164325], "isController": false}, {"data": ["1 Home-0-10", 50, 0, 0.0, 3.82, 2, 9, 5.0, 5.8999999999999915, 9.0, 5.960185957801883, 507.9486995619264, 2.1826852872809632], "isController": false}, {"data": ["50 Book Detail", 50, 0, 0.0, 9.660000000000002, 4, 38, 30.699999999999996, 34.24999999999998, 38.0, 5.976571838393498, 69.8103278896725, 2.6322596671049485], "isController": true}, {"data": ["1 Home-0-0", 50, 0, 0.0, 5.160000000000002, 3, 41, 6.0, 8.899999999999991, 41.0, 5.158893933140734, 33.80989959502683, 1.7784077718737104], "isController": false}, {"data": ["64 Review", 50, 0, 0.0, 24.220000000000002, 12, 73, 65.6, 71.0, 73.0, 5.985156811108451, 141.6097453315777, 8.942665938472588], "isController": true}, {"data": ["1 Home-0-3", 50, 0, 0.0, 3.2200000000000006, 1, 8, 5.0, 7.0, 8.0, 5.943183168905266, 16.134813681207653, 2.1822625698324023], "isController": false}, {"data": ["1 Home-0-2", 50, 0, 0.0, 326.84000000000003, 204, 1090, 798.7999999999997, 1076.8, 1090.0, 5.270369979972594, 507.7168716071993, 4.004245941815116], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1100, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
