/*
 * Copyright 2013(c) The Ontario Institute for Cancer Research. All rights reserved.
 *
 * This program and the accompanying materials are made available under the terms of the GNU Public
 * License v3.0. You should have received a copy of the GNU General Public License along with this
 * program. If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 * WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

// A small adjustment to work around the context - this file might be run server-side with commonjs
// or client-side under Angular, which does no lazy loading and will therefore assume d3 has already
// been loaded. This should change if Angular gets better loading some day.

var reald3 = (typeof require === 'function') ? require("d3") : d3;
var d3 = reald3;

// The expected data is as follows: this does not need to be modelled exactly, as it
// can be generated on-demand. The data is an object with the following keys:
// start: nnn
// stop: nnn
// mutations: [{id: str, position: nnn, url: url, value: nnn,... }, ...]
// domains: [{id: str, label: str, url: url, start: nnn, stop: nnn,...},...]
// mutationHtmlFn: function(m) where m is a mutation
// domainHtmlFn: function(m) where m is a mutation

/**
 * Primary definition of the data used.
 */
var ProteinStructureChart = function(options, data) {

  /*
   * Configuration values explained:
   *   displayWidth - width of the main chart body for the coding region/protein
   *   valueHeight - height of the main chart body for values presented
   *   domainRowHeight - height of each row of domain information
   *   domainRowSeparation - separation between domain rows
   *   valueAxisWidth - width of the left margin axis for values
   *   structureAxisHeight - height of the axis for the coding region/protein
   *   topMargin, leftMargin, rightMargin, bottomMargin - margins for the display
   *   markerRadius - size of the circle to use marking a value
   */

  var config = {};

  var default_config = {
    tooltips: true,
    displayWidth: 700,
    valueHeight: 140,
    domainRowHeight: 15,
    domainBarHeight: 7,
    domainRowSeparation: 2,
    domainLegendSeparation: 10,
    domainLegendBarSize: 45,
    domainLegendBarDescriptionOffset: 47,
    domainBarLabels: ["pfam"],
    valueAxisWidth: 30,
    structureAxisHeight: 25,
    topMargin: 10,
    leftMargin: 10,
    rightMargin: 20,
    bottomMargin: 5,
    markerRadius: 4,
    maximumLabelledDomains: 10,
    domainTooltipHtmlFn: function(d) { return "<a href='#'>" + d.id + "</a><br>" + d.id; },
    domainTooltipOptions: {container: "body", placement: "right", html: true},
    markerTooltipHtmlFn: function(d) { return "Mutation: " + d.id; },
    markerTooltipOptions: {container: "body", placement: "right", html: true},
    markerClassFn: function(d) { return undefined; }
  };

  Object.keys(default_config).forEach(function(key) {
    config[key] = default_config[key];
  });
  Object.keys(options).forEach(function(key) {
    config[key] = options[key];
  });

  this.config = config;
  this.data = data;
};

/**
 * Algorithm to pack domains effectively. The rangeKeyFn is a function
 * that returns a [m, n] value from each data element. This is basically
 * a bin-packing problem, and we're using a first-fit decreasing algorithm
 * which isn't perfectly optimal, but not bad, especially since the data
 * will not be too tightly constrained.
 *
 * @return the number of bins required
 */
ProteinStructureChart.prototype.packRanges = function(data, rangeKey) {
  var index = 0;
  var ranges = data.map(function(e) {
    var range = rangeKey(e);
    return { index: index++, range: range, size: range[1] - range[0] };
  });
  var sorted = ranges.sort(function(a, b) { return a.range[1] - b.range[1]; });

  // Now we start.
  var length = data.length;
  var binRights = [];
  var binCount = 0;
  sorted: for(var i = 0; i < length; i++) {
    var next = sorted[i];
    var left = next.range[0];
    for(var j = 0; j < binCount; j++) {
      if (left > binRights[j]) {
        data[next.index].bin = j;
        binRights[j] = next.range[1];
        continue sorted;
      }
    }
    data[next.index].bin = binCount++;
    binRights.push(next.range[1]);
    continue sorted;
  }

  return binCount;
};

