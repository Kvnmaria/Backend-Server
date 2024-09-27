const bcrypt = require('bcrypt');
const { con } = require('./databaseConnection');
const jwt = require('jsonwebtoken');

const login = (req, res) => {

    try {
        const employeeId = req.body.employeeId;
        const password = req.body.password;

        if (!employeeId && !password) {
            return res.status(400).send({
                Message: 'Please Enter the EmployeeId and Password'
            })
        } else if (!employeeId) {
            return res.status(400).send({
                Message: 'Please Enter the EmployeeId'
            })
        } else if (!password) {
            return res.status(400).send({
                Message: 'Please Enter the Password '
            })
        }


        const sqlQuery = `SELECT ID, PASSWORD FROM employee WHERE id = '${employeeId}'`;

        con.query(sqlQuery, async (err, dbResult) => {

            if (err) {
                return res.status(500).send({
                    Message: 'Something Went Wrong'
                })
            }

            if (dbResult.length > 0) {

                const employeeDbPassword = await bcrypt.compare(password, dbResult[0].PASSWORD);

                if (!employeeDbPassword) {
                    return res.status(400).send({
                        Message: 'Please Enter a Valid Password'
                    })
                } else if (employeeId == dbResult[0].ID && employeeDbPassword) {
                    // json webtoken
                    const employee = {
                        ID: employeeId,
                        Password: password
                    };

                    jwt.sign({ user: employee }, 'avemaria@12', { expiresIn: '5hr' }, (err, token) => {

                        if (err) {
                            res.status(500).send('Server Side Error')
                        }
                        return res.status(200).send({
                            Message: 'Welcome',
                            Token: token,
                            EmployeeId: employeeId
                        })

                    })

                }

            } else {
                return res.status(400).send({
                    Message: `Your EmployeeId does not match with the Company's Database`
                })
            }
        })
    } catch (error) {
        return res.status(500).send('Some Server Side Error')
    }
}

module.exports = login;


