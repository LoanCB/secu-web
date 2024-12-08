import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseTicketingEntities1731861855146 implements MigrationInterface {
  name = 'BaseTicketingEntities1731861855146';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`file\` (
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`deletedAt\` timestamp(6) NULL,
                \`fileName\` varchar(255) NOT NULL,
                \`path\` varchar(255) NOT NULL,
                \`size\` int NOT NULL,
                \`ticketId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`ticket\` (
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`deletedAt\` timestamp(6) NULL,
                \`title\` varchar(255) NOT NULL,
                \`description\` text NOT NULL,
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`file\`
            ADD CONSTRAINT \`FK_ddb767cf2965efd177f38d0b70e\` FOREIGN KEY (\`ticketId\`) REFERENCES \`ticket\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`ticket\`
            ADD CONSTRAINT \`FK_0e01a7c92f008418bad6bad5919\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_0e01a7c92f008418bad6bad5919\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_ddb767cf2965efd177f38d0b70e\`
        `);
    await queryRunner.query(`
            DROP TABLE \`ticket\`
        `);
    await queryRunner.query(`
            DROP TABLE \`file\`
        `);
  }
}
