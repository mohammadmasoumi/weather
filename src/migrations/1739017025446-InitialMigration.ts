import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1739017025446 implements MigrationInterface {
    name = 'InitialMigration1739017025446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "weather" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cityName" character varying NOT NULL, "country" character varying NOT NULL, "temperature" double precision NOT NULL, "description" character varying NOT NULL, "humidity" integer NOT NULL, "windSpeed" double precision NOT NULL, "fetchedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af9937471586e6798a5e4865f2d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "weather"`);
    }

}
