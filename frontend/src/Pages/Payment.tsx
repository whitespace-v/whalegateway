import React, { useEffect } from 'react';
import classes from '../styles/Pages/Payment.module.scss';
import Layout from "../Components/Layout";
import sberbank_svg from '../static/banks/sberbank.svg'
import alfabank_svg from '../static/banks/alfabank.svg'
import tinkoff_svg from '../static/banks/tinkoff.svg'
import { Dispatcher } from "../core/store";
import { __payment_types } from "../core/models";
import { _verify_session, fetch_session, selectPaymentType } from "../core/actions/SessionActions";
import { useGo } from "../hooks/useGo";
import { useNavigate, useSearchParams } from "react-router-dom";
import From from "../Components/From";
import PageTitle from "../Components/PageTitle";

const Payment = () => {
    const [searchParams] = useSearchParams();
    const patch = Dispatcher.patch()
    const go = useGo()
    const navigate = useNavigate()
    const session_uid = searchParams.get("session_uid")
    const merchant_uid = searchParams.get("merchant_uid")


    const { status } = Dispatcher.extract(state => state.sessionReducer)

    ///** ---- check session validity ---- **///
    useEffect(() => {
        if (status === "PROCESS") {
            //stay here
        }
        if (status === "PENDING") {
            go("/payment/suspense")
        }
        if (status === "EXITED") {
            go("/exited")
        }
        if (status === "SUCCESS") {
            go("/success")
        }
        if (status === "ERROR") {
            go("/error")
        }
    }, [status])

    // verify session
    useEffect(() => {
        if (session_uid && merchant_uid) {
            patch(_verify_session({ session_uid, merchant_uid }))
        } else navigate('/dummy')
    }, [])


    const selectPaymentHandler = async ({ payment_type }: { payment_type: __payment_types }) => {
        patch(selectPaymentType({ payment_type }))
        go('/payment/email')
    }

    return (
        <Layout>
            <div className={classes["Payment"]}>
                <div className={classes["Payment__content"]}>
                    <From />
                    <div className={classes["Payment__content_welcome"]}>
                        Добро пожаловать,
                    </div>
                    <PageTitle>
                        Выберите способ оплаты
                    </PageTitle>
                    <div className={classes["Payment__content_payment-type"]}>
                        {[
                            { payment_image: sberbank_svg, payment_type: __payment_types.sberbank },
                            { payment_image: alfabank_svg, payment_type: __payment_types.alfabank },
                            { payment_image: tinkoff_svg, payment_type: __payment_types.tinkoff }
                        ].map((i, id) => (
                            <div className={classes["Payment__content_payment-type_item"]} key={id}
                                onClick={() => selectPaymentHandler(i)}
                            >
                                <div className={classes["Payment__content_payment-type_item-image"]}
                                    style={{ backgroundImage: `url(${i.payment_image})` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Payment;