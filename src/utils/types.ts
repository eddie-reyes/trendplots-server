export type DailyInstance = {
    hour: number;
    value: number;
};

export type DailyTrend = {
    name: string;
    instances: DailyInstance[];
};
