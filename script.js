let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let firstOperand = null;
let secondOperand = null;

function appendNumber(number) {
    currentInput += number;
    display.value = currentInput;
}

function setOperator(op) {
    if (currentInput === '') return; // Prevent setting operator without first operand
    firstOperand = parseFloat(currentInput);
    operator = op;
    currentInput = '';
    display.value = '';
}

function calculate() {
    if (currentInput === '' || firstOperand === null) return; // Prevent calculation without second operand
    secondOperand = parseFloat(currentInput);
    let result;
    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            result = firstOperand / secondOperand;
            break;
        default:
            return;
    }
    display.value = result;
    currentInput = result.toString();
    firstOperand = null;
    secondOperand = null;
    operator = '';
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = '';
    firstOperand = null;
    secondOperand = null;
}