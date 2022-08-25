require('dotenv').config()

module.exports = {
    UserDB: process.env.UserDB,
    passwordDB: process.env.passwordDB,
    UserDB_2: process.env.UserDB_2,
    passwordDB_2: process.env.passwordDB_2,
    time_sessions: process.env.time_sessions,
    MyEmail: process.env.MyEmail,
    EmailDestino: process.env.EmailDestino,
    password_nodemailer: process.env.password_nodemailer
}