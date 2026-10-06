import { useId, useRef, useState } from "react";
import Button from "react-bootstrap/Button";

type FileInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "hidden"
>;

const NO_FILE = "No file selected";

const FileInput = ({ className, onChange, ...rest }: FileInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const nameId = useId();
    const [fileName, setFileName] = useState(NO_FILE);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        // The parent must read e.target.files synchronously, before the reset below
        onChange?.(e);

        // Clear the input so choosing the same file again still fires onChange
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
                title={fileName}
                aria-live="polite"
                className="flex-grow-1 align-self-center fw-bold text-white text-truncate"
            >
                {fileName}
            </span>
        </div>
    );
};

export default FileInput;
