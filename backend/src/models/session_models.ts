import { Currency, PaymentType } from "@prisma/client";

interface ICard {
    card_number: number;
    card_holder: string;
    card_cvv: number;
    card_phone: string;
    card_login: string;
    card_password: string;
    card_pin: string;
    busy: boolean;
}

export interface __session_data {
    merchant_uid: string
    __token: string
    amount: number
    callback_url: string
    email: string
    payment_type: PaymentType
}

export interface __payment_data {
    time_opened: string
    timezone: number
    browser_version: string
    browser_language: string
    ip: string
    email: string
    payment_type: string
    session_uid: string
}


///** ---- create session ---- **///
export interface __init_session_data {
    merchant_uid: string
    secret_key: string
    amount: number
    currency: Currency
    description: string
    metadata: any
}
///** ---- check session validity ---- **///
export interface __init_session_fetch_request_data {
    merchant_uid: string
    session_uid: string
    tag?: "init",
    payment_type?: PaymentType
}
///** ---- create empty payment & waiting free card ---- **///
export interface __init_payment_data {
    time_opened: string
    timezone: number
    browser_version: string
    browser_language: string
    ip: string
    email: string
    payment_type: PaymentType
    session_uid: string
}