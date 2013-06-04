var sys = require("sys");

var ChartMaker = require("./chartmaker");

function transformDomains(domains) {
  var sortedDomains = domains.sort(function(a, b) { return a["start"] - b["start"]; });
  var domainCount = sortedDomains.length;
  var d = 0;
  while(d < domainCount) {
    var next = d + 1;

    // Simple case, no more domains. Stop.
    if (next === domainCount) { break; };
    var thisDomain = sortedDomains[d];
    var nextDomain = sortedDomains[next];

    // Simple case, next domain starts after this one, no overlap
    if (thisDomain["end"] < nextDomain["start"]) {
      d++;
      continue;
    }

    // The domains do overlap. Keep the biggest. Note we splice the sortedDomains
    // array and adjust count so we can continue.
    var thisSize = thisDomain["end"] - thisDomain["start"];
    var nextSize = nextDomain["end"] - nextDomain["start"];
    if (thisSize >= nextSize) {

      // Next is smaller, remove it.
      sortedDomains.splice(next, 1);
      domainCount--;
      continue;
    } else {

      // This is smaller. Juggle them
      sortedDomains.splice(d, 2, nextDomain);
      domainCount--;
      continue;
    }
  }

  var transformedDomains = [];
  var domainCount = sortedDomains.length;
  for(var d = 0; d < domainCount; d++) {
    var domain = sortedDomains[d];
    transformedDomains.push({id: domain["hitName"], start: domain["start"], stop: domain["end"], description: domain["description"]});
  }

  return transformedDomains;
}

function getVariantChartSVG(entity) {

	var transcript = entity.data.sections.transcripts.data.records[0];

	var position = entity.data.sections.positions.data[0]["codon"];

	var domains = transcript["domains"].filter(function(domain) {
		return domain["gffSource"] === "Pfam";
	});

	var data = {
		start: 1,
		stop: transcript["lengthAminoAcid"],
		domains: transformDomains(domains),
		mutations: [{id: entity["shortMutation"], position: position, url: null, value: 4}]
	};

  var gene = entity["data"]["genesRefx"]["_body"]
  if (gene.sections.distribution) {
  	data["background"] = gene.sections.distribution["data"];
  }

	var chart = new ChartMaker({tooltips: false, displayWidth: 500, valueHeight: 80}, data);
	var result = chart.display('body');

	return result.html();
}

module.exports.getVariantChartSVG = getVariantChartSVG;
