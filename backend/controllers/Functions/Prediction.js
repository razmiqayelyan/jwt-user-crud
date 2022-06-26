import { connection } from "../../config/db.js"


export const setCount = ({bank, optional}) => {
        if(bank * 0.2 < optional.optional) return ({...optional, status:"Add More Games", count:5})
        else if (bank * 0.13 < optional.optimal) return ({...optional, status:"Add More Games", count:3})
        else if (bank * 0.1 < optional.optimal) return ({...optional, status:"Add More Games", count:1})
        else{ 
             return ({...optional, status:"OK", count:0})
        } 
} 

export const intParser = ({analitics_prediction=0, coefficient=0, bank=0}) => {
    const myBank = parseInt(bank)
    const myCoefficient = parseFloat(coefficient)
    const myAnalitics_prediction = parseFloat(analitics_prediction)
    return {
        myBank,
        myCoefficient,
        myAnalitics_prediction
    }
}



export const MathValidator = ({myAnalitics_prediction, myCoefficient}) => {
    if (!myAnalitics_prediction || isNaN(myAnalitics_prediction)) return  {passive : null, status : "NaN"}
    else if(myAnalitics_prediction >= 1 || myAnalitics_prediction < 0 || !myCoefficient) return {passive : null, status : undefined}
}



export const MathematicsList = async({analitics_prediction, coefficient, bank}) => {

    const  { myBank, myCoefficient, myAnalitics_prediction } = intParser({analitics_prediction, coefficient, bank})
    const validated = MathValidator({myAnalitics_prediction, myCoefficient})
    if(validated) return
    const passive_1 = parseInt(((myCoefficient * myAnalitics_prediction - 1) / (myCoefficient - 1)* myBank))
    const passive_2 = parseInt((((myCoefficient - 0.01) * myAnalitics_prediction - 1) / ((myCoefficient - 0.01) - 1) * myBank))
    const passive = parseInt(passive_2 + ((passive_1 - passive_2) * 0.7))
    return {passive}
}



export const savePredictions = async({optimals, user}) => {
    const moreGames = optimals.filter((optimal) => optimal.status !== 'OK' && optimal.count !== 0)
    if(!moreGames || moreGames.length < 1) await console.log(optimals, user)
    return optimals
}




export const getPositions = async({positionIDs}) => {
    const Positions = await connection.promise().query("SELECT * FROM Positions WHERE id IN (?)", [[...positionIDs]])
    return Positions[0]
}



export const getResults = async({Positions, bank}) => {
     const results = []
            await Positions.map(async(position) => { 
                try {
                    const {passive, status} = await MathematicsList({analitics_prediction:position.analitics_prediction, coefficient:position.coefficient, bank})
                    results.push({passive, status})   
                } catch (error) {
                    return 
                }
            })
    return results
}




export const resultsSum = ({results}) => {
    const acc = results.reduce((acc, elem) => {
        if(!isNaN(elem.passive)){
            acc += parseInt(elem.passive)
        }
        return acc
}, 0)
    return acc
}



export const getOptimals = ({results, bank, acc}) => {
    const optimals = results.map((el) => ({optimal:parseInt(((parseInt(bank) / acc) * el.passive)) ,...el}))
    return optimals
}




