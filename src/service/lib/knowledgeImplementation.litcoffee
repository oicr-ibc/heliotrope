> Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
>
> This program and the accompanying materials are made available under the terms of the GNU Public
> License v3.0. You should have received a copy of the GNU General Public License along with this
> program. If not, see <http://www.gnu.org/licenses/>.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
> IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
> FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
> CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
> DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
> DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
> WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
> WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Service implementation for the knowledge base
--------------------------------------

Knowledge service implementation. The primary export from this is a router that can be
connected into the express server with the right URL prefix.

    log4js = require('log4js')
    logger = log4js.getLogger('knowledgeImplementation')

    config = module.exports.config

    async =           require("async")
    mongo =           require("mongodb")
    pug =             require("pug")
    fs =              require("fs")
    temp =            require("temp")

    MongoClient =     mongo.MongoClient
    BSON =            mongo.BSONPure

    genomics =        require("./genomics")
    knowledgeCharts = require("./knowledgeCharts")
    reporting =       require("./reporting")
    ChartMaker =      require("./chartmaker")


Object resolution functions. These walk an object and convert from indexed
to embedded relation references. This happens server-side.

    resolveRelation = (offset, relations) ->
      relations[offset]

    resolveArray = (list, relations) ->
      resolveValue(element, relations) for element in list

    resolveObject = (object, relations) ->
      result = {}
      for own key, value of object
        if key.substr(-4, 4) == "Ridx"
          newKey = key.slice(0, -4) + "Refx"
          result[newKey] = resolveRelation(object[key], relations)
        else
          result[key] = resolveValue(object[key], relations)
      result

    resolveValue = (value, relations) ->
      if value == null
        value
      else if value instanceof Array
        resolveArray(value, relations)
      else if typeof value == 'object'
        resolveObject(value, relations)
      else
        value

    resolve = (object) ->
      if typeof object == 'object'
        references = object["references"]
        delete object["references"]
        resolveObject(object, references)
      else
        object

    relativeUrl = (res, string) ->
      config = res.locals.config
      config['baseUrl'] + config['knowledgeUriBase'] + string

Database endpoint to read a single gene. This should also read a set of the
related entities of all types.

    getGene = (req, res) ->
      name = req.params.gene
      db = res.locals.db
      db.collection "genes", (err, genes) ->
        return res.status(500).send(err) if (err)
        genes.findOne {name: name}, (err, doc) ->
          return res.status(500).send(err) if (err)
          return res.status(404).send({err: "no such object: " + name}) if ! doc?

          resolved = resolve(doc)
          resolved.url = relativeUrl(res, "/genes/" + name)
          resolved.mutationsUrl = resolved.url + "/mutations"
          resolved.frequenciesUrl = resolved.url + "/frequencies"
          resolved.annotationUrl = resolved.url + "/annotation"

          result = new Object
          result['data'] = resolved
          result['config'] = res.locals.config

          res.send(result)

    module.exports.getGene = getGene


Database endpoint to read the mutations associated with a single gene. This should also read a set of the
related entities of all types.

    getGeneMutations = (req, res) ->
      name = req.params.gene
      db = res.locals.db
      db.collection "genes", (err, genes) ->
        return res.status(500).send(err) if (err)

        genes.findOne {name: name}, (err, doc) ->

          db.collection "variantRecords", (err, variantRecords) ->
            return res.status(500).send(err) if (err)

            pipeline = [
              { $match : {  geneId : doc["_id"], mutationName : { $ne : null }}},
              { $group : { _id : '$mutationName', frequency : { $sum : 1 }, codon : { $min : '$mutationCodon'}}},
              { $project : { _id : 0, name : '$_id', frequency : 1, codon : 1, variant: { $concat : [ name, '+', '$_id' ]}}},
              { $sort : { 'frequency' : -1 }}
            ]

            variantRecords.aggregate pipeline, (err, records) ->
              return res.status(500).send(err) if (err)

              result = {}
              result['data'] = records
              result['url'] = req.url
              res.send(result)

    module.exports.getGeneMutations = getGeneMutations


