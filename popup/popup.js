document.addEventListener("DOMContentLoaded", () => {
    const autoCleanSwitch = document.getElementById("autoCleanSwitch");
    const clearButton = document.getElementById("clearStates");

    // Получаем состояние autoClean при загрузке страницы
    chrome.storage.sync.get(["autoClean"], (data) => {
        autoCleanSwitch.checked = data.autoClean || false;
        if (autoCleanSwitch.checked) {
            chrome.runtime.sendMessage({ action: "cleanCourses" });
        }
    });

    // Обработчик изменения состояния переключателя
    autoCleanSwitch.addEventListener("change", () => {
        const isChecked = autoCleanSwitch.checked;
        chrome.storage.sync.set({ autoClean: isChecked });
        if (isChecked) {
            console.log('autoClean is now enabled, sending cleanCourses message');
            chrome.runtime.sendMessage({ action: "cleanCourses" });
        }
    });

    // Обработчик кнопки очистки
    clearButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "clearCheckboxes" });
        });
    });
});