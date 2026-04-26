const functions = require('firebase-functions');
const next = require('next');

const dev = false;
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();
const appPrepare = app.prepare();

exports.nextServer = functions.https.onRequest((req, res) => {
  return appPrepare.then(() => handle(req, res));
});
