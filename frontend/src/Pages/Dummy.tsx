import React, { useEffect } from 'react';
import { AxiosInterceptor } from "../core/http";
import Layout from '../Components/Layout';

const Dummy = () => {
    const f = async () => {
        const { data } = await AxiosInterceptor.$host.post('/session',
            {
                "merchant_uid": '___',
                "secret_key": "___",
                "amount": 5,
                "currency": "RUB",
                "domain": "https://gitlab.com/",
                "description": "Заказ №19",
                "metadata": {
                    "order_id": "50000000000",
                    "client_id": "dfbdfgbdfgdf"
                }
            }
        )
        // console.log(data)
    }

    useEffect(() => { f() }, []);
    return <Layout><div className={"Dummy"}>d u m m y</div></Layout>
};

export default Dummy;