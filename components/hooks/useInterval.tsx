import { useEffect, useRef } from "react";

type Props = {
    callback: any;
    delay: number;
};

const useInterval = (props: Props) => {
    const savedCallback = useRef<any>();

    useEffect(() => {
        savedCallback.current = props.callback;
    }),
        [props.callback];

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };

        if (props.delay !== null) {
            let id = setInterval(tick, props.delay);
            return () => clearInterval(id);
        }
    }, [props.delay]);
};

export default useInterval;
