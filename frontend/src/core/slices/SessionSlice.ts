import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {__payment_types, __session_data, __session_status, __sessionVerified_pending, __sessionVerified_process} from "../models";
import {fetch_session} from "../actions/SessionActions";

interface SessionVerifiedData{
    status_code: number
    data: {
        card: {
            card_receiver: string
            card_number: string
            payment_type: __payment_types
        }
        domain: string
        time_opened: string
        amount: number
        currency: string
    }
}
  
interface ICardDetails{
    card_receiver: string,
    card_number: string
}
interface IFetchedSession {
    amount: number
    created_at: string
    currency: string
    domain: string
    merchant_uid: string
}

interface IFetched_session_message{
    status_code: number,
    data: IFetchedSession
    
}
interface ISessionState extends __session_data, IFetchedSession{
    payment_image: string
    loading: boolean
    error: string
    card_details: ICardDetails,
    transaction_id: number,
    status: __session_status
    timeout: number
}

const initialState: ISessionState = {
    payment_type: __payment_types.default,
    payment_image: 'default??->->static',
    email: '',
    loading: false,
    error: '',
    card_details: {card_receiver: '', card_number: ''},
    transaction_id: 0,
    session_uid: '',
    merchant_uid: '',
    amount: 0,
    created_at: '',
    currency: '',
    domain: '',
    time_opened: '0',
    status: __session_status["PROCESS"],
    timeout: 0
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        selectPaymentType(state, action: PayloadAction<{payment_type: __payment_types}>){
            state.payment_type = action.payload.payment_type
        },
        insertEmail(state, action: PayloadAction<{ email: string }>){
            state.email = action.payload.email
        },
        fetch_session(state, action: PayloadAction<{ session_uid: string, session_data: IFetched_session_message }>){            
            state.loading = false
            state.error = ''
            state.session_uid= action.payload.session_uid
            state.merchant_uid= action.payload.session_data.data.merchant_uid
            state.amount = action.payload.session_data.data.amount
            state.created_at = action.payload.session_data.data.created_at
            state.currency = action.payload.session_data.data.currency
            state.domain = action.payload.session_data.data.domain
        },
        _sessionVerified(state, action: PayloadAction<SessionVerifiedData>){
            state.loading = false
            state.error = ''
            state.amount = action.payload.data.amount
            state.card_details.card_number = action.payload.data.card.card_number
            state.card_details.card_receiver = action.payload.data.card.card_receiver
            state.currency = action.payload.data.currency
            state.time_opened = action.payload.data.time_opened
            state.domain = action.payload.data.domain
            state.payment_type = action.payload.data.card.payment_type
        },
        _sessionInit(state){
            state.loading = true
            state.error = ''
        },
        _sessionError(state, action: PayloadAction<{ error: string }>){
            state.loading = false
            state.error = action.payload.error
        },
        _sessionSuccess(state, action: PayloadAction<{ card_details: ICardDetails, transaction_id: number }>
        ){
            state.loading = false
            state.card_details = action.payload.card_details
            state.transaction_id = action.payload.transaction_id
        },
        
        sessionVerified_process(state, action: PayloadAction<__sessionVerified_process>){
            state.status = action.payload.session.status
            state.currency = action.payload.session.currency
            state.amount  = action.payload.session.amount
            state.domain = action.payload.domain
        },
        sessionVerified_pending(state, action: PayloadAction<__sessionVerified_pending>){
            state.status = action.payload.session.status
            state.currency = action.payload.session.currency
            state.amount  = action.payload.session.amount
            state.payment_type  = action.payload.payment.payment_type
            state.card_details.card_number  = action.payload.payment.card_details.card_number
            state.card_details.card_receiver  = action.payload.payment.card_details.card_reciever
            state.domain = action.payload.domain
            state.timeout = action.payload.session.timeout
        },
        _sessionVerified_exited(state, action: PayloadAction<{session: {status: __session_status}}>){
            state.status = action.payload.session.status           
        }
    }
})

export default sessionSlice.reducer