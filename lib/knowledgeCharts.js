var ChartMaker = require("./chartmaker");

var data = {
  start: 0,
  stop: 100,
  mutations: [{id: "X", position: 10, url: "/", value: 4}],
  domains: [{id: "DOMAIN", label: "DOMAIN", url: "/", start: 5, stop: 50}]
}

function getVariantChartSVG(entity) {
	var chart = new ChartMaker({tooltips: false}, data);
	var result = chart.display('body');
	return result.html();
}

module.exports.getVariantChartSVG = getVariantChartSVG;

// console.log(result.html());

//  = require("d3");

// var data = [1, 2, 3, 4];
// var w = 100;
// var h = 100;

// var vis = d3.select("body").append("svg")
//   .data([data])
//   .attr("width", w)
//   .attr("height", h);

// console.log(d3.select("body").html());