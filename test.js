const encryptTemplate = '<nppcrypt version="1016">\n<encryption cipher="rijndael" key-length="32" mode="gcm" aad="true" encoding="base64" />\n<key algorithm="scrypt" N="16384" r="8" p="1" salt="salt_value" />\n<iv value="iv_value" method="random" /><tag value="tag_value" />\n</nppcrypt>\ncipher_value';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

var inputArea;
var passwordArea;
var outputArea;
var jsonArea;
var personTemp;
var accountTemp;
var loginTemp;

window.onload = function () {
	inputArea = document.getElementById("input-area");
	passwordArea = document.getElementById("password-area");
	outputArea = document.getElementById("output-area");
	jsonArea = document.getElementById("json-section")
	personTemp = document.getElementById("person-template");
	accountTemp = document.getElementById("account-template");
	loginTemp = document.getElementById("login-template");


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

	document.getElementById("display-button").addEventListener('click', function (ev) {
		var jsonData = JSON.parse(outputArea.value)
		console.log(jsonData);

		jsonArea.innerHTML="";
		Object.keys(jsonData).forEach(person => {
			var personElem = personTemp.content.cloneNode(true);
			var personAccounts = personElem.querySelector(".person-accounts");
			let title = personElem.querySelector(".person-title");
			title.innerHTML = person;

			jsonArea.appendChild(personElem);

			Object.keys(jsonData[person]).forEach(account => {
				var accountElem = accountTemp.content.cloneNode(true);
				var accountData = accountElem.querySelector(".account-data");
				let title = accountElem.querySelector(".account-title");
				title.innerHTML = account;

				personAccounts.appendChild(accountElem);

				jsonData[person][account].forEach(login => {
					var loginElem = loginTemp.content.cloneNode(true);

					var loginField = loginElem.querySelector(".login-field");
					var passwordField = loginElem.querySelector(".password-field");

					var loginInput = loginField.getElementsByTagName("input")[0];
					var passwordInput = passwordField.getElementsByTagName("input")[0];

					loginInput.value = login.username;
					passwordInput.value = login.password;
					accountData.appendChild(loginElem);
				});
			});
		});
	});

	document.getElementById("extract-button").addEventListener('click', function (ev) {
		var extractedJson = {};

		Array.from(jsonArea.children).forEach(personElem => {
			var personAccounts = personElem.querySelector(".person-accounts");
			var personTitle = personElem.querySelector(".person-title").innerHTML;
			extractedJson[personTitle] = {};

			Array.from(personAccounts.children).forEach(accountElem => {
				var accountData = accountElem.querySelector(".account-data");
				var accountTitle = accountElem.querySelector(".account-title").innerHTML;
				extractedJson[personTitle][accountTitle] = [];

				Array.from(accountData.children).forEach(loginElem => {
					var loginField = loginElem.querySelector(".login-field");
					var passwordField = loginElem.querySelector(".password-field");
					
					var loginInput = loginField.getElementsByTagName("input")[0];
					var passwordInput = passwordField.getElementsByTagName("input")[0];

					extractedJson[personTitle][accountTitle].push({"username":loginInput.value,"password":passwordInput.value});
				});
			});

			
		});
		inputArea.value = JSON.stringify(extractedJson);
	});
};

