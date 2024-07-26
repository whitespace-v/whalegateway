import {AppDispatch} from "../store";
import {sessionSlice} from "../slices/SessionSlice";
import {__payment_types, __session_data} from "../models";
import {AxiosInterceptor} from "../http";
import axios from "axios";

///** ---- action used for sync payment_type with store ---- **///
export const selectPaymentType = ({payment_type}: {payment_type: __payment_types}) => (dispatch: AppDispatch) => {
    dispatch(sessionSlice.actions.selectPaymentType({payment_type}));
}
///** ---- action used for sync user email with store ---- **///
export const insertEmail = ({email}: {email: string}) => (dispatch: AppDispatch) => {
    dispatch(sessionSlice.actions.insertEmail({email}));
}
///** ---- action used for fetch session data from server ---- **///
export const fetch_session = ({session_uid, merchant_uid}: {session_uid: string, merchant_uid:string}) => async (dispatch: AppDispatch) => {
    try {
        const {data} = await AxiosInterceptor.$timeHost.get(`/session?merchant_uid=${merchant_uid}&session_uid=${session_uid}`)
        dispatch(sessionSlice.actions.fetch_session({session_uid, session_data: data}));
    } catch (e){
        console.log(e)
        dispatch(sessionSlice.actions._sessionError(e.message))
    }
}
///** ---- action used for create session at server ---- **///
export const _sessionInit = ({session_uid, payment_type, email}: {session_uid: string, payment_type: __payment_types, email: string}) => async (dispatch: AppDispatch) => {
    dispatch(sessionSlice.actions._sessionInit());
    try {
        const {data: ip} = await axios.get('https://api.ipify.org?format=json')
        const payment_data = {
            time_opened: Date.now().toString(),
            timezone: (new Date()).getTimezoneOffset()/60,
            browser_version: navigator.userAgent,
            browser_language: navigator.language,
            ip: ip.ip,
            email,
            payment_type,
            session_uid
        }
        // fetch card and create payment
        const {data} = await AxiosInterceptor.$timeHost.post('/payment/init', payment_data)
        dispatch(sessionSlice.actions._sessionSuccess(data))
    } catch (e){
        dispatch(sessionSlice.actions._sessionError(e.message))
    }
}
///** ---- action used for fetch payment status from server ---- **///
export const _checkPayment = ({session_uid}: {session_uid: string}) => async (dispatch: AppDispatch) => {
    try{
        const { data } = await axios.get('http://localhost:5000/payment/expect', { params: { session_uid } })
        console.log(data)
    } catch (e) {
        dispatch(sessionSlice.actions._sessionError(e.message))
    }
}
///** ---- action used for fetch payment status from server ---- **///
export const _verify_session = ({session_uid, merchant_uid}: {session_uid: string, merchant_uid: string}) => async (dispatch: AppDispatch) => {
    try{
        const { data } = await axios.get('http://localhost:5000/session/verify', { params: { session_uid, merchant_uid } })
        switch (data.session.status) {
            case "PROCESS": {
                console.log(data);
                dispatch(sessionSlice.actions.sessionVerified_process(data))
                return data.session.status
            }
            case "PENDING": {
                console.log(data);
                dispatch(sessionSlice.actions.sessionVerified_pending(data))
                break
            }
            // case "SUCCESS": {
            //     dispatch(sessionSlice.actions._sessionVerified_success(data))
            //     break
            // }
            // case "ERROR": {
            //     dispatch(sessionSlice.actions._sessionVerified_error(data))
            //     break
            // }
            case "EXITED": {
                dispatch(sessionSlice.actions._sessionVerified_exited(data))
                break
            }
        }
    } catch (e) {
        dispatch(sessionSlice.actions._sessionError(e.message))
    }
}
