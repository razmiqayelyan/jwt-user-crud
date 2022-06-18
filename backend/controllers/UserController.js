import { connection } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getNewPass, sendEmailtoUser, verifyPassword } from "./EmailSendler.js";

export const verifyToken = async(req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const {uuid} = await jwt.verify(token, process.env.SECRET);
      if(!uuid) return res.status(401).send("Invalid Token"); 
      const user = await connection.promise().query("SELECT Users.uuid,Users.username, Users.email, Users.full_name, Users.phone FROM Users WHERE uuid=?", [uuid])
      req.user = user[0][0];
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };

export const userData = (req, res, next) => {
    try {
        if(!req.user) return res.status(403).send("USER NOT FOUND")
        res.send({user: req.user})
    } catch (error) {
        res.status(403).send(error.message)
    }
}


export const loginUser = async(req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await connection.promise().query("SELECT  Users.username, Users.uuid, Users.email, Users.full_name, Users.phone, Users.password FROM Users WHERE username=?", [username])
        if(!user[0].length) return res.status(403).send("Uncorrect Data")
        const {password:myPassword, uuid} = user[0][0] 
        const matching = await bcrypt.compare(password, myPassword)
        if(!matching) return res.status(403).send("Uncorrect Data")
        const token = await jwt.sign({uuid}, process.env.SECRET, { expiresIn: process.env.TOKEN_DATE })
        const {email, username:myUsername, full_name, phone } = user[0][0]
        res.user = {email, myUsername, full_name, phone}
        res.send({uuid, token ,email, myUsername, full_name, phone})
       
    } catch (error) {
        res.status(403).send(error.message)
    }
}

export const verifyEmail = async(req, res) => {
    try {
     
        const {email, username, uuid} = req.user
        const myUser = await connection.promise().query("SELECT  Users.confirmed, Users.link FROM Users WHERE uuid=?", [uuid])
        if(!myUser[0][0].confirmed || !myUser[0][0].link) return res.status(403).send("User Not Found")
        else if(myUser[0][0].confirmed !== 'false') return res.status(403).send("Email Already Confirmed")
        sendEmailtoUser(myUser[0][0].link, email, username)
        res.send({message:"Email Sended Successfully"})
        
    } catch (error) {
        res.status(400).send(error.message)
    }
}

export const registerUser =  async(req, res, next) => {
    try {
        const {username, email, password, full_name, phone} = req.body
        if(!username || !email || !password) res.status(400).send("Please Fill all Fields")
        const userPass = await bcrypt.hash(password, 10)
        const uuid = await bcrypt.hash(username, 10)
        const link = `${Math.random()*10}${uuid.split('/')[0]}`
        if(!uuid)res.status(400).send("Please try again")
        const token = await jwt.sign({uuid}, process.env.SECRET, { expiresIn: process.env.TOKEN_DATE })
        const response = await connection.promise().query("INSERT INTO Users (uuid, email, username, full_name, password, link, phone) VALUES (?, ? ,? ,?, ?, ? ,? )", [uuid, email, username, full_name? full_name:"NULL", userPass, link, phone?phone:"NULL"])
        // const response = await connection.promise().query("SELECT Users.username, Friends.friend FROM Users INNER JOIN Friends ON Friends.username=Users.username WHERE Friends.friend='razmiqayelyan'")   
        sendEmailtoUser(link, email, username)
        res.send({
            uuid, email, username, full_name:full_name? full_name:"NULL", phone:phone?phone:"NULL", token
        });
    } catch (error) {
        res.status(400).send(error.message)
    }    
}

