const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const xsenv = require('@sap/xsenv');
const hdbext = require('@sap/hdbext');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

// add HANA client to all incoming requests. json file is only read when not running on XS Advanced Server
const services = xsenv.getServices({ hana: { tag: 'hana' } }, '/tmp/default-services.json');
app.use('/', hdbext.middleware(services.hana));

// configure keycloak if enabled
const keycloakAuth = require('./middlewares/keycloak-auth')(app);

app.use(keycloakAuth);

const appRouter = require('./app-router');

app.use('/', appRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`http server started on port ${port}`);
});