Generates and returns the external URL associated with a citation

    getExternalUrl = (citation) ->
      unpacked = citation.identifier.split ':', 2
      switch unpacked[0]
        when 'pmid'
          "http://www.ncbi.nlm.nih.gov/pubmed/#{encodeURIComponent(unpacked[1])}"
        else
          undefined

Database endpoint to read the annotation associated with a single gene.

    module.exports.getGeneAnnotation = (req, res) ->
      name = req.params.gene
      db = res.locals.db
      db.collection "genes", (err, genes) ->
        return res.status(500).send(err) if (err)

        genes.findOne {name: name}, (err, gene) ->
          return res.status(500).send(err) if (err)
          return res.status(404).send("Not found") if ! gene?

          db.collection "annotations", (err, annotations) ->
            return res.status(500).send(err) if (err)

            annotations.find({ref: gene._id}).toArray (err, docs) ->
              return res.status(500).send(err) if (err)

              ## A small amount of client-side decoding, this translates some array items
              ## (best for MongoDB indexing) to object keys (best for the client)

              result = {}
              result['data'] = {}
              for doc in docs
                role = doc.role
                result['data'][role] ?= []

                for citation in doc.citations
                  citation.externalUrl ?= getExternalUrl(citation)

                result['data'][role].push doc
              result['url'] = req.url

              res.send result


Database endpoint to execute a query. Queries are now pre-calculated during the statistics
script run when building a knowledge base, mainly for performance in some complex cases.

    module.exports.executeQuery = (req, res) ->
      name = req.params.query
      db = res.locals.db
      db.collection "statistics", (err, statistics) ->
        return res.status(500).send(err) if (err)

        statistics.findOne {'tag' : name}, (err, commonGenes) ->
          return res.status(500).send(err) if (err)
          result = new Object
          result['data'] = commonGenes.data
          result['config'] = res.locals.config
          res.send result


Returns a query object that can be used to find a variant within the database, based on
the incoming request.

    getVariantSelector = (req) ->
      id = req.params.id.replace(/\+/, " ")
      components = id.split(" ")

      if components.length >= 2
        name = components[0]
        mutation = components[1]
        mutation = genomics.convertNamesToCodes(mutation)
        mutation = "p." + mutation if ! mutation.substring("p.")
        {gene: name, shortMutation: mutation}
      else
        {_id: new BSON.ObjectID(id)}


Retrieves a variant. The endpoint also looks up a little gene information and implants
that into the response where appropriate.

    getVariant = (req, res) ->

      getVariantData req, res, (err, doc) ->
        return res.status(err.code).send(err.err) if err?

        resolved = resolve(doc)
        encodedName = encodeURIComponent(doc.name)
        encodedName = encodedName.replace(/%20/g, '+')
        resolved.url = relativeUrl(res, "/variants/" + encodedName)
        resolved.geneUrl = relativeUrl(res, "/genes/" + resolved.gene)
        resolved.frequenciesUrl = resolved.url + "/frequencies"
        resolved.mutationsUrl = resolved.geneUrl + "/mutations"
        resolved.annotationUrl = resolved.url + "/annotation"
        resolved.reportUrl = resolved.url + "/report?mimeType=application/pdf"

        result = new Object
        result['data'] = resolved
        result['config'] = res.locals.config
        result['url'] = req.url

        res.send result

    module.exports.getVariant = getVariant


Retrieves variant data and hands it to a callback. The endpoint also looks up a little
gene information and implants that into the response where appropriate.

    getVariantData = (req, res, callback) ->
      selector = getVariantSelector(req)

      db = res.locals.db
      db.collection "variants", (err, variants) ->
        return callback {code: 500, error: err} if (err)

        variants.findOne selector, (err, doc) ->
          return callback {code: 500, error: err} if (err)
          return callback {code: 404, error: {err: "no such object: " + selector.toString()}} if (! doc?)

          callback null, doc


Given a variant, returns the gene information associated with that variant.

    getVariantGene = (req, res) ->
      getVariantData req, res, (err, doc) ->
        return res.status(err.code).send(err.err) if err?

        req.params.gene = doc.gene
        getGene(req, res)


