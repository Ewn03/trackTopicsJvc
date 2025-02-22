// ==UserScript==
// @name         Track Topics on JVC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enregistre les titres de sujets dans un cookie et les affiche dans le profil utilisateur sur JeuxVideo.com
// @author       Ewn03 Ravelmint
// @match        https://www.jeuxvideo.com/forums/*
// @match        https://www.jeuxvideo.com/profil/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js

// ==/UserScript==

(function() {
    'use strict';

    // Fonction pour vérifier si la page est une page secondaire (Page 2, Page 3, etc.)
    function isSecondaryPage() {
        const breadcrumbItems = document.querySelectorAll('.breadcrumb__item');
        for (const item of breadcrumbItems) {
            //console.log('item content bread : ', item.textContent);
            if (item.textContent.includes('- Page')) {
                //console.log('avec page : item content bread : ', item.textContent);
                return true; // Page secondaire détectée
            }
        }
        return false; // Pas de page secondaire
    }

    // Si c'est une page secondaire, on arrête le script
    if (isSecondaryPage()) {
        return; // Ne rien faire si c'est une page secondaire
    }

    // Fonction pour vérifier les doublons basés sur les premières lettres
    function isDuplicateTopic(title, trackedTopics) {
        const maxLength = 15; // Nombre de lettres à comparer
        const shortTitle = title.slice(0, maxLength).toLowerCase();
        return trackedTopics.some(topic => topic.title.slice(0, maxLength).toLowerCase() === shortTitle);
    }

    // Variables pour récupérer les éléments de la page
    const pseudoBloc = document.querySelector(".bloc-pseudo-msg");
    const headerPseudo = document.querySelector(".headerAccount__pseudo");

    // Modification de l'enregistrement du cookie
    if (pseudoBloc && headerPseudo && pseudoBloc.textContent.trim() === headerPseudo.textContent.trim()) {
        const title = document.querySelector("#bloc-title-forum")?.textContent?.trim();
        const url = window.location.href;

        if (title && url) {
            // Charger les sujets déjà suivis depuis le cookie
            const trackedTopics = JSON.parse(Cookies.get("trackedTopics") || "[]");

            // Vérifier si le sujet est déjà suivi
            if (!trackedTopics.some(topic => topic.url === url) && !isDuplicateTopic(title, trackedTopics)) {
                // Ajouter le nouveau sujet
                trackedTopics.push({ title, url });

                // Limiter à 10 entrées maximum
                while (trackedTopics.length > 10) {
                    trackedTopics.shift();
                }

                // Enregistrer dans le cookie
                Cookies.set("trackedTopics", JSON.stringify(trackedTopics), { expires: 365 });
            }
        }
    }

    // Code pour afficher les sujets dans le profil utilisateur
    if (window.location.href.includes("/profil/") && window.location.href.includes("?mode=infos")) {
        const trackedTopics = JSON.parse(Cookies.get("trackedTopics") || "[]");

        // Créer un conteneur pour afficher les liens des sujets
        const container = document.createElement("div");
        container.classList.add("bloc-default-profil");
        const containerTitres = document.createElement("div");
        containerTitres.classList.add('last-messages');

        const header = document.createElement("h2");
        header.textContent = "Derniers topics";
        const d = document.createElement('div');
        d.classList.add('bloc-default-profil-header');
        d.appendChild(header);
        container.appendChild(d);

        // Ajouter les liens des sujets
        trackedTopics.forEach(topic => {
            const link = document.createElement("a");
            link.href = topic.url;
            link.textContent = topic.title;
            link.style.display = "block"; // Chaque lien sur une nouvelle ligne
            link.classList.add('xXx');
            link.style.color = 'white';
            link.style.fontWeight = 'bold';
            containerTitres.appendChild(link);
        });
        container.appendChild(containerTitres);

        // Ajouter le conteneur à la page après la section principale
        const layout = document.querySelector(".layout__row.layout__content.layout__row--gutter");
        if (layout) {
            layout.appendChild(container);
        }
    }

})();
