import {lightdashApi} from "../api";
import {ApiError, ApiStatusResults} from "common";
import {useQuery} from "react-query";
import {useEffect} from "react";
import {useExploreConfig} from "./useExploreConfig";

const getStatus = async () => (
    await lightdashApi<ApiStatusResults>({
        method: 'GET',
        url: '/status',
        body: undefined,
    })
)

export const useServerStatus = () => {
    const queryKey = 'status'
    const { setError } = useExploreConfig()
    const query = useQuery<ApiStatusResults, ApiError>({
        queryKey,
        queryFn: getStatus,
        refetchInterval: 5000,
        refetchIntervalInBackground: false,
    })

    useEffect(() => {
        if (query.error) {
            const [first, ...rest] = query.error.error.message.split('\n')
            setError({title: first, text: rest.join('\n')})
        }
    }, [query.error, setError])

    return query
}