Given a variant, returns the gene mutations associated with that variant.

    getVariantGeneMutations = (req, res) ->
      getVariantData req, res, (err, doc) ->
        return res.status(err.code).send(err.err) if err?

        req.params.gene = doc.gene
        getGeneMutations(req, res)


Given a partial tag query, returns a list of matching tags. This is used to implement the
tag completion for cancer types, for example.

    module.exports.getTags = (req, res) ->
      query = req.query.q || "*"

      escaped = query.replace /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"

      query = if escaped == query
        query
      else
        new RegExp("^" + escaped.replace(/\\\*/g, '.*').replace(/\\\?/g, '.'), 'i')

      db = res.locals.db
      db.collection "tags", (err, tags) ->
        tags.find({name: query}, {_id: 0, name: 1}).sort([['name', 1]]).toArray (err, tags) ->
          return res.status(500).send(err) if err?
          res.send({data: tags})


Updates a variant. This is used to save updates from the front end.

    module.exports.putVariantAnnotation = (req, res) ->
      selector = getVariantSelector(req)
      body = req.body

      db = res.locals.db
      db.collection "variants", (err, variants) ->
        return res.status(500).send(err) if (err)

        variants.findOne selector, (err, variant) ->
          return res.status(500).send(err) if (err)
          return res.status(404).send("Not found") if ! variant?

          db.collection "annotations", (err, annotations) ->

            toWrite = []
            for own k, v of body.data
              for element in v
                toWrite.push {role: k, annotation: element}

            async.eachSeries toWrite,
              (e, done) ->

                finder = if e.annotation["_id"]
                  {_id: new BSON.ObjectID(e.annotation["_id"])}
                else
                  {ref: variant._id, role: e.role, identity: e.annotation["identity"]}
                delete e.annotation["_id"]

                annotations.update finder, {$set : e.annotation}, {"upsert" : true}, (err, result) ->
                  done(err)
              (err) ->
                return res.status(500).send(err) if (err)
                module.exports.getVariantAnnotation req, res


Retrieves a variant report. The endpoint also looks up a little gene information and implants
that into the response where appropriate. This requires a different strategy than the other
endpoints, in that we want to merge data from several endpoints into a single data block for
rendering.

    getVariantReportData = (req, res, callback) ->

      # We are going to be a bit cunning here. We're going to mock a response for
      # the various endpoints, and collate the data into a single object. When we are
      # done, we combine and render.

      MockResponse = class
        constructor: (@responseCallback) ->
          @locals = {db: res.locals.db, config: res.locals.config}
        status: (code) -> @code = code
        send: (data) -> @responseCallback(@code != 200 and @code, data)

      requests = {
        'variant': module.exports.getVariant,
        'frequencies': module.exports.getVariantFrequencies
        'gene': getVariantGene
        'mutations': getVariantGeneMutations
        'annotation': module.exports.getVariantAnnotation
      }

      result = {}

      requestHandler = (key, itemCallback) ->
        mocked = new MockResponse (err, data) ->
          # console.log "Received response", key, data
          result[key] = data if ! err?
          itemCallback(err)
        requests[key](req, mocked)

      resultHandler = (err) ->
        callback(err, result)

      async.each Object.keys(requests), requestHandler, resultHandler


Given some HTML, runs that through the reporting component to transform it into
PDF and return it through the response.

    respondWithPDF = (html, res) ->
      buffer = new Buffer(html)

      temp.open 'report', (err, info) ->
        console.error("Failed to open file", err) if err

        fs.write info.fd, buffer, 0, buffer.length, null, (err, written, buffer) ->
          console.error("Failed to open file", err) if err

          fs.close info.fd, (err) ->
            console.error("Failed to close file", err) if err

            reporting.generatePdf info.path, (err, stream) ->
              stream.pipe(res)


