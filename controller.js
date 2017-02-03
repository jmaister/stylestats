/* globals Chart */
"use strict";

function transformData(label, stats) {
    let data = {
    	labels: [],
    	datasets: [{
            label: label,
    		data: []
    	}]
    };
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            let value = stats[key];
            data.labels.push(key);
            data.datasets[0].data.push(value);
        }
    }
    return data;
}

function drawChart(id, stats, label) {
    let chartElement = document.createElement('canvas');
    chartElement.id = id;
    let charts = document.getElementById('charts');
    charts.appendChild(chartElement);

    let data = transformData(label, stats);
    let options = {
    	scales: {
    		yAxes: [{
    			ticks: {
    				min: 0
    			}
    		}]
    	}
    };

    new Chart(chartElement, {
        type: 'bar',
        data: data,
        options: options
    });

}

function drawCharts(stats) {
    let charts = document.getElementById('charts');
    charts.innerHTML = '';

    drawChart('chart_nodes', stats.nodes, 'Number of elements');
    drawChart('chart_classes', stats.classes, 'Number of classes');
    drawChart('chart_styles', stats.styles, 'Number of elements with style');
    drawChart('chart_node_styles', stats.nodestyles, 'Number of element+style');
}


document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('go').addEventListener("click", function() {
		document.getElementById("view").src = document.getElementById("url").value;
	});

	const webview = document.getElementById('view');

	webview.addEventListener("ipc-message", function(e) {
		if (e.channel === "stats") {
			let data = e.args[0];
			console.log(data);

            drawCharts(data);
		}
	});

	const loadstart = function() {};
	const loadstop = function() {};

	webview.addEventListener('did-start-loading', loadstart);
	webview.addEventListener('did-finish-load', loadstop);

}, false);
