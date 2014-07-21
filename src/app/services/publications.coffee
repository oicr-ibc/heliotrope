angular
  .module 'heliotrope.services.publications', ['ngSanitize']

  .factory 'dewikifier', Array '$sanitize', ($sanitize) ->
    return (text, references) ->

      getAuthors = (reference) ->
        input = reference.author
        result =
          if input.length
            if input.length > 3 then input[0] + " et al." else input.join(", ")
          else
            ''
        result = result.trim()
        return if result then $sanitize(result + ". ") else result

      getTitle = (reference) -> $sanitize(reference.title)
      getJournal = (reference) -> '<i>' + $sanitize(reference.journal) + '</i>'
      getVolume = (reference) ->
        if reference.volume?
          '<b>' + $sanitize(reference.volume) + '</b>'
        else
          ''

      getIssue = (reference) -> if reference.issue? then "(" + $sanitize(reference.issue) + ")" else ''
      getPages = (reference) -> if reference.pages? then "pp." + $sanitize(reference.pages) + ", " else ''
      getLink = (reference) ->
        encoded = encodeURIComponent(reference.pmid)
        "<a href='/publications/pmid/#{encoded}'>PMID #{encoded}</a>"

      bibiographyElement = (reference) ->
        "<span>#{getAuthors(reference)}#{getTitle(reference)}. #{getJournal(reference)} " +
        "#{getVolume(reference)}#{getIssue(reference)}, #{getPages(reference)}#{getLink(reference)}<span>"

      iElement = angular.element('<div></div>')
      paragraphs = text.split(/\n\n/)

      if !references?
        references = {}
      refList = undefined

      referenceIndexes = {}
      referenceIndex = 1

      if Object.keys(references).length > 0
        refList = angular.element('<ol class="references"></ol>')
        for own key, reference of references
          if reference.significant
            referenceElement = angular.element('<li class="reference"></li>')
            referenceElement.append bibiographyElement(reference)
            refList.append referenceElement
            referenceIndexes[key] = referenceIndex++

      for paragraph in paragraphs
        element = angular.element('<p></p>')
        paragraph = paragraph.replace /<ref refId="([^"]+)"\/>/g, (match, p1) ->
          found = references[p1]
          "<a class='citation' href='/publications/pmid/#{found.pmid}'>#{'[' + referenceIndexes[p1] + ']'}</a>"
        element.html(paragraph)
        iElement.append element

      if refList?
        iElement.append angular.element('<h4>References</h4>')
        iElement.append(refList)