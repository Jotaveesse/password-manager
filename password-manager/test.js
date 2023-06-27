const encryptTemplate = '<nppcrypt version="1016">\n<encryption cipher="rijndael" key-length="32" mode="gcm" aad="true" encoding="base64" />\n<key algorithm="scrypt" N="16384" r="8" p="1" salt="salt_value" />\n<iv value="iv_value" method="random" /><tag value="tag_value" />\n</nppcrypt>\ncipher_value';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

window.onload = function () {
	const inputArea = document.getElementById("input-area");
	const passwordArea = document.getElementById("password-area");
	const outputArea = document.getElementById("output-area");

	document.getElementById("encrypt-button").addEventListener('click', function (ev) {
		var inputStringBuffer = textEncoder.encode(inputArea.value);
		var saltArrBuf = randBytes(16);
		var ivArrBuf = randBytes(16);
		var addiData = new Uint8Array(saltArrBuf.length + ivArrBuf.length);

		//additional data contains the salt and the iv
		addiData.set(saltArrBuf);
		addiData.set(ivArrBuf, saltArrBuf.length);

		encrypt(inputStringBuffer, passwordArea.value, saltArrBuf, ivArrBuf, addiData)
			.then((encr) => {
				var cipherArrBuf = encr.slice(0, encr.byteLength - 16);
				var tagArrBuf = encr.slice(encr.byteLength - 16);
				var finalString = encryptTemplate.replace("salt_value", arrayBufferToBase64(saltArrBuf));

				finalString = finalString.replace("iv_value", arrayBufferToBase64(ivArrBuf));
				finalString = finalString.replace("tag_value", arrayBufferToBase64(tagArrBuf));
				finalString = finalString.replace("cipher_value", arrayBufferToBase64(cipherArrBuf));
				outputArea.value = finalString;
			});
	});

	document.getElementById("decrypt-button").addEventListener('click', function (ev) {
		var inputString = inputArea.value;
		var xmlString = inputString.substring(0, inputString.indexOf("</nppcrypt>") + 11);
		var cipherB64 = inputString.substring(inputString.indexOf("</nppcrypt>") + 11);

		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(xmlString, "text/xml");

		//xml nodes
		var keyNode = xmlDoc.getElementsByTagName("key")[0];
		var ivNode = xmlDoc.getElementsByTagName("iv")[0];
		var tagNode = xmlDoc.getElementsByTagName("tag")[0];

		var saltB64 = keyNode.getAttribute("salt");
		var ivB64 = ivNode.getAttribute("value");
		var tagB64 = tagNode.getAttribute("value");
		var addiB64 = joinBase64(saltB64, ivB64);	//additional data contains salt and the iv

		var saltArrBuf = base64ToArrayBuffer(saltB64)
		var ivArrBuf = base64ToArrayBuffer(ivB64)
		var addiArrBuf = base64ToArrayBuffer(addiB64);

		var dataArrBuf = base64ToArrayBuffer(joinBase64(cipherB64, tagB64))

		/*encryptionData = {
			data: dataArrBuf,
			password: passwordArea.value,
			salt: saltArrBuf,
			iv: ivArrBuf,
			additionalData: addiData
		};*/

		decrypt(dataArrBuf, passwordArea.value, saltArrBuf, ivArrBuf, addiArrBuf).then((decr) => {
			outputArea.value = decr;
		});
	});
};

