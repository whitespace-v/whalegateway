export enum __payment_types {
    default =   "default",
    sberbank =   "sberbank",
    alfabank =   "alfabank",
    tinkoff =   "tinkoff",
    raiffeisen =   "raiffeisen"
}

export enum __session_status{
    PROCESS = "PROCESS",
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    ERROR   = "ERROR",
    EXITED  = "EXITED",
}

export interface __session_data{
    email: string
    payment_type: __payment_types
    browser_language?: string
    browser_version?: string
    ip?: string
    time_opened?: string
    timezone?: number
    session_uid: string,
    merchant_uid: string
}


export interface __sessionVerified_process {
    session: {
        status: __session_status,
        currency: string;
        amount: number;
        timeout: number
    },
     domain: string;
}

export interface __sessionVerified_pending extends __sessionVerified_process{
    payment: {
        payment_type: __payment_types,
        card_details: {
            card_reciever: string,
            card_number: string
        }
    }
}