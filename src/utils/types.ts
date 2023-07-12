export interface DailyInstance {
    hour: number;
    value: number;
}

export interface DailyTrend {
    name: string;
    instances: DailyInstance[];
}