ProteinStructureChart.prototype.addChartData = function(data) {

  function xOffsetFunction(d, i) { return 10 * i; }
  function yOffsetFunction(d) { return 10 + d; }
  function widthFunction(d) { return 10; }
  function heightFunction(d) { return 10; }

  this.chart.selectAll("rect.value")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "value")
    .attr("x", xOffsetFunction)
    .attr("y", yOffsetFunction)
    .attr("width", widthFunction)
    .attr("height", heightFunction);
};

/**
 * This method adds a shaded background to the overall chart. This is also straight
 * use of d3. The background is assumed to be a table of values in a simple big
 * array.
 */
ProteinStructureChart.prototype.addBackground = function() {
  var chart = this._chart;
  var values = this.data.background;
  var maximum = this._maximumValue;

  var tm = this.config.topMargin;
  var vh = this.config.valueHeight;

  var proteinScale = this._proteinScale;

  var backgroundHorizontalScale = d3.scale.linear()
    .domain([0, values.length])
    .range(proteinScale.range());

  var backgroundVerticalScale = d3.scale.linear()
    .domain([maximum, 0])
    .range([tm, tm + vh]);

  function backgroundXFn(d, i) { return backgroundHorizontalScale(i); }
  function backgroundYFn(d, i) { return backgroundVerticalScale(d) - 0.5; }
  function backgroundWidthFn(d, i) { return backgroundHorizontalScale(i + 1) - backgroundHorizontalScale(i) + 0.5; }
  function backgroundHeightFn(d, i) { return backgroundVerticalScale(0) - backgroundVerticalScale(d); }

  var values = chart.selectAll("rect.shade")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "shade")
    .attr("x", backgroundXFn)
    .attr("y", backgroundYFn)
    .attr("width", backgroundWidthFn)
    .attr("height", backgroundHeightFn)
    .attr("fill", "#ccc");
};

/**
 * This method adds the values to the overall chart. This is a fairly straight
 * use of d3.
 */
ProteinStructureChart.prototype.addValues = function() {
  var chart = this._chart;
  var values = this.data.mutations;

  if (! values)
    return;

  var tm = this.config.topMargin;
  var vh = this.config.valueHeight;
  var top = tm + (0.62 * vh);

  var proteinScale = this._proteinScale;
  var valueScale = this._valueScale;
  var bottom = valueScale(0) - 0.5;
  var markerRadius = this.config.markerRadius;

  function markerCxFn(d, i) { return proteinScale(d.position); }
  function valuePathFn(d, i) {
    var x = proteinScale(d.position);
    return "M" + x +"," + top + "L" + x + "," + bottom;
  }

  var values = chart.selectAll("g.marker")
    .data(values)
    .enter()
    .append("g")
    .attr("class", "marker");

  values.append("path")
    .attr("d", valuePathFn);

  values.append("circle")
    .attr("class", this.config.markerClassFn)
    .attr("cx", markerCxFn)
    .attr("cy", top)
    .attr("r", markerRadius)
    .attr("rel", "tooltip")
    .attr("title", this.config.markerTooltipHtmlFn);
};

/**
 * This method adds the domain elements to the overall chart. It's a fairly straight
 * use of d3 against the scales we already have.
 */
