import { DataSource } from 'typeorm';
import { Trend } from './entities/Trend';
import { Instance } from './entities/Instance';

export const orm = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'paco',
    database: 'trends-database',
    entities: [Trend, Instance],
    synchronize: true,
    logging: false,
});
