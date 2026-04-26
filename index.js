const functions = require('firebase-functions');
const next = require('next');

const dev = false;
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();
const appPrepare = app.prepare();

functions.setGlobalOptions({ region: 'asia-southeast1' });

exports.nextServer = functions.https.onRequest((req, res) => {
  return appPrepare.then(() => handle(req, res));
});
