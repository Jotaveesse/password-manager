const N = 16384;
const r = 8;
const p = 1;
const dkLen = 32; // Key length in bytes

async function derivate(password, salt) {
    var derivatedKey;

    await scrypt.scrypt(
        textEncoder.encode(password),
        new Uint8Array(salt),
        N,
        r,
        p,
        dkLen,
        updateProgressBar
    )
        .then(async function (key) {
            derivatedKey = key;
        })
        .catch(function (err) {
            console.error("Derivation error:", err);
        });

    return derivatedKey;
}

async function encrypt(plaintextData, password, saltValue, ivValue, addiData) {
    const key = await derivate(password, saltValue);

    var encrypted;

    encryptionParams = {
        name: "AES-GCM",
        iv: ivValue,
        tagLength: 128,
        additionalData: addiData
    };

    await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-GCM" },
        false,
        ["encrypt"]
    )
        .then(async function (cryptoKey) {
            await crypto.subtle.encrypt(encryptionParams, cryptoKey, plaintextData)
                .then(function (encryptedData) {
                    encrypted = encryptedData;
                })
                .catch(function (err) {
                    console.error("Encryption error:", err);
                });
        })
        .catch(function (err) {
            console.error("Key import error:", err);
        })

    return encrypted;
}

async function decrypt(dataToDecode, password, saltValue, ivValue, addiData) {
    const key = await derivate(password, saltValue);

    var decrypted;

    decryptionParams = {
        name: "AES-GCM",
        iv: ivValue,
        tagLength: 128,
        additionalData: addiData
    };

    await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    )
        .then(async function (cryptoKey) {
            await crypto.subtle.decrypt(decryptionParams, cryptoKey, dataToDecode)
                .then(function (decryptedData) {
                    decrypted = textDecoder.decode(decryptedData);
                })
                .catch(function (err) {
                    console.error("Decryption error:", err);
                });
        })
        .catch(function (err) {
            console.error("Key import error:", err);
        });

    return decrypted;
}