const ReportController = {};
const itemReport = require('../models/itemReport.model');
const Purchases = require('../models/purchases.model');
const Items = require('../models/items.model');
const Sales = require('../models/sales.model');
const Payments = require('../models/payments.model');
const Expenses = require('../models/expenses.model');

const path = require('path');
const moment = require('moment');
var querystring = require('querystring');
const http = require('http');
ReportController.getItemReport = async (req, res) => {
  console.log('in item report')
  let purchasedItems = await Items.aggregate([
    { $project: { itemId: { $toString: "$_id" }, Itemname: 1 } }, {
      $lookup:
      {
        from: "purchases",
        localField: "itemId",
        foreignField: "item",
        as: "order_fact_docs"
      }
    },

    { $unwind: '$order_fact_docs' },

    { $group: { _id: "$_id", name: { $last: '$Itemname' }, purchasedQuantity: { $sum: '$order_fact_docs.quantity' } } },
  ])
  let soldItems = await Items.aggregate([
    { $project: { itemId: { $toString: "$_id" }, Itemname: 1 } }, {
      $lookup:
      {
        from: "sales",
        localField: "itemId",
        foreignField: "item",
        as: "sales_docs"
      }
    },

    { $unwind: '$sales_docs' },

    { $group: { _id: "$_id", soldQuantity: { $sum: '$sales_docs.quantity' } } },
  ]);
  let wastageItems = await Items.aggregate([
    { $project: { itemId: { $toString: "$_id" }, Itemname: 1 } }, {
      $lookup:
      {
        from: "waistages",
        localField: "itemId",
        foreignField: "item",
        as: "waistages_docs"
      }
    },

    { $unwind: '$waistages_docs' },

    { $group: { _id: "$_id", wastageQuantity: { $sum: '$waistages_docs.quantity' } } },
  ])
  //console.log('ids = ', a)
  // console.log('wastageItems', wastageItems)

  const mergeById = (a1, a2) =>
    a1.map(itm => ({
      ...a2.find((item) => (item.id === itm.id) && item),
      ...itm
    }));
  let arr1 = mergeById(soldItems, purchasedItems);

  // const result = soldItems.map(v => ({ ...v, ...purchasedItems.find(sp => sp.id === v.id) }));
  //  const mergedArray = [...soldItems, ...purchasedItems,...wastageItems];
  //  var output = [];
  //  var resutl = mergedArray
  //  .groupBy('id')
  //  .map(_.spread(_.assign))
  //  .value();
  // const newData = purchasedItems.map((item, row) => {
  //   const found = soldItems.find((element) => item._id == element._id);
  //   return { ...item, ...found };
  // });
  //  console.log('purchasedItems', newData)

  // console.log('arr1',arr1);
  //console.log('purchases included',mergeById(arr1, purchasedItems));
  const result = purchasedItems.map(v => ({ ...v, ...soldItems.find(sp => sp.id === v.id) }));

  res.status(200).send({
    code: 200,
    message: 'Successful',
    purchase: arr1
  });

};
ReportController.getISaleReport = async (req, res) => {
  console.log('in item report')
  let day = req.body.day;
  let month = req.body.month;
  let year = req.body.year;
  var d;
  console.log(req.body);

  let paid = await Sales.aggregate([
    { $project: { dateObj: { $toDate: "$timeStamp" }, item: 1, quantity: 1, payment: 1, amount: 1 } },
    {
      $project:
      {
        year: { $year: "$dateObj" },
        month: { $month: "$dateObj" },
        day: { $dayOfMonth: "$dateObj" },
        status: 1,
        camp_id: 1,
        item: 1, quantity: 1, payment: 1, amount: 1
      }
    },
    {
      $match:
      {
        $and: [
          { year: year },
          { month: month },
          { day: day },
          { payment: "true" }
        ]
      }
    },
    { $group: { _id: "$day", paid: { $sum: '$amount' } } },
  ])
  let unpaid = await Sales.aggregate([
    { $project: { dateObj: { $toDate: "$timeStamp" }, item: 1, quantity: 1, payment: 1, amount: 1 } },
    {
      $project:
      {
        year: { $year: "$dateObj" },
        month: { $month: "$dateObj" },
        day: { $dayOfMonth: "$dateObj" },
        status: 1,
        camp_id: 1,
        item: 1, quantity: 1, payment: 1, amount: 1
      }
    },
    {
      $match:
      {
        $and: [
          { year: year },
          { month: month },
          { day: day },
          { payment: "false" }
        ]
      }
    },
    { $group: { _id: "$day", unpaid: { $sum: '$amount' } } },
  ])
  let saleList = await Sales.aggregate([
    {
      $project: {
        dateObj: { $toDate: "$timeStamp" }, itemId: { $toObjectId: "$item" }, buyerId: { $toObjectId: "$buyer" }, userId: { $toObjectId: "$userId" }, quantity: 1,
        unitPrice: 1,
        amount: 1,
        timeStamp: 1, payment: 1
      }
    },
    {
      $project:
      {
        year: { $year: "$dateObj" },
        month: { $month: "$dateObj" },
        day: { $dayOfMonth: "$dateObj" },
        itemId: 1,
        buyerId: 1,
        userId: 1,
        quantity: 1,
        unitPrice: 1,
        amount: 1,
        timeStamp: 1
        , payment: 1
      }
    },
    {
      $match:
      {
        $and: [
          { year: year },
          { month: month },
          { day: day }
        ]
      }
    },
    {
      $lookup:
      {
        from: "items",
        localField: "itemId",
        foreignField: "_id",
        as: "itemObj"
      }
    },

    { $unwind: '$itemObj' },
    {
      $lookup:
      {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyerObj"
      }
    },

    { $unwind: '$buyerObj' },
    {
      $lookup:
      {
        from: "managers",
        localField: "userId",
        foreignField: "_id",
        as: "userObj"
      }
    },

    { $unwind: '$userObj' }

  ])

  res.status(200).send({
    code: 200,
    message: 'Successful',
    unpaid: unpaid,
    paid: paid,
    saleList: saleList
  });

};

