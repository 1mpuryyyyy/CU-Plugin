chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "cleanCourses") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "cleanAndAddRightClick" });
        });
    }
});