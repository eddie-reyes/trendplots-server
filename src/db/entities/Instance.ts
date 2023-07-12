import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Trend } from './Trend';

@Entity()
export class Instance {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    value: number;

    @ManyToOne(() => Trend, (trend) => trend.instances)
    trend: Trend;
}
