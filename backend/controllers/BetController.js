import { data } from "../config/db.js"

const Mathematics = async({playerPrediction, positionID, bank}) => {
    let status = 'OK'
    const myBank = parseInt(bank)
    const myPositionID = parseInt(positionID)
    const myPlayerPrediction = parseFloat(playerPrediction)
    if(playerPrediction >= 1 || playerPrediction < 0) return {passive : null, status : "Player Prediction Error"}
    if (!myPlayerPrediction || isNaN(myPlayerPrediction)) return  {passive : null, status : "NaN"}
    const myCoefficient = await data.promise().query("SELECT  Positions.coefficient FROM Positions WHERE id=?", [myPositionID])
    if(!myCoefficient) return {passive : null, status : undefined}
    // res.send(myCoefficient[0][0])    
    const passive_1 = parseInt(((myCoefficient[0][0].coefficient * myPlayerPrediction - 1) / (myCoefficient[0][0].coefficient - 1)* myBank))
    const passive_2 = parseInt((((myCoefficient[0][0].coefficient - 0.01) * myPlayerPrediction - 1) / ((myCoefficient[0][0].coefficient - 0.01) - 1) * myBank))
    const passive = parseInt(passive_2 + ((passive_1 - passive_2) * 0.7))
    // if(passive < myBank ) return res.send({passive:"Too Risky Bet"}) 
    if(passive < myBank * 0.04) status = "Too Risky Bet"
    else if (passive > myBank * 0.1) status = 'Select More Games'
    return {
        passive,
        status
    }
}

const MathematicsList = async({playerPrediction, coefficient, bank}) => {
    let status = 'OK'
    const myBank = parseInt(bank)
    const myCoefficient = parseFloat(coefficient)
    const myPlayerPrediction = parseFloat(playerPrediction)
    if(!myCoefficient) return {passive : null, status : undefined}
    if(playerPrediction >= 1 || playerPrediction < 0) return {passive : null, status : "Player Prediction Error"}
    if (!myPlayerPrediction || isNaN(myPlayerPrediction)) return  {passive : null, status : "NaN"}
    // res.send(myCoefficient)    
    const passive_1 = parseInt(((myCoefficient * myPlayerPrediction - 1) / (myCoefficient - 1)* myBank))
    const passive_2 = parseInt((((myCoefficient - 0.01) * myPlayerPrediction - 1) / ((myCoefficient - 0.01) - 1) * myBank))
    const passive = parseInt(passive_2 + ((passive_1 - passive_2) * 0.7))
    // if(passive < myBank ) return res.send({passive:"Too Risky Bet"}) 
    if(passive < myBank * 0.04) status = "Too Risky Bet"
    else if (passive > myBank * 0.1) status = 'Select More Games'
    return {
        passive,
        status
    }
}


export const  selectedPredictions = async(req, res) => {
    try {
        const {playerPrediction, positionIDs, bank} = req.body 
        if(!positionIDs || !Array.isArray(positionIDs) || positionIDs.length < 1)  return res.status(404).send("Position ID's cannot be empty")
        // const possiveList = await Mathematics(playerPrediction, 4, 20000)
        // const possiveList =  await Mathematics({playerPrediction, positionID:4, bank})
        const Positions = (await data.promise().query("SELECT * FROM Positions WHERE id IN (?)", [[...positionIDs]]))[0]
        // console.log(Positions)
        const ResPromise = new Promise(async function(resolve, reject) {
            const results = []
            await Positions.map(async(position) => { 
                try {
                    const {passive, status} = await MathematicsList({playerPrediction, coefficient:position.coefficient, bank})
                    results.push({passive, status})   
                } catch (error) {
                    res.status(400).send(error.message)
                }
            })
            resolve(results)
        }).then((results) => res.send(results))
     
    } catch (error) {
        res.status(400).send(error.message)
    }
}


export const Prediction = async(req, res) => {
    try {
        const {playerPrediction, positionID, bank} = req.body
        const {passive, status} = await Mathematics({playerPrediction, positionID, bank})
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