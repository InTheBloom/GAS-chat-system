/* utilities */
function escapeHtml (unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
                e instanceof DOMException &&
                // everything except Firefox
                (e.code === 22 ||
                 // Firefox
                 e.code === 1014 ||
                 // test name field too, because code might not be present
                 // everything except Firefox
                 e.name === "QuotaExceededError" ||
                 // Firefox
                 e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage &&
                storage.length !== 0
               );
    }
}

function getQuery() {
    if(window.location.search === "") return;
    const variables = decodeURI(window.location.search).split("?")[1].split("&");
    const obj = {};
    variables.forEach(function(v, i) {
            const variable = v.split("=");
            obj[variable[0]] = variable[1];
            });
    return obj;
}

function is_login () {
    return localStorage.getItem("user") !== "";
}

// 投稿日時を相対的な形式（例：1分前、2時間前）で表示する関数
function formatRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}分前`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}時間前`;
    } else if (diffInSeconds < 2592000) {
        return `${Math.floor(diffInSeconds / 86400)}日前`;
    } else {
        return `${Math.floor(diffInSeconds / 2592000)}ヶ月前`;
    }
}
