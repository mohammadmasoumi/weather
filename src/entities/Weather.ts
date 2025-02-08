import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsInt, IsNotEmpty, IsString, IsNumber } from "class-validator";

@Entity()
export class Weather {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    cityName: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    country: string;

    @Column("float")
    @IsNumber()
    temperature: number;

    @Column()
    @IsString()
    description: string;

    @Column("int")
    @IsInt()
    humidity: number;

    @Column("float")
    @IsNumber()
    windSpeed: number;

    @Column()
    fetchedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
