const { PORT, DB, FRONT_OFFICE_URL, BACK_OFFICE_URL} = require('./env');
const sequelize = require('./config/db');
const app       = require('./app');

sequelize.sync()
  .then(() => {
    console.log('BDD bien synchronisée');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`API lancée sur http://localhost:${PORT}`);
      console.log(`  • Front  : ${FRONT_OFFICE_URL}`);
      console.log(`  • Back   : ${BACK_OFFICE_URL}`);
    });
  })
  .catch(err => {
    console.error('Impossible de démarrer la base de données', err);
    process.exit(1);
  });
