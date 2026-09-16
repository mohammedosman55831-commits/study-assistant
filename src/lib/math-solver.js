// ============================================================
// MATH & TRIGONOMETRY SOLVER MODULE
// ============================================================

/**
 * Format a number cleanly, removing unnecessary trailing decimal zeroes
 * while avoiding JavaScript floating point rounding artifacts.
 */
export function formatNumber(value, maxDecimals = 8) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value);
  }

  // Snap very close to zero or integer to avoid 6.123233995736766e-17
  if (Math.abs(number) < 1e-12) {
    return '0';
  }

  const roundedInt = Math.round(number);
  if (Math.abs(number - roundedInt) < 1e-11) {
    return String(roundedInt);
  }

  // Round to maxDecimals cleanly
  const factor = Math.pow(10, maxDecimals);
  const rounded = Math.round(number * factor) / factor;

  return String(rounded);
}

// ------------------------------------------------------------
// EXACT TRIGONOMETRIC LOOKUP TABLE (for clean degree values)
// ------------------------------------------------------------

const EXACT_DEGREE_VALUES = {
  0: { sin: 0, cos: 1, tan: 0, sinExact: '0', cosExact: '1', tanExact: '0' },
  30: {
    sin: 0.5,
    cos: Math.sqrt(3) / 2,
    tan: 1 / Math.sqrt(3),
    sinExact: '0.5',
    cosExact: 'âˆš3/2 â‰ˆ 0.866',
    tanExact: '1/âˆš3 â‰ˆ 0.577',
  },
  45: {
    sin: Math.SQRT1_2,
    cos: Math.SQRT1_2,
    tan: 1,
    sinExact: 'âˆš2/2 â‰ˆ 0.7071',
    cosExact: 'âˆš2/2 â‰ˆ 0.7071',
    tanExact: '1',
  },
  60: {
    sin: Math.sqrt(3) / 2,
    cos: 0.5,
    tan: Math.sqrt(3),
    sinExact: 'âˆš3/2 â‰ˆ 0.866',
    cosExact: '0.5',
    tanExact: 'âˆš3 â‰ˆ 1.732',
  },
  90: {
    sin: 1,
    cos: 0,
    tan: Infinity,
    sinExact: '1',
    cosExact: '0',
    tanExact: 'undefined',
  },
  120: {
    sin: Math.sqrt(3) / 2,
    cos: -0.5,
    tan: -Math.sqrt(3),
    sinExact: 'âˆš3/2 â‰ˆ 0.866',
    cosExact: '-0.5',
    tanExact: '-âˆš3 â‰ˆ -1.732',
  },
  135: {
    sin: Math.SQRT1_2,
    cos: -Math.SQRT1_2,
    tan: -1,
    sinExact: 'âˆš2/2 â‰ˆ 0.7071',
    cosExact: '-âˆš2/2 â‰ˆ -0.7071',
    tanExact: '-1',
  },
  150: {
    sin: 0.5,
    cos: -Math.sqrt(3) / 2,
    tan: -1 / Math.sqrt(3),
    sinExact: '0.5',
    cosExact: '-âˆš3/2 â‰ˆ -0.866',
    tanExact: '-1/âˆš3 â‰ˆ -0.577',
  },
  180: { sin: 0, cos: -1, tan: 0, sinExact: '0', cosExact: '-1', tanExact: '0' },
  210: {
    sin: -0.5,
    cos: -Math.sqrt(3) / 2,
    tan: 1 / Math.sqrt(3),
    sinExact: '-0.5',
    cosExact: '-âˆš3/2 â‰ˆ -0.866',
    tanExact: '1/âˆš3 â‰ˆ 0.577',
  },
  225: {
    sin: -Math.SQRT1_2,
    cos: -Math.SQRT1_2,
    tan: 1,
    sinExact: '-âˆš2/2 â‰ˆ -0.7071',
    cosExact: '-âˆš2/2 â‰ˆ -0.7071',
    tanExact: '1',
  },
  240: {
    sin: -Math.sqrt(3) / 2,
    cos: -0.5,
    tan: Math.sqrt(3),
    sinExact: '-âˆš3/2 â‰ˆ -0.866',
    cosExact: '-0.5',
    tanExact: 'âˆš3 â‰ˆ 1.732',
  },
  270: {
    sin: -1,
    cos: 0,
    tan: Infinity,
    sinExact: '-1',
    cosExact: '0',
    tanExact: 'undefined',
  },
  300: {
    sin: -Math.sqrt(3) / 2,
    cos: 0.5,
    tan: -Math.sqrt(3),
    sinExact: '-âˆš3/2 â‰ˆ -0.866',
    cosExact: '0.5',
    tanExact: '-âˆš3 â‰ˆ -1.732',
  },
  315: {
    sin: -Math.SQRT1_2,
    cos: Math.SQRT1_2,
    tan: -1,
    sinExact: '-âˆš2/2 â‰ˆ -0.7071',
    cosExact: 'âˆš2/2 â‰ˆ 0.7071',
    tanExact: '-1',
  },
  330: {
    sin: -0.5,
    cos: Math.sqrt(3) / 2,
    tan: -1 / Math.sqrt(3),
    sinExact: '-0.5',
    cosExact: 'âˆš3/2 â‰ˆ 0.866',
    tanExact: '-1/âˆš3 â‰ˆ -0.577',
  },
  360: { sin: 0, cos: 1, tan: 0, sinExact: '0', cosExact: '1', tanExact: '0' },
};

