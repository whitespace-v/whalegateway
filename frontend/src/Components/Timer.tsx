import { useEffect, useState } from "react";
import { Dispatcher } from "../core/store";
import { useGo } from "../hooks/useGo";

const Timer = ({ timeout }: { timeout: number }) => {
    let s = 60000
    const [timestamp, setTimestamp] = useState(timeout);
    const patch = Dispatcher.patch()
    const go = useGo()

    useEffect(() => {
        const id = setInterval(() => setTimestamp((timestamp) => timestamp - 1000), 1000);
        return () => {
            clearInterval(id);
        };
    }, []);

    useEffect(() => {
        if (timestamp <= 0) {
            go("/exited")
        }

    }, [timestamp])
    // exit button
    return <div>Осталось: {Math.floor(timestamp / s) < 10 && '0'}{Math.floor(timestamp / s)}:{Number(((timestamp % s) / 1000).toFixed(0)) < 10 && '0'}{Number(((timestamp % s) / 1000).toFixed(0))}</div>
}

export default Timer;  