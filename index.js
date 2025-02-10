const fs = require('fs/promises');
const path = require('path');

exports.handler = async (event) => {
    const quotesFilePath = path.join(__dirname, '..', 'shoti.json');

    if (event.httpMethod === 'GET') {
        try {
            const data = await fs.readFile(quotesFilePath, 'utf8');
            const quotes = JSON.parse(data);
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            return {
                statusCode: 200,
                body: JSON.stringify(randomQuote),
            };
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Unable to fetch a quote.' }) };
        }
    }

    if (event.httpMethod === 'POST') {
        try {
            const { name, description, url } = JSON.parse(event.body);
            const data = await fs.readFile(quotesFilePath, 'utf8');
            const quotes = JSON.parse(data);
            const newQuote = { name, description, url };
            quotes.push(newQuote);
            await fs.writeFile(quotesFilePath, JSON.stringify(quotes));
            return { statusCode: 200, body: JSON.stringify(newQuote) };
        } catch (err) {
            return { statusCode: 500, body: JSON.stringify({ error: 'Error saving data.' }) };
        }
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
};
