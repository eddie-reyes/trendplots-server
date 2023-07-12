import axios from 'axios';
import { mutateDatabase } from '../db/mutations';

export interface ResultsDictionary {
    [index: string]: number;
}

export const fetchTrendData = async () => {
    try {
        const { data } = await axios.get<ResultsDictionary>(process.env.API_ENDPOINT!);
        return data;
    } catch (error) {
        mutateDatabase();

        return null;
    }
};
