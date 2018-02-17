emptyCallback = () => {};

getCurrentTab = (callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        callback(tabs[0]);
    });
};

getTabSettings = (url, callback) => {
    chrome.storage.sync.get(url, (settings) => {
        callback(settings[url]);
    });
};

retrieveTextAreas = () => {
    return {
        enabled: document.getElementById('tab-enabled').checked,
        zoom: document.getElementById('tab-zoom').value,
        css: document.getElementById('tab-css').value
    }
};

populateTabInfo = (tab) => {
    document.getElementById('tab-favIconUrl').src = tab.favIconUrl;
    document.getElementById('tab-title').innerHTML = tab.title;
    document.getElementById('tab-url').innerHTML = tab.url;
};

populateTabSettings = (tabSettings) => {
    if (tabSettings) {
        document.getElementById('tab-enabled').checked = tabSettings.enabled;
        document.getElementById('tab-zoom').value = tabSettings.zoom;
        document.getElementById('tab-css').value = tabSettings.css;
    }
};

saveTabSettings = (url, settings, callback) => {
    callback = callback || emptyCallback;

    const newSettings = {
        [url]: {
            enabled: settings.enabled || false,
            css: settings.css || '',
            zoom: settings.zoom || 100
        }
    };

    chrome.storage.sync.set(newSettings, () => {
        chrome.storage.sync.get(url, (s) => {
            callback(s[url]);
        });
    });
};

loadPopup = () => {
    getCurrentTab((tab) => {
        getTabSettings(tab.url, (tabSettings) => {
            populateTabInfo(tab);
            populateTabSettings(tabSettings);
        });
    });
};

// Save Button
document.getElementById('btn-submit').addEventListener('click', () => {
    getCurrentTab((tab) => {
        const textAreas = retrieveTextAreas();
        saveTabSettings(tab.url, textAreas, (s) => {
            document.getElementById('btn-submit').innerHTML = 'Saved!';
            setTimeout(() => {
                document.getElementById('btn-submit').innerHTML = 'Save Changes';
            }, 1000);
        });
    });
});

let checkbox = document.getElementById('tab-enabled');
const zoomInput = document.getElementById('tab-zoom');
const cssInput = document.getElementById('tab-css');

zoomInput.addEventListener('change', () => {
    checkbox.checked = true;
});

cssInput.addEventListener('change', () => {
    checkbox.checked = true;
});

window.onload = () => {
    loadPopup();
};