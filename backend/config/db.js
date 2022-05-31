import mysql from "mysql2";
import 'dotenv/config';


export const  connection = mysql.createPool({
    connectionLimit : 10,
    acquireTimeout  : 10000,
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
  });