const axios = require('axios');

module.exports = async (req, res) => {
    // L'URL di destinazione è tutto ciò che viene dopo la barra iniziale
    const urlToFetch = req.url.substring(1);
    console.log("--- DEBUG VERCEL: Richiesta ricevuta per l'URL: " + urlToFetch);

    if (!urlToFetch || !urlToFetch.startsWith('http')) {
        console.log("DEBUG VERCEL: ERRORE - URL non valido.");
        return res.status(400).send('Please provide a valid URL starting with http.');
    }

    try {
        console.log("DEBUG VERCEL: Tentativo di fetch con Axios...");
        const response = await axios.get(urlToFetch, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
            },
            timeout: 20000 // 20 secondi
        });
        console.log(`DEBUG VERCEL: Fetch riuscito. Status: ${response.status}. Content-Type: ${response.headers['content-type']}`);

        // Inoltriamo gli header e il contenuto originali
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/xml; charset=utf-8');
        res.status(200).send(response.data);
        console.log("DEBUG VERCEL: Risposta inviata con successo.");

    } catch (error) {
        console.error("DEBUG VERCEL: ERRORE CATTURATO:", error);
        const statusCode = error.response ? error.response.status : 500;
        const message = error.message || 'An error occurred while fetching the URL.';
        res.status(statusCode).send(message);
    }
};
