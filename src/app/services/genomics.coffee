angular.module('heliotrope.services.genomics', [])

  .service('domainService', () ->

    @transform = (domains) ->
      sortedDomains = domains.sort (a, b) -> a["start"] - b["start"]

      domainCount = sortedDomains.length
      d = 0
      while d < domainCount - 1

        next = d + 1
        thisDomain = sortedDomains[d]
        nextDomain = sortedDomains[next]

        if thisDomain["end"] < nextDomain["start"]

          # Simple case, next domain starts after this one, no overlap
          d++

        else

          # The domains do overlap. Keep the biggest. Note we splice the sortedDomains
          # array and adjust count so we can continue.
          thisSize = thisDomain["end"] - thisDomain["start"]
          nextSize = nextDomain["end"] - nextDomain["start"]

          if thisSize >= nextSize

            sortedDomains.splice(next, 1)
            domainCount--

          else

            sortedDomains.splice(d, 2, nextDomain)
            domainCount--

      domainFn = (domain) ->
        result =
          id: domain["hitName"]
          start: domain["start"]
          stop: domain["end"]
          description: domain["description"]

      result = domainFn(domain) for domain in sortedDomains
  )

  # .service


# function transformDomains(domains) {
#   var sortedDomains = domains.sort(function(a, b) { return a["start"] - b["start"]; });
#   var domainCount = sortedDomains.length;
#   var d = 0;
#   while(d < domainCount) {
#     var next = d + 1;

#     // Simple case, no more domains. Stop.
#     if (next === domainCount) { break; };
#     var thisDomain = sortedDomains[d];
#     var nextDomain = sortedDomains[next];

#     // Simple case, next domain starts after this one, no overlap
#     if (thisDomain["end"] < nextDomain["start"]) {
#       d++;
#       continue;
#     }

#     // The domains do overlap. Keep the biggest. Note we splice the sortedDomains
#     // array and adjust count so we can continue.
#     var thisSize = thisDomain["end"] - thisDomain["start"];
#     var nextSize = nextDomain["end"] - nextDomain["start"];
#     if (thisSize >= nextSize) {

#       // Next is smaller, remove it.
#       sortedDomains.splice(next, 1);
#       domainCount--;
#       continue;
#     } else {

#       // This is smaller. Juggle them
#       sortedDomains.splice(d, 2, nextDomain);
#       domainCount--;
#       continue;
#     }
#   }

#   var transformedDomains = [];
#   var domainCount = sortedDomains.length;
#   for(var d = 0; d < domainCount; d++) {
#     var domain = sortedDomains[d];
#     transformedDomains.push({id: domain["hitName"], start: domain["start"], stop: domain["end"], description: domain["description"]});
#   }

#   return transformedDomains;
# }

