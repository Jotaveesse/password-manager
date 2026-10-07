import { useId } from "react";
import Form from "react-bootstrap/Form";

type TextInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size"
> & {
    label?: string;
    value: string;
    horizontalLayout?: boolean;
    variant?: "primary" | "secondary";
    size?: "sm" | "lg";
};

const HORIZONTAL = "d-flex flex-row align-items-center column-gap-2";
const VERTICAL = "d-flex flex-column";

const TextInput = ({
    label,
    id,
    horizontalLayout = false,
    variant = "primary",
    className,
    style,
    children,
    ...rest
}: TextInputProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const variantClass = variant === "primary" ? "bg-primary" : "bg-secondary";

    return (
        <Form.Group
            controlId={inputId}
            className={`${horizontalLayout ? HORIZONTAL : VERTICAL} ${className ?? ""}`}
            style={style}
        >
            {label && (
                <Form.Label
                    className={`fw-bold text-white ${horizontalLayout ? "mb-0" : ""}`}
                >
                    {label}
                </Form.Label>
            )}

            <div className="d-flex flex-grow-1 column-gap-2">
                <Form.Control
                    className={`flex-grow-1 border-0 text-white py-1 px-2 fs-6 fw-medium ${variantClass}`}
                    style={{ minWidth: "8rem" }}
                    type="text" // callers can override, e.g. type="email"
                    autoComplete="off"
                    spellCheck={false}
                    {...rest}
                />
                {children}
            </div>
        </Form.Group>
    );
};

export default TextInput;
