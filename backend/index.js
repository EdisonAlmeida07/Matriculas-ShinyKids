'use estrict'
var app = require('./app');
var port = '3600';

require('./firebase');

app.listen(port, function() {
    console.log("Servidor iniciado en el puerto: " + port);
});