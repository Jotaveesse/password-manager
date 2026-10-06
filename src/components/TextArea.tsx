import { useId } from "react";
import Form from "react-bootstrap/Form";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    value: string;
}

const TextArea = ({ label, id, className, style, ...rest }: TextAreaProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <Form.Group
            controlId={inputId}
            className={`flex-grow-1 d-flex flex-column ${className ?? ""}`}
        >
            {label && (
                <Form.Label className="text-white fw-bold">{label}</Form.Label>
            )}
            <Form.Control
                as="textarea"
                className="flex-grow-1 bg-secondary border-0 rounded-3 text-white fs-7 lh-sm fw-bold"
                style={{ resize: "none", ...style }}
                {...rest}
            />
        </Form.Group>
    );
};

export default TextArea;
