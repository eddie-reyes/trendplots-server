import { DataSource } from 'typeorm';
import { Trend } from './entities/Trend';
import { Instance } from './entities/Instance';

export const orm = new DataSource({
    type: 'postgres',
    host: process.env.RDS_HOSTNAME,
    port: Number(process.env.RDS_PORT),
    username: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    entities: [Trend, Instance],
    synchronize: true,
    logging: false,
});
