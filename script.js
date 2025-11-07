const result = document.getElementById("MyResult");
const buttons = document.querySelectorAll(".buttons button");
const errorMsg = document.getElementById("errorMsg");

let expression = "";

// Update display
function updateDisplay() {
  result.value = expression || "0";
}

// Clear all
function clearAll() {
  expression = "";
  updateDisplay();
  errorMsg.textContent = "";
}

// Backspace (delete last char)
function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
  errorMsg.textContent = "";
}

// Add char to expression with validation
function addChar(char) {
  // Prevent multiple operators in a row (except parentheses and dot)
  const operators = ['+', '-', '*', '/', '%'];
  const lastChar = expression.slice(-1);

  if (operators.includes(char)) {
    if (expression === "" && char !== '-') {
      // Don't allow operator at start except minus for negative number
      return;
    }
    if (operators.includes(lastChar)) {
      // Replace last operator with new one
      expression = expression.slice(0, -1);
    }
  }

  if (char === '.') {
    // Prevent multiple dots in a number segment
    const parts = expression.split(/[\+\-\*\/\%\(\)]/);
    const lastPart = parts[parts.length -1];
    if (lastPart.includes('.')) return;
  }

  expression += char;
  updateDisplay();
  errorMsg.textContent = "";
}

// Calculate answer safely
function calculate() {
  try {
    if (expression === "") return;

    // Replace % with /100 for percentage
    let exp = expression.replace(/%/g, "/100");

    // eslint-disable-next-line no-eval
    let evalResult = eval(exp);

    if (evalResult === undefined) {
      errorMsg.textContent = "Invalid Expression";
      return;
    }

    expression = evalResult.toString();
    updateDisplay();
    errorMsg.textContent = "";
  } catch {
    errorMsg.textContent = "Invalid Expression";
  }
}

// Button clicks
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const val = button.getAttribute("data-value");

    if (button.id === "clear") {
      clearAll();
    } else if (button.id === "backspace") {
      backspace();
    } else if (button.id === "equal") {
      calculate();
    } else if (val !== null) {
      addChar(val);
    }
  });
});

// Keyboard support
document.addEventListener("keydown", e => {
  if (
    (e.key >= '0' && e.key <= '9') ||
    ['+', '-', '*', '/', '(', ')', '.', '%'].includes(e.key)
  ) {
    e.preventDefault();
    addChar(e.key);
  } else if (e.key === "Enter") {
    e.preventDefault();
    calculate();
  } else if (e.key === "Backspace") {
    e.preventDefault();
    backspace();
  } else if (e.key === "Escape") {
    e.preventDefault();
    clearAll();
  }
});

updateDisplay();
