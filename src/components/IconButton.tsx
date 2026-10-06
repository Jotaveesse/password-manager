import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string;
    title: string;
    variant?: "primary" | "secondary";
    outerPadding?: boolean;
}

const IconButton = ({
    icon,
    title,
    variant = "primary",
    className,
    style,
    outerPadding = true,
    ...rest
}: IconButtonProps) => {
    const wrapperVariant =
        variant === "primary" ? "bg-primary" : "bg-secondary";

    return (
        <div
            className={`${wrapperVariant} ${outerPadding ? "p-1" : "p-0"} rounded-3 ${className ?? ""}`}
            style={{ width: "min-content", height: "min-content", ...style }}
        >
            <Button
                variant={variant}
                title={title}
                aria-label={title}
                className="d-flex align-items-center justify-content-center p-2 rounded-3"
                style={{ height: "2.2rem" }}
                {...rest}
            >
                <Image
                    src={icon}
                    alt=""
                    draggable={false}
                    style={{ height: "100%", objectFit: "contain" }}
                />
            </Button>
        </div>
    );
};

export default IconButton;
