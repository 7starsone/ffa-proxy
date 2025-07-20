const http = require('http');
const cors_proxy = require('cors-anywhere');

const proxy = cors_proxy.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
});

module.exports = (req, res) => {
    console.log("--- DEBUG VERCEL: Richiesta ricevuta. ---");
    console.log(`DEBUG VERCEL: URL richiesto: ${req.url}`);

    // Creiamo un "falso" server per intercettare la risposta del proxy
    const mockServer = new http.Server((proxyReq, proxyRes) => {
        let body = [];
        proxyRes.on('data', chunk => body.push(chunk));
        proxyRes.on('end', () => {
            const finalBody = Buffer.concat(body).toString();
            const finalHeaders = proxyRes.getHeaders();

            console.log("--- DEBUG VERCEL: Risposta dal proxy INTERCETTATA ---");
            console.log(`DEBUG VERCEL: Status Code che il proxy sta per inviare: ${proxyRes.statusCode}`);
            console.log("DEBUG VERCEL: Headers che il proxy sta per inviare:");
            console.log(JSON.stringify(finalHeaders, null, 2));
            console.log("--- DEBUG VERCEL: Fine intercettazione. Invio risposta finale. ---");

            // Ora inviamo la risposta vera e propria, ma con l'header corretto
            res.writeHead(proxyRes.statusCode, { ...finalHeaders, 'content-type': 'application/xml; charset=utf-8' });
            res.end(finalBody);
        });
    });
    
    // Passiamo la richiesta originale al nostro proxy, che risponderà al nostro "falso" server
    proxy.emit('request', req, new http.ServerResponse(req));
};