ReportController.getISaleReportRange = async (req, res) => {
  console.log('in item report')
  let paid;
  let unpaid;
  let oldUnpaidAmount;
  let totalUnpaid;
  let paidFromPayments;
  let totalPaidFromPayments;
  let expensesAmount;
let oldPaidFromPayments;
let oldPaidAndUnpaidAmount;
  let paidAndUnpaid;
  let oldPaidUnpaidAmount;
  let totalPaidAndUnpaid;
  var d;
  if (req.body.menu == 'Date Range') {
    var fromDate = req.body.start.split('T')[0];
    var toDate = req.body.end.split('T')[0];
    paidAndUnPaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, unpaid:1, amount: 1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    paidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
    expensesAmount = await Expenses.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, item: 1, quantity: 1, payment: 1, price: 1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          status: 1,
          camp_id: 1,
          item: 1, quantity: 1, payment: 1, price: 1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$price' }, unpaid: { $sum: '$unpaid' } } },
    ])

    oldPaidAndUnpaidAmount = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" },unpaid:1, amount: 1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } }
          ,unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $lt: fromDate } },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    oldPaidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $lt: fromDate } },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
    totalPaidAndUnpaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" },unpaid:1, amount: 1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } }
          ,unpaid:1, amount: 1,type:1
        }
      }, {
        $match:
        {
          $and: [
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    totalPaidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
  } else if (req.body.menu == 'Date') {
    let date = req.body.date;
    paidAndUnPaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: date },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    paidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: date },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
    expensesAmount = await Expenses.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, item: 1, quantity: 1, payment: 1, price: 1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          status: 1,
          camp_id: 1,
          item: 1, quantity: 1, payment: 1, price: 1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: date }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$price' } } },
    ])
    oldPaidAndUnpaidAmount = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" },unpaid:1, amount: 1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $lt: date } },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' } , unpaid: { $sum: '$unpaid' } } },
    ])
    oldPaidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $lt: date } },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
    totalPaidAndUnpaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, unpaid:1, amount: 1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' } , unpaid: { $sum: '$unpaid' }} },
    ])
    totalPaidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
  } else if (req.body.menu == 'Buyer') {
    let buyerId = req.body.buyer;
    paidAndUnPaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, unpaid:1, amount: 1, buyer: 1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1, buyer: 1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { buyer: buyerId },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    paidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1,buyer:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1,buyer:1
        }
      },
      {
        $match:
        {
          $and: [
            { buyer: buyerId },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
  } else if (req.body.menu == 'Date And Buyer') {
    let date = req.body.date;
    let buyerId = req.body.buyer;
    paidAndUnPaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, unpaid:1, amount: 1,buyer:1 ,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,buyer:1,type:1 
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: date },
            { buyer: buyerId },
            { type: "sale" }
            
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    paidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1,buyer:1  } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1,buyer:1 
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: date },
            { buyer: buyerId },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
    expensesAmount = await Expenses.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, item: 1, quantity: 1, payment: 1, price: 1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          status: 1,
          camp_id: 1,
          item: 1, quantity: 1, payment: 1, price: 1
        }
      },
      {
        $match:
        {
          $and: [ { dateObj: date }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$price' } } },
    ])
    oldPaidAndUnpaidAmount = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" },unpaid:1, amount: 1,buyer:1 ,type:1  } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,buyer:1 ,type:1 
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $lt: date } },
            { buyer: buyerId },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    oldPaidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1,buyer:1  } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1,buyer:1 
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $lt: date } },
            { buyer: buyerId },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
    totalPaidAndUnpaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" },unpaid:1, amount: 1,buyer:1,type:1   } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,buyer:1 ,type:1 
        }
      },
      {
        $match:
        {
          $and: [
            { buyer: buyerId },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    totalPaidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1,buyer:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1,buyer:1
        }
      },
      {
        $match:
        {
          $and: [
            { buyer: buyerId },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
  } else if (req.body.menu == 'Date Range And Buyer') {
    var fromDate = req.body.start.split('T')[0];
    var toDate = req.body.end.split('T')[0];
    let buyerId = req.body.buyer;
    paidAndUnPaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, unpaid:1, amount: 1,buyer:1 ,type:1} },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,buyer:1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } },
            { buyer: buyerId },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    paidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1,buyer:1  } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1,buyer:1 
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } },
            { buyer: buyerId },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
    expensesAmount = await Expenses.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, item: 1, quantity: 1, payment: 1, price: 1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          status: 1,
          camp_id: 1,
          item: 1, quantity: 1, payment: 1, price: 1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$price' } } },
    ])
    oldPaidAndUnpaidAmount = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" },unpaid:1, amount: 1,buyer:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,buyer:1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $lt: fromDate } },
            { buyer: buyerId },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    oldPaidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1,buyer:1  } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1,buyer:1 
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $lt: fromDate } },
            { buyer: buyerId },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
    totalPaidAndUnpaid = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, unpaid:1, amount: 1,buyer:1,type:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,buyer:1,type:1
        }
      },
      {
        $match:
        {
          $and: [
            { buyer: buyerId },
            { type: "sale" }
          ]
        }
      },
      { $group: { _id: "$day", paid: { $sum: '$amount' }, unpaid: { $sum: '$unpaid' } } },
    ])
    totalPaidFromPayments = await Payments.aggregate([
      { $project: { dateObj: { $toDate: "$timeStamp" }, amount: 1,unpaid:1,type:1,buyer:1 } },
      {
        $project:
        {
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          unpaid:1, amount: 1,type:1,buyer:1
        }
      },
      {
        $match:
        {
          $and: [
            { buyer: buyerId },
            { type: "payment" }
          ]
        }
      },
      { $group: { _id: "$day", payment: { $sum: '$amount' }} },
    ])
  }
  console.log('paidAndUnpaid: ',paidAndUnPaid);
  console.log('paidFromPayments: ',paidFromPayments);

  console.log('oldPaidUnpaidAmount: ',oldPaidAndUnpaidAmount);
  console.log('oldPaidFromPayments: ',oldPaidFromPayments);

  console.log('totalPaidAndUnpaid: ',totalPaidAndUnpaid);
  console.log('totalPaidFromPayments: ',totalPaidFromPayments);

  res.status(200).send({
    code: 200,
    message: 'Successful',
    paidAndUnpaid: paidAndUnPaid,
    paidFromPayments:paidFromPayments,
    oldPaidAndUnpaidAmount: oldPaidAndUnpaidAmount,
    oldPaidFromPayments:oldPaidFromPayments,
    totalPaidAndUnpaid: totalPaidAndUnpaid,
    totalPaidFromPayments:totalPaidFromPayments,
    // unpaid: unpaid,
    // paid: paid,
    // oldUnpaidAmount: oldUnpaidAmount,
    // totalUnpaid: totalUnpaid,
    // paidFromPayments: paidFromPayments,
    // totalPaidFromPayments:totalPaidFromPayments,
    expensesAmount:expensesAmount
    //saleList:saleList
  });

};
ReportController.getItemsReportRange = async (req, res) => {
  let itemReport;
  let purchase;
  let sales;
  let waistages;
  if (req.body.menu == 'Date Range') {
    let fromDate = req.body.start.split('T')[0];
    let toDate = req.body.end.split('T')[0];
    purchase = await Items.aggregate([
      { $match: { isExpense: "false" } },
      { $project: { id: { $toString: "$_id" }, Itemname: 1, countingUnit: 1 } },
      {
        $project:
        {
          _id: 0,
          id: 1,
          Itemname: 1,
          countingUnit: 1,
        }
      },
      // Join with user_info table
      {
        $lookup: {
          from: "purchases",       // other table name
          localField: "id",   // name of users table field
          foreignField: "item", // name of userinfo table field
          as: "purchases"         // alias for userinfo table
        }
      },
      { $unwind: "$purchases" },

      {
        $project: {
          _id: 0, id: 1, dateObj: { $toDate: "$purchases.timeStamp" },
          purchaseQ: "$purchases.quantity", Itemname: 1, countingUnit: 1
        }
      },
      //formate date and new documents
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          purchaseQ: "$purchaseQ", Itemname: 1, countingUnit: 1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } },
          ]
        }
      },
      // sum of purchases quantity against given date for items
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: 1,
          purchase: "$purchaseQ",
          Itemname: 1, countingUnit: 1
        }
      },
      {
        $group: {
          _id: "$id",
          date: { "$first": "$dateObj" },
          name: { "$first": "$Itemname" },
          unit: { "$first": "$countingUnit" },
          pStock: { $sum: '$purchase' }
        }
      }
    ]);
    //Sales for an item
    sales = await Items.aggregate([
      { $match: { isExpense: "false" } },
      { $project: { id: { $toString: "$_id" }, Itemname: 1, countingUnit: 1 } },
      {
        $project:
        {
          _id: 0,
          id: 1,
          Itemname: 1,
          countingUnit: 1,
        }
      },
      // Join with user_info table
      {
        $lookup: {
          from: "sales",       // other table name
          localField: "id",   // name of users table field
          foreignField: "item", // name of userinfo table field
          as: "sales"         // alias for userinfo table
        }
      },
      { $unwind: "$sales" },

      {
        $project: {
          _id: 0, id: 1, dateObj: { $toDate: "$sales.timeStamp" },
          salesQ: "$sales.quantity", Itemname: 1, countingUnit: 1
        }
      },
      //formate date and new documents
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          salesQ: "$salesQ", Itemname: 1, countingUnit: 1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } },
          ]
        }
      },
      // sum of sales quantity against given date for items
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: 1,
          sales: "$salesQ",
          Itemname: 1, countingUnit: 1
        }
      },
      {
        $group: {
          _id: "$id",
          date: { "$first": "$dateObj" },
          name: { "$first": "$Itemname" },
          unit: { "$first": "$countingUnit" },
          sStock: { $sum: '$sales' }
        }
      }
    ]);
    waistages = await Items.aggregate([
      { $match: { isExpense: "false" } },
      { $project: { id: { $toString: "$_id" }, Itemname: 1, countingUnit: 1 } },
      {
        $project:
        {
          _id: 0,
          id: 1,
          Itemname: 1,
          countingUnit: 1,
        }
      },
      // Join with user_info table
      {
        $lookup: {
          from: "waistages",       // other table name
          localField: "id",   // name of users table field
          foreignField: "item", // name of userinfo table field
          as: "waistages"         // alias for userinfo table
        }
      },
      { $unwind: "$waistages" },

      {
        $project: {
          _id: 0, id: 1, dateObj: { $toDate: "$waistages.timeStamp" },
          waistagesQ: "$waistages.quantity", Itemname: 1, countingUnit: 1
        }
      },
      //formate date and new documents
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          waistagesQ: "$waistagesQ", Itemname: 1, countingUnit: 1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: { $gte: fromDate, $lte: toDate } },
          ]
        }
      },
      // sum of sales quantity against given date for items
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: 1,
          waistages: "$waistagesQ",
          Itemname: 1, countingUnit: 1
        }
      },
      {
        $group: {
          _id: "$id",
          date: { "$first": "$dateObj" },
          name: { "$first": "$Itemname" },
          unit: { "$first": "$countingUnit" },
          wStock: { $sum: '$waistages' }
        }
      }

    ]);
    //parse object with desired keys
    const parseObject = (data) => {
      return {
        _id: data._id,
        name: data.name,
        wStock: data.wStock || 0,
        sStock: data.sStock || 0,
        pStock: data.pStock || 0,
        Remainings: data.pStock - (data.wStock + data.sStock)
      };
  
  }
  
    //merge all arrays into one
 var _result = [...waistages, ...sales, ...purchase];