export const putUser =  async(req, res, next) => {
    try {
        const {id} = req.params
        const user = req.user
        if(!user) return res.status(403).send("User Not Found")


        if(id==='password'){
        const {password, newPassword} = req.body
        if(password === newPassword) return res.status(404).send("SAME PASSWORDS")
        if(!password || !newPassword) return res.status(403).send("Please Fill All Fields")
        const myUser = await connection.promise().query("SELECT  Users.password FROM Users WHERE uuid=?", [user.uuid])
        if(!myUser[0][0].password) return res.status(403).send("User Not Found")
        const same = await bcrypt.compare(password, myUser[0][0].password)
        if(!same) return res.status(403).send("Password is not correct")
        const myNewPassword = await bcrypt.hash(newPassword, 10)
        const response = await connection.promise().query("UPDATE Users SET password = ? WHERE Users.uuid = ?;", [myNewPassword, user.uuid])
        return res.send(`${user.username} INFO UPDATED`);
        }


        else if(id==="username"){
            const {newUsername} = req.body
            if(!newUsername) return res.status(404).send("FILL FIELD USERNAME")
            if(user.username === newUsername) return res.status(404).send("SAME USERNAME")
            const isExist = await connection.promise().query("SELECT * FROM Users WHERE username=?", [newUsername])
            if(isExist[0][0]) return res.status(404).send("THIS USERNAME IS EXIST")
            const response = await connection.promise().query("UPDATE Users SET username = ? WHERE Users.uuid = ?;", [newUsername, user.uuid])
            return res.send({username:newUsername})
           
        }



        else if(id==="email"){
            const {newEmail} = req.body
            if(!newEmail) return res.status(404).send("FILL FIELD EMAIL")
            if(user.email === newEmail) return res.status(404).send("SAME EMAIL")
            const isExist = await connection.promise().query("SELECT * FROM Users WHERE email=?", [newEmail])
            if(isExist[0][0]) return res.status(404).send("THIS EMAIL IS EXIST")
            const response = await connection.promise().query("UPDATE Users SET email = ?, confirmed = 'false'  WHERE Users.uuid = ?;", [newEmail, user.uuid])
            return res.send({email:newEmail})
        }

        else if(id==="full_name"){
            const {newFull_name} = req.body
            if(!newFull_name) return res.status(404).send("FILL FIELD FULL_NAME")
            if(user.full_name === newFull_name) return res.status(404).send("SAME FULL_NAME")
            const response = await connection.promise().query("UPDATE Users SET full_name = ? WHERE Users.uuid = ?;", [newFull_name, user.uuid])
            return res.send({full_name:newFull_name})
        }

        else if(id==="phone"){
            const {newPhone} = req.body
            if(!newPhone) return res.status(404).send("FILL FIELD PHONE")
            if(user.phone === newPhone) return res.status(404).send("SAME PHONE")
            const response = await connection.promise().query("UPDATE Users SET phone = ? WHERE Users.uuid = ?;", [newPhone, user.uuid])
            return res.send({phone:newPhone})
        }

        else{
            return res.status(404).send("URL NOT FOUND")
        }



    } catch (error) {
        res.status(400).send(error.message)
    }
}

export const deleteUser =  async(req, res, next) => {
    try {
        const {password} = req.body
        const user = req.user
        if(!user) return res.status(403).send("Not Authorized")

        const isExist = await connection.promise().query("SELECT Users.password FROM Users WHERE uuid=?", [user.uuid])
        if(isExist[0][0] && await bcrypt.compare(password ,isExist[0][0].password)){

        const response = await connection.promise().query("DELETE FROM Users WHERE Users.uuid = ?", [user.uuid])
        res.send(`DELETED : ${JSON.stringify(user)}`);
        }else{
            res.status(404).send("UNCORRECT DATA")
        }        
    } catch (error) {
        res.status(404).send(error.message)
    }
}



export const confirmUser = async(req, res, next) => {
    try {
        const {id} = req.params
        if(!id) return res.status(403).send("ID NOT FOUND")
        const response = await connection.promise().query("UPDATE Users SET confirmed = 'true' WHERE Users.link = ?;", [id])
        if(response[0].info.includes("Changed: 0")) return res.status(404).send("Uncorrect Confirmation Link")

        res.send({confirmed:true})
    } catch (error) {
        res.status(400).send(error.message)
    }
}

export const resetPass = async(req, res, next) => {
    try {
        const {username} = req.body
        if(!username) return res.status(403).send("Enter Username for Reset Password")
        const link = Math.random().toString().split('.')[1] + Date.now()
        const response = await connection.promise().query("UPDATE Users SET link = ? WHERE Users.username = ?;", [link ,username])
        if(response[0].info.includes("Changed: 0")) return res.status(404).send("Uncorrect Username")
        const isExist = await connection.promise().query("SELECT Users.email, Users.confirmed FROM Users WHERE username=?", [username])
        if(!isExist[0][0] || isExist[0][0].confirmed !== 'true') return res.status(403).send("Email Not Found")
        verifyPassword(link, isExist[0][0].email, username)
        setTimeout(async() => {
            const response = await connection.promise().query("UPDATE Users SET link = ? WHERE Users.username = ?;", ["NULL" ,username])
        }, 1000*600)
        res.send("Email Sended Successfully")
    } catch (error) {  
        res.status(404).send(error.message)
        
    }
}

export const resetByEmail = async(req, res, next) => {
    try {
        const {link} = req.params
        if(!link) return res.status(403).send("LINK NOT FOUND")
        const isExist = await connection.promise().query("SELECT Users.username, Users.email, Users.confirmed FROM Users WHERE link=?", [link])
        if(!isExist[0][0] || isExist[0][0].confirmed !== 'true') return res.status(403).send("INVALID LINK")
        const newPass = Math.random().toString()
        const newPassHashed = await bcrypt.hash(newPass, 10)
        const response = await connection.promise().query("UPDATE Users SET password = ? WHERE Users.username = ?;", [ newPassHashed,isExist[0][0].username])
        getNewPass(isExist[0][0].email,  isExist[0][0].username, newPass)
        setTimeout(async() => {
            const response = await connection.promise().query("UPDATE Users SET link = ? WHERE Users.username = ?;", ["NULL" ,isExist[0][0].username])
        }, 5000)
        res.send(newPass)
    } catch (error) {
        res.status(400).send(error.message)
    }
}