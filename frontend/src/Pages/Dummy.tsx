import React, { useEffect } from 'react';
import { AxiosInterceptor } from "../core/http";

const Dummy = () => {
    const f = async () => {
        const { data } = await AxiosInterceptor.$host.post('/session',
            {
                "merchant_uid": '4529c874-f1dd-4165-b78d-26910427a7fa',
                "secret_key": "KShasdjkasdduioh123ey",
                "amount": 5,
                "currency": "RUB",
                "description": "Заказ №19",
                "metadata": {
                    "order_id": "50000000000",
                    "client_id": "dfbdfgbdfgdf"
                }
            }
        )
        console.log(data)
    }

    useEffect(() => { f() }, []);
    return <div className={"Dummy"}>d u m m y</div>
};

export default Dummy;