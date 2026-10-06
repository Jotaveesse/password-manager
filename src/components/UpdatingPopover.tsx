import { forwardRef, useCallback, useEffect, useRef } from "react";
import Popover from "react-bootstrap/esm/Popover";

type Props = React.ComponentProps<typeof Popover> & {
    popper?: { scheduleUpdate?: () => void };
};

/**
 * A Popover that tells Popper to reposition whenever its own size changes.
 * Adds no extra DOM element, so flex/height layouts inside keep working.
 */
const UpdatingPopover = forwardRef<HTMLDivElement, Props>(
    ({ popper, ...props }, ref) => {
        const elRef = useRef<HTMLDivElement | null>(null);
        const updateRef = useRef<(() => void) | undefined>(undefined);

        // always call the latest scheduleUpdate without re-subscribing
        useEffect(() => {
            updateRef.current = popper?.scheduleUpdate;
        });

        // keep our own ref AND the one Overlay needs for positioning
        const setRefs = useCallback(
            (node: HTMLDivElement | null) => {
                elRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
            },
            [ref],
        );

        // subscribe once per mount
        useEffect(() => {
            const el = elRef.current;
            if (!el) return;

            const observer = new ResizeObserver(() => updateRef.current?.());
            observer.observe(el);
            return () => observer.disconnect();
        }, []);

        return <Popover ref={setRefs} popper={popper} {...props} />;
    },
);

export default UpdatingPopover;
