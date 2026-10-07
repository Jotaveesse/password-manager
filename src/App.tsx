import { useState } from "react";
import IconButton from "./components/ui/IconButton";
import ImagePlus from "./assets/plus.svg";
import ImageLockOpen from "./assets/lock-open.svg";
import ImageLockClosed from "./assets/lock-closed.svg";
import PasswordInput from "./components/ui/PasswordInput";
import FileInput from "./components/ui/FileInput";
import TextArea from "./components/ui/TextArea";
import PersonRow from "./components/vault/PersonRow";
import IdleCountdown from "./components/IdleCountdown";
import BackupCodesPopover from "./components/vault/BackupCodePopover";
import { useData, type Credential, type Data } from "./context/DataContext";
import { decryptText, encryptText } from "./lib/crypter";
import MainButton from "./components/ui/MainButton";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const download = (text: string) => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.download = `vault.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // revoke after the browser has had time to start the download
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function App() {
    const [textInput, setTextInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [fileName, setFileName] = useState<string | null>(null);
    const [newlyCreatedPersonId, setNewlyCreatedPersonId] = useState<
        string | null
    >(null);

    //one piece of state, so the open credential and its anchor element can never get out of sync.
    const [openCodes, setOpenCodes] = useState<{
        credentialId: string;
        anchor: HTMLElement;
    } | null>(null);

    const {
        currentData,
        setCurrentData,
        sortCurrentData,
        createPerson,
        clearData,
    } = useData();

    const hasData = currentData.people.length > 0;

    const selectedCredential = openCodes
        ? (currentData.people
              .flatMap((p) => p.accounts)
              .flatMap((a) => a.credentials)
              .find((c) => c.id === openCodes.credentialId) ?? null)
        : null;

    const lock = () => {
        clearData();
        setPasswordInput("");
        setOpenCodes(null);
        setNewlyCreatedPersonId(null);
    };

    const handleSeeCodes = (credential: Credential, target: HTMLElement) => {
        setOpenCodes((current) =>
            current?.credentialId === credential.id
                ? null
                : { credentialId: credential.id, anchor: target },
        );
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_BYTES) {
            setErrorMessage("That file is too large to be a vault.");
            return;
        }

        try {
            setErrorMessage("");
            setTextInput(await file.text());
            setFileName(file.name);
        } catch {
            setErrorMessage("Could not read the file.");
        }
    };

    const handleEncryptDownloadButtonClick = async () => {
        setErrorMessage("");

        try {
            const jsonData = JSON.stringify(currentData);
            const encryptedText = await encryptText(jsonData, passwordInput);

            download(encryptedText);
        } catch (error) {
            console.error("Encryption error:", error);

            setErrorMessage(
                String(error instanceof Error ? error.message : error) ||
                    "Encryption failed.",
            );
        }
    };

    const handleDecryptButtonClick = async () => {
        try {
            setErrorMessage("");

            const decryptedText = await decryptText(textInput, passwordInput);
            const jsonData: Data = JSON.parse(decryptedText);

            if (
                !jsonData ||
                !jsonData.people ||
                !Array.isArray(jsonData.people)
            ) {
                throw new Error("Decrypt successful, but format is invalid.");
            }

            setCurrentData(jsonData);
            sortCurrentData(); // TODO: sort the parsed data once, before setting it

            setTextInput("");
            setFileName(null);
        } catch (error) {
            setErrorMessage(
                String(error instanceof Error ? error.message : error) ||
                    "Decryption failed.",
            );
        }
    };

    return (
        <>
            <main className="bg-primary d-flex column-gap-3 p-3 vh-100 vw-100 text-white fw-bold">
                <div
                    className="d-flex flex-column row-gap-3"
                    style={{ width: "40%" }}
                >
                    <div className="flex-grow-1 d-flex flex-column row-gap-3">
                        <TextArea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            label="Input text"
                        />

                        <FileInput
                            className="ms-auto w-50"
                            fileName={fileName}
                            accept=".txt,.json"
                            onChange={handleFileUpload}
                        />

                        <PasswordInput
                            label="Password"
                            value={passwordInput}
                            variant="primary"
                            className="p-2"
                            placeholder="Decryption and encryption password"
                            autoComplete="new-password"
                            onChange={(e) => setPasswordInput(e.target.value)}
                        />
                    </div>

                    <div className="d-flex flex-column row-gap-2 mt-2">
                        <div className="d-flex column-gap-4 justify-content-around fs-4">
                            <MainButton
                                title="Decrypt the input text using the password"
                                className="flex-grow-1"
                                variant="secondary"
                                icon={ImageLockOpen}
                                disabled={!textInput}
                                onClick={handleDecryptButtonClick}
                            >
                                Decrypt
                            </MainButton>

                            <MainButton
                                title="Encrypt the current data using the password and download it"
                                className="flex-grow-1"
                                variant="secondary"
                                icon={ImageLockClosed}
                                disabled={!hasData || !passwordInput}
                                onClick={handleEncryptDownloadButtonClick}
                            >
                                Encrypt
                            </MainButton>
                        </div>

                        <div
                            role="alert"
                            className="text-center fs-6"
                            style={{ minHeight: "1.5em" }}
                        >
                            {errorMessage}
                        </div>
                    </div>
                </div>

                <div className="flex-grow-1 d-flex flex-column row-gap-2 h-100">
                    <div className="text-end" style={{ minHeight: "1.5em" }}>
                        {hasData && <IdleCountdown onIdle={lock} />}
                    </div>

                    {hasData && (
                        <div className="d-flex flex-column row-gap-2 overflow-y-scroll">
                            {currentData.people.map((person) => (
                                <PersonRow
                                    key={person.id}
                                    defaultExpanded={
                                        person.id === newlyCreatedPersonId
                                    }
                                    person={person}
                                    onSeeCodes={handleSeeCodes}
                                />
                            ))}
                        </div>
                    )}

                    <IconButton
                        title="Add New Person"
                        icon={ImagePlus}
                        variant="secondary"
                        className="ms-auto"
                        onClick={() => setNewlyCreatedPersonId(createPerson())}
                    />
                </div>
            </main>

            <BackupCodesPopover
                credential={selectedCredential}
                target={openCodes?.anchor ?? null}
                onClose={() => setOpenCodes(null)}
            />
        </>
    );
}

export default App;
