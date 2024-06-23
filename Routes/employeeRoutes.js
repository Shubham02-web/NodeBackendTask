const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middelware/UploadFile");
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
} = require("../controller/employeeController");
// Routes
router.post("/create", uploadMiddleware, createEmployee);
router.get("/allemployee", getEmployees);
router.get("/SingleEmployee/:id", getSingleEmployee);
router.put("/update/:id", uploadMiddleware, updateEmployee);
router.delete("/delete/:id", deleteEmployee);

module.exports = router;
