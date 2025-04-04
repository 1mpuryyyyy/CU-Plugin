// Связываем popup.js и content.js
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get("autoClean", (data) => {
        if (data.autoClean) {
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.sendMessage(tab.id, { action: "cleanAndAddRightClick" });
                });
            });
        }
    });
});
