import { fetchTrendData, ResultsDictionary } from '../api/api';
import { getPreviousHour } from '../utils/dates';
import { orm } from './data-source';
import { MoreThanOrEqual } from 'typeorm';
import { Instance } from './entities/Instance';
import { Trend } from './entities/Trend';

import moment from 'moment-timezone';

const DECAY_FACTOR = 0.5; //rate at which trends decay if trend is not in api results
const MINIMUM_SIZE = 5;

export const mutateDatabase = async () => {
    const apiResults = await fetchTrendData(); //get results dictionary from api

    if (!apiResults) return; //if api returns error, do nothing

    const recentTrends = await orm.manager.find(Trend, {
        //get trends that were updated in the previous hour (could include current trends and/or decaying trends)
        where: {
            updatedAt: MoreThanOrEqual(
                getPreviousHour(new Date(moment().tz('America/Los_Angeles').format()))
            ),
        },
    });

    for (const key in apiResults) {
        if (apiResults[key] <= MINIMUM_SIZE) continue; //dont allow trends under minimum size

        const currentTrend = await orm.manager.findOneBy(Trend, { name: key }); //find trend using key (string)
        //if trend exists
        if (currentTrend) {
            //new instance for current trend
            createNewInstance(currentTrend, key, apiResults);
            //remove from recent trends if it was in previous mutation and let it persist
            if (recentTrends.includes(currentTrend)) {
                recentTrends.splice(recentTrends.indexOf(currentTrend), 1);
            }
        } else {
            //if need new trend
            const newTrend = new Trend();
            newTrend.name = key;

            createNewInstance(newTrend, key, apiResults);
        }
    }

    for (const trend of recentTrends) {
        //decay instances not in api results
        await decayInstance(trend);
    }
};

const createNewInstance = (trend: Trend, key: string, apiResults: ResultsDictionary) => {
    const instance = new Instance();
    instance.value = apiResults[key];

    saveDatabase(trend, instance);
};

const decayInstance = async (trend: Trend) => {
    const currentInstance = await orm.manager.findOneBy(Instance, {
        trend: trend, //find first trend relationship for instance
    });

    //decay instance by decay factor
    const decayedValue = currentInstance ? Math.floor(currentInstance.value * DECAY_FACTOR) : 0;

    if (decayedValue <= MINIMUM_SIZE) return; //dont update instance if below minimum size

    const instance = new Instance();
    instance.value = decayedValue;

    saveDatabase(trend, instance);
};

const saveDatabase = async (trend: Trend, instance: Instance) => {
    trend.updatedAt = new Date(moment().tz('America/Los_Angeles').format());
    await orm.manager.save(trend);

    //value of key (int)
    instance.createdAt = new Date(moment().tz('America/Los_Angeles').format());
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
