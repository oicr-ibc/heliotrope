angular
  .module('heliotrope', [
    'heliotrope.filters'
    'heliotrope.services'
    'heliotrope.directives'
    'heliotrope.directives.charts'
    'heliotrope.directives.forms'
    'heliotrope.directives.tables'
    'heliotrope.directives.workflows'
    'heliotrope.directives.navigation'
    'knowledge.services'
  ])
  .config(['$routeProvider', 
    ($routeProvider) ->
      $routeProvider.when "/search",                                     {templateUrl: 'app/partials/search.html',       controller: "SearchController"}
      $routeProvider.when "/",                                           {templateUrl: 'app/partials/home.html',         controller: "HomeController"}
      $routeProvider.when "/genes",                                      {templateUrl: 'app/partials/home.html',         controller: "HomeController"}
      $routeProvider.when "/genes/:gene",                                {templateUrl: 'app/partials/gene.html',         controller: "GeneController"}
      $routeProvider.when "/variants/:variant",                          {templateUrl: 'app/partials/variant.html',      controller: "VariantController"}
      $routeProvider.when "/studies/:study",                             {templateUrl: 'app/partials/study.html',        controller: "StudyController"}
      $routeProvider.when "/studies/:study/:role/:identity",             {templateUrl: 'app/partials/entity.html',       controller: "EntityController"}
      $routeProvider.when "/studies/:study/:role/:identity/step/:step",  {templateUrl: 'app/partials/step.html',         controller: "EntityStepController"}
      $routeProvider.otherwise {redirectTo: "/view1"}
  ])
  .config( ['$locationProvider', ($locationProvider) ->
      $locationProvider.html5Mode(true)
      $locationProvider.hashPrefix = "!"
  ])

# angular.bootstrap(document,['heliotrope'])

jQuery.extend(jQuery.fn.dataTableExt.oStdClasses, {
  "sSortAsc": "header headerSortDown", 
  "sSortDesc": "header headerSortUp", 
  "sSortable": "header"
})

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "percent-pre": (a) ->
    x = if a == "-" then 0 else a.replace( /%/, "" )
    parseFloat(x)
 
  "percent-asc": (a, b) ->
    if a < b then -1 else if (a > b) then 1 else 0
  
  "percent-desc": (a, b) ->
    if a < b then 1 else if (a > b) then -1 else 0
})

jQuery(document).ready () ->
  jQuery('body').on('.tooltip.data-api')