/**
 * Evaluates standard trig function (sin, cos, tan) for an angle.
 * Supports explicit degrees (Â°), radians (rad/pi), or default degrees for plain numbers.
 */
export function evaluateTrig(func, rawAngleStr) {
  let angleStr = rawAngleStr.trim().toLowerCase();
  let isRadians = false;

  // Check for explicit radians
  if (
    angleStr.includes('rad') ||
    angleStr.includes('pi') ||
    angleStr.includes('Ï€')
  ) {
    isRadians = true;
    angleStr = angleStr.replace(/radians?|rads?|rad/g, '').trim();
    angleStr = angleStr.replace(/Ï€/g, 'pi');
  } else {
    // Degree markings
    angleStr = angleStr.replace(/Â°|degrees?|degs?|deg/g, '').trim();
  }

  // Parse numeric angle or pi fraction
  let angleValue;
  if (isRadians) {
    let parsed = angleStr;
    if (parsed.includes('pi')) {
      parsed = parsed.replace(/(\d+)\s*\*\s*pi/g, '($1 * ' + Math.PI + ')');
      parsed = parsed.replace(/(\d+)\s*pi/g, '($1 * ' + Math.PI + ')');
      parsed = parsed.replace(/pi/g, String(Math.PI));
    }
    angleValue = safeEvaluateArithmetic(parsed);
    if (angleValue === null || Number.isNaN(angleValue)) {
      throw new Error(`Could not parse radian angle: "${rawAngleStr}"`);
    }
  } else {
    angleValue = safeEvaluateArithmetic(angleStr);
    if (angleValue === null || Number.isNaN(angleValue)) {
      throw new Error(`Could not parse angle: "${rawAngleStr}"`);
    }
  }

  const normFunc = func.toLowerCase();
  let resultValue;
  let angleDesc;
  let exactDesc = '';

  if (isRadians) {
    angleDesc = `${formatNumber(angleValue)} rad`;
    const degEquivalent = (angleValue * 180) / Math.PI;

    const normDeg = Math.round(((degEquivalent % 360) + 360) % 360);
    if (
      Math.abs(degEquivalent - normDeg) < 1e-4 &&
      EXACT_DEGREE_VALUES[normDeg]
    ) {
      const entry = EXACT_DEGREE_VALUES[normDeg];
      resultValue = entry[normFunc];
      exactDesc = entry[`${normFunc}Exact`];
    } else {
      if (normFunc === 'sin') resultValue = Math.sin(angleValue);
      else if (normFunc === 'cos') resultValue = Math.cos(angleValue);
      else if (normFunc === 'tan') {
        const c = Math.cos(angleValue);
        if (Math.abs(c) < 1e-12) {
          resultValue = Infinity;
        } else {
          resultValue = Math.tan(angleValue);
        }
      }
    }
  } else {
    angleDesc = `${formatNumber(angleValue)}Â°`;
    const normDeg = Math.round(((angleValue % 360) + 360) % 360);

    if (
      Math.abs(angleValue - Math.round(angleValue)) < 1e-5 &&
      EXACT_DEGREE_VALUES[normDeg]
    ) {
      const entry = EXACT_DEGREE_VALUES[normDeg];
      resultValue = entry[normFunc];
      exactDesc = entry[`${normFunc}Exact`];
    } else {
      const rad = (angleValue * Math.PI) / 180;
      if (normFunc === 'sin') resultValue = Math.sin(rad);
      else if (normFunc === 'cos') resultValue = Math.cos(rad);
      else if (normFunc === 'tan') {
        const c = Math.cos(rad);
        if (Math.abs(c) < 1e-12) {
          resultValue = Infinity;
        } else {
          resultValue = Math.tan(rad);
        }
      }
    }
  }

  // Handle tan undefined at 90, 270, etc.
  if (resultValue === Infinity || resultValue === -Infinity) {
    return {
      func: normFunc,
      angleDesc,
      value: undefined,
      exactDesc: 'undefined (asymptote)',
      isUndefined: true,
    };
  }

  // Snap clean values
  if (Math.abs(resultValue) < 1e-12) resultValue = 0;
  if (Math.abs(resultValue - 1) < 1e-12) resultValue = 1;
  if (Math.abs(resultValue + 1) < 1e-12) resultValue = -1;
  if (Math.abs(resultValue - 0.5) < 1e-12) resultValue = 0.5;
  if (Math.abs(resultValue + 0.5) < 1e-12) resultValue = -0.5;

  return {
    func: normFunc,
    angleDesc,
    value: resultValue,
    exactDesc: exactDesc || formatNumber(resultValue),
    isUndefined: false,
  };
}

/**
 * Evaluates inverse trig functions (arcsin, arccos, arctan).
 */
