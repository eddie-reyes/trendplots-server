import axios from 'axios';
import { mutateDatabase } from '../db/mutations';

export interface ResultsDictionary {
    [index: string]: number;
}

export const fetchTrendData = async () => {
    try {
        const { data } = await axios.get<ResultsDictionary>(
            'https://lk11hk4mxh.execute-api.us-west-1.amazonaws.com/'
        );
        return data;
    } catch (error) {
        mutateDatabase();

        return null;
    }
};
