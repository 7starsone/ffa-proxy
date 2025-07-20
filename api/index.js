// Carica la libreria cors-anywhere
const cors_proxy = require('cors-anywhere');

// Definisci le opzioni per il nostro server proxy
const host = '0.0.0.0';
const port = 8080;

// Crea e avvia il server proxy
const server = cors_proxy.createServer({
    originWhitelist: [], // Lascia vuoto per permettere tutte le origini
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
});

// Esporta il server per Vercel
module.exports = (req, res) => {
    server.emit('request', req, res);
};
