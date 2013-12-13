(function(){


  var express = require('express')
    , http = require('http')
    , path = require('path')
    , io = require('socket.io')
    , fs = require('fs');
    

   var users = {};

  //Configure server
  var app = express();

  app.configure(function(){
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());

    //app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);  
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });


  //Define routes
  



  //INDEX
  app.get('/', function(req, res){
    res.render('audio',  { server: req.headers.host , port: app.get('port'), ip: req.connection.remoteAddress });
  });

   //INDEX
  app.get('/ipad', function(req, res){
    res.render('ipad',  { server: req.headers.host , port: app.get('port'), ip: req.connection.remoteAddress });
  });

   app.get('/audio', function(req, res){
    res.render('audio',  { server: req.headers.host , port: app.get('port'), ip: req.connection.remoteAddress });
  });



  //Start Server

  var sv = http.createServer(app);
  var io = require('socket.io').listen(sv);


  sv.listen(app.get('port'), function(){
    console.log('SERVER STARTED ON PORT ' + app.get('port'))
  });

  sv.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      console.log('PORT 80 in use. Trying the port 8080' );
      app.set('port', 8080);
      setTimeout(function () {
        sv.listen(app.get('port'));
      }, 1000);
    }
  });

  io.set('log level', 0);



  // Listener for users first connection
  io.sockets.on('connection', function (socket) {
    
    //socket.on('disconnect')

    socket.on('note', function(data){
        //socket.broadcast()
        socket.broadcast.emit('note', data);
        
    });

  });


})()