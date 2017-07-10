import Sequelize from 'sequelize';

import config from '../../config';

const sequelize = new Sequelize(config('PGDB_DBNAME'), config('PGDB_USERNAME'), config('PGDB_PASSWORD'), {
  host: config('PGDB_HOST'),
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

export { sequelize }