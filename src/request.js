async function fetch_all_thread () {
    console.log(`invoked ${(new Date()).toLocaleString()}`);

    // GETクエリを飛ばす。
    const response = await fetch(`${gas_app_url}?type=get-all-threads`);

    const json_content = await response.json();
    if (json_content.verdict === "OK") {
        localStorage.setItem("all_thread", JSON.stringify(json_content.data));
        return;
    }

    throw new Error(`スレッドのデータ取得に失敗しました。 Error: ${json_content.detail}`);
}

async function create_new_thread (title) {
    if (!is_login()) {
        throw new Error("スレッドを作成するには、ログインが必要です。");
    }

    if (title === "") {
        throw new Error("スレッドタイトルが空です。");
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
                password: `${localStorage.getItem("password")}`,
                date: (new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
            }
        })
    });

    const response_detail_json = await response.json();
    if (response_detail_json.verdict === "OK") {
        alert(`スレッド: ${title}が作成されました。`);
        return;
    }

    throw new Error(`スレッド作成に失敗しました。エラーメッセージ: ${response_detail_json.detail}`);
}

async function fetch_messages (title) {
    console.log(`invoked ${(new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`);

    // GET
    const response = await fetch(`${gas_app_url}?type=get-thread-messages&title=${title}`);
    const json_content = await response.json();

    if (json_content.verdict === "ERROR") {
        throw new Error(`スレッドデータの取得でエラーが発生しました。 Error: ${json_content.detail}`);
        return;
    }

    localStorage.setItem(`${title}_last_updated`, `${Date.now()}`);
    localStorage.setItem(`${title}_messages`, JSON.stringify(json_content.data));
};

async function post_message (title, msg) {
    if (!is_login()) {
        throw new Error("メッセージの投稿にはログインが必要です。");
    }

    if (msg === "") {
        throw new Error("メッセージが空です。");
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
                password: `${localStorage.getItem("password")}`,
                date: (new Date()).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
                message: `${msg}`,
            }
        })
    });

    const json_content = await response.json();

    if (json_content.verdict === "OK") {
        return;
    }

    if (json_content.verdict === "ERROR") {
        throw new Error(`メッセージの投稿でエラーが発生しました。 Error: ${json_content.detail}`);
    }
    throw new Error(`ステータス: ${json_content.verdict} メッセージ: ${json_content.detail}`);
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

async function login (user_name, password, mailaddress) {
    if (user_name === "") {
        throw new Error("ユーザー名が空です。");
    }
    if (password === "") {
        throw new Error("パスワードが空です。");
    }

    // 情報のフェッチ
    let collision = await is_user_name_collision(user_name);

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
                mailaddress: `${mailaddress}`,
            }
        })
    });

    const json = await response.json();

    if (json.verdict === "ERROR") {
        throw new Error(`エラーが発生しました。Error: ${json.detail}`);
        return;
    }

    alert(`成功しました。 Message: ${json.detail}`);

    // LocalStorageに反映
    localStorage.setItem("user", user_name);
    localStorage.setItem("password", password);
}
