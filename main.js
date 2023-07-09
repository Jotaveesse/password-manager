const emptyData = { "Pessoa": { "Conta": [{ "username": "", "password": "" }] } };
const encryptTemplate = `<nppcrypt version="1016">
<encryption cipher="rijndael" key-length="32" mode="gcm" aad="true" encoding="base64" />
<key algorithm="scrypt" N="16384" r="8" p="1" salt="salt_value" />
<iv value="iv_value" method="random" /><tag value="tag_value" />
</nppcrypt>
cipher_value`;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

var inputArea;
var passwordArea;
var outputArea;
var jsonArea;
var personTemp;
var accountTemp;
var loginTemp;
var progressBar;
var bar;
var errorMessage;

window.onload = function () {
	inputArea = document.getElementById("input-area");
	passwordArea = document.getElementById("password-area");
	outputArea = document.getElementById("output-area");
	jsonArea = document.getElementById("json-section")
	personTemp = document.getElementById("person-template");
	accountTemp = document.getElementById("account-template");
	loginTemp = document.getElementById("login-template");
	bar = document.getElementById("bar");
	progressBar = document.getElementById("progress-bar");
	errorMessage = document.getElementById("error-message");

	document.getElementById("encrypt-button").onclick = async function () {
		errorMessage.style.display = "none";
		var extractedJson = extractJson();
		jsonData = JSON.stringify(extractedJson);
		var encrData = await encryptDefault(jsonData, passwordArea.value);
		outputArea.value = encrData;
	};

	document.getElementById("display-button").onclick = async function () {
		errorMessage.style.display = "none";
		var decrData = await decryptDefault(inputArea.value, passwordArea.value);
		var jsonData;

		if (decrData == undefined) {
			displayError("Wrong password");
		}
		else {
			try {
				jsonData = JSON.parse(decrData);
			} catch (error) {
				errorMessage.innerHTML = "Badly formatted JSON";
				errorMessage.style.display = "block";
			} finally {
				jsonArea.innerHTML = "";
				createPersonElems(jsonData, jsonArea);
			}
		}
	};

	document.getElementById("new-person-button").onclick = function () {
		createPersonElems(emptyData, jsonArea);
	};

	document.getElementById("crypt-show-button").onclick = function () {
		let isShowing = this.attributes.showing.value == "true";
		this.children[0].src = isShowing ? "images/eye-open.svg" : "images/eye-closed.svg";
		passwordArea.type = isShowing ? "password" : "text";

		this.setAttribute("showing", !isShowing);
	};
};

function createPersonElems(data, parent) {
	Object.keys(data).forEach(person => {
		var personElem = personTemp.content.cloneNode(true);
		var personAccounts = personElem.querySelector(".person-accounts");
		var newAccountButton = personElem.querySelector(".new-button");
		var dropButton = personElem.querySelector(".dropdown-button");
		var removeButton = personElem.querySelector(".remove-button");
		let title = personElem.querySelector(".person-title");

		title.innerHTML = person;
		title.ondblclick = editField;

		//hides the accounts and flips the dropdown
		dropButton.onclick = function () {
			toggleHideElem(personAccounts);
			toggleHideElem(newAccountButton);

			let buttonClasses = this.children[0].classList;
			let isRotated = buttonClasses.contains("rotate180");

			if (isRotated)
				buttonClasses.remove("rotate180");
			else
				buttonClasses.add("rotate180");
		};

		newAccountButton.onclick = function () {
			createAccountElems(emptyData.Pessoa, personAccounts);
		};

		removeButton.onclick = function () {
			this.parentElement.parentElement.remove()
		};

		//clicks to hide the accounts initially
		dropButton.click();

		parent.appendChild(personElem);

		createAccountElems(data[person], personAccounts);
	});
}

function createAccountElems(person, parent) {
	Object.keys(person).forEach(account => {
		var accountElem = accountTemp.content.cloneNode(true);
		var accountData = accountElem.querySelector(".account-data");
		var newLoginButton = accountElem.querySelector(".new-button");
		var removeButton = accountElem.querySelector(".remove-button");
		let title = accountElem.querySelector(".account-title");

		title.innerHTML = account;
		title.ondblclick = editField;

		newLoginButton.onclick = function () {
			createLoginElems(emptyData.Pessoa.Conta, accountData);
		};

		removeButton.onclick = function () {
			this.parentElement.parentElement.remove()
		};

		parent.appendChild(accountElem);

		createLoginElems(person[account], accountData);
	});
}