ProteinStructureChart.prototype.addDomains = function() {
  var chart = this._chart;
  var domains = this.data.domains;
  var domainCount = domains.length;

  var proteinScale = this._proteinScale;
  var domainRowScale = this._domainRowScale;
  var domainColourScale = this._domainColourScale;
  var domainLegendRowScale = this._domainLegendRowScale;
  var domainLegendColumnScale = this._domainLegendColumnScale;
  var drh = this.config.domainRowHeight;
  var drs = this.config.domainRowSeparation;
  var dbh = this.config.domainBarHeight;
  var dbl = this.config.domainBarLabels;
  var dbo = (drh - dbh) / 2;
  var lm = this.config.leftMargin;

  function domainXFn(d, i) { return proteinScale(d.start); }
  function domainYFn(d, i) { return domainRowScale(d.bin); }
  function domainWidthFn(d, i) { return proteinScale(d.stop) - proteinScale(d.start); }
  function domainHeightFn(d, i) { return drh; }
  function domainColourFn(d, i) { return domainColourScale(i); }
  function domainLabelFn(d, i) { return d.id; }
  function domainDescriptionFn(d, i) { return d.description; }
  function domainRowLabelFn(d, i) { return d.label; }
  function domainRowYFn(d, i) { return domainRowScale(d.row) + dbo; }

  var rowCount = 1 + Math.max.apply(null, [-1].concat(domains.map(function(d) { return d.bin; } )));
  var rows = new Array(rowCount);
  for(var r = 0; r < rowCount; r++) {
    rows[r] = {row: r, label: dbl[r]};
  }
  var rowScale = proteinScale.range();

  var domainRows = chart.selectAll("g.domainRow")
    .data(rows)
    .enter()
    .append("g")
    .attr("class", "domainRow");

  domainRows.append("rect")
    .attr("x", rowScale[0])
    .attr("y", domainRowYFn)
    .attr("width", rowScale[1] - rowScale[0])
    .attr("height", dbh)
    .attr("fill", "#ccc");

  domainRows.append("text")
    .attr("x", 1)
    .attr("y", domainRowYFn)
    .attr("dx", 1)
    .attr("dy", dbh)
    .text(domainRowLabelFn)
    .attr("fill", "black");

  // Add the domain groups
  var domainGroups = chart.selectAll("g.domain")
    .data(domains)
    .enter()
    .append("g")
    .attr("class", "domain");

  domainGroups.attr("rel", "tooltip")
    .attr("title", this.config.domainTooltipHtmlFn);

  // Add the domain rectables
  domainGroups.append("rect")
    .attr("x", domainXFn)
    .attr("y", domainYFn)
    .attr("width", domainWidthFn)
    .attr("height", domainHeightFn)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", domainColourFn);

  if (domainCount > this.config.maximumLabelledDomains) {
    return;
  }

  // Add labels. Actually, it is moot whether we ought to do this, especially for
  // short domains. But it's good enough for now.
  domainGroups.append("text")
    .attr("x", domainXFn)
    .attr("y", domainYFn)
    .attr("dx", 3)
    .attr("dy", drh - 4)
    .text(domainLabelFn)
    .attr("fill", "black");

  // Now we can add a domain legend.
  var domainColumn = Math.ceil(domainCount / 2.0);

  var domainLegendGroups = chart.selectAll("g.domain-legend")
    .data(domains)
    .enter()
    .append("g")
    .attr("class", "domain-legend");

  var domainLegendBarSize = this.config.domainLegendBarSize;
  var domainLegendBarIdOffset = 0;
  var domainLegendBarDescriptionOffset = this.config.domainLegendBarDescriptionOffset;

  function domainLegendYFn(d, i) { return domainLegendRowScale(i % domainColumn); }
  function domainLegendXFn(d, i) { return domainLegendColumnScale(Math.floor(i / domainColumn)); }
  function domainLegendLabelXFn(d, i) { return domainLegendColumnScale(Math.floor(i / domainColumn)) + domainLegendBarIdOffset; }
  function domainLegendDescriptionXFn(d, i) { return domainLegendColumnScale(Math.floor(i / domainColumn)) + domainLegendBarDescriptionOffset; }

  // Add the domain rectangles
  domainLegendGroups.append("rect")
    .attr("x", domainLegendXFn)
    .attr("y", domainLegendYFn)
    .attr("width", domainLegendBarSize)
    .attr("height", drh)
    .attr("rx", 3)
    .attr("ry", 3)
    .attr("fill", domainColourFn);

  domainLegendGroups.append("text")
    .attr("x", domainLegendLabelXFn)
    .attr("y", domainLegendYFn)
    .attr("dx", 3)
    .attr("dy", drh - 4)
    .text(domainLabelFn)
    .attr("fill", "black");

  domainLegendGroups.append("text")
    .attr("x", domainLegendDescriptionXFn)
    .attr("y", domainLegendYFn)
    .attr("dx", 3)
    .attr("dy", drh - 4)
    .text(domainDescriptionFn)
    .attr("fill", "black");
};

/**
 * Sets up the tooltips needed for the chart constituent elements. This is a Bootstrap/
 * jQuery level.
 */
ProteinStructureChart.prototype.addTooltips = function() {
  var element = this.element;
  jQuery(element).find("g.marker circle").tooltip(this.config.markerTooltipOptions);
  jQuery(element).find("g.domain").tooltip(this.config.domainTooltipOptions);
};

