import { fetchTrendData, ResultsDictionary } from '../api/api';
import { orm } from './data-source';
import { Instance } from './entities/Instance';
import { Trend } from './entities/Trend';

const DECAY_FACTOR = 0.9; //rate at which trends decay if trend is not in api results
const MINIMUM_SIZE = 5;

export const mutateDatabase = async () => {
    const apiResults = await fetchTrendData(); //get results dictionary from api

    if (!apiResults) return; //if api returns error, do nothing

    for (const key in apiResults) {
        if (apiResults[key] <= MINIMUM_SIZE) continue; //dont allow trends under minimum size

        const currentTrend = await orm.manager.findOneBy(Trend, { name: key }); //find trend using key (string)
        //if trend exists
        if (currentTrend) {
            //new instance for current trend
            createNewInstance(currentTrend, key, apiResults);
        } else {
            //if need new trend
            const newTrend = new Trend();
            newTrend.name = key;

            createNewInstance(newTrend, key, apiResults);
        }
    }
};

const createNewInstance = (trend: Trend, key: string, apiResults: ResultsDictionary) => {
    const instance = new Instance();
    instance.value = apiResults[key];

    saveDatabase(trend, instance);
};

const saveDatabase = async (trend: Trend, instance: Instance) => {
    trend.updatedAt = new Date();
    await orm.manager.save(trend);

    //value of key (int)
    instance.createdAt = new Date();
    instance.trend = trend; //many to one relation
    await orm.manager.save(instance);
};

const persistDatabase = async (trends: Trend[]) => {
    for (const trend of trends) {
        const currentInstance = await orm.manager.findOneBy(Instance, {
            trend: trend, //find first trend relationship for instance
        });

        const instance = new Instance();
        instance.value = currentInstance ? currentInstance.value : 0;

        saveDatabase(trend, instance);
    }
};
