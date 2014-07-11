angular
  .module 'heliotrope.services.genomics', []

  .factory 'transformDomains', () ->

    (domains) ->
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
