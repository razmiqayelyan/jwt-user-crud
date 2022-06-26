import {getPositions, getResults, resultsSum, getOptimals, setCount, savePredictions} from './Functions/Prediction.js'


// route: ___/api/bet
// method: POST
export const  Predictions = async(req, res) => {
    try {
        let {positionIDs, bank, firstResponse} = req.body
        positionIDs = [...new Set(positionIDs)]
        bank = parseInt(bank)
        if(!positionIDs || !Array.isArray(positionIDs) || positionIDs.length < 1)  return res.status(404).send("Position ID's cannot be empty")
        if(firstResponse && positionIDs.length < 11)  return res.status(404).send("Minimum 11 Position ID's")
        const Positions = await getPositions({positionIDs})
        new Promise(async(resolve, reject) => {
            const results = await getResults({Positions, bank})
            results.length > 0? resolve(results): res.status(404).end()})
              .then((results) => {
                        const acc = resultsSum({results})
                        const optimals = getOptimals({results, bank, acc})
                        return optimals})
              .then((optimals) => {
                return optimals.map((optional) => setCount({bank, optional}))
              }).then((optimals) => savePredictions({optimals, user:req.user, positionIDs}))
              .then((optimals) => res.send(optimals))
    } catch (error) {
        res.status(400).send(error.message)
    }
}