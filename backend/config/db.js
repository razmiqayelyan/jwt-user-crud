import mysql from "mysql2";
import 'dotenv/config';


export const  connection = mysql.createPool({
    connectionLimit : 10,
    acquireTimeout  : 10000,
    host : process.env.BET_HOST,
    user : process.env.BET_USER,
    password : process.env.BET_PASSWORD,
    database : process.env.BET_DATABASE
  });

// export const  data = mysql.createPool({
//     connectionLimit : 10,
//     acquireTimeout  : 10000,
//     host : process.env.BET_HOST,
//     user : process.env.BET_USER,
//     password : process.env.BET_PASSWORD,
//     database : process.env.BET_DATABASE
//   });