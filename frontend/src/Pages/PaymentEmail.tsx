import React, { useEffect } from 'react';
import classes from '../styles/Pages/PaymentEmail.module.scss';
import Layout from "../Components/Layout";
import From from "../Components/From";
import PageTitle from "../Components/PageTitle";
import UIButton from "../UIKit/UIButton";
import icon_check from '../static/svg/check.svg'
import PageDesignator from "../Components/PageDesignator";
import { Dispatcher } from "../core/store";
import { _sessionInit, _verify_session, fetch_session, insertEmail } from "../core/actions/SessionActions";
import { useGo } from "../hooks/useGo";
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentEmail = () => {
    const [searchParams] = useSearchParams();
    const patch = Dispatcher.patch()
    const go = useGo()
    const navigate = useNavigate()
    const [check, setCheck] = React.useState<boolean>(true);
    const [email, setEmail] = React.useState<string>('');
    const [regState, setRegState] = React.useState<boolean>(false)
    const [touched, setTouched] = React.useState<boolean>(false)

    ///** ---- check session validity ---- **///
    const session_uid = searchParams.get("session_uid")
    const merchant_uid = searchParams.get("merchant_uid")
    useEffect(() => {
        if (session_uid && merchant_uid) {
            patch(_verify_session({ session_uid, merchant_uid }))
        } else navigate('/dummy')
    }, [])

    const { status, payment_type } = Dispatcher.extract(state => state.sessionReducer)

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

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setTouched(true)
            validate()
        }
        if (event.key === 'Enter' && regState && check) {
            await eventHandler()
        }
    }

    const eventHandler = async () => {
        await patch(insertEmail({ email }))
        await patch(_sessionInit({ payment_type, email, session_uid: session_uid || '' }))
        go('/payment/suspense')
    }
    const validate = () => {
        if (email.toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        ) {
            setRegState(true)
        } else {
            setRegState(false)
        }
    }
    useEffect(() => {
        validate()
    }, [email])

    return (
        <Layout>
            <div className={classes["PaymentEmail"]}>
                <div className={classes["PaymentEmail__content"]}>
                    <From />
                    <PageTitle>
                        Оплата заказа
                    </PageTitle>
                    <PageDesignator>
                        Введите ваш E-mail для отправки чека
                    </PageDesignator>
                    <div className={classes["PaymentEmail__content_input"]}>
                        <input type="text"
                            placeholder={'example@example.com'}
                            onBlur={() => setTouched(true)}
                            value={email}
                            onKeyDown={(e) => handleKeyDown(e)}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {touched && !regState &&
                            <div className={classes["PaymentEmail__content_input-error"]}>
                                *Указан некорректный формат электронной почты
                            </div>
                        }
                    </div>
                    <div className={classes["PaymentEmail__content_agreement"]}>
                        <div className={classes["PaymentEmail__content_agreement-check"]}
                            onClick={() => setCheck(!check)}
                        >
                            {check &&
                                <div className={classes["PaymentEmail__content_agreement-check-element"]}
                                    style={{ backgroundImage: `url(${icon_check})` }}
                                />
                            }
                        </div>
                        <div className={classes["PaymentEmail__content_agreement-text"]}>
                            Я согласен с <span>Обработкой данных</span> и <span>Соглашением</span>
                        </div>
                    </div>
                    <UIButton
                        type={regState && check ? "enabled" : "disabled"}
                        onClick={() => eventHandler()}
                    >
                        Продолжить
                    </UIButton>
                </div>
            </div>
        </Layout>

    );
};

export default PaymentEmail;