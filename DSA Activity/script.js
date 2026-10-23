
const form = document.getElementById("converterForm");
const expressionInput = document.getElementById("expression");
const results = document.getElementById("results");
const errorMessage = document.getElementById("errorMessage");
const infixResult = document.getElementById("infixResult");
const postfixResult = document.getElementById("postfixResult");
const stepsBody = document.getElementById("stepsBody");
const stepCount = document.getElementById("stepCount");

const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3
};

function isOperator(ch) {
    return Object.prototype.hasOwnProperty.call(precedence, ch);
}

function isOperand(ch) {
    return /^[a-zA-Z0-9]$/.test(ch);
}

function convertInfixToPostfix(infix) {
    const stack = [];
    const output = [];
    const steps = [];
    const symbols = [...infix];

    function saveStep(symbol) {
        steps.push({
            number: steps.length + 1,
            symbol: symbol,
            stack: stack.length ? stack.join("") : "Empty",
            output: output.join("") || "—"
        });
    }

    for (const ch of symbols) {
        if (/\s/.test(ch)) {
            continue;
        }

        if (isOperand(ch)) {
            output.push(ch);
        } else if (ch === "(") {
            stack.push(ch);
        } else if (ch === ")") {
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }

            if (!stack.length) {
                throw new Error("Mismatched parentheses: closing ')' has no matching '('.");
            }

            stack.pop();
        } else if (isOperator(ch)) {
            while (stack.length) {
                const top = stack[stack.length - 1];

                if (top === "(") {
                    break;
                }

                const higherPrecedence =
                    precedence[top] > precedence[ch];

                const equalLeftAssociative =
                    precedence[top] === precedence[ch] && ch !== "^";

                if (higherPrecedence || equalLeftAssociative) {
                    output.push(stack.pop());
                } else {
                    break;
                }
            }

            stack.push(ch);
        } else {
            throw new Error(`Invalid character '${ch}'. Use letters, digits, operators and parentheses only.`);
        }

        saveStep(ch);
    }

    if (!steps.length) {
        throw new Error("Please enter an infix expression.");
    }

    while (stack.length) {
        if (stack[stack.length - 1] === "(") {
            throw new Error("Mismatched parentheses: opening '(' has no matching ')'.");
        }

        output.push(stack.pop());
    }

    steps.push({
        number: steps.length + 1,
        symbol: "END",
        stack: "Empty",
        output: output.join("")
    });

    return {
        infix: infix.trim(),
        postfix: output.join(""),
        steps: steps
    };
}

function addCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    row.appendChild(cell);
}

function displayResult(data) {
    infixResult.textContent = data.infix;
    postfixResult.textContent = data.postfix;

    stepsBody.replaceChildren();

    data.steps.forEach((step) => {
        const row = document.createElement("tr");

        addCell(row, String(step.number));
        addCell(row, step.symbol);
        addCell(row, step.stack);
        addCell(row, step.output);

        stepsBody.appendChild(row);
    });

    stepCount.textContent = `${data.steps.length} STEPS`;
    results.hidden = false;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    errorMessage.hidden = true;
    results.hidden = true;

    try {
        const infix = expressionInput.value.trim();
        const data = convertInfixToPostfix(infix);

        displayResult(data);
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.hidden = false;
    }
});

document.querySelectorAll(".example-btn").forEach((button) => {
    button.addEventListener("click", function () {
        expressionInput.value = button.dataset.value;
        form.requestSubmit();
    });
});