export function evaluateInverseTrig(func, rawArgStr) {
  let normFunc = func
    .toLowerCase()
    .trim()
    .replace('â»Â¹', '')
    .replace('^-1', '')
    .replace(/^inv/, '');

  if (normFunc.startsWith('arc')) {
    // already starts with arc: arcsin, arccos, arctan
  } else if (normFunc.startsWith('a')) {
    // asin, acos, atan -> arcsin, arccos, arctan
    normFunc = 'arc' + normFunc.slice(1);
  } else {
    // sin, cos, tan -> arcsin, arccos, arctan
    normFunc = 'arc' + normFunc;
  }

  const x = safeEvaluateArithmetic(rawArgStr);
  if (x === null || Number.isNaN(x)) {
    throw new Error(`Could not parse inverse trig ratio: "${rawArgStr}"`);
  }

  if (normFunc === 'arcsin') {
    if (x < -1 || x > 1) {
      return {
        error: `Domain error: arcsin(x) is only defined for -1 â‰¤ x â‰¤ 1. (Received x = ${x})`,
      };
    }
    const rad = Math.asin(x);
    const deg = (rad * 180) / Math.PI;
    let piFraction = '';
    if (Math.abs(x - 0.5) < 1e-6) piFraction = 'Ï€/6 rad â‰ˆ ';
    else if (Math.abs(x - Math.SQRT1_2) < 1e-6) piFraction = 'Ï€/4 rad â‰ˆ ';
    else if (Math.abs(x - Math.sqrt(3) / 2) < 1e-6) piFraction = 'Ï€/3 rad â‰ˆ ';
    else if (Math.abs(x - 1) < 1e-6) piFraction = 'Ï€/2 rad â‰ˆ ';
    else if (Math.abs(x) < 1e-6) piFraction = '0 rad';

    return {
      func: 'arcsin',
      arg: x,
      deg: formatNumber(deg),
      rad: piFraction ? `${piFraction}${formatNumber(rad, 4)}` : `${formatNumber(rad, 4)} rad`,
      degNum: deg,
      radNum: rad,
    };
  }

  if (normFunc === 'arccos') {
    if (x < -1 || x > 1) {
      return {
        error: `Domain error: arccos(x) is only defined for -1 â‰¤ x â‰¤ 1. (Received x = ${x})`,
      };
    }
    const rad = Math.acos(x);
    const deg = (rad * 180) / Math.PI;
    let piFraction = '';
    if (Math.abs(x - 1) < 1e-6) piFraction = '0 rad';
    else if (Math.abs(x - Math.sqrt(3) / 2) < 1e-6) piFraction = 'Ï€/6 rad â‰ˆ ';
    else if (Math.abs(x - Math.SQRT1_2) < 1e-6) piFraction = 'Ï€/4 rad â‰ˆ ';
    else if (Math.abs(x - 0.5) < 1e-6) piFraction = 'Ï€/3 rad â‰ˆ ';
    else if (Math.abs(x) < 1e-6) piFraction = 'Ï€/2 rad â‰ˆ ';
    else if (Math.abs(x + 1) < 1e-6) piFraction = 'Ï€ rad â‰ˆ ';

    return {
      func: 'arccos',
      arg: x,
      deg: formatNumber(deg),
      rad: piFraction ? `${piFraction}${formatNumber(rad, 4)}` : `${formatNumber(rad, 4)} rad`,
      degNum: deg,
      radNum: rad,
    };
  }

  if (normFunc === 'arctan') {
    const rad = Math.atan(x);
    const deg = (rad * 180) / Math.PI;
    let piFraction = '';
    if (Math.abs(x) < 1e-6) piFraction = '0 rad';
    else if (Math.abs(x - 1 / Math.sqrt(3)) < 1e-6) piFraction = 'Ï€/6 rad â‰ˆ ';
    else if (Math.abs(x - 1) < 1e-6) piFraction = 'Ï€/4 rad â‰ˆ ';
    else if (Math.abs(x - Math.sqrt(3)) < 1e-6) piFraction = 'Ï€/3 rad â‰ˆ ';

    return {
      func: 'arctan',
      arg: x,
      deg: formatNumber(deg),
      rad: piFraction ? `${piFraction}${formatNumber(rad, 4)}` : `${formatNumber(rad, 4)} rad`,
      degNum: deg,
      radNum: rad,
    };
  }

  throw new Error(`Unsupported inverse trig function: ${func}`);
}

// ------------------------------------------------------------
// SAFE ARITHMETIC EVALUATOR (Shunting-yard / Recursive)
// ------------------------------------------------------------

