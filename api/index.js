// Carica la libreria cors-anywhere
const cors_proxy = require('cors-anywhere');

// Definisci le opzioni per il nostro server proxy
const host = '0.0.0.0';
const port = 8080;

// Crea il server proxy
const server = cors_proxy.createServer({
    originWhitelist: [], 
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
});

// Esporta la funzione per Vercel
module.exports = (req, res) => {
    // Intercettiamo la richiesta prima di passarla al server proxy
    
    // Aggiungiamo un listener per modificare la risposta del proxy
    const originalWriteHead = res.writeHead;
    res.writeHead = function(statusCode, headers) {
        // CORREZIONE CHIAVE: Forziamo il Content-Type a essere XML.
        // Questo dice a SimplePie che il contenuto è sicuro da analizzare.
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        
        // Rimuoviamo un header che può causare problemi
        res.removeHeader('X-Request-URL');
        
        // Richiamiamo la funzione originale
        originalWriteHead.apply(this, arguments);
    };

    // Ora passiamo la richiesta al server proxy per essere gestita
    server.emit('request', req, res);
};
