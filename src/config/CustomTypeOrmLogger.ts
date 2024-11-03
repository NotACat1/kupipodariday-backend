import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import logger from './logger.config';

export class CustomTypeOrmLogger implements TypeOrmLogger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.info(`Query: ${query} -- Parameters: ${JSON.stringify(parameters)}`);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    logger.error(
      `Query Error: ${error} -- Query: ${query} -- Parameters: ${JSON.stringify(
        parameters,
      )}`,
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    logger.warn(
      `Slow Query: ${time}ms -- Query: ${query} -- Parameters: ${JSON.stringify(
        parameters,
      )}`,
    );
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.info(`Schema Build: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    logger.info(`Migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    if (level === 'log') {
      logger.info(message);
    } else if (level === 'info') {
      logger.info(message);
    } else if (level === 'warn') {
      logger.warn(message);
    }
  }
}
