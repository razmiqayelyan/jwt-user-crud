import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import {connection} from './config/db.js';
import * as url from 'url';
import cron from "node-cron";
import schedule from 'node-schedule';
import CoinGecko from "coingecko-api";
import {UserRouter} from "./Routes/UserRouter.js"
import { BetRouter } from './Routes/BetRouter.js';


const app = express()


app.use(cors({origin: process.env.ORGIN || 'http://127.0.0.1:3001'}))
app.use(express.json())
app.use(express.urlencoded({extended: false}));




app.use("/api/user", UserRouter)
app.use("/api/bet", BetRouter)



const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));





app.listen(process.env.PORT || 3000, (ok, err) =>{
        if(err) connection.end();
    })
  

































// const sceduling_every_hour = schedule.scheduleJob("0 0 * * * *", function() {
    
// })

// const sceduling_every_day = schedule.scheduleJob("0 0 12 * * *", function() {
    
// })
// const sceduling_every_10_minute = schedule.scheduleJob("*/10 * * * *", function() {
    
// })
// const sceduling_every_30_minute = schedule.scheduleJob("*/30 * * * *", function() {
    
// })




// app.get('/', async(req, res) => {
//     const CoinGeckoClient = new CoinGecko();
//     const {data} = await CoinGeckoClient.coins.all();
//     await data.map(async(each) => await connection.promise().query("INSERT INTO `currency` (`name_id`, `symbol`, `name`) VALUES (?, ?, ?)", [each.id, each.symbol, each.name]))
//     res.send('Success')
// })

