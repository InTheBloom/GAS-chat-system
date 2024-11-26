async function fetch_all_thread () {
    console.log(`invoked ${(new Date()).toLocaleString()}`);

    // GETクエリを飛ばす。
    const response = await fetch(`${gas_app_url}?type=get-all-threads`);

    const json_content = await response.json();
    if (json_content.verdict === "OK") {
        localStorage.setItem("all_thread", JSON.stringify(json_content.data));
        return;
    }

    alert(`Failed to fetch thread data. Error: ${json_content.detail}`);
}