function createLoginElems(account, parent) {
	account.forEach(login => {
		var loginElem = loginTemp.content.cloneNode(true);

		var removeButton = loginElem.querySelector(".remove-button");
		var showButton = loginElem.querySelector(".show-button");
		var loginField = loginElem.querySelector(".login-field");
		var passwordField = loginElem.querySelector(".password-field");


		var loginInput = loginField.getElementsByTagName("input")[0];
		var passwordInput = passwordField.getElementsByTagName("input")[0];

		loginInput.value = login.username;
		passwordInput.value = login.password;

		removeButton.onclick = function () {
			this.parentElement.remove()
		};

		showButton.onclick = function () {
			let isShowing = this.attributes.showing.value == "true";
			this.children[0].src = isShowing ? "images/eye-open.svg" : "images/eye-closed.svg";
			passwordInput.type = isShowing ? "password" : "text";

			this.setAttribute("showing", !isShowing);
		};

		//inserts before the new button
		parent.insertBefore(loginElem, parent.querySelector(".new-button"));
	});
}

function extractJson() {
	var extractedJson = {};

	//extracts each person
	Array.from(jsonArea.children).forEach(personElem => {
		var personAccounts = personElem.querySelector(".person-accounts");
		var personTitle = personElem.querySelector(".person-title").innerHTML;
		extractedJson[personTitle] = {};

		//extracts each account
		Array.from(personAccounts.children).forEach(accountElem => {
			var accountData = accountElem.querySelector(".account-data");
			var accountTitle = accountElem.querySelector(".account-title").innerHTML;
			extractedJson[personTitle][accountTitle] = [];

			//extracts each login
			Array.from(accountData.querySelectorAll(".data-row")).forEach(loginElem => {
				var loginField = loginElem.querySelector(".login-field");
				var passwordField = loginElem.querySelector(".password-field");

				var loginInput = loginField.getElementsByTagName("input")[0];
				var passwordInput = passwordField.getElementsByTagName("input")[0];

				extractedJson[personTitle][accountTitle].push({
					"username": loginInput.value,
					"password": passwordInput.value
				});
			});
		});
	});

	return extractedJson;
}

async function encryptDefault(text, password) {
	var encripted;
	var inputStringBuffer = textEncoder.encode(text);
	var saltArrBuf = randBytes(16);
	var ivArrBuf = randBytes(16);
	var addiData = new Uint8Array(saltArrBuf.length + ivArrBuf.length);

	//additional data contains the salt and the iv
	addiData.set(saltArrBuf);
	addiData.set(ivArrBuf, saltArrBuf.length);

	await encrypt(inputStringBuffer, password, saltArrBuf, ivArrBuf, addiData)
		.then((encr) => {
			var cipherArrBuf = encr.slice(0, encr.byteLength - 16);
			var tagArrBuf = encr.slice(encr.byteLength - 16);
			var finalString = encryptTemplate.replace("salt_value", arrayBufferToBase64(saltArrBuf));

			finalString = finalString.replace("iv_value", arrayBufferToBase64(ivArrBuf));
			finalString = finalString.replace("tag_value", arrayBufferToBase64(tagArrBuf));
			finalString = finalString.replace("cipher_value", arrayBufferToBase64(cipherArrBuf));
			encripted = finalString;
		});
	return encripted;
}

async function decryptDefault(text, password) {
	var decrypted;
	var xmlString = text.substring(0, text.indexOf("</nppcrypt>") + 11);
	var cipherB64 = text.substring(text.indexOf("</nppcrypt>") + 11);

	var parser = new DOMParser();
	var xmlDoc;

	xmlDoc = parser.parseFromString(xmlString, "text/xml");

	if (xmlDoc.activeElement.tagName == "parsererror") {
		displayError("Badly formatted XML");
	}
	else {
		try {
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

			var dataArrBuf = base64ToArrayBuffer(joinBase64(cipherB64, tagB64));

			await decrypt(dataArrBuf, password, saltArrBuf, ivArrBuf, addiArrBuf).then((decr) => {
				decrypted = decr;
			});
		}
		catch {
			displayError("Corrupted cipher");
		}

		return decrypted;
	}
}

function toggleHideElem(elem) {
	let isHidden = elem.style.display == "none";
	elem.style.display = isHidden ? "" : "none";
}

function editField() {
	if (this.childElementCount == 0) {
		var input = document.createElement("input");

		input.value = this.innerHTML;
		input.onblur = function () {
			var val = this.value;
			this.parentNode.innerHTML = val;
		}
		this.innerHTML = "";

		this.appendChild(input);
		input.focus();
	}
}

function updateProgressBar(progress) {
	if (progress == 1)
		progressBar.style.display = "none";
	else {
		progressBar.style.display = "block";
		bar.style.width = (progress * 100) + "%";
	}
}

function displayError(err) {
	if (errorMessage.style.display == "none") {
		errorMessage.innerHTML = err;
		errorMessage.style.display = "block";
	}
}