import * as express from 'express';
import * as path from 'path';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import usersApi from '../server/routes/api/users';
import eventsApi from '../server/routes/api/events';

class App {
  public app: express.Application;

  // Run configuration methods on the Express instance.
	constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

	// Configure Express middleware.
	private middleware(): void {
		/* Mongoose setup */
		mongoose.connect('mongodb://localhost/ctn');

		const db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error'));
		db.once('open', () => console.log('Successfully conneted to MongoDB'));

		// Parsers for POST data
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}

	// Configure API endpoints.
	private routes(): void {
		// Point static path to dist
		this.app.use(express.static(path.join(__dirname, 'dist')));

		this.app.use('/api/users', usersApi);
		this.app.use('/api/events', eventsApi);

		// Catch all other routes and return the index file
		this.app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, 'dist/index.html'));
		});
	}
}

export default new App().app;
