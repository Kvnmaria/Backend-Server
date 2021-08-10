const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = require('./app')

const PORT = 7777;

const con = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: 'kvnmaria@12',
    database: 'leave_application'

})

function databaseConnection() {
    return new Promise((resolve, reject) => {

        con.connect((err) => {
            if (!err) {
                resolve(true)
            } else {
                reject(err)
            }
        })

    })
}

// adding the cors middleware
app.use(cors());

const init = async () => {

    try {

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        await databaseConnection();

        // Route for adding an new Employee
        app.post('/employeeData', async (req, res) => {

            const id = req.body.id;
            const name = req.body.name;
            const mail = req.body.mail;
            const mobile = req.body.mobile;
            const role = req.body.role;
            const password = req.body.password;
            const total_leave = req.body.total_leave;

            if (!id) {
                return res.status(400).send({
                    Message: 'Please enter the EmployeeId'
                });
            } else if (!name) {
                return res.status(400).send({
                    Message: 'Please enter the Name'
                });
            } else if (!mail) {
                return res.status(400).send({
                    Message: 'Please enter the Email'
                });
            } else if (!mobile) {
                return res.status(400).send({
                    Message: 'Please enter the Mobile No'
                });
            } else if (!role) {
                return res.status(400).send({
                    Message: 'Please enter the Role '
                });
            } else if (!password) {
                return res.status(400).send({
                    Message: 'Please enter the Password'
                });
            } else if (!total_leave) {
                return res.status(400).send({
                    Message: 'Please enter the Total_Leave'
                });
            }

            const saltRounds = 10;

            const userPassword = await bcrypt.hash(password, saltRounds);

            const sqlQuery = 'INSERT INTO employee(ID, Name, Mail, Mobile, Role, Password, Total_Leave) VALUES ?';

            const values = [
                [id, name, mail, mobile, role, userPassword, total_leave]
            ]

            con.query(sqlQuery, [values], (err) => {

                if (err) return console.log(error);

                return res.send({
                    Message: 'Data has been entered Successfully'
                })
            });
        });



        // Route for LeaveApplications
        app.post('/leaveapplication', (req, res) => {

            let employeeId = req.body.employeeId;
            let fromDate = req.body.fromDate;
            let toDate = req.body.toDate;

            if (!employeeId && !fromDate && !toDate) {
                return res.status(400).send({
                    Message: 'Please enter your EmployeeId, fromDate and toDate'
                })
            } else if (!employeeId) {
                return res.status(400).send({
                    Message: 'Please Enter the EmployeeId'
                })
            } else if (!toDate) {
                return res.status(400).send({
                    Message: 'Please Enter the toDate'
                })
            } else if (!fromDate) {
                return res.status(400).send({
                    Message: 'Please Enter the fromDate'
                })
            }

            const sqlQuery = 'INSERT INTO employeeLeave(fromDate, toDate, employeeId) VALUES ?';

            const values = [
                [fromDate, toDate, employeeId]
            ]

            con.query(sqlQuery, [values], (err) => {

                if (err) return console.log('Data is not Inserted');

                console.log('Data Entered Successfully');

            })

            const sqlQueryEmployeeId = `SELECT * FROM employee WHERE ID = '${employeeId}' `;

            con.query(sqlQueryEmployeeId, (err, dbResult) => {

                if (err) return console.log(err.message)

                console.log(dbResult, req.body.employeeId);

                if (dbResult.length > 0) {

                    if (req.body.employeeId == dbResult[0].ID) {

                        const sqlQuery = `UPDATE employeeLeave
                                          SET status = 'Approved'
                                          WHERE employeeId = '${req.body.employeeId}'`;

                        con.query(sqlQuery, err => {

                            if (err) return console.log(err.message);

                            return res.status(200).send({
                                Message: 'Your Leave has been approved'
                            })
                        })
                    }
                } else {
                    res.status(400).send({
                        Message: `Your EmployeeId Does not Match with Company's Record`
                    });
                }

            })

        })

        app.listen(() => console.log(`Server Started Listening at Port ${PORT}`));

    } catch (error) {
        console.log(error);
    }
}

init();