This function does a small bit of domain transformation. In particular, it sorts domains
by their start offset within the gene, and then iterates through removing those that are
entirely enclosed. This is somethong of a heuristic, but filters out small features
very effectively.

    transformDomains = (domains) ->
      sortedDomains = domains.sort (a, b) -> a["start"] - b["start"]
      domainCount = sortedDomains.length
      d = 0

      while d < domainCount
        next = d + 1

        ## Simple case, no more domains. Stop.
        break if next == domainCount

        thisDomain = sortedDomains[d]
        nextDomain = sortedDomains[next]

        ## Simple case, next domain starts after this one, no overlap
        if thisDomain["end"] < nextDomain["start"]
          d++
          continue

        ## The domains do overlap. Keep the biggest. Note we splice the sortedDomains
        ## array and adjust count so we can continue.
        thisSize = thisDomain["end"] - thisDomain["start"]
        nextSize = nextDomain["end"] - nextDomain["start"]

        if thisSize >= nextSize

          ## Next is smaller, remove it.
          sortedDomains.splice(next, 1)
        else

          ## This is smaller. Juggle them
          sortedDomains.splice(d, 2, nextDomain)

        domainCount--
        continue

      ({id: domain["hitName"], start: domain["start"], stop: domain["end"], description: domain["description"]} for domain in sortedDomains)


The function `getVariantChartSVG` uses a server-side charting component to
generate the SVG needed to display a variant chart. This can then be embedded in the HTML
for rendering to a PDF file server-side.

    getVariantChartSVG = (data) ->

      transcript = data.gene.data.sections.transcripts.data.records[0]

      positionString = data.variant.data.sections.positions.data[0]["codonStart"]
      position = parseInt((positionString).toString())

      mutationsData = for m in data.mutations.data when m.codon
        {id: m.name, position: m.codon , url: null, value: m.frequency, selected: (m.name == data.variant.data.mutation)}

      # Make sure selected markers are at the front. Don't use sort for this, no need. We can
      # filter and concatenate in two passes.
      mutationsSelected = mutationsData.filter (a) -> a.selected
      mutationsUnselected = mutationsData.filter (a) -> !a.selected

      domains = transcript["domains"].filter (domain) -> domain["gffSource"] == "Pfam"

      chartData =
        start: 1
        stop: transcript["lengthAminoAcid"]
        domains: transformDomains(domains)
        mutations: [].concat(mutationsUnselected, mutationsSelected)

      markerClassFn = (d) -> if d.selected then 'marker marker-selected' else 'marker marker-unselected'
      markerTooltipHtmlFn = (d) -> undefined

      chart = new ChartMaker({tooltips: false, displayWidth: 500, valueHeight: 80, markerClassFn: markerClassFn, markerTooltipHtmlFn: markerTooltipHtmlFn}, chartData)
      chart.display('body')

      chart.getChartElement().html()


Generates the report for a variant. This involves building the model, translating it into
HTML with pug, building any charts needed, and finally (if needed) translating it all into
a PDF for sending.

    module.exports.getVariantReport = (req, res) ->
      getVariantReportData req, res, (err, data) ->
        return res.status(500).send(err) if err?

        ## There are several parts to this. We always want at least HTML. We might
        ## then want to transform that HTML to PDF, or something similar.

        try
          data['chart'] = getVariantChartSVG(data)
        catch error
          logger.error "Error", error
          return res.status(500).send(error)

        html = undefined
        try
          html = pug.renderFile 'etc/reporting/templates/report.jade', data
        catch error
          logger.error "Error", error
          return res.status(500).send(error)

        res.format

          'application/pdf': () ->
            res.header('Content-Disposition', 'attachment; filename="report.pdf"')
            respondWithPDF html, res

          'text/html': () ->
            res.send html


Generates a PDF report for a variant. This involves building the model, translating it into
HTML with pug, building any charts needed, and finally (if needed) translating it all into
a PDF for sending.

    module.exports.getPDFVariantReport = (req, res) ->
      if req.query && req.query["type"] == 'pdf'
        knowledge.getVariantReport err, db, req, res, (db, err, doc, res, statusCode) ->
          statusCode = 400 if statusCode == undefined

          if err
            res.header('Content-Type', 'application/json')
            return res.send statusCode, {error: err, body: doc}

          doc["data"]["serviceUrl"] = req.url
          doc["data"]["config"] = res.locals.config if res.locals.config?
          view = "index.pug"
          res.render view, doc, (err, html) ->
            if err
              db.close()
              res.send 500, err
            else
              buffer = new Buffer(html)

              temp.open 'report', (err, info) ->
                console.error("Failed to open file", err) if err

                fs.write info.fd, buffer, 0, buffer.length, null, (err, written, buffer) ->
                  console.error("Failed to open file", err) if err

                  fs.close info.fd, (err) ->
                    console.error("Failed to close file", err) if err

                    reporting.generatePdf info.path, (err, stream) ->

                      db.close()
                      res.header('Content-Type', 'application/pdf')
                      res.header('Content-Disposition', 'attachment; filename="report.pdf"')
                      stream.pipe(res)
      else
        knowledge.getVariantReport req, res


