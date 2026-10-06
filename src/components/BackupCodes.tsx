import IconButton from "./IconButton.tsx";
import ImagePlus from "../assets/plus.svg";
import { useData, type Credentials } from "../DataContext.tsx";
import Overlay from "react-bootstrap/esm/Overlay";
import Popover from "react-bootstrap/esm/Popover";
import BackupCodesRow from "./BackupCodeRow.tsx";
import UpdatingPopover from "./UpdatingPopover.tsx";

interface BackupCodesProp extends React.HTMLAttributes<HTMLElement> {
    credentials: Credentials | null;
    target: HTMLElement | null;
    onClose?: () => void;
}

const BackupCodes = ({
    credentials,
    target,
    className,
    onClose,
    ...rest
}: BackupCodesProp) => {
    const { createBackupCode } = useData();

    return (
        <Overlay
            target={target}
            show={!!credentials && !!target}
            placement="left"
            rootClose
            rootCloseEvent="mousedown"
            onHide={onClose}
            popperConfig={{
                modifiers: [
                    {
                        name: "flip",
                        options: {
                            padding: 8,
                            fallbackPlacements: [
                                "right-start",
                                "bottom",
                                "top",
                            ],
                        },
                    },
                    {
                        name: "preventOverflow",
                        options: { padding: 8, altAxis: true },
                    },
                ],
            }}
            {...rest}
        >
            <UpdatingPopover
                className={`d-flex bg-primary p-2 rounded-2 ${className}`}
                style={
                    {
                        height: "fit-content",
                        maxHeight: "50%",
                        maxWidth: "fit-content",
                        "--bs-popover-bg": "var(--bs-secondary)",
                        "--bs-popover-border-color": "var(--bs-secondary)",
                        "--bs-popover-border-width": "0px",
                        ...rest.style,
                    } as React.CSSProperties & {
                        "--bs-popover-bg": string;
                        "--bs-popover-border-color": string;
                        "--bs-popover-border-width": string;
                    }
                }
            >
                <Popover.Body className="bg-secondary d-flex flex-column row-gap-2 p-2 pe-0 flex-grow-1">
                    <div className="flex-grow-1 h-50 d-flex flex-column row-gap-2">
                        <div className="text-white fs-6 fw-bold pe-2">
                            Backup Codes
                        </div>

                        <div className="d-flex flex-column row-gap-2 overflow-y-auto h-100 pe-2">
                            {credentials?.backupCodes.map((backupCode) => (
                                <BackupCodesRow
                                    key={backupCode.id}
                                    backupCode={backupCode}
                                />
                            ))}
                        </div>
                    </div>

                    <IconButton
                        icon={ImagePlus}
                        title="Add New Backup Code"
                        outerPadding={false}
                        variant="secondary"
                        onClick={() => createBackupCode(credentials!)}
                    ></IconButton>
                </Popover.Body>
            </UpdatingPopover>
        </Overlay>
    );
};

export default BackupCodes;