var output = {};
_result.forEach((element) => {
  if (!output[element._id]) {
      output[element._id] = element;
      if(element.wStock)
      output[element._id].wStock = element.wStock;
      else 
      output[element._id].wStock = 0;
      if(element.sStock)
      output[element._id].sStock = element.sStock;
      else 
      output[element._id].sStock = 0;
      if (element.pStock) 
      output[element._id].pStock = element.pStock;
      else 
      output[element._id].pStock = 0;
    //   output[element._id] = parseObject(output[element._id])
  }
  else {
   
    if(element.wStock)
    output[element._id].wStock = element.wStock;
    if(element.sStock)
    output[element._id].sStock = element.sStock;
    if (element.pStock) 
    output[element._id].pStock = element.pStock;

    // output[element._id].total = output[element._id].wStock ||  0 + output[element._id].sStock ||  0 + output[element._id].pStock ||  0;
      output[element._id] = parseObject(output[element._id])
  }
});

// console.log(Object.values(output));
let finalResult = Object.values(output)
    res.status(200).send({
      code: 200,
      message: 'Successful',
      report:finalResult
      // waistages: waistages,
      // sales: sales,
      // purchase: purchase,
      // _result: _result
    });
  }
  else if (req.body.menu == 'Date') {
    let date = req.body.date;
    purchase = await Items.aggregate([
      { $match: { isExpense: "false" } },
      { $project: { id: { $toString: "$_id" }, Itemname: 1, countingUnit: 1 } },
      {
        $project:
        {
          _id: 0,
          id: 1,
          Itemname: 1,
          countingUnit: 1,
        }
      },
      // Join with user_info table
      {
        $lookup: {
          from: "purchases",       // other table name
          localField: "id",   // name of users table field
          foreignField: "item", // name of userinfo table field
          as: "purchases"         // alias for userinfo table
        }
      },
      { $unwind: "$purchases" },

      {
        $project: {
          _id: 0, id: 1, dateObj: { $toDate: "$purchases.timeStamp" },
          purchaseQ: "$purchases.quantity", Itemname: 1, countingUnit: 1
        }
      },
      //formate date and new documents
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          purchaseQ: "$purchaseQ", Itemname: 1, countingUnit: 1
        }
      },
      // {
      //   $match:
      //   {
      //     $and: [
      //       { dateObj: { $gte: fromDate, $lte: toDate } },
      //     ]
      //   }
      // },
      {
        $match:
        {
          $and: [
            { dateObj: date },
          ]
        }
      },
      // sum of purchases quantity against given date for items
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: 1,
          purchase: "$purchaseQ",
          Itemname: 1, countingUnit: 1
        }
      },
      {
        $group: {
          _id: "$id",
          date: { "$first": "$dateObj" },
          name: { "$first": "$Itemname" },
          unit: { "$first": "$countingUnit" },
          pStock: { $sum: '$purchase' }
        }
      }
    ]);
    //Sales for an item
    sales = await Items.aggregate([
      { $match: { isExpense: "false" } },
      { $project: { id: { $toString: "$_id" }, Itemname: 1, countingUnit: 1 } },
      {
        $project:
        {
          _id: 0,
          id: 1,
          Itemname: 1,
          countingUnit: 1,
        }
      },
      // Join with user_info table
      {
        $lookup: {
          from: "sales",       // other table name
          localField: "id",   // name of users table field
          foreignField: "item", // name of userinfo table field
          as: "sales"         // alias for userinfo table
        }
      },
      { $unwind: "$sales" },

      {
        $project: {
          _id: 0, id: 1, dateObj: { $toDate: "$sales.timeStamp" },
          salesQ: "$sales.quantity", Itemname: 1, countingUnit: 1
        }
      },
      //formate date and new documents
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          salesQ: "$salesQ", Itemname: 1, countingUnit: 1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: date },
          ]
        }
      },
      // sum of sales quantity against given date for items
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: 1,
          sales: "$salesQ",
          Itemname: 1, countingUnit: 1
        }
      },
      {
        $group: {
          _id: "$id",
          date: { "$first": "$dateObj" },
          name: { "$first": "$Itemname" },
          unit: { "$first": "$countingUnit" },
          sStock: { $sum: '$sales' }
        }
      }
    ]);
    waistages = await Items.aggregate([
      { $match: { isExpense: "false" } },
      { $project: { id: { $toString: "$_id" }, Itemname: 1, countingUnit: 1 } },
      {
        $project:
        {
          _id: 0,
          id: 1,
          Itemname: 1,
          countingUnit: 1,
        }
      },
      // Join with user_info table
      {
        $lookup: {
          from: "waistages",       // other table name
          localField: "id",   // name of users table field
          foreignField: "item", // name of userinfo table field
          as: "waistages"         // alias for userinfo table
        }
      },
      { $unwind: "$waistages" },

      {
        $project: {
          _id: 0, id: 1, dateObj: { $toDate: "$waistages.timeStamp" },
          waistagesQ: "$waistages.quantity", Itemname: 1, countingUnit: 1
        }
      },
      //formate date and new documents
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: { '$dateToString': { format: '%Y-%m-%d', date: '$dateObj' } },
          waistagesQ: "$waistagesQ", Itemname: 1, countingUnit: 1
        }
      },
      {
        $match:
        {
          $and: [
            { dateObj: date },
          ]
        }
      },
      // sum of sales quantity against given date for items
      {
        $project: {
          _id: 0,
          id: 1,
          dateObj: 1,
          waistages: "$waistagesQ",
          Itemname: 1, countingUnit: 1
        }
      },
      {
        $group: {
          _id: "$id",
          date: { "$first": "$dateObj" },
          name: { "$first": "$Itemname" },
          unit: { "$first": "$countingUnit" },
          wStock: { $sum: '$waistages' }
        }
      }

    ]);
    //parse object with desired keys
    const parseObject = (data) => {
      return {
        _id: data._id,
        name: data.name,
        wStock: data.wStock || 0,
        sStock: data.sStock || 0,
        pStock: data.pStock || 0,
        Remainings: data.pStock - (data.wStock + data.sStock)
      };
  }
  
    //merge all arrays into one
 var _result = [...waistages, ...sales, ...purchase];
