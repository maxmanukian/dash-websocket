export const decodeRawTransaction = async (rawtx) =>{
    let baseUrl = "https://trpc.digitalcash.dev";
    let basicAuth = btoa(`user:pass`);
    let payload = JSON.stringify({
        "method": "decoderawtransaction",
        "params": [rawtx]
    });
    let resp = await fetch(baseUrl, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${basicAuth}`,
            "Content-Type": "application/json",
        },
        body: payload,
    });

    let data = await resp.json();
    if (data.error) {
        let err = new Error(data.error.message);
        Object.assign(err, data.error);
        throw err;
    }
    return data.result;
}