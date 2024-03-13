import { useEffect, useRef } from "react";

type Props = {
    callback: any;
    delay: number | null;
};

const useInterval = (props: Props) => {
    const savedCallback = useRef<any>();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const stopInterval = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        savedCallback.current = props.callback;
    }, [props.callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };

        if (props.delay !== null) {
            intervalRef.current = setInterval(tick, props.delay);
            return () => stopInterval();
        }
    }, [props.delay]);
};

export default useInterval;