var output = {};
_result.forEach((element) => {
  if (!output[element._id]) {
      output[element._id] = element;
      if(element.wStock)
      output[element._id].wStock = element.wStock;
      else 
      output[element._id].wStock = 0;
      if(element.sStock)
      output[element._id].sStock = element.sStock;
      else 
      output[element._id].sStock = 0;
      if (element.pStock) 
      output[element._id].pStock = element.pStock;
      else 
      output[element._id].pStock = 0;
    //   output[element._id] = parseObject(output[element._id])
  }
  else {
   
    if(element.wStock)
    output[element._id].wStock = element.wStock;
    if(element.sStock)
    output[element._id].sStock = element.sStock;
    if (element.pStock) 
    output[element._id].pStock = element.pStock;

    // output[element._id].total = output[element._id].wStock ||  0 + output[element._id].sStock ||  0 + output[element._id].pStock ||  0;
      output[element._id] = parseObject(output[element._id])
  }
});

// console.log(Object.values(output));
let finalResult = Object.values(output)
    res.status(200).send({
      code: 200,
      message: 'Successful',
      report:finalResult
      // waistages: waistages,
      // sales: sales,
      // purchase: purchase,
      // _result: _result
    });
  }
};



module.exports = ReportController;

/////////////////////////////////////////////////////////////////////////////////////////////////////
