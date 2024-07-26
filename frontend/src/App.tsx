import React, { useEffect } from 'react';
import './styles/index.scss'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Payment from "./Pages/Payment";
import PaymentEmail from "./Pages/PaymentEmail";
import PaymentSuspense from "./Pages/PaymentSuspense";
import { Dispatcher } from "./core/store";
import Loader from "./Components/Loader";
import Dummy from "./Pages/Dummy";
import { useGo } from './hooks/useGo';
import Exited from './Pages/Exited';
import Success from './Pages/Success';
import Error from './Pages/Error';

const App = () => {
    const { loading } = Dispatcher.extract(state => state.sessionReducer);
    return (
        <React.Fragment>
            {loading && <Loader />}
            <BrowserRouter>
                <Routes>
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/payment/email" element={<PaymentEmail />} />
                    <Route path="/payment/suspense" element={<PaymentSuspense />} />
                    <Route path="/dummy" element={<Dummy />} />
                    {/* status  */}
                    <Route path="/success" element={<Success />} />
                    <Route path="/exited" element={<Exited />} />
                    <Route path="/error" element={<Error />} />
                </Routes>
            </BrowserRouter>
        </React.Fragment>

    );
};

export default App;