/*
 * Some stuff of general usefulness in handling genomics data. This is important when handling some of
 * the more data-rich aspects of genomic data, for example.
 */

var aminoAcidCodes = {
  "Ala" : "A",
  "Arg" : "R",
  "Asn" : "N",
  "Asp" : "D",
  "Cys" : "C",
  "Gln" : "Q",
  "Glu" : "E",
  "Gly" : "G",
  "His" : "H",
  "Ile" : "I",
  "Leu" : "L",
  "Lys" : "K",
  "Met" : "M", 
  "Phe" : "F",
  "Pro" : "P",
  "Ser" : "S",
  "Thr" : "T",
  "Trp" : "W",
  "Tyr" : "Y",
  "Val" : "V", 
};

module.exports.aminoAcidCodes = aminoAcidCodes;

var aminoAcidNames = {};
Object.keys(aminoAcidCodes).forEach(function(prop) {
  aminoAcidNames[aminoAcidCodes[prop]] = prop;
});

module.exports.aminoAcidNames = aminoAcidNames;

var reverseCodeTable = {
  "A" : "T",
  "C" : "G",
  "G" : "C",
  "T" : "A"
}

var codePattern = new RegExp("[" + Object.keys(aminoAcidNames).map(function(k) { return k; }).join("") + "]", "g")
var namePattern = new RegExp("(?:" + Object.keys(aminoAcidCodes).map(function(k) { return k; }).join("|") + ")", "g")

function convertCodesToNames(string) {
  return string.replace(codePattern, function(match) { return aminoAcidNames[match]; });
}

function convertNamesToCodes(string) {
  return string.replace(namePattern, function(match) { return aminoAcidCodes[match]; });
}

module.exports.convertCodesToNames = convertCodesToNames;
module.exports.convertNamesToCodes = convertNamesToCodes;

function invertSequence(string) {
  var length = string.length;
  var matcher = /[ACGT]/g;
  return string.replace(matcher, function(match) { return reverseCodeTable[match]; })
}

module.exports.invertSequence = invertSequence;
