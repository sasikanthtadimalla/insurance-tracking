require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.kgtzf.mongodb.net/itDB",{useNewUrlParser:!0,useCreateIndex:!0,useUnifiedTopology:!0});

// mongoose.connect("mongodb://localhost:27017/itDB", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

const customerSchema = new mongoose.Schema({
  customerID: Number,
  customerName: String,
  contact: String,
  insuranceCompany: String,
  policyNumber: String,
  sumInsured: String,
  policyType: String,
  premium: String,
  policyTerm: String,
  ppt: String,
  issuanceDate: String,
  renewalDate: String,
  noOfPersons: String,
  vehicleType: String,
  capacity: String,
  makeModel: String,
  claimStatus: String
});

const idSchema = new mongoose.Schema({
  customerID: Number
});

const Customer = mongoose.model("Customer", customerSchema);

const CustomerID = mongoose.model("CustomerID", idSchema);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/add", (req, res) => {
  res.render("add", {cnfMsg: "", errMsg: "", id: ""});
});

app.get("/companySearch", (req, res) => {
  
  const foundCustomers = [{
    customerID: "",
    customerName: "", 
    contact: "", 
    insuranceCompany: "", 
    policyNumber: "", 
    sumInsured: "", 
    policyType: "", 
    premium: "", 
    policyTerm: "", 
    ppt: "", 
    issuanceDate: "", 
    renewalDate: "", 
    noOfPersons: "", 
    vehicleType: "", 
    capacity: "", 
    makeModel: "", 
    claimStatus: ""    
  }];

  res.render("companySearch", {foundCustomers: foundCustomers, errMsg: "", cnfMsg: "" , noOfPeople: "0"});

});

app.get("/customerSearch", (req, res) => {

  const foundCustomers = [{
    customerID: "",
    customerName: "", 
    contact: "", 
    insuranceCompany: "", 
    policyNumber: "", 
    sumInsured: "", 
    policyType: "", 
    premium: "", 
    policyTerm: "", 
    ppt: "", 
    issuanceDate: "", 
    renewalDate: "", 
    noOfPersons: "", 
    vehicleType: "", 
    capacity: "", 
    makeModel: "", 
    claimStatus: ""    
  }];

  res.render("customerSearch", {foundCustomers: foundCustomers, errMsg: "", cnfMsg: "" , noOfPeople: "0"});
});

app.get("/delete", (req, res) => {
  res.render("delete", {errMsg: "", cnfMsg: ""});
});

app.get("/manage", (req, res) => {
  res.render("manage");
});

app.get("/update", (req, res) => {
  res.render("update", {
    customerID: "",
    customerName: "", 
    contact: "", 
    insuranceCompany: "", 
    policyNumber: "", 
    sumInsured: "", 
    policyType: "", 
    premium: "", 
    policyTerm: "", 
    ppt: "", 
    issuanceDate: "", 
    renewalDate: "", 
    noOfPersons: "", 
    vehicleType: "", 
    capacity: "", 
    makeModel: "", 
    claimStatus: "",
    errMsg: "",
    cnfMsg: ""
  });  
});

app.post("/companySearch", (req, res) => {

  Customer.find({insuranceCompany: { $regex: req.body.companyName, $options: "i" }}, (err, foundCustomers) => {
    if (err) {
      console.log(err);
    } else {
      if (foundCustomers.length != 0) {
        // RENDER HERE      
        res.render("companySearch", {foundCustomers: foundCustomers, errMsg: "", cnfMsg: "Customer(s) Found." , noOfPeople: foundCustomers.length});

      } else {
        const foundCustomerArray = [{
          customerID: "",
          customerName: "", 
          contact: "", 
          insuranceCompany: "", 
          policyNumber: "", 
          sumInsured: "", 
          policyType: "", 
          premium: "", 
          policyTerm: "", 
          ppt: "", 
          issuanceDate: "", 
          renewalDate: "", 
          noOfPersons: "", 
          vehicleType: "", 
          capacity: "", 
          makeModel: "", 
          claimStatus: ""    
        }];
      
        res.render("companySearch", {foundCustomers: foundCustomerArray, errMsg: "No Customer(s) Found.", cnfMsg: "" , noOfPeople: "0"});
      }
    }
  });

});

