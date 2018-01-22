import * as http from 'http';
import app from './app';
const port =  process.env.PORT || '3000';
app.set('port', port);

// create a server and pass our Express app to it.
const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

// function to note that Express is listening
function onListening(): void {
  console.log(`API running on localhost:${port}`);
}
