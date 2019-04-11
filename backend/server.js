const http=require("http");

const app=require("./app");

const port=3000;
app.set('port',port);

const server=http.createServer(app);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'boolean' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
  });
server.on('error',function(error){
    console.log(error);
})
server.listen(port);