import { orm } from './db/data-source';
import { mutateDatabase } from './db/mutations';
import { resolveDailyTrends } from './db/resolvers';

import express from 'express';
import cors from 'cors';
import 'reflect-metadata';

orm.initialize()
    .then(() => {
        setInterval(tick, 60000);
        console.log('connected to database');
    })
    .catch(() => console.log("couldn't connect to database")); //init timer for sequential db mutations

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json(), cors());

app.get('/', async (req, res) => {
    const date = new Date(String(req.query.date));
    res.status(200).send(await resolveDailyTrends(date)); //wait for daily trends to be fetched from db before sending to client
});

app.listen(port);

const tick = () => {
    let minute = new Date().getMinutes();

    if (minute === 0) mutateDatabase();
};
