import { useState } from "react";
import Form from "react-bootstrap/Form";
import IconButton from "./IconButton.tsx";
import ImagePlus from "../assets/plus.svg";
import ImageMinus from "../assets/minus.svg";
import { useData, type Account, type Credential } from "../DataContext.tsx";
import CredentialRow from "./CredentialRow.tsx";

interface AccountRowProps extends React.HTMLAttributes<HTMLDivElement> {
    account: Account;
    onSeeCodes?: (credential: Credential, target: HTMLElement) => void;
}

// corner radius for a credential row based on its position in the list
const radiusFor = (index: number, count: number): string => {
    const isFirst = index === 0;
    const isLast = index === count - 1;

    if (isFirst && isLast) return "0 0.5rem 0 0.5rem";
    if (isFirst) return "0 0.5rem 0 0";
    if (isLast) return "0 0 0 0.5rem";
    return "0";
};

const AccountRow = ({
    account,
    onSeeCodes,
    className,
    ...rest
}: AccountRowProps) => {
    const { updateAccountName, removeAccount, createCredential } = useData();
    const [editingName, setEditingName] = useState(false);

    const startEditing = () => setEditingName(true);
    const stopEditing = () => setEditingName(false);

    const hasCredentials = account.credentials.length > 0;

    return (
        <div className={className} {...rest}>
            <div
                className={`d-flex w-50 bg-primary rounded-top-3 ${hasCredentials ? "" : "rounded-end-3"}`}
            >
                {editingName ? (
                    <Form.Control
                        autoFocus
                        type="text"
                        aria-label="Account name"
                        value={account.name}
                        className="bg-secondary p-1 ms-1 border-0 rounded-2 h-50 m-auto text-white fw-bold"
                        onFocus={(e) => e.target.select()}
                        onBlur={stopEditing}
                        onChange={(e) =>
                            updateAccountName(account, e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") stopEditing();
                        }}
                    />
                ) : (
                    <button
                        type="button"
                        title="Double-click (or press Enter) to rename"
                        className="flex-grow-1 mt-auto mb-auto ms-2 p-0 border-0 bg-transparent text-start text-reset fw-bold"
                        style={{ cursor: "text" }}
                        onDoubleClick={startEditing}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") startEditing();
                        }}
                    >
                        {account.name || "Untitled account"}
                    </button>
                )}

                <IconButton
                    title="Remove Account"
                    icon={ImageMinus}
                    onClick={() => removeAccount(account)}
                />
            </div>

            <div>
                {account.credentials.map((credential, index, array) => (
                    <CredentialRow
                        key={credential.id}
                        credential={credential}
                        onSeeCodes={onSeeCodes}
                        style={{ borderRadius: radiusFor(index, array.length) }}
                    />
                ))}
            </div>

            <IconButton
                className={`rounded-top-0 ${hasCredentials ? "ms-auto" : "me-auto"}`}
                title="Add New Credential"
                icon={ImagePlus}
                onClick={() => createCredential(account)}
            />
        </div>
    );
};

export default AccountRow;
