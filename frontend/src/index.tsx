import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import { setupStore } from "./core/store";

ReactDOM
    .createRoot(document.querySelector('.paywhale') as HTMLElement)
    .render(
        <Provider store={setupStore()}>
            <App />
        </Provider>
    );

reportWebVitals();
