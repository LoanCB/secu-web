import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeDatabase1722431497202 implements MigrationInterface {
  name = 'InitializeDatabase1722431497202';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`role\` (
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`category\` (
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NOT NULL,
                \`description\` varchar(255) NULL,
                UNIQUE INDEX \`IDX_9f16dbbf263b0af0f03637fa7b\` (\`title\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`keyword\` (
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NOT NULL,
                UNIQUE INDEX \`IDX_a1af8669df11217cf8d9789d41\` (\`title\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`note\` (
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`deletedAt\` timestamp(6) NULL,
                \`title\` varchar(255) NOT NULL,
                \`content\` text NOT NULL,
                \`code\` text NULL,
                \`languages\` text NOT NULL,
                \`categoryId\` int NULL,
                \`userId\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`deletedAt\` timestamp(6) NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`isActive\` tinyint NOT NULL DEFAULT 1,
                \`roleId\` int NULL,
                UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`category_keywords_keyword\` (
                \`categoryId\` int NOT NULL,
                \`keywordId\` int NOT NULL,
                INDEX \`IDX_f4d8cd9b50949ded4022588c39\` (\`categoryId\`),
                INDEX \`IDX_2ca21acda85f3dfe372a33c65d\` (\`keywordId\`),
                PRIMARY KEY (\`categoryId\`, \`keywordId\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`note_keywords_keyword\` (
                \`noteId\` int NOT NULL,
                \`keywordId\` int NOT NULL,
                INDEX \`IDX_31ed51ad6d7c86d1414f147ee0\` (\`noteId\`),
                INDEX \`IDX_1983e7348ef4feeb4a4b29d204\` (\`keywordId\`),
                PRIMARY KEY (\`noteId\`, \`keywordId\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`note\`
            ADD CONSTRAINT \`FK_fa0889ab27ba7dd8a59f9e7065c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`note\`
            ADD CONSTRAINT \`FK_5b87d9d19127bd5d92026017a7b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`category_keywords_keyword\`
            ADD CONSTRAINT \`FK_f4d8cd9b50949ded4022588c390\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`category_keywords_keyword\`
            ADD CONSTRAINT \`FK_2ca21acda85f3dfe372a33c65db\` FOREIGN KEY (\`keywordId\`) REFERENCES \`keyword\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`note_keywords_keyword\`
            ADD CONSTRAINT \`FK_31ed51ad6d7c86d1414f147ee0a\` FOREIGN KEY (\`noteId\`) REFERENCES \`note\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`note_keywords_keyword\`
            ADD CONSTRAINT \`FK_1983e7348ef4feeb4a4b29d204d\` FOREIGN KEY (\`keywordId\`) REFERENCES \`keyword\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`note_keywords_keyword\` DROP FOREIGN KEY \`FK_1983e7348ef4feeb4a4b29d204d\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`note_keywords_keyword\` DROP FOREIGN KEY \`FK_31ed51ad6d7c86d1414f147ee0a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`category_keywords_keyword\` DROP FOREIGN KEY \`FK_2ca21acda85f3dfe372a33c65db\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`category_keywords_keyword\` DROP FOREIGN KEY \`FK_f4d8cd9b50949ded4022588c390\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`note\` DROP FOREIGN KEY \`FK_5b87d9d19127bd5d92026017a7b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`note\` DROP FOREIGN KEY \`FK_fa0889ab27ba7dd8a59f9e7065c\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_1983e7348ef4feeb4a4b29d204\` ON \`note_keywords_keyword\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_31ed51ad6d7c86d1414f147ee0\` ON \`note_keywords_keyword\`
        `);
    await queryRunner.query(`
            DROP TABLE \`note_keywords_keyword\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_2ca21acda85f3dfe372a33c65d\` ON \`category_keywords_keyword\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_f4d8cd9b50949ded4022588c39\` ON \`category_keywords_keyword\`
        `);
    await queryRunner.query(`
            DROP TABLE \`category_keywords_keyword\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`note\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_a1af8669df11217cf8d9789d41\` ON \`keyword\`
        `);
    await queryRunner.query(`
            DROP TABLE \`keyword\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_9f16dbbf263b0af0f03637fa7b\` ON \`category\`
        `);
    await queryRunner.query(`
            DROP TABLE \`category\`
        `);
    await queryRunner.query(`
            DROP TABLE \`role\`
        `);
  }
}
