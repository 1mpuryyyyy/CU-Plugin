document.addEventListener("DOMContentLoaded", () => {
    const autoCleanSwitch = document.getElementById("autoCleanSwitch");

    if (!autoCleanSwitch) {
        return;
    }

    // Загружаем состояние toggle из chrome.storage.local
    chrome.storage.local.get("autoClean", (data) => {
        const savedState = data.autoClean || false;
        autoCleanSwitch.checked = savedState;
    });

    // Обработчик изменения toggle
    autoCleanSwitch.addEventListener("change", () => {
        const isChecked = autoCleanSwitch.checked;
        chrome.storage.local.set({ autoClean: isChecked });

        // Отправляем сообщение content.js для очистки
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            chrome.tabs.sendMessage(tabs[0].id, { action: "cleanAndAddRightClick" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.warn("Ошибка отправки сообщения:", chrome.runtime.lastError.message);
                }
            });
        });
    });

    // Добавляем обработчик для кнопки "Сбросить состояния"
    const clearStatesButton = document.getElementById("clearStates");
    if (clearStatesButton) {
        clearStatesButton.addEventListener("click", () => {
            chrome.storage.local.clear();
            alert("Состояния сброшены!");
        });
    }
});
