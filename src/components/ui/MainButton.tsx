import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string;
    title: string;
    variant?: "primary" | "secondary";
}

const IconButton = ({
    icon,
    title,
    variant = "primary",
    className,
    style,
    children,
    ...rest
}: IconButtonProps) => {
    const wrapperVariant =
        variant === "primary" ? "bg-primary" : "bg-secondary";

    return (
        <div
            className={`p-2 w-100 rounded-3 ${wrapperVariant}`}
            style={{ height: "4rem", ...style }}
        >
            <Button
                className={`rounded-3 d-flex column-gap-3 p-2 justify-content-center h-100 w-100 ${className ?? ""}`}
                variant={variant}
                {...rest}
            >
                <Image
                    src={icon}
                    alt=""
                    draggable={false}
                    style={{ height: "100%", objectFit: "contain" }}
                />
                <span
                    title={title}
                    aria-label={title}
                    className="d-flex align-items-center fs-4 fw-normal"
                >
                    {children}
                </span>
            </Button>
        </div>
    );
};

export default IconButton;
