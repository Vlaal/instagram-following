// Functie om de URL te controleren en om te leiden
function redirectToFollowing() {
    const currentUrl = window.location.href;
    // Check voor zowel desktop als mobiele URLs
    if (currentUrl.includes('variant=home') || 
        currentUrl === 'https://www.instagram.com/' || 
        currentUrl === 'https://instagram.com/' ||
        currentUrl.match(/https:\/\/(www\.)?instagram\.com\/?$/)) {
        window.location.href = 'https://www.instagram.com/?variant=following';
    }
}

// Functie om Facebook link toe te voegen aan zoekresultaten
function addFacebookLinks() {
    // Zoek alle zoekresultaten voor zowel desktop als mobiel
    const searchResults = document.querySelectorAll('a[href^="/"][role="link"], a[href*="instagram.com/"]');
    
    searchResults.forEach(result => {
        // Check of het een gebruikersprofiel is (werkt voor zowel desktop als mobiel)
        const profileMatch = result.href.match(/instagram\.com\/([^/]+)\/?$/);
        if (profileMatch) {
            const username = profileMatch[1];
            // Skip als het geen echte username is
            if (['explore', 'direct', 'stories', 'reels'].includes(username)) return;
            
            // Check of de FB link al bestaat
            const existingFbLink = result.parentElement.querySelector('[data-fb-link]');
            if (existingFbLink) return;
            
            // Maak een container voor de Facebook link
            const fbLinkContainer = document.createElement('div');
            fbLinkContainer.style.cssText = `
                margin-left: 10px;
                display: inline-block;
                vertical-align: middle;
            `;
            
            // Maak de Facebook link
            const fbLink = document.createElement('a');
            fbLink.href = `https://www.facebook.com/public/${username}`;
            fbLink.target = '_blank';
            fbLink.style.cssText = `
                color: #385898;
                text-decoration: none;
                font-size: 14px;
                padding: 2px 6px;
                border-radius: 4px;
                background: rgba(56, 88, 152, 0.1);
                display: inline-block;
            `;
            fbLink.innerHTML = '🔍 FB';
            fbLink.setAttribute('data-fb-link', 'true');
            
            fbLinkContainer.appendChild(fbLink);
            
            // Voeg de link toe naast het zoekresultaat
            const resultContainer = result.closest('div[role="none"], div[role="button"], div.x1i10hfl');
            if (resultContainer) {
                resultContainer.style.display = 'flex';
                resultContainer.style.alignItems = 'center';
                resultContainer.appendChild(fbLinkContainer);
            } else {
                // Fallback voor mobiel als we de container niet kunnen vinden
                const parentDiv = result.parentElement;
                if (parentDiv) {
                    parentDiv.style.display = 'flex';
                    parentDiv.style.alignItems = 'center';
                    parentDiv.appendChild(fbLinkContainer);
                }
            }
        }
    });
}

// Voer de functies uit
redirectToFollowing();

// Observer voor URL veranderingen en DOM updates
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    
    // Check voor URL veranderingen
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        redirectToFollowing();
    }
    
    // Voeg Facebook links toe aan zoekresultaten voor zowel zoekpagina als profielpagina's
    if (currentUrl.includes('/explore/search/') || currentUrl.match(/instagram\.com\/[^/]+\/?$/)) {
        addFacebookLinks();
    }
});

// Start de observer met uitgebreide opties voor betere mobiele ondersteuning
observer.observe(document, { 
    subtree: true, 
    childList: true,
    characterData: true,
    attributes: true 
});

// History API aanpassingen behouden
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
    originalPushState.apply(this, arguments);
    redirectToFollowing();
};

history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    redirectToFollowing();
};