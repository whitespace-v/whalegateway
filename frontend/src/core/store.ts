import {combineReducers, configureStore} from "@reduxjs/toolkit";
import sessionReducer from './slices/SessionSlice'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({
    sessionReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export class Dispatcher{
    static patch = () => useDispatch<AppDispatch>()
    static extract: TypedUseSelectorHook<RootState> = useSelector
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