Calculates the gene frequencies for a variant. This is not precalculated, but is done dynamically
using the aggregation framework.

    module.exports.getGeneFrequencies = (req, res) ->
      name = req.params.gene
      db = res.locals.db
      db.collection "genes", (err, genes) ->
        return res.status(500).send(err) if (err)

        genes.findOne {name: name}, (err, doc) ->

          return res.status(500).send(err) if (err)
          return res.status(404).send({err: "no such object: " + selector.toString()}) if (! doc?)

          variantFrequenciesPipeline = [
            { $match : {  geneId : doc['_id'] }},
            { $group : { _id : { site : '$primarySite', hist : '$primaryHist'}, total : { $sum : 1}, mutated : { $sum : {$cond : { if : {$ne : ['$mutationId', null]}, then : 1, else : 0 }}}}},
            { $project : { _id : 0, type : '$_id', total : 1, mutated : 1, frequency: { $divide : [ '$mutated', '$total']}}},
            { $match : { mutated : { $gt : 0}}},
            { $sort : { 'frequency' : -1 }}
          ]

          db.collection "variantRecords", (err, variantRecords) ->
            return res.status(500).send(err) if (err)
            variantRecords.aggregate variantFrequenciesPipeline, (err, variantFrequencies) ->
              return res.status(500).send(err) if (err)

              result = new Object
              result['data'] = variantFrequencies
              result['config'] = res.locals.config
              res.send result


Finds and returns the annotations for a variant.

    module.exports.getVariantAnnotation = (req, res) ->
      selector = getVariantSelector(req)

      db = res.locals.db
      db.collection "variants", (err, variants) ->
        return res.status(500).send(err) if (err)

        variants.findOne selector, (err, variant) ->
          return res.status(500).send(err) if (err)
          return res.status(404).send("Not found") if ! variant?

          db.collection "annotations", (err, annotations) ->
            return res.status(500).send(err) if (err)

            annotations.find({ref: variant._id}).toArray (err, docs) ->
              return res.status(500).send(err) if (err)

              ## A small amount of client-side decoding, this translates some array items
              ## (best for MongoDB indexing) to object keys (best for the client)

              result = {}
              result['data'] = {}
              for doc in docs
                delete doc.ref
                role = doc.role
                result['data'][role] ?= []

                if doc.citations?
                  for citation in doc.citations
                    citation.externalUrl ?= getExternalUrl(citation)

                result['data'][role].push doc
              result['url'] = req.url

              res.send result


Retrieves variant frequencies.

    module.exports.getVariantFrequencies = (req, res) ->
      selector = getVariantSelector(req)

      db = res.locals.db
      db.collection "variants", (err, variants) ->
        return res.status(500).send(err) if (err)

        variants.findOne selector, (err, doc) ->
          return res.status(500).send(err) if (err)
          return res.status(404).send({err: "no such object: " + selector.toString()}) if (! doc?)

          geneId = doc.references[doc.genesRidx]['_id']

          variantFrequenciesPipeline = [
            { $match : {  geneId : geneId}},
            { $group : { _id : { site : '$primarySite', hist : '$primaryHist'}, total : { $sum : 1}, mutated : { $sum : {$cond : { if : {$eq : ['$mutationId', doc['_id']]}, then : 1, else : 0 }}}}},
            { $project : { _id : 0, type : '$_id', total : 1, mutated : 1, frequency: { $divide : [ '$mutated', '$total']}}},
            { $match : { mutated : { $gt : 0}}},
            { $sort : { 'frequency' : -1 }}
          ]

          db.collection "variantRecords", (err, variantRecords) ->
            return res.status(500).send(err) if (err)
            variantRecords.aggregate variantFrequenciesPipeline, (err, variantFrequencies) ->
              return res.status(500).send(err) if (err)

              result = new Object
              result['data'] = variantFrequencies
              result['config'] = res.locals.config
              res.send result


