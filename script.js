let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;

const display = document.getElementById('display');

function updateDisplay() {
  display.value = displayValue;
}

function inputDigit(digit) {
  if (displayValue === 'Error') {
    displayValue = '0';
  }

  if (waitingForSecondOperand) {
    displayValue = digit;
    waitingForSecondOperand = false;
  } else {
    displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal() {
  if (displayValue === 'Error') {
    displayValue = '0';
  }

  if (waitingForSecondOperand) {
    displayValue = '0.';
    waitingForSecondOperand = false;
    return;
  }

  if (!displayValue.includes('.')) {
    displayValue = displayValue === '0' ? '0.' : displayValue + '.';
  }
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(displayValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    if (result === 'Error') {
      displayValue = 'Error';
      resetState();
      return;
    }
    displayValue = `${parseFloat(result.toFixed(7))}`;
    firstOperand = result;
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
}

function calculate(first, second, op) {
  if (op === '+') return first + second;
  if (op === '-') return first - second;
  if (op === '*') return first * second;
  if (op === '/') return second === 0 ? 'Error' : first / second;
  return second;
}

function resetState() {
  firstOperand = null;
  waitingForSecondOperand = false;
  operator = null;
}

function resetCalculator() {
  displayValue = '0';
  resetState();
}

document.querySelector('.buttons').addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) return;

  if (target.classList.contains('clear')) {
    resetCalculator();
    updateDisplay();
    return;
  }

  if (target.classList.contains('decimal')) {
    inputDecimal();
    updateDisplay();
    return;
  }

  if (target.classList.contains('operator')) {
    handleOperator(target.dataset.op);
    updateDisplay();
    return;
  }

  if (target.classList.contains('equal')) {
    if (firstOperand !== null && operator) {
      const inputValue = parseFloat(displayValue);
      const result = calculate(firstOperand, inputValue, operator);
      
      if (result === 'Error') {
        displayValue = 'Error';
        resetState();
      } else {
        displayValue = `${parseFloat(result.toFixed(7))}`;
        resetState();
      }
    }
    updateDisplay();
    return;
  }

  inputDigit(target.dataset.value);
  updateDisplay();
});

updateDisplay();