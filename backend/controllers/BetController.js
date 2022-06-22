import { data } from "../config/db.js"


export const Prediction = async(req, res) => {
    try {
        // const {playerPrediction, positionID, bank} = req.body
        // const myBank = parseInt(bank)
        // const myPositionID = parseInt(positionID)
        // const myPlayerPrediction = parseFloat(playerPrediction)
        // if(playerPrediction >= 1) return res.status(404).send("Player Prediction cannot be grather or equal 1")
        // if (!playerPrediction || isNaN(playerPrediction)) return res.status(400).send("Uncorrect Value for Player Prediction")
        // const myCoefficient = await data.promise().query("SELECT  Positions.coefficient FROM Positions WHERE id=?", [positionID])
        // if(!myCoefficient[0][0]) return res.status(404).send("Coefficient Undefined")
        // // res.send(myCoefficient[0][0])
        // const passive_1 = parseInt(((myCoefficient[0][0].coefficient * parseFloat(playerPrediction) - 1) / (myCoefficient[0][0].coefficient - 1)* parseInt(bank)))
        // const passive_2 = parseInt((((myCoefficient[0][0].coefficient - 0.01) * parseFloat(playerPrediction) - 1) / ((myCoefficient[0][0].coefficient - 0.01) - 1) * parseInt(bank)))
        // const passive = parseInt(passive_2 + ((passive_1 - passive_2) * 0.7))
        // if(passive < parseInt(bank) ) return res.send({passive:"Too Risky Bet"}) 
        // // res.send({passive:parseInt(((passive_2) + ((passive_1 - passive_2) * 0.7)))})

        // // change passive name to passive
        // res.send({passive})   

        const {playerPrediction, positionID, bank} = req.body
        
        let status = 'OK'
        const myBank = parseInt(bank)
        const myPositionID = parseInt(positionID)
        const myPlayerPrediction = parseFloat(playerPrediction)
        if(playerPrediction >= 1) return res.status(404).send("Player Prediction cannot be grather or equal 1")
        if (!playerPrediction || isNaN(playerPrediction)) return res.status(400).send("Uncorrect Value for Player Prediction")
        const myCoefficient = await data.promise().query("SELECT  Positions.coefficient FROM Positions WHERE id=?", [myPositionID])
        if(!myCoefficient[0][0]) return res.status(404).send("Coefficient Undefined")
        // res.send(myCoefficient[0][0])
        const passive_1 = parseInt(((myCoefficient[0][0].coefficient * myPlayerPrediction - 1) / (myCoefficient[0][0].coefficient - 1)* myBank))
        const passive_2 = parseInt((((myCoefficient[0][0].coefficient - 0.01) * myPlayerPrediction - 1) / ((myCoefficient[0][0].coefficient - 0.01) - 1) * myBank))
        const passive = parseInt(passive_2 + ((passive_1 - passive_2) * 0.7))
        // if(passive < myBank ) return res.send({passive:"Too Risky Bet"}) 
        if(passive < myBank * 0.04) status = "Too Risky Bet"
        else if (passive > myBank * 0.1) status = 'Add More Games'
        // res.send({passive:parseInt(((passive_2) + ((passive_1 - passive_2) * 0.7)))})
        // change passive name to passive
        res.send({passive, status})   

    } catch (error) {
        res.status(400).send(error.message)
    }
}
























































// import { connection } from "../config/db.js";


// export const createPosts = async(req, res) => {
//     try {
//         const allowedPermissions = {
//             public:true,
//             private:true,
//             onlyFriends:true
//         }
//         const {username} = req.user
//         const {title, description, image, permission} = req.body
//         if(permission && !allowedPermissions[permission.toLowerCase()])return res.status(400).send("PERMISSION VARIANT NOT FOUND")
//         if(!title) return res.status(400).send("TITLE IS REQUIRED")
//         const addPost =  await connection.promise().query("INSERT INTO `Posts` (username, title, description, image, permission) VALUES (?, ?, ?, ?, ?)", [username, title, description, image, permission?permission:"public"])
//         res.send({
//             username,
//             title,
//             description: description? description:"NULL",
//             image:image?image:"NULL",
//             permission:permission?permission.toLowerCase():"public"
//         })
        
//     } catch (error) {
//         res.status(404).send(error.message)
//     }
// }



// export const getPosts = async(req, res) => {
//     try {
//         const {username} = req.user
//         const posts =  await connection.promise().query("SELECT * FROM Posts WHERE username=?", [username])
//         res.send(posts[0])
        
//     } catch (error) {
//         res.status(404).send(error.message)
//     }
// }


// export const UpdatePosts = async(req, res) => {
//     try {
//         const {username} = req.user
//         const {title, description, image, permission} = req.body
//         const {id} = req.params

//         if(!title && !description && !image && !permission) return  res.status(404).send("FIELDS ARE EMPTY")

//         if(isNaN(id)) return  res.status(404).send("URL NOT FOUND")

//         const initialState =  await connection.promise().query("SELECT * FROM Posts WHERE username=? AND id=? LIMIT 1", [username, id])
//         if(!initialState[0][0]) return  res.status(400).send("POST NOT FOUND")
//         const {title:inititalTitle, description:inititalDescription, image:initialImage, permission:initialPermission} = initialState[0][0]
//         const updated = await connection.promise().query(`UPDATE Posts SET title = ?, description = ?, image = ?, permission = ? WHERE Posts.id = ? AND username = ?`, [title?title:inititalTitle, description?description:inititalDescription, image? image:initialImage, permission?permission:initialPermission, id, username])
//         res.send({
//                 username, 
//                 title:title?title:inititalTitle,
//                 description:description?description:inititalDescription, 
//                 image:image? image:initialImage, 
//                 permission: permission?permission:initialPermission
//    })
        
//     } catch (error) {
//         res.status(404).send(error.message)
//     }
// }