Handler for the search API. This accepts a single string and returns a set of
hits. The principle is fairly simple, we want to look to see if there is a
space in the string, and if so, we behave a little differently. Each returned
result is tagged for display using some kind of a directive.

    convertWildcardToRegex = (string) ->
      escaped = string.replace /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"
      if escaped == string
        string
      else
        new RegExp("^" + escaped.replace(/\\\*/g, '.*').replace(/\\\?/g, '.'))

    module.exports.executeSearch = (req, res) ->
      db = res.locals.db
      query = req.query.q
      result = new Object
      response = new Object

      response["query"] = query
      response["results"] = []
      result["data"] = response

      addGeneResults = (query, result, callback) ->
        db.collection "genes", (err, genes)->
          components = query.split(" ")
          if components.length >= 1
            name = convertWildcardToRegex(components[0].toUpperCase())
            genes.find({name: name}).limit(1).toArray (err, docs) ->
              if docs.length < 1
                callback query, result
              else
                doc = docs[0]
                hit = new Object
                hit["type"] = "gene"
                hit["url"] = "/genes/" + doc["name"]
                hit["name"] = doc["name"]
                hit["label"] = hit["name"]
                result["data"]["results"].push(hit)
                callback query, result
          else
            callback query, result

      addVariantResults = (query, result, callback) ->
        db.collection "variants", (err, variants) ->
          components = query.split(" ")
          if components.length >= 2
            name = convertWildcardToRegex(components[0])
            mutation = components[1]
            mutation = genomics.convertNamesToCodes(mutation)
            mutation = "p." + mutation if ! mutation.startsWith("p.")
            mutation = convertWildcardToRegex(mutation)

            variants.find({gene: name, shortMutation: mutation}).limit(1).toArray (err, docs) ->
              if docs.length < 1
                callback db, query, result
              else
                doc = docs[0]
                hit = new Object
                hit["type"] = "mutation"
                hit["url"] = "/variants/" + encodeURIComponent(doc["shortName"])
                hit["gene"] = doc["gene"]
                hit["mutation"] = doc["mutation"]
                hit["shortMutation"] = doc["shortMutation"]
                hit["label"] = hit["gene"] + " " + hit["shortMutation"] + " (" + hit["mutation"] + ")"
                result["data"]["results"].push(hit)
                callback query, result
          else
            callback query, result

      query = query.trim()
      addGeneResults query, result, (query, result) ->
        addVariantResults query, result, (query, result) ->
          res.send result

    module.exports.getPublication = (err, db, req, res, callback) ->
      type = req.params['type']
      id = req.params['id']
      publicationId = type + ":" + id
      db.collection "publications", (err, publications) ->
        if err then return callback db, err, {}, res

        publications.find({name: publicationId}).limit(1).toArray (err, docs) ->
          if err then return callback db, err, {}, res
          if docs.length < 1 then return callback db, {err: "no such object: " + publicationId}, "", res, 404
          doc = docs[0]

          result = new Object
          result["data"] = doc
          callback db, err, result, res, 200


Updates/creates a variant. This is used to store new variants created from VCF files.
There is a significant amount of basic data needed for a single variant. Each must include, at
a minimum, the fields below. All of these can be derived from a properly managed use of the
Ensembl variant effect predictor. The fields are validated fairly thoroughly in terms of their
existence, but no semantic checking or consistency checks are applied.

* variantType - the variant type, always "mutation"
* shortMutation - e.g., "p.D1208Y" (optional)
* consequence - e.g., "missense_variant"
* name - e.g., "NPHS1 p.Asp1208Tyr" (optional)
* gene - e.g, "NPHS1"
* geneId - e.g., "ENSG00000161270"
* mutation - e.g., "p.Asp1208Tyr"
* type - e.g., "variant"
* shortName - e.g., "NPHS1 p.D1208Y" (optional)

