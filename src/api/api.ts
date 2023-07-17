import axios from 'axios';
import { mutateDatabase } from '../db/mutations';

export interface ResultsDictionary {
    [index: string]: number;
}

export const fetchTrendData = async (dateAtMutatation: Date) => {
    try {
        const { data } = await axios.get<ResultsDictionary>(process.env.API_ENDPOINT!);
        return data;
    } catch (error) {
        if (new Date().getTime() < dateAtMutatation.setHours(dateAtMutatation.getHours() + 1)) {
            mutateDatabase(dateAtMutatation);
        }

        return null;
    }
};
