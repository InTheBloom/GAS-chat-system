async function fetch_all_thread () {
    console.log(`invoked ${(new Date()).toLocaleString()}`);

    // GETクエリを飛ばす。
    const response = await fetch(`${gas_app_url}?type=get-all-threads`);

    const json_content = await response.json();
    if (json_content.verdict === "OK") {
        localStorage.setItem("all_thread", JSON.stringify(json_content.data));
        return;
    }

    alert(`スレッドのデータ取得に失敗しました。 Error: ${json_content.detail}`);
}

async function create_new_thread (title) {
    if (!is_login()) {
        alert("スレッドを作成するには、ログインが必要です。");
        return;
    }

    if (title === "") {
        alert("スレッドタイトルが空です。");
        return;
    }

    if (!confirm(`スレッド名: ${title}で作成します。よろしいですか？`)) {
        return;
    }

    // POSTで作成リクエストを投げる
    const response = await fetch(gas_app_url, {
        method: "POST",
        body: JSON.stringify({
            type: "create-new-thread",
            data: {
                title: `${title}`,
                user: `${localStorage.getItem("user")}`,
                date: (new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
            }
        })
    });

    const response_detail_json = await response.json();
    if (response_detail_json.verdict === "OK") {
        alert(`スレッド: ${title}が作成されました。`);
        return;
    }

    alert(`スレッド作成に失敗しました。エラーメッセージ: ${response_detail_json.detail}`);
}

async function fetch_messages (title) {
    console.log(`invoked ${(new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`);

    // GET
    const response = await fetch(`${gas_app_url}?type=get-thread-messages&title=${title}`);
    const json_content = await response.json();

    if (json_content.verdict === "ERROR") {
        alert(`スレッドデータの取得でエラーが発生しました。 Error: ${json_content.detail}`);
        return;
    }

    localStorage.setItem(`${title}_last_updated`, `${Date.now()}`);
    localStorage.setItem(`${title}_messages`, JSON.stringify(json_content.data));
};

async function post_message (msg) {
    if (!is_login()) {
        alert("メッセージの投稿にはログインが必要です。");
        return;
    }

    if (msg === "") {
        alert("メッセージが空です。");
        return;
    }

    // POST
    const response = await fetch(gas_app_url, {
        method: "POST",
        body: JSON.stringify({
            type: "create-new-post",
            data: {
                title: `${title}`,
                user: `${localStorage.getItem("user")}`,
                date: (new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
                message: `${msg}`,
            }
        })
    });

    const json_content = await response.json();

    if (json_content.verdict === "ERROR") {
        alert(`メッセージの投稿でエラーが発生しました。 Error: ${json_content.detail}`);
    }
}

async function is_user_name_collision (name) {
    const response = await fetch(gas_app_url, {
        method: "POST",
        body: JSON.stringify({
            type: "is-user-collision",
            data: {
                user_name: `${name}`,
            }
        })
    });

    const json = await response.json();

    if (json.verdict === "ERROR") {
        throw new Error(`${json.detail}`);
    }

    return json.detail === "true";
}

async function login (user_name, password) {
    if (user_name === "") {
        alert("ユーザー名が空です。");
        return;
    }
    if (password === "") {
        alert("パスワードが空です。");
    }

    // 情報のフェッチ
    let collision;
    try {
        collision = await is_user_name_collision(user_name);
    }
    catch (e) {
        alert(`エラーが発生しました。 Error: ${e}`);
        return;
    }

    if (collision) {
        if (!confirm(`ユーザ名: ${user_name}でログインを試みます。よろしいですか？`)) return;
    }
    else {
        if (!confirm(`ユーザ名: ${user_name}でアカウントを作成します。よろしいですか？`)) return;
    }

    // ログインクエリ
    const response = await fetch(gas_app_url, {
        method: "POST",
        body: JSON.stringify({
            type: "login",
            data: {
                user_name: `${user_name}`,
                password: `${password}`,
            }
        })
    });

    const json = await response.json();

    if (json.verdict === "ERROR") {
        alert(`エラーが発生しました。Error: ${json.detail}`);
        return;
    }

    alert(`成功しました。 Message: ${json.detail}`);

    // LocalStorageに反映
    localStorage.setItem("user", user_name);
    localStorage.setItem("password", password);
}
