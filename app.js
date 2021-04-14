function add(a, b){
    return a + b
}

function subtract(a, b){
    return a - b
}

function multiply(a, b){
    return a * b
}

function divide(a, b){
    return a / b
}

//handle arithmetic
function operate(op, a=0, b=0){
    switch (op){
        case '+':
            return add(a,b)
        case '-':
            return subtract(a,b)
        case '*':
            return multiply(a,b)
        case '/':
            return divide(a,b)
    }
}

//store numbers
let currNum = '';
let pastNum = '';
//store if number turns into float
let isDecimal = false
//store future operation
let operator = ''
//check if user wants to perform an op
let isOperating = false
//store memory
let memory = ''
//check if memory is a float
let isMemoryDecimal = false;

//adding numbers to the input
function handleNums(e, num = 0){
    if (currNum.length > 40){
        currNum = currNum.substr(-50, 50)
    }
    //in case an argument is passed
    if (num && !isDecimal){
        currNum = num
        opDisplay.value = currNum + '.'
        return
    }
    if (num && isDecimal){
        currNum = num
        opDisplay.value = currNum
        return
    }
    //check if number is decimal
    if (isDecimal){
        currNum += this.dataset.value
        opDisplay.value = currNum
        return;
    }
    //add each number to the currently saved number as string
    currNum += this.dataset.value;
    opDisplay.value = currNum + '.'

}

//calls operate and handles float conversion
function handleOperations(key){
    //auxiliary number storage
    let tempNum = ''
    switch (key){
        case '.':
            isDecimal = true
            currNum = opDisplay.value
            break
        case 'opposite':
            if (currNum.indexOf('-') > -1){
                tempNum = currNum.slice(1)
            } else {
                tempNum = '-' + currNum
                if (tempNum === '-'){
                  tempNum = '-0'
                }
            }
            handleNums(null, tempNum)
            break
    }
}

function handleDelete(key){
    let temp = '';
    if (key === 'back') {
        const deletedVal = currNum.substr(-1,1)
        currNum = currNum.slice(0, -1)
        //this line prevents the decimal point from being deleted
        opDisplay.value = (isDecimal) ? currNum : currNum + '.'
        //checks to see if deleted value was decimal point
        if (deletedVal === '.'){
            isDecimal = false
            //calls handle nums to 
            handleNums(null, currNum)
        } else if (!currNum){
            //if we delete all numbers, set display to 0
            opDisplay.value = '0.'
        }
    } else if (key === 'all'){
        isOperating = false
        pastNum = ''
        currNum = ''
        isDecimal = false
        opDisplay.value = '0.'
    } else {
        currNum = ''
        opDisplay.value = '0.'
        isDecimal = false
    }
}

//saves numbers to memory
function handleMemory(key){
    switch (key){
        case 'clear':
            isMemoryDecimal = false
            memory = ''
            break;
        case 'recall':
            if (!memory) return;
            else if (isMemoryDecimal){
                isDecimal = true
            }
            handleNums(null, memory)
            break;
        case 'save':
            memory = currNum
            if (memory.indexOf('.') > -1){
                isMemoryDecimal = true
            }
            break
        case 'sum':
            memory = parseFloat(memory) + parseFloat(opDisplay.value)
            memory = memory.toString()
            break
    }
    //display memory indicator or delete it
    if (!memory) memDisplay.value = ''
    else memDisplay.value = 'M'
}

//single number operations
function handleSpecial(key){
    switch (key){
        case 'sqrt':
            currNum = Math.sqrt(parseFloat(currNum)).toString()
            if (currNum.indexOf('.') > -1) isDecimal = true
            handleNums(null, currNum)
            break
        case '%':
            currNum = (currNum / 100).toString()
            isDecimal = true
            handleNums(null, currNum)
            break
        case '1x':
            currNum = (1 / currNum).toString()
            isDecimal = true
            handleNums(null, currNum)
    }
}

function handleArithmetic(key){
    if (isOperating) {
        currNum = operate(operator, parseFloat(pastNum), parseFloat(currNum)).toString()
        if (currNum.includes('.') && currNum.split('.')[1].length > 5) currNum = parseFloat(currNum).toFixed(5).toString()
        handleNums(null, currNum)
    }
    operator = key
    pastNum = currNum
    isOperating = true
    currNum = ''
    //small trick to keep results if you click equal but keep operating
    if (key === '='){
        isOperating = false
        currNum = opDisplay.value
    }
}

//select number buttons
const numBtns = document.querySelectorAll('button[data-value]')
numBtns.forEach(btn => btn.addEventListener('click', handleNums))

//select operations display
const opDisplay = document.querySelector('#operations');

//select operation buttons
const opBtns = document.querySelectorAll('button[data-operation]')
opBtns.forEach(btn => btn.addEventListener('click', e => handleOperations(e.target.dataset.operation)))

//select arithmetic buttons
const arBtns = document.querySelectorAll('button[data-arithmetic]')
arBtns.forEach(btn => btn.addEventListener('click', e => handleArithmetic(e.target.dataset.arithmetic)))

//select special buttons
const spBtns = document.querySelectorAll('button[data-special]')
spBtns.forEach(btn => btn.addEventListener('click', e => handleSpecial(e.target.dataset.special)))

//select delete buttons
const delBtns = document.querySelectorAll('button[data-del]')
delBtns.forEach(btn => btn.addEventListener('click', (e) => handleDelete(e.target.dataset.del)))

//select memory buttons
const memBtns = document.querySelectorAll('button[data-memory]')
memBtns.forEach(btn => btn.addEventListener('click', (e) => handleMemory(e.target.dataset.memory)))

//select memory display
const memDisplay = document.querySelector('#m-field')

window.addEventListener('keydown', e => {
    console.log(e.key)
    if (!isNaN(e.key)){
        const currBtn = document.querySelector(`button[data-value="${e.key}"`)
        handleNums.call({dataset: {value: e.key}})
        currBtn.focus()
    } else if (["-", "+", "/", "*"].includes(e.key)){
        const currBtn = document.querySelector(`button[data-arithmetic="${e.key}"`)
        handleArithmetic.call(null, e.key)
        currBtn.focus()
    } else if (e.key === "Backspace"){
        handleDelete("back")
    } else if (e.key === "Enter"){
        handleArithmetic("=")
    }
})

function unfocusKeys(){
    const allBtns = document.querySelectorAll('button')
    allBtns.forEach(btn => btn.blur())
}

window.addEventListener('keyup', unfocusKeys)
window.addEventListener('mouseup', unfocusKeys)
