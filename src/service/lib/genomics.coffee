module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

## Some stuff of general usefulness in handling genomics data. This is important when handling some of
## the more data-rich aspects of genomic data, for example.

aminoAcidCodes = {
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

aminoAcidNames = {}
for own key, value of aminoAcidCodes
  aminoAcidNames[aminoAcidCodes[key]] = key

module.exports.aminoAcidCodes = aminoAcidCodes
module.exports.aminoAcidNames = aminoAcidNames

reverseCodeTable = {
  "A" : "T",
  "C" : "G",
  "G" : "C",
  "T" : "A"
}

codePattern = new RegExp("[" + (key for own key of aminoAcidNames).join("") + "]", "g")
namePattern = new RegExp("(?:" + (key for own key of aminoAcidCodes).join("|") + ")", "g")

module.exports.convertCodesToNames = (string) ->
  string.replace codePattern, (match) -> aminoAcidNames[match]

module.exports.convertNamesToCodes = (string) ->
  string.replace namePattern, (match) -> aminoAcidCodes[match]

module.exports.invertSequence = (string) ->
  string.replace /[ACGT]/g, (match) -> reverseCodeTable[match]