export function safeEvaluateArithmetic(expr) {
  if (typeof expr !== 'string') expr = String(expr);

  let sanitized = expr
    .trim()
    .replace(/Ã—/g, '*')
    .replace(/Ã·/g, '/')
    .replace(/\s+/g, '');

  if (!sanitized) return null;

  // Simple tokens
  const tokens = [];
  let i = 0;
  while (i < sanitized.length) {
    const ch = sanitized[i];

    if (
      ch === '+' ||
      ch === '-' ||
      ch === '*' ||
      ch === '/' ||
      ch === '^' ||
      ch === '(' ||
      ch === ')'
    ) {
      // Check if '-' or '+' is unary
      if (
        (ch === '-' || ch === '+') &&
        (i === 0 ||
          tokens[tokens.length - 1] === '(' ||
          ['+', '-', '*', '/', '^'].includes(tokens[tokens.length - 1]))
      ) {
        // Unary sign: absorb into next number
        let numStr = ch;
        i++;
        while (i < sanitized.length && /[\d.]/.test(sanitized[i])) {
          numStr += sanitized[i];
          i++;
        }
        tokens.push(Number(numStr));
        continue;
      }

      tokens.push(ch);
      i++;
    } else if (/[\d.]/.test(ch)) {
      let numStr = '';
      while (i < sanitized.length && /[\d.]/.test(sanitized[i])) {
        numStr += sanitized[i];
        i++;
      }
      tokens.push(Number(numStr));
    } else {
      return null; // Unrecognized character
    }
  }

  // Shunting-yard to RPN
  const outputQueue = [];
  const opStack = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

  for (const token of tokens) {
    if (typeof token === 'number') {
      outputQueue.push(token);
    } else if (token in precedence) {
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1] !== '(' &&
        precedence[opStack[opStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(opStack.pop());
      }
      opStack.push(token);
    } else if (token === '(') {
      opStack.push(token);
    } else if (token === ')') {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
        outputQueue.push(opStack.pop());
      }
      if (opStack.length === 0) return null; // Mismatched parens
      opStack.pop(); // Remove '('
    }
  }

  while (opStack.length > 0) {
    const op = opStack.pop();
    if (op === '(' || op === ')') return null; // Mismatched parens
    outputQueue.push(op);
  }

  // Evaluate RPN
  const evalStack = [];
  for (const token of outputQueue) {
    if (typeof token === 'number') {
      evalStack.push(token);
    } else {
      if (evalStack.length < 2) return null;
      const b = evalStack.pop();
      const a = evalStack.pop();
      let res;
      if (token === '+') res = a + b;
      else if (token === '-') res = a - b;
      else if (token === '*') res = a * b;
      else if (token === '/') {
        if (b === 0) return Infinity;
        res = a / b;
      } else if (token === '^') res = Math.pow(a, b);
      evalStack.push(res);
    }
  }

  if (evalStack.length !== 1) return null;
  return evalStack[0];
}

// ------------------------------------------------------------
// PROBLEM CLASSIFIER
// ------------------------------------------------------------

