import { useId, useState } from "react";
import Form from "react-bootstrap/Form";
import IconButton from "./IconButton";
import ImageEyeOpen from "../assets/eye-open.svg";
import ImageEyeClosed from "../assets/eye-closed.svg";

// `type` is omitted on purpose: this component controls show/hide itself.
// className and style apply to the outer wrapper; everything else goes to the <input>.
interface PasswordInputProps extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size"
> {
    label?: string;
    value: string; // required: always a controlled input
    horizontalLayout?: boolean;
    variant?: "primary" | "secondary";
}

const HORIZONTAL = "d-flex flex-row align-items-center column-gap-2";
const VERTICAL = "d-flex flex-column";

const PasswordInput = ({
    label,
    id,
    horizontalLayout = false,
    variant = "primary",
    className,
    style,
    ...rest
}: PasswordInputProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [showingPassword, setShowingPassword] = useState(false);

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
                    autoComplete="off"
                    spellCheck={false}
                    {...rest}
                    type={showingPassword ? "text" : "password"}
                />

                <IconButton
                    title={showingPassword ? "Hide Password" : "Show Password"}
                    icon={showingPassword ? ImageEyeOpen : ImageEyeClosed}
                    outerPadding={false}
                    onClick={() => setShowingPassword((show) => !show)}
                />
            </div>
        </Form.Group>
    );
};

export default PasswordInput;
