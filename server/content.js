// Функция для удаления нежелательных курсов
function removeUnwantedCourses() {
    // Список нежелательных курсов
    const unwantedCourses = [
        "Онбординг по платформам ЦУ",
        "Онбординговая неделя",
        "Математический буткемп",
        "ОРГ: Восток",
        "ОРГ: Юг",
        "ОРГ: Север",
        "ОРГ: Запад",
        "English 104",
        "English 103",
        "English 102",
        "English 101",
        "Большие идеи в компьютерных науках",
        "Ознакомление с локально-нормативными актами и приказами ЦУ",
        "Бизнес-студия: Восток",
        "Опросы бакалавриат",
        "🔵🔴⚫️ Введение в статистику",
        "🔵🔴⚫️ Линейная алгебра",
        "ФОС МКН. Вариант 1",
        "Основы финансов",
        "Мастерская технологического предпринимательства",
        "🔵🔴⚫️ Математический анализ",
        "Научная студия. Лесные пожары",
        "ОРГ_1",
        "ОРГ_2",
        "ОРГ_3",
        "ОРГ_4",
        '🔵🔴 Основы бизнес-аналитики',
        "⚫️ Основы бизнес-аналитики",
        "⚫️ Разработка на Python",
        "🔵🔴 Разработка на Python",
        "Физическая культура",
        "Физическая культура. Рефераты"
    ];

    if (window.location.href.includes('courses/view')) {
        const courseElements = document.querySelectorAll('.course-card');
        courseElements.forEach(courseElement => {
            const courseTitleElement = courseElement.querySelector('.course-card__title');
            if (courseTitleElement) {
                const courseTitle = courseTitleElement.innerText.trim();
                if (unwantedCourses.includes(courseTitle)) {
                    courseElement.closest('li').remove();
                }
            }
        courseElement.classList.add("turned-on");
        });
    } 
    if (window.location.href.includes('tasks/actual-student-tasks')){
        const listItems2024 = document.querySelectorAll('tr');
        listItems2024.forEach(item => {
            const text = item.textContent;

            if (text.includes("Seminar") ||
                text.includes("Суммарная оценка за аудиторную работу") ||
                text.includes("Посещение") ||
                text.includes("Пересдача")) {
                item.remove();
            }
        });
    }
}

// Функция добавления обработчика правого клика на курс
function addRightClickHandlers() {
    document.querySelectorAll('li').forEach(li => {

        if(li.classList.contains('has-right-click')) return;

        const titleElement = li.querySelector('.course-card__title');

        if(!titleElement) return;

        const courseKey = 'completed_' + titleElement.innerText.trim();

        li.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const isCompleted = !this.classList.toggle('completed');

            chrome.storage.local.set({ [courseKey]: isCompleted });
        });

        li.classList.add('has-right-click');
    });
}

// Основная функция при загрузке страницы
function cleanAndAddRightClick() {
    const observer = new MutationObserver((mutations, observer) => {
        const courseElements = document.querySelectorAll('.course-card');
        if (courseElements.length > 0) {
            removeUnwantedCourses();
            addRightClickHandlers();
            observer.disconnect(); 
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Проверяем autoClean при загрузке страницы
chrome.storage.local.get("autoClean", (data) => {
    if (data.autoClean) {
        cleanAndAddRightClick();
    } 
});
// Обработчик сообщений от popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "cleanAndAddRightClick") {
        chrome.storage.local.get("autoClean", (data) => {
            if (data.autoClean) {
                removeUnwantedCourses();
                addRightClickHandlers();
            } else {
                window.location.reload(); 
            }
        });
        sendResponse({ success: true });
    }
});