export function classifyProblem(question) {
  const q = question.trim();
  const lower = q.toLowerCase();

  // Inverse trig check
  if (
    /sin(?:â»Â¹|\^-1)|cos(?:â»Â¹|\^-1)|tan(?:â»Â¹|\^-1)|arcsin|arccos|arctan|asin|acos|atan/i.test(
      lower
    )
  ) {
    return 'trigonometry';
  }

  // Regular trig check: sin, cos, tan followed by digits, angles, or parentheses
  if (
    /\b(?:sin|cos|tan)\b/i.test(lower) ||
    /(?:sin|cos|tan)\s*\(?\s*[\d.]+/i.test(lower)
  ) {
    return 'trigonometry';
  }

  // Percentages
  if (/%\s*of\b/i.test(lower)) {
    return 'arithmetic';
  }

  // Simple equation check (e.g. x + 5 = 12, 2x - 4 = 10, etc.)
  if (/[a-zA-Z]\s*[+\-*/=]/.test(q) && q.includes('=')) {
    return 'algebra';
  }

  // Pure arithmetic check (numbers, operators +, -, *, /, Ã·, Ã—, ^)
  if (
    /^[\s\d\.\+\-\*\/\(\)\^\Ã·\Ã—xX]+$/.test(q) &&
    /[\d]/.test(q) &&
    /[\+\-\*\/\Ã·\Ã—^]/.test(q)
  ) {
    return 'arithmetic';
  }

  // Check if it's a conceptual question, syllabus topic, or word problem
  const conceptKeywords = [
    'explain',
    'what is',
    'why',
    'how',
    'difference',
    'define',
    'formula',
    'law',
    'derive',
    'newton',
    'photosynthesis',
    'gravity',
    'velocity',
    'speed',
    'acceleration',
    'friction',
    'energy',
    'momentum',
    'work',
    'power',
    'cell',
    'atom',
    'molecule',
    'reaction',
    'matrix',
    'derivative',
    'integral',
    'limit',
    'polynomial',
    'quadratic',
    'theorem',
  ];

  if (
    conceptKeywords.some((keyword) => lower.includes(keyword)) ||
    q.endsWith('?') ||
    q.split(/\s+/).length >= 5
  ) {
    return 'concept_question';
  }

  return 'unknown';
}

// ------------------------------------------------------------
// TRIGONOMETRY EXPRESSION SOLVER
// ------------------------------------------------------------

export function solveTrigonometry(question) {
  const q = question.trim();

  // Check for single inverse trig function first (e.g., arcsin(0.5), sinâ»Â¹(0.5), tanâ»Â¹(1))
  const invMatch = q.match(
    /^(?:what\s+is\s+)?(sin(?:â»Â¹|\^-1)|cos(?:â»Â¹|\^-1)|tan(?:â»Â¹|\^-1)|arcsin|arccos|arctan|asin|acos|atan)\s*\(?\s*(-?[\d.]+)\s*\)?$/i
  );

  if (invMatch) {
    const funcName = invMatch[1];
    const argStr = invMatch[2];
    const invRes = evaluateInverseTrig(funcName, argStr);

    if (invRes.error) {
      return `### ðŸ·ï¸ PROBLEM TYPE: Trigonometry (Inverse Function)

### â“ QUESTION
${q}

### âš ï¸ ERROR
${invRes.error}

### ðŸ’¡ WHY?
The trigonometric functions sine and cosine have outputs strictly in the range [-1, 1]. Therefore, their inverse functions can only accept inputs between -1 and 1.`;
    }

    return `### ðŸ·ï¸ PROBLEM TYPE: Trigonometry (Inverse Function)

### â“ QUESTION
${q}

### ðŸŽ¯ WHAT WE NEED TO FIND
Find the angle whose ${invRes.func.replace('arc', '')} value is **${invRes.arg}**.

### ðŸ“– CONCEPT
- **Inverse Trigonometric Function**: Returns the angle $\\theta$ such that $\\text{${invRes.func.replace('arc', '')}}(\\theta) = ${invRes.arg}$.
- **Standard Domain**:
  - arcsin / arccos: input in $[-1, 1]$
  - arctan: input in $(-\\infty, \\infty)$

### ðŸ“ STEP-BY-STEP EXPLANATION
**Step 1:** Set up the equation:
$$\\text{${invRes.func.replace('arc', '')}}(\\theta) = ${invRes.arg}$$

**Step 2:** Find the principal angle $\\theta$:
- In degrees: **${invRes.deg}Â°**
- In radians: **${invRes.rad} rad**

### âœ… FINAL ANSWER
**${invRes.deg}Â°**  *(or ${invRes.rad} rad)*

### ðŸ’¡ WHY THIS METHOD WORKS
The inverse function reverses the trigonometric operation to retrieve the original angle in its principal range.

### ðŸ§ª TRY IT YOURSELF
What is **arcsin(0.5)** or **tanâ»Â¹(1)**?`;
  }

  // ----------------------------------------------------------
  // COMPOUND TRIG EXPRESSIONS (e.g. cos(90Â°) + sin(90Â°), 2sin(30Â°) + cos(60Â°))
  // ----------------------------------------------------------

  // Pre-normalize expression:
  let normalized = q
    .replace(/Ã—/g, '*')
    .replace(/Ã·/g, '/')
    .replace(/sinâ»Â¹|sin\^-1/gi, 'arcsin')
    .replace(/cosâ»Â¹|cos\^-1/gi, 'arccos')
    .replace(/tanâ»Â¹|tan\^-1/gi, 'arctan');

  // Insert multiplication between numbers and trig functions: e.g. "2sin" -> "2 * sin"
  normalized = normalized.replace(
    /(\d+(?:\.\d+)?)\s*(sin|cos|tan|arcsin|arccos|arctan)\b/gi,
    '$1 * $2'
  );

  // Normalize function calls with bare numbers: "cos90" -> "cos(90Â°)", "cos 90Â°" -> "cos(90Â°)", "cos(90)" -> "cos(90Â°)"
  normalized = normalized.replace(
    /\b(sin|cos|tan)\s*\(?(\d+(?:\.\d+)?\s*(?:Â°|deg|degrees|rad|radians|pi|Ï€)?)\)?/gi,
    (match, func, arg) => {
      let cleanArg = arg.trim();
      // If no unit, assume degrees
      if (
        !cleanArg.includes('Â°') &&
        !cleanArg.includes('deg') &&
        !cleanArg.includes('rad') &&
        !cleanArg.includes('pi') &&
        !cleanArg.includes('Ï€')
      ) {
        cleanArg = `${cleanArg}Â°`;
      }
      return `${func.toLowerCase()}(${cleanArg})`;
    }
  );

  // Also handle expressions inside parentheses like sin(pi / 2 rad)
  normalized = normalized.replace(
    /\b(sin|cos|tan)\s*\(([^)]+)\)/gi,
    (match, func, innerArg) => {
      let cleanArg = innerArg.trim();
      if (
        !cleanArg.includes('Â°') &&
        !cleanArg.includes('deg') &&
        !cleanArg.includes('rad') &&
        !cleanArg.includes('pi') &&
        !cleanArg.includes('Ï€') &&
        /^[\d.]+$/.test(cleanArg)
      ) {
        cleanArg = `${cleanArg}Â°`;
      }
      return `${func.toLowerCase()}(${cleanArg})`;
    }
  );

  // Find all trig function calls: e.g. func(arg)
  const trigCallRegex = /\b(sin|cos|tan)\(([^)]+)\)/gi;
  const trigCalls = [];
  let match;

  while ((match = trigCallRegex.exec(normalized)) !== null) {
    trigCalls.push({
      fullMatch: match[0],
      func: match[1].toLowerCase(),
      arg: match[2].trim(),
    });
  }

  if (trigCalls.length === 0) {
    return null; // Not a standard trig expression
  }

  // Evaluate each trig term and record steps
  const steps = [];
  const evalResults = [];
  let substitutedExpr = normalized;

  for (let idx = 0; idx < trigCalls.length; idx++) {
    const call = trigCalls[idx];
    try {
      const res = evaluateTrig(call.func, call.arg);

      if (res.isUndefined) {
        return `### ðŸ·ï¸ PROBLEM TYPE: Trigonometry

### â“ QUESTION
${q}

### âš ï¸ ERROR
**${call.func}(${call.arg}) is undefined.**

### ðŸ’¡ WHY?
At odd multiples of 90Â° (such as 90Â°, 270Â°), the cosine is 0. Since $\\tan(\\theta) = \\frac{\\sin(\\theta)}{\\cos(\\theta)}$, division by zero occurs, making the tangent undefined (vertical asymptote).`;
      }

      evalResults.push(res);
      steps.push(
        `- **${call.fullMatch}**: Angle is ${res.angleDesc} â†’ **${call.func}(${res.angleDesc}) = ${res.exactDesc}**`
      );

      // Substitute into expression
      substitutedExpr = substitutedExpr.replace(
        call.fullMatch,
        `(${res.value})`
      );
    } catch (err) {
      return `### ðŸ·ï¸ PROBLEM TYPE: Trigonometry

### â“ QUESTION
${q}

### âš ï¸ ERROR
Could not evaluate **${call.fullMatch}**: ${err.message}`;
    }
  }

  // Safely evaluate the arithmetic of the substituted expression
  const finalNumericValue = safeEvaluateArithmetic(substitutedExpr);

  if (finalNumericValue === null || Number.isNaN(finalNumericValue)) {
    return `### ðŸ·ï¸ PROBLEM TYPE: Trigonometry

### â“ QUESTION
${q}

### âš ï¸ ERROR
Could not compute the final arithmetic for expression: \`${substitutedExpr}\`. Please check the expression syntax.`;
  }

  const formattedAnswer = formatNumber(finalNumericValue);

  return `### ðŸ·ï¸ PROBLEM TYPE: Trigonometry

### â“ QUESTION
${q}

### ðŸŽ¯ WHAT WE NEED TO FIND
Evaluate the trigonometric expression: **${q}**

### ðŸ“– CONCEPT & FORMULAS
- **Angle Convention**: Angles without units or with **Â°** are treated as **Degrees**. Angles written with **rad** or containing **Ï€** are in **Radians**.
- **Standard Trigonometric Values**:
  - $\\sin(0^\\circ) = 0$, $\\sin(30^\\circ) = 0.5$, $\\sin(90^\\circ) = 1$
  - $\\cos(0^\\circ) = 1$, $\\cos(60^\\circ) = 0.5$, $\\cos(90^\\circ) = 0$
  - $\\tan(45^\\circ) = 1$

### ðŸ“ STEP-BY-STEP EXPLANATION
**Step 1:** Evaluate each trigonometric function:
${steps.join('\n')}

**Step 2:** Substitute the evaluated values into the expression:
$$${substitutedExpr}$$

**Step 3:** Perform arithmetic operations:
$$= ${formattedAnswer}$$

### âœ… FINAL ANSWER
**${formattedAnswer}**

### ðŸ’¡ WHY THIS METHOD WORKS
Trigonometric expressions are evaluated by first calculating each function at its respective angle, then applying algebraic order of operations.

### ðŸ§ª TRY IT YOURSELF
Try calculating: **2sin(30Â°) + cos(60Â°)** or **tan(45Â°) + cos(0Â°)**!`;
}