app.post("/customerSearch", (req, res) => {

  Customer.find({customerName: { $regex: req.body.customerName, $options: "i" }}, (err, foundCustomers) => {
    if (err) {
      console.log(err);
    } else {
      if (foundCustomers.length != 0) {
        // RENDER HERE      
        res.render("customerSearch", {foundCustomers: foundCustomers, errMsg: "", cnfMsg: "Customer(s) Found." , noOfPeople: foundCustomers.length});

      } else {
        const foundCustomerArray = [{
          customerID: "",
          customerName: "", 
          contact: "", 
          insuranceCompany: "", 
          policyNumber: "", 
          sumInsured: "", 
          policyType: "", 
          premium: "", 
          policyTerm: "", 
          ppt: "", 
          issuanceDate: "", 
          renewalDate: "", 
          noOfPersons: "", 
          vehicleType: "", 
          capacity: "", 
          makeModel: "", 
          claimStatus: ""    
        }];
      
        res.render("customerSearch", {foundCustomers: foundCustomerArray, errMsg: "No Customer(s) Found.", cnfMsg: "" , noOfPeople: "0"});
      }
    }
  });

});

app.post("/add", (req, res) => {

  CustomerID.find({}, (err, foundID) => {
    if (err) {
      console.log(err);
      res.render("add", {errMsg: "Something Went Wrong. Please Try Again.", cnfMsg: "", id: ""});
    } else {
      CustomerID.updateOne({_id: "60e3445c9b9148315caf5197"}, {
        customerID: foundID[0].customerID + 1
      }, (err) => {
        if (err) {
          console.log(err);
          res.render("add", {errMsg: "Something Went Wrong. Please Try Again.", cnfMsg: "", id: ""});
        } else {
            console.log("ID incremented.");

            const newCustomer = new Customer({
              customerID: foundID[0].customerID + 1,
              customerName: _.startCase(req.body.customerName),
              contact: _.startCase(req.body.contact),
              insuranceCompany: _.startCase(req.body.insuranceCompany),
              policyNumber: _.startCase(req.body.policyNumber),
              sumInsured: _.startCase(req.body.sumInsured),
              policyType: _.startCase(req.body.policyType),
              premium: _.startCase(req.body.premium),
              policyTerm: _.startCase(req.body.policyTerm),
              ppt: _.startCase(req.body.ppt),
              issuanceDate: _.startCase(req.body.issuanceDate),
              renewalDate: _.startCase(req.body.renewalDate),
              noOfPersons: _.startCase(req.body.noOfPersons),
              vehicleType: _.startCase(req.body.vehicleType),
              capacity: _.startCase(req.body.capacity),
              makeModel: _.startCase(req.body.makeModel),
              claimStatus: _.startCase(req.body.claimStatus)
            });

            newCustomer.save((err) => {
              if (err) {
                console.log(err);
                res.render("add", {errMsg: "Something Went Wrong. Please Try Again.", cnfMsg: "", id: ""});
              } else {
                console.log("New Customer Data Saved.");
                res.render("add", {errMsg: "", cnfMsg: "New Customer Added Successfully. Their ID is: ", id: (foundID[0].customerID + 1) });
              }
            });
        }
      });
    }

  });

});

