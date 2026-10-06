import IconButton from "./IconButton.tsx";
import ImageSafe from "../assets/safe.svg";
import ImageMinus from "../assets/minus.svg";
import { useData, type Credentials as Credentials } from "../DataContext.tsx";
import TextInput from "./TextInput.tsx";
import PasswordInput from "./PasswordInput.tsx";
import CopyButton from "./CopyButton.tsx";

interface CredentialsRowProps extends React.HTMLAttributes<HTMLDivElement> {
    credentials: Credentials;
    onSeeCodes?: (credential: Credentials, target: HTMLElement) => void;
}

const CredentialsRow = ({
    credentials,
    onSeeCodes,
    className,
    ...rest
}: CredentialsRowProps) => {
    const { updateCredential, removeCredentials } = useData();

    return (
        <div
            className={`d-flex bg-primary py-1 ps-2 pe-0 ${className ?? ""}`}
            {...rest}
        >
            <TextInput
                label="Login"
                value={credentials.username}
                horizontalLayout
                variant="secondary"
                className="flex-grow-1"
                onChange={(e) =>
                    updateCredential(credentials, "username", e.target.value)
                }
            />

            <PasswordInput
                label="Password"
                value={credentials.password}
                horizontalLayout
                variant="secondary"
                className="flex-grow-1 ms-4"
                autoComplete="new-password"
                onChange={(e) =>
                    updateCredential(credentials, "password", e.target.value)
                }
            />

            <div className="d-flex">
                <CopyButton
                    textToCopy={credentials.password}
                    title="Copy Password"
                />

                <IconButton
                    title="See Backup Codes"
                    icon={ImageSafe}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => onSeeCodes?.(credentials, e.currentTarget)}
                />

                <IconButton
                    title="Remove Credentials"
                    icon={ImageMinus}
                    onClick={() => removeCredentials(credentials)}
                />
            </div>
        </div>
    );
};

export default CredentialsRow;
