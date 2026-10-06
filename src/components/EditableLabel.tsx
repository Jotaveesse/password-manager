import { useState } from "react";
import Form from "react-bootstrap/Form";

interface EditableLabelProps {
    value: string;
    onChange: (newValue: string) => void;
    label: string;
    fallback?: string;
    inputClassName?: string;
    textClassName?: string;
}

const EditableLabel = ({
    value,
    onChange,
    label,
    fallback = "Untitled",
    inputClassName = "",
    textClassName = "",
}: EditableLabelProps) => {
    const [editing, setEditing] = useState(false);

    if (editing) {
        return (
            <Form.Control
                autoFocus
                type="text"
                aria-label={label}
                value={value}
                className={inputClassName}
                onFocus={(e) => e.target.select()}
                onBlur={() => setEditing(false)}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") setEditing(false);
                }}
            />
        );
    }

    return (
        <button
            type="button"
            title="Double-click (or press Enter) to rename"
            className={`p-0 border-0 bg-transparent text-start text-reset fw-bold ${textClassName}`}
            style={{ cursor: "text" }}
            onDoubleClick={() => setEditing(true)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "F2") setEditing(true);
            }}
        >
            {value || fallback}
        </button>
    );
};

export default EditableLabel;
