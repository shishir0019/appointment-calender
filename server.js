const express = require('express');
const history = require('connect-history-api-fallback');

const app = express();

app.use(history());
app.use('/', express.static('./public'));

app.all('*', (req, res, next) => {
    res.sendFile('index.html');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Port on listening http://localhost:${PORT}`);
})