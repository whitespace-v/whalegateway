import React, { useEffect, useState } from 'react';
import classes from '../styles/Pages/PaymentSuspense.module.scss';
import Layout from "../Components/Layout";
import From from "../Components/From";
import PageTitle from "../Components/PageTitle";
import PageDesignator from "../Components/PageDesignator";
import PaymentCard from "../Components/PaymentCard";
import { Dispatcher } from "../core/store";
import { _checkPayment, _sessionInit, _verify_session, fetch_session } from "../core/actions/SessionActions";
import { useNavigate, useSearchParams } from 'react-router-dom';
import Timer from '../Components/Timer';
import { useGo } from '../hooks/useGo';
// TODO: save to local

const PaymentSuspense = () => {
    const go = useGo()
    const patch = Dispatcher.patch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const { timeout, status } = Dispatcher.extract(state => state.sessionReducer)
    const session_uid = searchParams.get("session_uid")
    const merchant_uid = searchParams.get("merchant_uid")

    useEffect(() => {
        if (session_uid && merchant_uid) {
            patch(_verify_session({ session_uid, merchant_uid }))
        } else navigate('/dummy')
    }, [])

    useEffect(() => {
        if (status === "PENDING") {
            //stay here
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

    //subscribe to check
    return (
        <Layout>
            <div className={classes["PaymentSuspense"]}>
                <div className={classes["PaymentSuspense__content"]}>
                    <From />
                    <PageTitle>
                        Ожидаем поступление...
                    </PageTitle>
                    <PageDesignator>
                        Переведите точную сумму в течении 20 минут по следующим реквизитам:
                    </PageDesignator>
                    <PaymentCard />
                    {timeout > 0 && <Timer timeout={timeout} />}
                </div>
            </div>
        </Layout>
    );
};

export default PaymentSuspense;