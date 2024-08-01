import Footer from '../Components/Footer'
import Header from '../Components/Header'
import Layout from '../Components/Layout'
import classes from "../styles/Pages/Status/Status.module.scss"
import doublecheck from "../static/svg/doublecheck.svg"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Dispatcher } from '../core/store'
import { useGo } from '../hooks/useGo'
import { useEffect } from 'react'
import { _verify_session } from '../core/actions/SessionActions'
import emailjs from 'emailjs-com';
import ireturn from "../static/svg/ireturn.svg"
import idocument from "../static/svg/idocument.svg"
// whalepayment
const Success = () => {
    const [searchParams] = useSearchParams();
    const patch = Dispatcher.patch()
    const navigate = useNavigate()
    const session_uid = searchParams.get("session_uid")
    const merchant_uid = searchParams.get("merchant_uid")
    const go = useGo();
    const { amount, currency, domain, status } = Dispatcher.extract(state => state.sessionReducer)

    useEffect(() => {
        if (session_uid && merchant_uid) {
            patch(_verify_session({ session_uid, merchant_uid }))
        } else navigate('/dummy')
    }, [])

    useEffect(() => {
        if (status === "PENDING") {
            go("/payment/suspense")
        }
        if (status === "EXITED") {
            go("/exited")
        }
        if (status === "SUCCESS") {
            // stay here 
        }
        if (status === "ERROR") {
            go("/error")
        }
    }, [status])

    return (
        <Layout>
            <div className={classes["Status"]}>
                <div className={classes["Status__content"]}>
                    <div className={classes["Status__content_title"]}>
                        <div className={classes["Status__content_title-icon"]} style={{ backgroundImage: `url(${doublecheck})` }} />
                        Ваш платеж на сумму <span>{amount} {currency}</span> успешно проведён.
                    </div>
                    <div className={classes["Status__content_subtitle"]}>
                        Спасибо за использование <span>PAY</span>WHALE
                    </div>
                    <div className={classes["Status__content_buttons"]}>
                        <div className={classes["Status__content_buttons-item"]}
                        // onClick={() => emailJs}
                        >
                            <div className={classes["Status__content_buttons-item-icon"]} style={{ backgroundImage: `url(${idocument})` }} />
                            Прислать чек
                        </div>
                        <div className={classes["Status__content_buttons-item"]}
                            onClick={() => window.open(domain)}
                        >
                            <div className={classes["Status__content_buttons-item-icon"]} style={{ backgroundImage: `url(${ireturn})` }} />
                            Вернуться на страницу покупателя
                        </div>
                    </div>
                </div>
            </div >
        </Layout>

    )
}
export default Success