import { useState } from "react";
import { useIdleTimeout } from "../useIdleTimeout";

const TIMEOUT_MS = 5 * 60 * 1000;

const formatTime = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
};

const IdleCountdown = ({ onIdle }: { onIdle: () => void }) => {
    const [label, setLabel] = useState(formatTime(TIMEOUT_MS));

    useIdleTimeout(
        onIdle,
        (msLeft) => setLabel(formatTime(msLeft)),
        TIMEOUT_MS,
        true,
    );

    return (
        <div title="Time left before erasing data" className="fs-6">
            {label}
        </div>
    );
};

export default IdleCountdown;
