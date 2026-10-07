import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import ImageCopy from "../../assets/copy.svg";
import ImageCheckSquare from "../../assets/check-square.svg";

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    textToCopy: string;
    outerPadding?: boolean;
    onCopy?: () => void;
}

const COPIED_RESET_MS = 2_000;

const CopyButton = ({
    textToCopy,
    title = "Copy",
    onCopy,
    ...rest
}: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);
    const resetTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(resetTimer.current), []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);

            setCopied(true);
            window.clearTimeout(resetTimer.current);
            resetTimer.current = window.setTimeout(
                () => setCopied(false),
                COPIED_RESET_MS,
            );
        } catch (err) {
            console.error("Failed to copy to clipboard:", err);
        }
    };

    return (
        <IconButton
            icon={copied ? ImageCheckSquare : ImageCopy}
            title={copied ? "Copied" : title}
            onClick={handleCopy}
            {...rest}
        />
    );
};

export default CopyButton;
