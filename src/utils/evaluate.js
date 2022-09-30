const OPERATORS = {
  GET: (key, content) => content[key],
  EQUALS: (value1, value2) => value1 === value2,
  NOT: (value) => !value,
  AND: (value1, value2) => value1 && value2,
  OR: (value1, value2) => value1 || value2,
  IN: (item, list) => list.includes(item),
}

export function evaluate(expression, content) {
  if (Array.isArray(expression)) {
    // unary operator
    if (expression.length === 2 && OPERATORS[expression[0]]) {
      const operand = evaluate(expression[1], content)
      return OPERATORS[expression[0]](operand, content)
    }

    // binary operator
    if (expression.length === 3 && OPERATORS[expression[1]]) {
      const operand1 = evaluate(expression[0])
      const operand2 = evaluate(expression[2])
      return OPERATORS[expression[1]](operand1, operand2, content)
    }

    // return all items evaluated recursively
    return expression.map((item) => evaluate(item))
  }

  return expression
}
