import axios from 'axios';
import { mutateDatabase } from '../db/mutations';
import { currentTime } from 'src/index';

export interface ResultsDictionary {
    [index: string]: number;
}

export const fetchTrendData = async () => {
    try {
        const { data } = await axios.get<ResultsDictionary>(process.env.API_ENDPOINT!);
        return data;
    } catch (error) {
        if (new Date().getTime() < currentTime.setHours(currentTime.getHours() + 1)) {
            mutateDatabase();
        }

        return null;
    }
};
