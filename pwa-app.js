// PWA installatie logica
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('PWA geïnstalleerd');
        }
        deferredPrompt = null;
        installButton.style.display = 'none';
    }
});

// Instagram frame logica
const instagramFrame = document.getElementById('instagram-frame');
const loadingDiv = document.getElementById('loading');
const refreshButton = document.getElementById('refresh-button');
const settingsButton = document.getElementById('settings-button');
const connectionStatus = document.getElementById('connection-status');

// Frame laden
function loadInstagramFrame() {
    loadingDiv.style.display = 'block';
    instagramFrame.style.display = 'none';
    
    instagramFrame.src = 'https://www.instagram.com/?variant=following';
    
    instagramFrame.onload = () => {
        loadingDiv.style.display = 'none';
        instagramFrame.style.display = 'block';
        
        // Probeer de "For You" tab te verbergen
        try {
            const frameDoc = instagramFrame.contentDocument || instagramFrame.contentWindow.document;
            const style = frameDoc.createElement('style');
            style.textContent = `
                [role="tablist"] > div:first-child,
                [role="tablist"] > div:first-of-type,
                [role="button"][aria-label="For you"],
                div[aria-label="For you"],
                a[role="tab"]:has(span:contains("For you")),
                div.x7a106z > div:first-child {
                    display: none !important;
                }
            `;
            frameDoc.head.appendChild(style);
        } catch (error) {
            console.log('Kan frame niet aanpassen vanwege security policy');
        }
    };
}

// Event listeners
refreshButton.addEventListener('click', loadInstagramFrame);

settingsButton.addEventListener('click', () => {
    // Toon instellingen menu (kan later worden uitgebreid)
    alert('Instellingen komen binnenkort beschikbaar!');
});

// Online/offline status
window.addEventListener('online', () => {
    connectionStatus.textContent = '📱 Online';
    loadInstagramFrame();
});

window.addEventListener('offline', () => {
    connectionStatus.textContent = '📴 Offline';
    loadingDiv.textContent = 'Je bent offline. Controleer je internetverbinding.';
    loadingDiv.style.display = 'block';
    instagramFrame.style.display = 'none';
});

// Laad de Instagram feed wanneer de pagina laadt
loadInstagramFrame(); 