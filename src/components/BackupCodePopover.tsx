import IconButton from "./IconButton.tsx";
import ImagePlus from "../assets/plus.svg";
import { useData, type Credentials } from "../DataContext.tsx";
import Overlay, { type OverlayProps } from "react-bootstrap/esm/Overlay";
import Popover from "react-bootstrap/esm/Popover";
import BackupCodesRow from "./BackupCodeRow.tsx";
import UpdatingPopover from "./UpdatingPopover.tsx";

interface BackupCodesPopoverProps extends React.HTMLAttributes<HTMLElement> {
    credentials: Credentials | null;
    target: HTMLElement | null;
    onClose?: () => void;
}

const popperConfig: OverlayProps["popperConfig"] = {
    modifiers: [
        {
            name: "flip",
            options: {
                padding: 8,
                fallbackPlacements: ["right-start", "bottom", "top"],
            },
        },
        {
            name: "preventOverflow",
            options: { padding: 8, altAxis: true },
        },
    ],
};

const BackupCodesPopover = ({
    credentials,
    target,
    className,
    style,
    onClose,
    ...rest
}: BackupCodesPopoverProps) => {
    const { createBackupCode } = useData();

    return (
        <Overlay
            target={target}
            show={!!credentials && !!target}
            placement="left-start"
            rootClose
            rootCloseEvent="mousedown"
            onHide={onClose}
            popperConfig={popperConfig}
        >
            <UpdatingPopover
                {...rest}
                role="dialog"
                aria-label="Backup codes"
                className={`bg-primary p-2 rounded-2 ${className ?? ""}`}
                style={
                    {
                        maxWidth: "fit-content",
                        "--bs-popover-bg": "var(--bs-secondary)",
                        "--bs-popover-border-color": "var(--bs-secondary)",
                        "--bs-popover-border-width": "0px",
                        ...style,
                    } as React.CSSProperties
                }
            >
                <Popover.Body className="bg-secondary d-flex flex-column row-gap-2 p-2 pe-0">
                    <h2 className="text-white fs-6 fw-bold mb-0 pe-2">
                        Backup Codes
                    </h2>

                    <div
                        className="d-flex flex-column row-gap-2 pe-2"
                        style={{
                            maxHeight: "min(50vh, 24rem)",
                            overflowY: "auto",
                        }}
                    >
                        {credentials?.backupCodes.map((backupCode) => (
                            <BackupCodesRow
                                key={backupCode.id}
                                backupCode={backupCode}
                            />
                        ))}
                    </div>

                    <IconButton
                        icon={ImagePlus}
                        title="Add New Backup Code"
                        outerPadding={false}
                        variant="secondary"
                        onClick={() =>
                            credentials && createBackupCode(credentials)
                        }
                    />
                </Popover.Body>
            </UpdatingPopover>
        </Overlay>
    );
};

export default BackupCodesPopover;
