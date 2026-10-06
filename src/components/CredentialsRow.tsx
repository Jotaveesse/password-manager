import IconButton from "./IconButton.tsx";
import ImageSafe from "../assets/safe.svg";
import ImageMinus from "../assets/minus.svg";
import React from "react";
import { useData, type Credentials } from "../DataContext.tsx";
import TextInput from "./TextInput.tsx";
import PasswordInput from "./PasswordInput.tsx";
import CopyButton from "./CopyButton.tsx";

interface CredentialsRowProps extends React.HTMLAttributes<HTMLElement> {
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
        <div className="bg-primary pt-1 pb-1 ps-2 pe-0" {...rest}>
            <div className="d-flex">
                <TextInput
                    label="Login"
                    value={credentials.username}
                    horizontalLayout={true}
                    variant="secondary"
                    className="flex-grow-1"
                    onChange={(e) =>
                        updateCredential(
                            credentials,
                            "username",
                            e.target.value,
                        )
                    }
                ></TextInput>

                <PasswordInput
                    label="Password"
                    value={credentials.password}
                    horizontalLayout={true}
                    variant="secondary"
                    className="flex-grow-1 ms-4"
                    onChange={(e) =>
                        updateCredential(
                            credentials,
                            "password",
                            e.target.value,
                        )
                    }
                ></PasswordInput>

                <div className="d-flex">
                    <CopyButton
                        textToCopy={credentials.password}
                        title="Copy Password"
                    />

                    <IconButton
                        title="See Backup Codes"
                        icon={ImageSafe}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            if (onSeeCodes) {
                                onSeeCodes(credentials, e.currentTarget);
                            }
                        }}
                    ></IconButton>

                    <IconButton
                        title="Remove Credentials"
                        icon={ImageMinus}
                        onClick={() => removeCredentials(credentials)}
                    ></IconButton>
                </div>
            </div>
        </div>
    );
};

export default CredentialsRow;
