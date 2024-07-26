import {useNavigate, useSearchParams} from "react-router-dom";

export const useGo = () => {
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();
    return (url: any) => {
        navigate(url+'?'+searchParams.toString());
    };
}