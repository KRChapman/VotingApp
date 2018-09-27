
const app = require('./../index.js');

const port = process.env.PORT || 3000;



//for testing with nodemon it tries to connect more than once while testing
// if (!module.parent) {

// }

app.listen(port);
console.log('server listening on port %s.', port);