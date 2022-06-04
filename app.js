const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path= require('path');

const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  
  
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  
// Requiring Routes

const UsersRoutes = require('./routes/users.routes');
const AdminsRoutes = require('./routes/admins.routes');
const BuyersRoutes = require('./routes/buyers.routes');
const SellersRoutes = require('./routes/sellers.routes');
const StocksRoutes = require('./routes/stocks.routes');
const ExpensesRoutes = require('./routes/expenses.routes');
const WaistageRoutes = require('./routes/waistage.routes');
const SalesRoutes = require('./routes/sales.routes');
const SalesRevisionRoutes = require('./routes/sales-revision.routes');
const PurchasesRoutes = require('./routes/purchases.routes');
const ManagersRoutes = require('./routes/managers.routes');
const buyersRevisionRoutes = require('./routes/buyers-revision.routes');
const sellersRevisionRoutes = require('./routes/sellers-revision.routes');
const expRevisionRoutes = require('./routes/expenses-revision.routes');
const mngRevisionRoutes = require('./routes/managers-revision.routes');
const purchaseRevisionRoutes = require('./routes/purchase-revision.routes');
const waistageRevisionRoutes = require('./routes/waistage-revision.routes');
const reportRoutes = require('./routes/report.routes');
const itemsRoutes = require('./routes/items.routes');
const itemsRevisionRoutes = require('./routes/items-revision.routes');
const PaymentsRoutes = require('./routes/payments.routes');
const paymentsRevisionRoutes = require('./routes/payments-revision.routes');




// connection to mongoose
require('dotenv').config();
const mongoCon = process.env.mongoCon;
// console.log("MongoDB",mongoCon)

mongoose.connect(mongoCon,{ useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });


const fs = require('fs');
fs.readdirSync(__dirname + "/models").forEach(function(file) {
    require(__dirname + "/models/" + file);
});


app.get('/',  function (req, res) {
  res.status(200).send({
    message: 'Express backend server'});
});

app.set('port', (process.env.PORT));

app.use(accessControls);
app.use(cors());

// Routes which should handle requests
app.use("/users",UsersRoutes);
app.use("/admins",AdminsRoutes);
app.use("/buyers",BuyersRoutes);
app.use("/sellers",SellersRoutes);
app.use("/stocks",StocksRoutes);
app.use("/expenses",ExpensesRoutes);
app.use("/waistages",WaistageRoutes);
app.use("/sales",SalesRoutes);
app.use("/purchases",PurchasesRoutes);
app.use("/managers",ManagersRoutes);
app.use("/buyersRevision",buyersRevisionRoutes);
app.use("/sellersRevision",sellersRevisionRoutes);
app.use("/expensesRevision",expRevisionRoutes);
app.use("/managersRevision",mngRevisionRoutes);
app.use("/purchaseRevision",purchaseRevisionRoutes);
app.use("/items",itemsRoutes);
app.use("/itemsRevisionRoutes",itemsRevisionRoutes);
app.use("/salesRevision",SalesRevisionRoutes);
app.use("/waistageRevision",waistageRevisionRoutes);
app.use("/report",reportRoutes);
app.use("/payments",PaymentsRoutes);
app.use("/paymentsRevision",paymentsRevisionRoutes);

app.use(errorHandler);

app.use(errorMessage);

server.listen(app.get('port'));
console.log('listening on port',app.get('port'));

module.exports = server;

