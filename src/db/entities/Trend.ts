import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    UpdateDateColumn,
} from 'typeorm';

import { Instance } from './Instance';

@Entity()
export class Trend {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Instance, (instance) => instance.trend)
    instances: Instance[];
}
