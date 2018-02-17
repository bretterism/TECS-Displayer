const emptyCallback = () => {};

const getCurrentTab = () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		return tabs[0];
	});
}

const getTabSettings = (url, callback) => {
    chrome.storage.sync.get(url, (settings) => {
    	if (settings.hasOwnProperty(url)) {
	        callback(settings[url]);
    	} else {
    		callback({url: url, enabled: false});
    	}
    });
};

const injectZoom = (tabId, zoomLevel, callback) => {
	callback = callback || emptyCallback;

	const zoomJs = 'document.body.style.zoom = \''+ zoomLevel + '%\';';
	chrome.tabs.executeScript(tabId, { code: zoomJs }, () => {
		callback();
	});
};

const runDisplayer = (tabId, tabSettings) => {
	// Clicks the refresh button on the Salesforce reports if that button exists
	const refreshReport = `
	    const refreshBtn = document.getElementById('refreshInput');

	    if (refreshBtn !== null) {
	        refreshBtn.click();
	    }`

    chrome.tabs.insertCSS(tabId, {code: tabSettings.css});
	chrome.tabs.executeScript(tabId, { code: refreshReport });
		
	injectZoom(tabId, tabSettings.zoom);
};

// **** Event Listeners ****
chrome.tabs.onUpdated.addListener(function(tabId, changeObj, tab){
	getTabSettings(tab.url, (tabSettings) => {
		if (tabSettings.enabled) {
			runDisplayer(tabId, tabSettings);
		}
	});
});