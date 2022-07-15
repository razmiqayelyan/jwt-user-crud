import { connection } from "../../config/db.js"


// this function for checking optiaml's value and adding status, value in object 
export const setCount = ({bank, optimal}) => {
        if(bank * 0.2 < optimal.optimal) return ({...optimal, status:"Add More Games", count:5})
        else if (bank * 0.13 < optimal.optimal) return ({...optimal, status:"Add More Games", count:3})
        else if (bank * 0.1 < optimal.optimal) return ({...optimal, status:"Add More Games", count:1})
        else{ 
             return ({...optimal, status:"OK", count:0})
        } 
} 

// for parsing strings to integer of float
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


// checking varibles value before parsing, in string only numbers or no
export const MathValidator = ({myAnalitics_prediction, myCoefficient}) => {
    if (!myAnalitics_prediction || isNaN(myAnalitics_prediction)) return  {passive : null, status : "NaN"}
    else if(myAnalitics_prediction >= 1 || myAnalitics_prediction < 0 || !myCoefficient) return {passive : null, status : undefined}
}


// our Passive startegy
export const MathematicsList = async({analitics_prediction, coefficient, bank}) => {

    const  { myBank, myCoefficient, myAnalitics_prediction } = intParser({analitics_prediction, coefficient, bank})
    const validated = MathValidator({myAnalitics_prediction, myCoefficient})
    if(validated) return
    const passive_1 = parseInt(((myCoefficient * myAnalitics_prediction - 1) / (myCoefficient - 1)* myBank))
    const passive_2 = parseInt((((myCoefficient - 0.01) * myAnalitics_prediction - 1) / ((myCoefficient - 0.01) - 1) * myBank))
    const passive = parseInt(passive_2 + ((passive_1 - passive_2) * 0.7))
    return {passive}
}


// this functionality doesnt finished for now, we want to save users strategy after buying
export const savePredictions = async({optimals, user}) => {
    const moreGames = optimals.filter((optimal) => optimal.status !== 'OK' && optimal.count !== 0)
    if(!moreGames || moreGames.length < 1) await console.log(optimals, user)
    return optimals
}



// request to SQL db for data
export const getPositions = async({positionIDs}) => {
    const Positions = await connection.promise().query("SELECT * FROM Positions WHERE id IN (?)", [[...positionIDs]])
    return Positions[0]
}


// map all Positions and call MathematicsList function for each position
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



// get Sum of all Positions Results, for getting status and status in setCount function 
export const resultsSum = ({results}) => {
    const acc = results.reduce((acc, elem) => {
        if(!isNaN(elem.passive)){
            acc += parseInt(elem.passive)
        }
        return acc
}, 0)
    return acc
}


// get Optimal for each Position
export const getOptimals = ({results, bank, acc}) => {
    const optimals = results.map((el) => ({optimal:parseInt(((parseInt(bank) / acc) * el.passive)) ,...el}))
    return optimals
}