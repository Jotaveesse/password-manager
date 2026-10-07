import IconButton from "../ui/IconButton";
import ImageMinus from "../../assets/minus.svg";
import { useData, type BackupCode } from "../../context/DataContext";
import PasswordInput from "../ui/PasswordInput";
import CopyButton from "../ui/CopyButton";

interface BackupCodesRowProps extends React.HTMLAttributes<HTMLDivElement> {
    backupCode: BackupCode;
}

const BackupCodesRow = ({
    backupCode,
    className,
    ...rest
}: BackupCodesRowProps) => {
    const { updateBackupCode, removeBackupCode } = useData();

    return (
        <div
            className={`d-flex align-items-center column-gap-2 ${className ?? ""}`}
            {...rest}
        >
            <PasswordInput
                aria-label="Backup code"
                value={backupCode.code}
                style={{ minWidth: "20rem" }}
                showButtonTitle="Show Backup Code"
                hideButtonTitle="Hide Backup Code"
                onChange={(e) => updateBackupCode(backupCode, e.target.value)}
            />

            <div className="d-flex align-items-center column-gap-2">
                <CopyButton
                    textToCopy={backupCode.code}
                    title="Copy Backup Code"
                    outerPadding={false}
                />

                <IconButton
                    icon={ImageMinus}
                    title="Remove Backup Code"
                    outerPadding={false}
                    onClick={() => removeBackupCode(backupCode)}
                />
            </div>
        </div>
    );
};

export default BackupCodesRow;
