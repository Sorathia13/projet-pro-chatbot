// Fichier : scraper/scrape.js
const fetch = require('node-fetch'); // Pour télécharger les pages
const cheerio = require('cheerio');   // Pour parser le HTML
const fs = require('fs');           // Pour écrire dans un fichier

// Mettez ici les URLs des pages de votre site que vous voulez inclure
const URLS_A_SCRAPER = [
    'https://vg-paradox.com/'
];

async function scraperSite() {
    console.log('Début du scraping...');
    let contenuTotal = '';

    for (const url of URLS_A_SCRAPER) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const $ = cheerio.load(html);

            // IMPORTANT : Ciblez la zone de contenu principal de votre site.
            // Par exemple, si votre texte est dans une balise <main> ou un <div id="content">
            // Cela évite de scraper les menus, footers, etc.
            const contenuPage = $('main').text(); // Adaptez le sélecteur 'main'

            contenuTotal += `\n\n--- Contenu de la page ${url} ---\n\n`;
            contenuTotal += contenuPage.replace(/\s\s+/g, ' ').trim(); // Nettoyage simple
            console.log(`- Page ${url} scrapée avec succès.`);

        } catch (error) {
            console.error(`Erreur en scrapant ${url}:`, error);
        }
    }

    // Formate le contenu final pour le fichier contexte.js
    const contenuFichierJS = `const CONTEXTE_DU_SITE = \`\n${contenuTotal}\n\`;`;
    
    // Écrit le résultat dans le fichier js/contexte.js
    fs.writeFileSync('js/contexte.js', contenuFichierJS, 'utf8');
    console.log('Fichier js/contexte.js mis à jour avec succès !');
}

scraperSite();