import { useId, useRef } from "react";
import Button from "react-bootstrap/Button";

type FileInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "hidden"
> & {
    fileName?: string | null;
};

const NO_FILE = "No file selected";

const FileInput = ({
    fileName = NO_FILE,
    className,
    onChange,
    ...rest
}: FileInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const nameId = useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        onChange?.(e);

        //clear the input so choosing the same file again still fires onChange
        e.target.value = "";
    };

    return (
        <div
            className={`d-flex p-1 bg-secondary rounded-3 column-gap-2 ${className ?? ""}`}
        >
            <input
                {...rest}
                ref={inputRef}
                type="file"
                hidden
                onChange={handleChange}
            />

            <Button
                variant="primary"
                aria-describedby={nameId}
                onClick={() => inputRef.current?.click()}
            >
                Browse...
            </Button>

            <span
                id={nameId}
                title={fileName ? fileName : NO_FILE}
                aria-live="polite"
                className="flex-grow-1 align-self-center fw-bold text-white text-truncate"
            >
                {fileName ? fileName : NO_FILE}
            </span>
        </div>
    );
};

export default FileInput;
