const Employee = require("../Models/employee");
const fs = require("fs");
const path = require("path");
const employee = require("../Models/employee");

// Controllers to handle opertions Creting Employee
const createEmployee = async function (req, res, next) {
  try {
    // accessing all necessary fields
    const { name, email, phone, position, employeeOfficeId } = req.body;
    //   Creating Condition to verify fields show error message if any of field is missing

    if (!name || !email || !phone || !position || !employeeOfficeId)
      return res.status(400).json({
        success: false,
        message:
          "Please Enter All Fields name email phone position employeeOfficeId",
      });

    if (phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: `Please enter a valid mobile number of 10 digits that is ${phone.length} digit `,
      });
    }
    const imageUrl = req.file
      ? `uploads/${employeeOfficeId}/${req.file.originalname}`
      : null;

    const newEmployee = await Employee.create({
      name,
      email,
      phone,
      position,
      imageUrl,
      employeeOfficeId,
    });
    await newEmployee.save();
    res.status(201).json({
      success: true,
      message: "Employee Created/Registerd Successfully",
      newEmployee,
    });
  } catch (err) {
    if (err.code && err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        message: `${field} allready exists please enter a unique ${field}`,
      });
    }
    res.status(500).json({
      success: false,
      message: `Error in CreateEmployee API ${err.message}`,
    });
  }
};
// Get all Employess
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    // validation if we dont have any employee
    if (!employees)
      return res.status(404).json({
        success: false,
        message: "Employees not found / Empty Employee Collection",
      });
    res.status(200).json({
      success: true,
      message: "Employees find successfully",
      employees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Error in get all Employees API ${err.message}`,
    });
  }
};

const getSingleEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ _id: id });
    if (!employee)
      return res.status(404).json({
        success: false,
        message: `Employee Not Found For These ID ${id}`,
      });

    res.status(200).json({
      success: true,
      message: "Emloyee Details :)",
      employee,
    });
  } catch (error) {
    console.log(`Error in getSingle Employee Details API ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Error  In GetSingleUserDetails API ${error.message}`,
    });
  }
};
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, position, employeeOfficeId } = req.body;
    const updatedEmployee = await Employee.findById(id);
    if (!updatedEmployee)
      res.json({ message: "no employee find for these id" });
    if (name) updatedEmployee.name = name;
    if (email) updatedEmployee.email = email;
    if (phone) updatedEmployee.phone = phone;
    if (position) updatedEmployee.position = position;
    if (employeeOfficeId) updatedEmployee.employeeOfficeId = employeeOfficeId;
    if (req.file) {
      //  removing image
      const filename = updatedEmployee.imageUrl.split("/").pop();
      const dir = path.join(
        __dirname,
        "..",
        "uploads",
        updatedEmployee.employeeOfficeId
      );
      console.log(dir);
      const filePath = path.join(dir, filename);
      console.log(filePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            // File does not exist
            return res.status(404).send("File not found.");
          }
          //       // Other errors
          return res.status(500).send("Error deleting file.");
        }
      });
      updatedEmployee.imageUrl = `uploads/${employeeOfficeId}/${req.file.originalname}`;
    }
    await updatedEmployee.save();
    res.status(200).json({
      success: true,
      updatedEmployee,
      message: `Employee Updates Successfully`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `error in Update Employee API ${err.message}`,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const delEmployee = await Employee.findById(id);
    if (!id)
      return res.status(400).json({
        success: false,
        message: `Employee Not Found for these ID`,
      });

    // removing image
    const filename = delEmployee.imageUrl.split("/").pop();
    const dir = path.join(
      __dirname,
      "..",
      "uploads",
      delEmployee.employeeOfficeId
    );
    // console.log(dir);
    const filePath = path.join(dir, filename);
    // console.log(filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          // File does not exist
          return res.status(404).send("File not found.");
        }
        // Other errors
        return res.status(500).send("Error deleting file.");
      }

      // Check if the directory is now empty
      fs.readdir(dir, (err, files) => {
        if (err) {
          return res.status(500).send("Error reading directory.");
        }

        if (files.length === 0) {
          // Delete the directory if it is empty
          fs.rmdir(dir, (err) => {
            if (err) {
              return res.status(500).send("Error deleting directory.");
            } // Proceed to the next middleware or route handler
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Error In Delete Image Function",
          });
          // Proceed to the next middleware or route handler
        }
      });
    });
    // Delting Employee
    await Employee.deleteOne({ _id: id });
    res.status(200).json({
      success: true,
      message: "Employee deleted Successfully",
      delEmployee,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error in delete Employee API ${err.message}`,
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getSingleEmployee,
};
