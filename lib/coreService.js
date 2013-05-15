// Core service components, which basically set up access to static files and other shared components.
// This should be set up for all deployments.

var app = module.parent.exports.app,
    config = module.parent.exports.config;

app.get('/test/*', function(req, res){
  var file = './webapp/test/' + req.params[0];
  res.sendfile(file);
});

app.get('/*', function(req, res){
  var file = './webapp/app/index.html';
  if (!res.getHeader('Cache-Control')) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  res.sendfile(file);
});
