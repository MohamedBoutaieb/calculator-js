const operators = ['*', '/', '+', '-'];

function add(a, b) {
    return a + b;
}
function substract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}
function operate(a, b, operator) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return substract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
    }
}
// this functions replace an operator and its two operands with the result inside the expression table
// example  reduceExpression('*',[ 5, * , 6 ,-, 10 ]) returns [30, - , 10]
function reduceExpression(operator, terms) {
    while (terms.includes(operator)) {
        let index = terms.indexOf(operator);
        let result = operate(parseFloat(terms[index - 1]), parseFloat(terms[index + 1]), operator);
        terms.splice(terms.indexOf(operator) - 1, 3, result);
    }
    return terms;
}
function evaluateExpression(str) {
    // transforming the mathematical expression to an array containing the sequence of operands and operators
    let terms = str.split(" ");
    // operating * and / first as the have the priority
    for (let i = 0; i < 2; i++) {
        reduceExpression(operators[i], terms);
    }
    // operating the rest of the expression with left to right order
    for (let i = 0; i < operators.length; i++) {
        if (terms[i] == '-' || terms[i] == '+') {
            if (i == 0) {
                let result = operate(0, parseFloat(terms[i + 1]), terms[i]);
                terms.splice(i, 2, result);
            }
            else {
                let result = operate(parseFloat(terms[i - 1]), parseFloat(terms[i + 1]), terms[i]);
                terms.splice(i - 1, 3, result);
            }
            i--;
        }

    }
    // if the result is Nan then something was wrong with the input
    if (!parseInt(terms[0]))
        return 'Error!';
    //choose whether to display the result as int or float according to its value
    if (parseFloat(terms[0]).toFixed(3) == parseInt(terms[0])) {
        return parseInt(terms[0]);
    }
    dot.disabled = true;
    return parseFloat(terms[0]).toFixed(3);

}
let input = document.querySelector("input")
let buttons = document.querySelectorAll("button")
let dot = document.querySelector(".dot")

//what happens when you click a button
function buttonClick(event) {

    if (input.value == "Error!" || input.value == "Infinity") {
        input.value = "";
    }
    //deleting last element in operation ( if it's and operator we need to delete additional spaces)
    if (event.target.innerText == "C") {
        if (input.value[input.value.length - 1] == " ") {
            input.value = input.value.substring(0, input.value.length - 3);
        }
        else {
            input.value = input.value.substring(0, input.value.length - 1);
        }
    }
    else if (event.target.innerText == "Clear") {
        input.value = ""
    }
    // making the operation happen
    else if (event.target.innerText == "=") {
        input.value = evaluateExpression(input.value)
    }
    else {
        // additional spaces are added if we input an operator to facilitate experession.split later
        if (operators.includes(event.target.innerText)) {
            if (input.value != '') {
                input.value += " "
            }
            input.value += event.target.innerText + " "
            // enabling the dot after each operator
            dot.disabled = false
        }
        // disabling the 
        else {
            input.value += event.target.innerText
            // using the dot one time per operand
            if (event.target.innerText == '.') {
                event.target.disabled = true
            }
        }
    }

}
// adding the evnet listener for all buttons
buttons.forEach(btn => btn.addEventListener('click', buttonClick))

// some optimisations for the keyboard mode (automatic spaces are added before and after operators) 
// (getting the result by enter or = button
input.addEventListener('keypress', (e)=>{

    if (operators.includes(e.key))
        input.value +=" "
    if(e.key == '=' || e.key == "Enter"){
        input.value =evaluateExpression(input.value)
    }
}
)
input.addEventListener('keyup', (e)=>{
    if (operators.includes(e.key))
        input.value +=" "
}
)