ProteinStructureChart.prototype.setChartScales = function() {
  // First calculate the overall chart dimensions
  var lm = this.config.leftMargin;
  var tm = this.config.topMargin;
  var rm = this.config.rightMargin;
  var bm = this.config.bottomMargin;
  var vaw = this.config.valueAxisWidth;
  var dw = this.config.displayWidth;
  var vh = this.config.valueHeight;
  var mv = this._maximumValue;
  var dr = this._domainRows;
  var dlr = this._domainLegendRows;
  var drh = this.config.domainRowHeight;
  var drs = this.config.domainRowSeparation;
  var dls = this.config.domainLegendSeparation;
  var sah = this.config.structureAxisHeight;

  this._height = tm + vh + bm + this.config.structureAxisHeight + (drh + drs) * dr - drs;
  if (dlr > 0) {
    this._height += dls + (drh + drs) * dlr;
  }
  this._width = lm + vaw + dw + rm;

  // Now create a store the scales we need to transform data
  this._proteinScale = d3.scale.linear()
    .domain([this.data.start, this.data.stop])
    .range([lm + vaw, lm + vaw + dw]);
  this._valueScale = d3.scale.linear()
    .domain([mv, 0])
    .range([tm, tm + vh])
    .nice();
  this._domainRowScale = d3.scale.linear()
    .domain([0, dr])
    .range([tm + vh + sah, tm + vh + sah + (dr + dlr) * (drh + drs)]);
  this._domainLegendRowScale = d3.scale.linear()
    .domain([0, dlr])
    .range([tm + vh + sah + dr * (drh + drs) + dls, tm + vh + sah + dr * (drh + drs) + dls + dlr * (drh + drs)]);
  this._domainLegendColumnScale = d3.scale.linear()
    .domain([0, 2])
    .range([0, this._width]);
  this._domainColourScale = d3.scale.category10();
};

ProteinStructureChart.prototype.addChart = function() {

  // Now the chart
  d3.select(this.element).html("");
  var chart = d3.select(this.element)
    .append("svg")
    .attr("class", "proteinstructure")
    .attr("width", this._width)
    .attr("height", this._height);

  this._chart = chart;
  return d3.select(this.element);
};

ProteinStructureChart.prototype.addAxes = function() {

  var chart = this._chart;

  var tm = this.config.topMargin;
  var vh = this.config.valueHeight;
  var lm = this.config.leftMargin;
  var vaw = this.config.valueAxisWidth;

  // And the axes; first for the values
  var xAxis = d3.svg.axis();
  xAxis.scale(this._proteinScale);
  xAxis.orient("bottom");
  chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + 0 + "," + (tm + vh - 0.5) + ")")
    .call(xAxis);

  // The second axis is the one for the protein coding space
  var valueAxis = d3.svg.axis().ticks(6).tickFormat(d3.format("d")).tickSubdivide(0);
  valueAxis.scale(this._valueScale);
  valueAxis.orient("left");
  chart.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (lm + vaw) + "," + (- 0.5) + ")")
    .call(valueAxis);

  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("class", "axis-label")
    .attr("y", 0)
    .attr("x", -(tm + vh/2))
    .attr("dy", "2ex")
    // .attr("dx", -(tm + vh/2))
    .style("text-anchor", "middle")
    .text("frequency in COSMIC");
};

/**
 * Main display method sets up the chart.
 */
ProteinStructureChart.prototype.display = function(element) {
  this.element = element;

  this._maximumValue = Math.max.apply(null, this.data.background);
  this._domains = this.data.domains;
  this._domainRows = this.packRanges(this.data.domains, function(e) { return [e.start, e.stop]; });
  if (this.data.domains.length > this.config.maximumLabelledDomains) {
    this._domainLegendRows = 0;
  } else {
    this._domainLegendRows = Math.ceil(this.data.domains.length / 2.0);
  }

  this.setChartScales();
  var chart = this.addChart();
  this.addBackground();
  this.addAxes();
  this.addDomains();
  this.addValues();
  if (this.config.tooltips) {
    this.addTooltips();
  }
  return chart;
};

if (typeof require === 'function') {
  module.exports = ProteinStructureChart;
}