All remaining data for a variant is pushed into the first positions record. It will typically
contain at least the following fields. Note that the database stores more information, and
will typically complete it from the core data included above. Some of these are required.
The core issue is how we RESTfully sensibly allow multiple items to be created.

* sift - e.g., { "level" : "tolerated", "score" : 0.07 } (optional)
* polyphen - e.g., { "level" : "benign", "score" : 0.002 } (optional)
* stop - e.g., "36317520"
* HGVSc - e.g., "c.3622G>T"
* cdsPosition - e.g., "3622"
* HGVSp - e.g., "p.Asp1208Tyr" (optional)
* codon - e.g., "1208"
* transcript - e.g., "ENST00000378910"
* HGVSpr - e.g., "p.D1208Y" (optional)
* chromosome - e.g., "19"
* exon - e.g., "29"
* start - e.g., "36317520"

Other values might well be added over time.

    module.exports.postVariant = (err, db, req, res, callback) ->
      body = req.body
      data = req.body.data
      errors = []

      requiredFields = ["consequence", "type", "gene", "geneId", "mutation", "transcript", "start", "stop"]
      integerFields =  ["start", "stop", "exon", "codon", "cdsPosition"]
      primaryFields =  ["variantType", "shortMutation", "consequence", "name", "gene", "geneId", "mutation", "type", "shortName"]

      ## Now we can do some basic validation.
      validateRequiredField = (field) ->
        errors.push("Missing field: " + field) if ! data[field]?

      validateIntegerField = (field) ->
        value = data[field]
        if typeof value == 'string'
          parsed = parseInt(value)
          if parsed == NaN
            errors.push("Invalid value for field: " + field + " (value: " + value.toString() + ")")
          else
            data[field] = parsed
        else if value && typeof value != 'number'
          errors.push("Invalid value for field: " + field + " (value: " + value.toString() + ")")

      requiredFields.forEach(validateRequiredField)
      integerFields.forEach(validateIntegerField)

      if errors.length > 0
        return callback db, {error: errors.join(", ")}, {}, res, 400

      # Complete inferred values

      data["shortMutation"] = genomics.convertNamesToCodes(data["mutation"]) if !data["shortMutation"]
      data["name"] =          data["gene"] + " " + data["mutation"] if !data["name"]
      data["shortName"] =     data["gene"] + " " + data["shortMutation"] if !data["shortName"]

      # And finally, we want to restructure this into a statement that we can use to do a safe insert. Do this using a
      # standard MongoDB insert, which ought to get rejected if we have an existing variant with that name. This is a
      # key requirement. We have a unique and safe index on the name field for the variants collection, which ought to be
      # enough. That index is ensured below.

      record = {}
      for field in primaryFields
        record[field] = data[field]
        delete data[field]
      record["sections"] = {}
      record["sections"]["positions"] = {}
      record["sections"]["positions"]["data"] = []
      position = {}
      record["sections"]["positions"]["data"].push(position)

      for own field of data
        position[field] = data[field]

      record["version"] = 1

      assert(record["name"], "Internal error: missing name")

      # Finally, we need to make the reference to the gene. Best way to do this is to use the Ensembl gene identifier.
      # Now we're into MongoDB territory.

      geneSelector = {id: record["geneId"]}
      db.collection "genes", (err, genes) ->
        genes.find(geneSelector).limit(1).toArray (err, docs) ->
          if err || docs.length == 0 then return callback db, {error: "Failed to find gene: " + record["geneId"]}, {}, res, 400

          record["genesRidx"] = 0
          record["references"] = [{
            "_id" : docs[0]._id,
            "ref" : "genes",
            "name" : docs[0].name
          }]

          insertOptions = {"fsync" : true, "w" : 1};
          db.collection "variants", (err, variants) ->
            variants.insert record, insertOptions, (err, result) ->
              if err
                callback db, {error: err}, {}, res, (if err.code == 11000 then 403 else 400)
              else
                url = "/variants/" + encodeURIComponent(record["shortName"])
                callback db, null, url, res