app.post("/updateSearch", (req, res) => {

  Customer.findOne({customerID: req.body.customerID}, (err, foundCustomer) => {
    if (err) {
      console.log(err);
    } else {
      if (foundCustomer) {
        res.render("update", { 
          customerID: foundCustomer.customerID,
          customerName: foundCustomer.customerName, 
          contact: foundCustomer.contact, 
          insuranceCompany: foundCustomer.insuranceCompany, 
          policyNumber: foundCustomer.policyNumber, 
          sumInsured: foundCustomer.sumInsured, 
          policyType: foundCustomer.policyType, 
          premium: foundCustomer.premium, 
          policyTerm: foundCustomer.policyTerm, 
          ppt: foundCustomer.ppt, 
          issuanceDate: foundCustomer.issuanceDate, 
          renewalDate: foundCustomer.renewalDate, 
          noOfPersons: foundCustomer.noOfPersons, 
          vehicleType: foundCustomer.vehicleType, 
          capacity: foundCustomer.capacity, 
          makeModel: foundCustomer.makeModel, 
          claimStatus: foundCustomer.claimStatus,
          errMsg: "",
          cnfMsg: "Customer Found."
        });
      } else {
        res.render("update", {
          customerID: "",
          customerName: "", 
          contact: "", 
          insuranceCompany: "", 
          policyNumber: "", 
          sumInsured: "", 
          policyType: "", 
          premium: "", 
          policyTerm: "", 
          ppt: "", 
          issuanceDate: "", 
          renewalDate: "", 
          noOfPersons: "", 
          vehicleType: "", 
          capacity: "", 
          makeModel: "", 
          claimStatus: "",
          errMsg: "Customer Not Found. Enter Correct ID.",
          cnfMsg: ""
        });
      }
      
    }

  });
});

app.post("/updateUpdate", (req, res) => {

  Customer.updateOne({customerID: req.body.customerID}, { 
    customerName: _.startCase(req.body.customerName),
    contact: _.startCase(req.body.contact),
    insuranceCompany: _.startCase(req.body.insuranceCompany),
    policyNumber: _.startCase(req.body.policyNumber),
    sumInsured: _.startCase(req.body.sumInsured),
    policyType: _.startCase(req.body.policyType),
    premium: _.startCase(req.body.premium),
    policyTerm: _.startCase(req.body.policyTerm),
    ppt: _.startCase(req.body.ppt),
    issuanceDate: _.startCase(req.body.issuanceDate),
    renewalDate: _.startCase(req.body.renewalDate),
    noOfPersons: _.startCase(req.body.noOfPersons),
    vehicleType: _.startCase(req.body.vehicleType),
    capacity: _.startCase(req.body.capacity),
    makeModel: _.startCase(req.body.makeModel),
    claimStatus: _.startCase(req.body.claimStatus)
  }, (err) => {
    if (err) {
      console.log(err);
      res.render("update", {
        customerID: "",
        customerName: "", 
        contact: "", 
        insuranceCompany: "", 
        policyNumber: "", 
        sumInsured: "", 
        policyType: "", 
        premium: "", 
        policyTerm: "", 
        ppt: "", 
        issuanceDate: "", 
        renewalDate: "", 
        noOfPersons: "", 
        vehicleType: "", 
        capacity: "", 
        makeModel: "", 
        claimStatus: "",
        errMsg: "Something Went Wrong. Please Try Again.",
        cnfMsg: "",      
      })
    } else {
      console.log("Customer data updated successfully.");
      res.render("update", {
        customerID: "",
        customerName: "", 
        contact: "", 
        insuranceCompany: "", 
        policyNumber: "", 
        sumInsured: "", 
        policyType: "", 
        premium: "", 
        policyTerm: "", 
        ppt: "", 
        issuanceDate: "", 
        renewalDate: "", 
        noOfPersons: "", 
        vehicleType: "", 
        capacity: "", 
        makeModel: "", 
        claimStatus: "",
        errMsg: "",
        cnfMsg: "Customer Data Updated Successfully.",      
      });
    }
  });

});

app.post("/delete", (req, res) => {

  Customer.findOne({customerID: req.body.customerID}, (err, foundCustomer) => {
    if (err) {
      console.log(err);
      res.render("delete", {errMsg: "Something Went Wrong. Please Try Again.", cnfMsg: ""});
    } else {
      if (foundCustomer) {
        Customer.deleteOne({customerID: req.body.customerID}, (err) => {
          if (err) {
            console.log(err);
            res.render("delete", {errMsg: "Something Went Wrong. Please Try Again.", cnfMsg: ""});
          } else {
            console.log("Customer deleted successfully.");
            res.render("delete", {errMsg: "", cnfMsg: "Customer Deleted Successfully."});
          }
        });
      } else {
        res.render("delete", {errMsg: "Customer Not Found. Enter Correct ID.", cnfMsg: ""});
      }
    }
  });

  
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started.");
});