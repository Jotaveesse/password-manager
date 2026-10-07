import IconButton from "../ui/IconButton";
import ImagePlus from "../../assets/plus.svg";
import { useData, type Credential } from "../../context/DataContext";
import Overlay, { type OverlayProps } from "react-bootstrap/esm/Overlay";
import Popover from "react-bootstrap/esm/Popover";
import BackupCodesRow from "./BackupCodeRow";
import UpdatingPopover from "../ui/UpdatingPopover";

interface BackupCodesPopoverProps extends React.HTMLAttributes<HTMLElement> {
    credential: Credential | null;
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
    credential,
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
            show={!!credential && !!target}
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
                        {credential?.backupCodes.map((backupCode) => (
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
                            credential && createBackupCode(credential)
                        }
                    />
                </Popover.Body>
            </UpdatingPopover>
        </Overlay>
    );
};

export default BackupCodesPopover;