// ------------------------------------------------------------
// PRESERVED & ENHANCED ARITHMETIC SOLVER
// ------------------------------------------------------------

export function solveArithmetic(question) {
  const q = question.trim();

  // 1. ADDITION (preserved exact format)
  const add = q.match(/^(-?\d+(?:\.\d+)?)\s*\+\s*(-?\d+(?:\.\d+)?)$/);
  if (add) {
    const a = Number(add[1]);
    const b = Number(add[2]);
    const answer = a + b;

    return `### ðŸ·ï¸ PROBLEM TYPE: Arithmetic (Addition)

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** Identify the two numbers: ${a} and ${b}.

**Step 2:** Add them together:

**${a} + ${b} = ${formatNumber(answer)}**

### âœ… FINAL ANSWER

**${formatNumber(answer)}**

### ðŸ’¡ WHY?

Addition combines quantities to find their total.

### ðŸ§ª TRY IT YOURSELF

What is **12 + 8**?`;
  }

  // 2. SUBTRACTION (preserved exact format)
  const subtract = q.match(/^(-?\d+(?:\.\d+)?)\s*-\s*(-?\d+(?:\.\d+)?)$/);
  if (subtract) {
    const a = Number(subtract[1]);
    const b = Number(subtract[2]);
    const answer = a - b;

    return `### ðŸ·ï¸ PROBLEM TYPE: Arithmetic (Subtraction)

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** Start with ${a}.

**Step 2:** Subtract ${b}:

**${a} - ${b} = ${formatNumber(answer)}**

### âœ… FINAL ANSWER

**${formatNumber(answer)}**

### ðŸ’¡ WHY?

Subtraction finds the difference between quantities.

### ðŸ§ª TRY IT YOURSELF

What is **20 - 7**?`;
  }

  // 3. MULTIPLICATION (preserved exact format)
  const multiply = q.match(
    /^(-?\d+(?:\.\d+)?)\s*(?:\*|x|X|Ã—)\s*(-?\d+(?:\.\d+)?)$/
  );
  if (multiply) {
    const a = Number(multiply[1]);
    const b = Number(multiply[2]);
    const answer = a * b;

    return `### ðŸ·ï¸ PROBLEM TYPE: Arithmetic (Multiplication)

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** Identify the numbers: ${a} and ${b}.

**Step 2:** Multiply them:

**${a} Ã— ${b} = ${formatNumber(answer)}**

### âœ… FINAL ANSWER

**${formatNumber(answer)}**

### ðŸ’¡ WHY?

Multiplication represents equal groups.

For example, ${a} Ã— ${b} means ${b} groups of ${a}.

### ðŸ§ª TRY IT YOURSELF

What is **6 Ã— 7**?`;
  }

  // 4. DIVISION (preserved exact format)
  const divide = q.match(
    /^(-?\d+(?:\.\d+)?)\s*(?:\/|Ã·)\s*(-?\d+(?:\.\d+)?)$/
  );
  if (divide) {
    const a = Number(divide[1]);
    const b = Number(divide[2]);

    if (b === 0) {
      return `### ðŸ·ï¸ PROBLEM TYPE: Arithmetic (Division)

### â“ QUESTION
${q}

### âœ… FINAL ANSWER

Division by zero is not defined.

### ðŸ’¡ WHY?

A number cannot be divided into zero equal groups.`;
    }

    const answer = a / b;

    return `### ðŸ·ï¸ PROBLEM TYPE: Arithmetic (Division)

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** Identify the dividend: ${a}.

**Step 2:** Identify the divisor: ${b}.

**Step 3:** Divide:

**${a} Ã· ${b} = ${formatNumber(answer)}**

### âœ… FINAL ANSWER

**${formatNumber(answer)}**

### ðŸ’¡ WHY?

Division separates a quantity into equal groups.

### ðŸ§ª TRY IT YOURSELF

What is **24 Ã· 6**?`;
  }

  // 5. PERCENTAGE (preserved exact format)
  const percentage = q.match(
    /^(-?\d+(?:\.\d+)?)\s*%\s*of\s*(-?\d+(?:\.\d+)?)$/i
  );
  if (percentage) {
    const percent = Number(percentage[1]);
    const number = Number(percentage[2]);
    const answer = (percent / 100) * number;

    return `### ðŸ·ï¸ PROBLEM TYPE: Arithmetic (Percentage)

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** Convert ${percent}% to a decimal:

${percent}% = ${percent} Ã· 100 = ${percent / 100}

**Step 2:** Multiply by ${number}:

${percent / 100} Ã— ${number} = ${formatNumber(answer)}

### âœ… FINAL ANSWER

**${formatNumber(answer)}**

### ðŸ’¡ WHY?

A percentage means a part out of 100.

### ðŸ§ª TRY IT YOURSELF

What is **25% of 80**?`;
  }

  // 6. GENERAL ARITHMETIC EXPRESSION (e.g. (10 + 5) * 2 - 4)
  const generalResult = safeEvaluateArithmetic(q);
  if (generalResult !== null && !Number.isNaN(generalResult)) {
    return `### ðŸ·ï¸ PROBLEM TYPE: Arithmetic

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** Parse the arithmetic expression following standard order of operations (BODMAS / PEMDAS).

**Step 2:** Evaluate operations:

**${q} = ${formatNumber(generalResult)}**

### âœ… FINAL ANSWER

**${formatNumber(generalResult)}**

### ðŸ’¡ WHY?

Order of operations ensures that mathematical expressions are evaluated consistently.`;
  }

  return null;
}

