import { Between } from 'typeorm';
import { orm } from './data-source';
import { Instance } from './entities/Instance';
import { Trend } from './entities/Trend';
import { DailyTrend, DailyInstance } from 'src/utils/types';

export const resolveDailyTrends = async (date: Date) => {
    let data: Array<DailyTrend> = [];

    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const dailyTrends = await orm.manager.find(Trend, {
        where: {
            updatedAt: Between(dayStart, dayEnd),
        },
    });

    for (const trend of dailyTrends) {
        const trendInstances = await orm.manager.find(Instance, {
            where: {
                createdAt: Between(dayStart, dayEnd),
                trend: trend,
            },
        });

        const parsedInstances = trendInstances.map((instance): DailyInstance => {
            return {
                hour: instance.createdAt.getHours(),
                value: instance.value,
            };
        });

        const parsedTrend: DailyTrend = {
            name: trend.name,
            instances: parsedInstances,
        };

        data.push(parsedTrend);
    }

    return data;
};
