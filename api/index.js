const axios = require('axios');

module.exports = async (req, res) => {
    // L'URL di destinazione è tutto ciò che viene dopo la barra iniziale
    // es. /https://www.sitepoint.com/sitepoint.rss
    const urlToFetch = req.url.substring(1);

    if (!urlToFetch || !urlToFetch.startsWith('http')) {
        return res.status(400).send('Please provide a valid URL.');
    }

    try {
        // Esegui una semplice richiesta GET, ma con uno User-Agent da browser
        const response = await axios.get(urlToFetch, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
            },
            // Imposta un timeout ragionevole per la richiesta a SitePoint
            timeout: 20000 // 20 secondi
        });

        // Invia il contenuto della risposta (l'XML del feed)
        // Imposta l'header corretto per far capire a SimplePie che è un feed
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/xml; charset=utf-8');
        res.status(200).send(response.data);

    } catch (error) {
        console.error(error);
        const statusCode = error.response ? error.response.status : 500;
        const message = error.message || 'An error occurred while fetching the URL.';
        res.status(statusCode).send(message);
    }
};