// ------------------------------------------------------------
// PRESERVED & ENHANCED ALGEBRA SOLVER
// ------------------------------------------------------------

export function solveAlgebra(question) {
  const q = question.trim();

  // Simple equation: x + a = b
  const eqAdd = q.match(
    /^x\s*\+\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)$/i
  );
  if (eqAdd) {
    const amount = Number(eqAdd[1]);
    const total = Number(eqAdd[2]);
    const answer = total - amount;

    return `### ðŸ·ï¸ PROBLEM TYPE: Algebra (Linear Equation)

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** We have:

**x + ${amount} = ${total}**

**Step 2:** Subtract ${amount} from both sides:

**x = ${total} - ${amount}**

**Step 3:** Calculate:

**x = ${formatNumber(answer)}**

### âœ… FINAL ANSWER

**x = ${formatNumber(answer)}**

### ðŸ’¡ WHY?

We use the opposite operation to isolate x.`;
  }

  // Simple equation: x - a = b
  const eqSub = q.match(
    /^x\s*-\s*(-?\d+(?:\.\d+)?)\s*=\s*(-?\d+(?:\.\d+)?)$/i
  );
  if (eqSub) {
    const amount = Number(eqSub[1]);
    const total = Number(eqSub[2]);
    const answer = total + amount;

    return `### ðŸ·ï¸ PROBLEM TYPE: Algebra (Linear Equation)

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** We have:

**x - ${amount} = ${total}**

**Step 2:** Add ${amount} to both sides:

**x = ${total} + ${amount}**

**Step 3:** Calculate:

**x = ${formatNumber(answer)}**

### âœ… FINAL ANSWER

**x = ${formatNumber(answer)}**

### ðŸ’¡ WHY?

We add ${amount} to both sides to cancel out subtraction and isolate x.`;
  }

  // General linear: ax + b = c or ax = b
  const eqLinear = q.match(
    /^(-?\d+(?:\.\d+)?)?x\s*(?:([+-])\s*(-?\d+(?:\.\d+)?))?\s*=\s*(-?\d+(?:\.\d+)?)$/i
  );
  if (eqLinear) {
    const a =
      eqLinear[1] === undefined || eqLinear[1] === '' ? 1 : Number(eqLinear[1]);
    const op = eqLinear[2];
    const b = eqLinear[3]
      ? op === '-'
        ? -Number(eqLinear[3])
        : Number(eqLinear[3])
      : 0;
    const c = Number(eqLinear[4]);

    if (a === 0) {
      return `### ðŸ·ï¸ PROBLEM TYPE: Algebra

### â“ QUESTION
${q}

### âš ï¸ ERROR
Invalid equation: Coefficient of x cannot be 0.`;
    }

    const answer = (c - b) / a;

    return `### ðŸ·ï¸ PROBLEM TYPE: Algebra (Linear Equation)

### â“ QUESTION
${q}

### ðŸ“ STEP-BY-STEP EXPLANATION

**Step 1:** Equation: **${a !== 1 ? a : ''}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${c}**

**Step 2:** Move constant terms to the right-hand side:
**${a !== 1 ? a : ''}x = ${c} - (${b}) = ${c - b}**

${a !== 1 ? `**Step 3:** Divide both sides by ${a}:\n**x = ${c - b} / ${a} = ${formatNumber(answer)}**` : ''}

### âœ… FINAL ANSWER

**x = ${formatNumber(answer)}**

### ðŸ’¡ WHY?

Linear equations are solved by isolating the variable using inverse operations.`;
  }

  return null;
}

