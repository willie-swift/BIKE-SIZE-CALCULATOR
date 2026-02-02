// learn more about object keys lines 21-53 add more text so that it resembles the emails i send with bike input 
// also need to do the css for this, make inputs more readable 
// and eventually write a function so when you hit the enter key it will focus on the next input 
// css for site, proabably not that much, maybe reiterate the ideal stack and reach in the results
const    frameModel = document.getElementById("frame-model")
const    frameSize = document.getElementById("frame-size")
const    idealReach = document.getElementById("ideal-reach")
const    idealStack = document.getElementById("ideal-stack")
const    frameReach = document.getElementById("frame-reach")
const   frameStack = document.getElementById("frame-stack")
const headTubeAngle = document.getElementById("headtube-angle")
const     stemAngle = document.getElementById("stem-angle")
const    stemLength = document.getElementById("stem-length")
const    stemHeight = document.getElementById("stem-height")
const  spacerHeight = document.getElementById("spacer-height")
const calcBtn = document.getElementById("calc-btn")
const saveBtn = document.getElementById("save-btn")
const clearBtn = document.getElementById("clear-btn")
const clearAllBtn = document.getElementById("clear-all-btn")
const results = document.getElementById("results")
const comparison = document.getElementById("comparison")
const savedInputs = document.getElementById("saved-results")
let hbXY = []
let savedResults = []
let savedResultsFromLocalStorage = JSON.parse(localStorage.getItem("saved-results"))
let hbXYFromLocalStorage = JSON.parse(localStorage.getItem("hbXY"))
const STORAGE_KEY = "bikeFitInputs"

document.addEventListener("DOMContentLoaded",function() {
    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ||{}
    Object.keys(savedData).forEach(function(key) {
        const input = document.getElementById(key)
        if (input) {
            input.value = savedData[key]
        }
    })
})

const inputs = document.querySelectorAll("input")

inputs.forEach(function(input) {
    input.addEventListener("input",function(){
        const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY))||{}
        currentData[input.id]= input.value
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(currentData)
        )
    })
})
if (hbXYFromLocalStorage){
    hbXY = hbXYFromLocalStorage
      if (hbXY[0] && hbXY[1]){
        results.innerHTML = `HB X = ${hbXY[0]}, HB Z = ${hbXY[1]} `
        if (idealReach.value && idealStack.value){
            comparison.innerHTML = localStorage.getItem("result-text")    
        }else {
            comparison.innerHTML = "ENTER IDEAL FIT MEASUREMENTS"
        }
        
    } else {
        results.innerHTML = `HB X = ${hbXY[0]}, HB Z = ${hbXY[1]} `
        comparison.innerHTML = "ENTER COMPLETE FIT MEASUREMENTS"
    }
   
}

if (savedResultsFromLocalStorage) {
    savedResults = savedResultsFromLocalStorage
    renderSave(savedResults)
}



calcBtn.addEventListener("click",function(){
    hbXY = calcHbPosition(frameReach.value, frameStack.value,headTubeAngle.value,
        stemAngle.value, stemLength.value,spacerHeight.value, stemHeight.value)
    localStorage.setItem("hbXY",JSON.stringify(hbXY))

    if (hbXY[0] && hbXY[1]){
        results.innerHTML = `HB X = ${hbXY[0]}, HB Z = ${hbXY[1]} `
        if (idealReach.value && idealStack.value){
            comparison.innerHTML = fitComparison(idealReach.value, idealStack.value, hbXY[0],hbXY[1], frameModel.value, frameSize.value, stemLength.value, stemAngle.value, spacerHeight.value)
        }else {
            comparison.innerHTML = "ENTER IDEAL FIT MEASUREMENTS"
        }
    } else {
        results.innerHTML = `HB X = ${hbXY[0]}, HB Z = ${hbXY[1]} `
        comparison.innerHTML = "ENTER COMPLETE FIT MEASUREMENTS"
    }
})


clearBtn.addEventListener("click",function(){
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem("result-text")
    localStorage.removeItem("hbXY")
    savedResults = []
    window.location.reload()
})
clearAllBtn.addEventListener("click", function(){
    localStorage.clear()
    savedResults = []
    window.location.reload()
})


saveBtn.addEventListener("click", function(){
    if (comparison.innerHTML.length > 31){
        savedResults.push(comparison.innerHTML)
        localStorage.setItem("saved-results",JSON.stringify(savedResults))
        renderSave(savedResults)
    }
    console.log(localStorage.getItem("saved-results"))
})
function calcHbPosition (x,z,h,sa,sl,sh,stH){
    x = parseFloat(x)
    z = parseFloat(z)
    h = parseFloat(h)
    sa = parseFloat(sa)
    sl = parseFloat(sl)
    sh = parseFloat(sh) + (parseFloat(stH)/2)
    let hRadians = h/(180/Math.PI)
    let theta = (90-h)+ sa
    let thetaRadians = theta/(180/Math.PI)
    let zh = z + (sl*Math.sin(thetaRadians))+ (sh*Math.sin(hRadians))
    let xh = x - (sh*Math.cos(hRadians)) + (sl*Math.cos(thetaRadians))
    return [Math.round(xh),Math.round(zh)]
}

function fitComparison (xIdeal, zIdeal, xActual, zActual,model,size,sl,sa,sh){
    let xDiff = parseFloat(xIdeal) - xActual 
    let zDiff = parseFloat(zIdeal) - zActual
    let xResult = ""
    let zResult = ""
    let compareText = `
    <span id = "bike-name">${model} Size: ${size}</span>
    <br>
    <br>
    A ${sl} mm ${sa} degree stem with ${sh} mm of total spacers `
    if (xDiff<0){
        xResult = `would result in a position that has a reach approximately ${Math.abs(xDiff)}mm longer and `
    }
    else if (xDiff > 0){
        xResult = `would result in a position that has a reach approximately ${Math.abs(xDiff)}mm closer and `
    }
    else {
        xResult = `would result in a position that has approximately the same reach and `    
    }
    if (zDiff<0){
        zResult = `and a stack ${Math.abs(zDiff)}mm taller than ideal`
    }
    else if (zDiff > 0){
        zResult = `and a stack ${Math.abs(zDiff)}mm shorter than ideal`
    }
    else {
        zResult = `same stack as ideal`    
    }
    localStorage.setItem("result-text",compareText + xResult + zResult)
    return compareText + xResult + zResult
}



function renderSave(saveArray){
    let htmlList = ""
    for (i = 0; i<saveArray.length; i++){
            htmlList += `
            <li class = "result-list">${saveArray[i]}</li>
        `
        }
        savedInputs.innerHTML = htmlList
        comparison.innerHTML = ""
}




