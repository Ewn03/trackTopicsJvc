// ==UserScript==
// @name         Track Topics JVC 18-25
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enregistrer les sujets créés par l'utilisateur dans la page profil sur le 18-25 de jeuxvideo.com
// @author       ravelmint (Ewn03)
// @match        *://www.jeuxvideo.com/forums/*
// @match        *://www.jeuxvideo.com/profil/*?mode=infos*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Nom du cookie utilisé pour stocker les sujets
    const COOKIE_NAME = 'trackedTopics';
    const MAX_TOPICS = 10;

    // Fonction pour lire un cookie
    function getTopics() {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(COOKIE_NAME + '='));
        return cookie ? JSON.parse(cookie.split('=')[1]) : [];
    }

    // Fonction pour écrire un cookie
    function setTopics(topics) {
        document.cookie = `${COOKIE_NAME}=${JSON.stringify(topics)}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }

    // Fonction pour ajouter un sujet au cookie (éviter les doublons)
    function addTopic(url, title) {
        const topics = getTopics();
        const isDuplicate = topics.some(topic => topic.url === url); // Vérifie si l'URL existe déjà
        if (!isDuplicate) {
            topics.unshift({ url, title }); // Ajouter au début
            if (topics.length > MAX_TOPICS) topics.pop(); // Supprimer l'excédent
            setTopics(topics);
        }
    }

    // Vérifier si on est sur une page de forum
    if (window.location.href.includes('/forums/')) {
        const pseudoElements = document.querySelectorAll('.bloc-pseudo-msg');
        const userPseudoElement = document.querySelector('.headerAccount__pseudo');
        const titleElement = document.getElementById('bloc-title-forum');

        if (pseudoElements.length > 0 && userPseudoElement && titleElement) {
            const firstPseudoElement = pseudoElements[0]; // Récupérer le premier élément
            const pseudo = firstPseudoElement.textContent.trim();
            const userPseudo = userPseudoElement.textContent.trim();
            const title = titleElement.textContent.trim();

            // Si le premier pseudo correspond à l'utilisateur connecté
            if (pseudo === userPseudo) {
                const url = window.location.href;
                addTopic(url, title);
            }
        }
    }

    // Vérifier si on est sur une page de profil
    if (window.location.href.includes('/profil/') && window.location.href.includes('?mode=infos')) {
        const topics = getTopics();

        // Créer une div pour afficher les titres
        const container = document.createElement('div');
        container.classList.add("bloc-default-profil");


        // Ajouter un titre
        const par = document.createElement('div');
        par.classList.add('bloc-default-profil-header');
        const title = document.createElement('h2');
        title.textContent = 'Derniers sujets créés';
        title.style.marginBottom = '10px';
        par.appendChild(title);
        container.appendChild(par);

        const containerTitres = document.createElement('div');
        containerTitres.classList.add("last-messages");

        // Ajouter les liens
        topics.forEach(topic => {
            const link = document.createElement('a');
            link.href = topic.url;
            link.textContent = topic.title;
            link.style.display = 'block';
            link.style.marginBottom = '5px';
            containerTitres.appendChild(link);
        });

        container.appendChild(containerTitres);

        // Ajouter la div dans la div `layout__row layout__content layout__row--gutter`
        const targetDiv = document.querySelector('.layout__row.layout__content.layout__row--gutter');
        if (targetDiv) {
            targetDiv.appendChild(container);
        }
    }
})();
