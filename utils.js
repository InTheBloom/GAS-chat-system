// initialize
if (!localStorage.hasOwnProperty("last_thread_updated")) {
    localStorage.setItem("last_thread_updated", "0");
}
if (!localStorage.hasOwnProperty("all_thread")) {
    localStorage.setItem("all_thread", "[]");
}
if (!localStorage.hasOwnProperty("a_thread_info")) {
    localStorage.setItem("a_thread_info", "{}");
}

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