// ------------------------------------------------------------
// HELPFUL UNSUPPORTED EXPRESSION MESSAGE
// ------------------------------------------------------------

export function getUnsupportedMathHelpMessage(question) {
  return `### ðŸ·ï¸ QUESTION SOLVER ASSISTANT

### â“ QUESTION
${question}

### ðŸ’¡ SUPPORTED PROBLEM TYPES & FORMATS

I didn't recognize that exact mathematical expression. Here are the formats and features I support with step-by-step solutions:

---

### ðŸ“ 1. Trigonometry (Degrees & Radians)
- **Standard functions**:
  - \`cos(90Â°) + sin(90Â°)\` or \`cos90 + sin90\`
  - \`sin(30Â°)\` or \`sin30\`
  - \`cos(60Â°)\` or \`cos60\`
  - \`tan(45Â°)\` or \`tan45\`
  - \`2sin(30Â°) + cos(60Â°)\`
- **Inverse functions**:
  - \`sinâ»Â¹(0.5)\` or \`arcsin(0.5)\`
  - \`cosâ»Â¹(0.5)\` or \`arccos(0.5)\`
  - \`tanâ»Â¹(1)\` or \`arctan(1)\`
- **Radian inputs**:
  - \`sin(pi / 2 rad)\` or \`cos(pi)\`

---

### ðŸ”¢ 2. Arithmetic & Percentages
- **Basic operations**: \`25 + 4\`, \`20 - 7\`, \`6 * 7\`, \`24 / 6\`
- **Percentages**: \`25% of 80\`, \`15% of 250\`
- **Compound expressions**: \`(15 + 5) * 3 - 10 / 2\`

---

### ðŸ§® 3. Algebra & Equations
- **Linear equations**: \`x + 5 = 12\`, \`x - 4 = 15\`, \`2x + 6 = 18\`

---

### ðŸ¤– 4. Conceptual Questions & Word Problems
- Ask any concept, e.g.:
  - *"Explain Newton's second law"*
  - *"What is photosynthesis?"*
  - *"Solve quadratic equation 2x^2 + 5x - 3 = 0"*
  The **Furqan NovaAI** will provide a comprehensive, structured explanation!`;
}

// ------------------------------------------------------------
// MASTER PROBLEM SOLVER ENTRY POINT
// ------------------------------------------------------------

export function solveMathProblem(question) {
  const q = String(question || '').trim();

  if (!q) {
    return {
      type: 'empty',
      content: `### â“ QUESTION\n\nNo question was entered.\n\n### ðŸ“ SOLUTION\n\nPlease enter a question and I'll solve it step by step.`,
    };
  }

  const problemType = classifyProblem(q);

  // 1. Try Trigonometry
  if (problemType === 'trigonometry') {
    const trigSolution = solveTrigonometry(q);
    if (trigSolution) {
      return { type: 'trigonometry', content: trigSolution };
    }
  }

  // 2. Try Algebra
  if (problemType === 'algebra') {
    const algebraSolution = solveAlgebra(q);
    if (algebraSolution) {
      return { type: 'algebra', content: algebraSolution };
    }
  }

  // 3. Try Arithmetic
  if (problemType === 'arithmetic') {
    const arithmeticSolution = solveArithmetic(q);
    if (arithmeticSolution) {
      return { type: 'arithmetic', content: arithmeticSolution };
    }
  }

  // Fallback checks: maybe trigonometry without triggering classifier
  const trigFallback = solveTrigonometry(q);
  if (trigFallback) {
    return { type: 'trigonometry', content: trigFallback };
  }

  // Maybe arithmetic without triggering classifier
  const arithmeticFallback = solveArithmetic(q);
  if (arithmeticFallback) {
    return { type: 'arithmetic', content: arithmeticFallback };
  }

  // Maybe algebra without triggering classifier
  const algebraFallback = solveAlgebra(q);
  if (algebraFallback) {
    return { type: 'algebra', content: algebraFallback };
  }

  // 4. Conceptual question (Delegate to Furqan NovaAI fallback)
  if (problemType === 'concept_question') {
    return { type: 'concept_question', content: null };
  }

  // 5. Unrecognized / malformed expression
  return {
    type: 'unsupported',
    content: getUnsupportedMathHelpMessage(q),
  };
}

