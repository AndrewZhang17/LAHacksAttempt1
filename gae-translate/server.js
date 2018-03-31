/**
 * This is a sample translation server that relies on Google Cloud Translate.
 */

// Import the "express" module.
var express = require('express');
// Import the Google Cloud Translate library.
var Translate = require('@google-cloud/translate');

// Do some initialization.
var translate = new Translate();
var app = express();
app.set('view engine', 'pug');

app.get('/', function handleRoot(request, response) {
    response.render('index');
});

app.get('/translate', function handleTranslate(request, response) {
    // Pre-condition: check that we actually received text.
    var query = request.query;
    if (query.text == null) {
        response.statusCode = 400; // Bad request
        response.send('Expected text to translate, but didn\'t get any.');
        return;
    }


    var textToTranslate = query.text;
    translate.getLanguages()
        .then(results => {
            const languages = results[0];
            var toLanguage = languages[Math.floor(Math.random() * languages.length)];
            var languageOptions = {
                from: query.from,
                to: toLanguage.code
            };


            // Translate the text. The translation itself it asynchronous because we need
            // to wait for the server to do the translation.
            console.log(textToTranslate, languageOptions);
            var translating = translate.translate(
                textToTranslate,
                languageOptions,
                // callback for when the operation is finished.
                function handleTranslatedText(err, translation) {
                    if (err != null) {
                        // There was an error!
                        console.error(err);
                        response.statusCode = 500; // Server error
                        response.send(`Server encountered an error: ${err.message}`);
                    } else {
                        console.log(`Translated: "${textToTranslate}" [${query.from}] -> "${translation}" [${query.to}]`);
                        response.send(translation);
                    }
                }
            );
        });


});

app.get('/list-languages', function handleListLanguages(request, response) {
    /**
     * EXERCISE -- Use translateService.getLanguages to get the list of languages
     * supported by Google Cloud Translate, and respond with that list of
     * languages. Docs:
     * https://cloud.google.com/nodejs/docs/reference/translate/1.1.x/Translate#getLanguages
     */

    translate
        .getLanguages()
        .then(results => {
            const languages = results[0];
            response.send(languages);

        });

});

// Determine the TCP port number to listen on from the environment, defaulting to 8080.
var PORT = process.env.PORT || 8080;
// Start the web application, listening the port number determined above.
app.listen(PORT);
console.log(`Now listening on port ${PORT}... Press Ctrl+C to quit.`);
