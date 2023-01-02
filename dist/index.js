import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import authRouter from '../routes/auth.js';
import gameRouter from '../routes/game.js';
var app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/auth', authRouter);
app.use('/game', gameRouter);
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.listen(3000, () => {
  console.log(`listening on ${3000}`);
});