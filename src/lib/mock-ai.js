// ============================================================
// MOCK AI - STUDY ASSISTANT
// ============================================================

import { solveMathProblem } from './math-solver.js';

// ============================================================
// HELPERS
// ============================================================

function cleanText(value) {
  return String(value || '').trim();
}

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value);
  }

  if (Number.isInteger(number)) {
    return String(number);
  }

  return String(Number(number.toFixed(10)));
}

// ============================================================
// MOCK AI TUTOR
// ============================================================

export function getMockTutorResponse(message, mode = 'standard', syllabusContext = null) {
  const text = cleanText(message);
  const lower = text.toLowerCase();

  if (!text) {
    return `### 🎓 Intermediate AI Tutor

Hello! 👋 I am your Intermediate (Class 11 & 12) AI Study Assistant.

Select your **Stream (MPC / BiPC / MEC / CEC)**, **Year**, and **Topic** to get tailored step-by-step guidance, formulas, MCQs, and exam revision!`;
  }

  // ----------------------------------------------------------
  // INTERMEDIATE CONTEXT OR NEWTON'S LAWS / MECHANICS
  // ----------------------------------------------------------
  if (
    lower.includes('newton') ||
    (lower.includes('law') && lower.includes('motion')) ||
    (syllabusContext && syllabusContext.topic && syllabusContext.topic.toLowerCase().includes('newton'))
  ) {
    if (lower.includes('simple') || mode === 'beginner' || (syllabusContext && syllabusContext.action === 'Simple Explanation')) {
      return `### ⚛️ Newton's Laws of Motion (Simple Explanation)
**Class 11 / Intermediate 1st Year Physics — Mechanics**

Here are Newton's Three Laws of Motion explained in the simplest, most intuitive terms with everyday examples! 🚀

---

### 1️⃣ First Law: The Law of Inertia (Lazy Law 🛋️)
> *"An object will stay at rest or keep moving at the same speed in a straight line unless pushed or pulled by an external force."*

* **Simple Idea**: Things like to keep doing what they are already doing. Objects are "lazy" to change their state on their own!
* **Everyday Example**: When a bus suddenly hits the brakes, your upper body jerks forward. Why? Because your body was moving forward with the bus and wanted to keep moving forward due to **inertia**!

---

### 2️⃣ Second Law: The Law of Force & Acceleration ($F = ma$ 🏎️)
> *"The acceleration of an object depends on how hard you push it and how heavy it is. More formally: Force = mass × acceleration ($F = ma$)."*

* **Simple Idea**: 
  - Push harder $\\rightarrow$ moves faster.
  - Heavier object $\rightarrow$ harder to push.
* **Everyday Example**: Kicking a light football sends it flying across the ground ($a = F/m$), but kicking a heavy rock with the same force barely moves it (and hurts your foot!).

---

### 3️⃣ Third Law: Action and Reaction ($F_{AB} = -F_{BA}$ 🚀)
> *"For every action, there is an equal and opposite reaction."*

* **Simple Idea**: Forces always come in pairs! You cannot push something without it pushing back on you with equal force.
* **Everyday Example**: When a rocket burns fuel, high-speed gas shoots **downward** (Action), which pushes the rocket soaring **upward** into space (Reaction)!

---

### 💡 Quick Summary Formula Card
| Law | Concept | Key Formula / Rule | Everyday Analog |
| :--- | :--- | :--- | :--- |
| **1st Law** | Inertia & Equilibrium | $\\Sigma F = 0 \\implies v = \\text{constant}$ | Seatbelts in cars |
| **2nd Law** | Momentum & Force | $F = \\frac{\\Delta p}{\\Delta t} = ma$ | Catching cricket ball |
| **3rd Law** | Action-Reaction Pairs | $F_{12} = -F_{21}$ | Walking, Swimming, Rockets |

---

### 🧪 Check Your Understanding
When a swimmer pushes the water backwards with their hands, why do they move forwards? Which law explains this?`;
    }

    if (lower.includes('mcq') || (syllabusContext && syllabusContext.action === 'Generate MCQs')) {
      return `### 🔘 MCQs: Newton's Laws of Motion (Intermediate Level)

**Q1. When a carpet is beaten with a stick, dust particles come out. This phenomenon is an illustration of:**
- A) Newton's Third Law
- B) Inertia of rest (Newton's First Law) *(Correct)*
- C) Conservation of momentum
- D) Law of gravitation
*Explanation: The carpet moves with the stick, but the dust particles remain at rest due to inertia and fall off.*

**Q2. A force of $10\\text{ N}$ acts on a body of mass $2\\text{ kg}$ initially at rest. What is the velocity attained after $3\\text{ seconds}$?**
- A) $5\\text{ m/s}$
- B) $10\\text{ m/s}$
- C) $15\\text{ m/s}$ *(Correct)*
- D) $20\\text{ m/s}$
*Explanation: $a = F/m = 10/2 = 5\\text{ m/s}^2$. Using $v = u + at = 0 + (5)(3) = 15\\text{ m/s}$.*

**Q3. Action and reaction forces:**
- A) Act on the same body
- B) Act on different bodies *(Correct)*
- C) Act along different lines
- D) Cancel each other completely on a single object
*Explanation: Action and reaction act on two mutually interacting bodies simultaneously, so they never cancel out on a single object.*

**Q4. The rate of change of linear momentum of a body is directly proportional to:**
- A) Applied impulse
- B) Applied net external force *(Correct)*
- C) Kinetic energy
- D) Acceleration only
*Explanation: By Newton's Second Law, $F_{ext} = \\frac{dp}{dt}$.*

**Q5. Why does a cricketer pull their hands back while catching a fast cricket ball?**
- A) To exert more force on the ball
- B) To increase impact time and decrease force on hands *(Correct)*
- C) To catch the ball at a higher position
- D) To reduce the momentum to a non-zero value
*Explanation: Increasing contact time $\\Delta t$ reduces impulse force $F = \\frac{\\Delta p}{\\Delta t}$.*`;
    }

    if (lower.includes('solve') || lower.includes('step') || (syllabusContext && syllabusContext.action === 'Solve Problems')) {
      return `### 🧩 Step-by-Step Problem Solver: Newton's Laws

### ❓ PROBLEM
A block of mass $m = 5\\text{ kg}$ is pulled along a rough horizontal surface by a constant horizontal force $F = 30\\text{ N}$. The coefficient of kinetic friction between the block and the surface is $\\mu_k = 0.2$. (Take $g = 9.8\\text{ m/s}^2$).
Find:
1. The frictional force acting on the block.
2. The acceleration of the block.
3. The distance covered in $4\\text{ seconds}$ starting from rest.

---

### 🎯 GIVEN DATA
- Mass $m = 5\\text{ kg}$
- Applied Force $F = 30\\text{ N}$
- Coefficient of kinetic friction $\\mu_k = 0.2$
- Initial velocity $u = 0\\text{ m/s}$
- Time $t = 4\\text{ s}$
- Acceleration due to gravity $g = 9.8\\text{ m/s}^2$

---

### 📝 STEP-BY-STEP SOLUTION

**Step 1: Calculate the Normal Reaction ($N$)**
In the vertical direction, the block is in equilibrium:
$$\\Sigma F_y = 0 \\implies N = mg = 5 \\times 9.8 = 49\\text{ N}$$

**Step 2: Calculate the Kinetic Frictional Force ($f_k$)**
$$f_k = \\mu_k N = 0.2 \\times 49 = 9.8\\text{ N}$$

**Step 3: Find the Net Force ($F_{\\text{net}}$) and Acceleration ($a$)**
Applying Newton's 2nd Law in the horizontal direction:
$$F_{\\text{net}} = F - f_k = 30 - 9.8 = 20.2\\text{ N}$$
$$a = \\frac{F_{\\text{net}}}{m} = \\frac{20.2}{5} = 4.04\\text{ m/s}^2$$

**Step 4: Find Distance ($s$) using Kinematic Equation**
$$s = ut + \\frac{1}{2}at^2 = 0(4) + \\frac{1}{2}(4.04)(4^2) = \\frac{1}{2} \\times 4.04 \\times 16 = 32.32\\text{ m}$$

---

### ✅ FINAL ANSWERS
1. **Frictional force**: $f_k = 9.8\\text{ N}$ (opposing motion)
2. **Acceleration**: $a = 4.04\\text{ m/s}^2$
3. **Distance in $4\\text{ s}$**: $s = 32.32\\text{ m}$`;
    }

    return `### ⚛️ Newton's Laws of Motion & Momentum
**Intermediate 1st Year / Class 11 — Physics (Mechanics)**

Newton's laws of motion form the foundation of classical mechanics, describing how bodies interact and move under forces.

---

### 1. First Law of Motion (Law of Inertia)
> *"Every body continues in its state of rest or of uniform motion in a straight line unless compelled to change that state by an external unbalanced force."*

* **Inertia**: The inherent property of a body to resist changes in its state of rest or uniform motion. Measured quantitatively by **mass**.
* Types of Inertia:
  1. **Inertia of Rest**: e.g., A passenger falling backward when a bus starts suddenly.
  2. **Inertia of Motion**: e.g., A passenger falling forward when brakes are applied.
  3. **Inertia of Direction**: e.g., Mud flying off tangentially from a rotating bicycle wheel.

---

### 2. Second Law of Motion ($F = \\frac{dp}{dt}$)
> *"The rate of change of linear momentum of a body is directly proportional to the applied external force and takes place in the direction in which the force acts."*

**Mathematical Derivation:**
* Linear Momentum: $\\vec{p} = m\\vec{v}$
* By 2nd Law: $\\vec{F} \\propto \\frac{d\\vec{p}}{dt} = \\frac{d(m\\vec{v})}{dt}$
* For constant mass $m$:
$$\\vec{F} = m\\frac{d\\vec{v}}{dt} = m\\vec{a}$$
* **SI Unit of Force**: Newton ($1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2$).
* **Impulse**: $\\vec{J} = \\vec{F} \\Delta t = \\Delta \\vec{p}$ (Change in momentum).

---

### 3. Third Law of Motion ($F_{AB} = -F_{BA}$)
> *"To every action, there is always an equal and opposite reaction."*

* **Crucial Characteristics**:
  1. Action and reaction forces act **simultaneously**.
  2. Action and reaction act on **two different bodies**, hence they **never cancel each other**.
  3. Gives rise to the **Law of Conservation of Linear Momentum** when $\\Sigma \\vec{F}_{ext} = 0$.

---

### 🎯 Key Exam Formulas & Highlights
- $\\vec{F}_{net} = m\\vec{a}$
- Impulse $J = \\int F\\, dt = m(v - u)$
- Recoil velocity of gun: $V = -\\frac{m}{M}v$
- Apparent weight in a lift moving up with acceleration $a$: $W = m(g + a)$
- Apparent weight in a lift moving down with acceleration $a$: $W = m(g - a)$`;
  }

  // Handle generic syllabus context if present
  if (syllabusContext && (syllabusContext.subject || syllabusContext.chapter || syllabusContext.topic)) {
    return generateStructuredIntermediateResponse(text, mode, syllabusContext);
  }

  // ----------------------------------------------------------
  // PHOTOSYNTHESIS
  // ----------------------------------------------------------

  if (
    lower.includes('photosynthesis') ||
    lower.includes('photo synthesis')
  ) {
    if (mode === 'beginner') {
      return `### 🌱 Photosynthesis

Photosynthesis is how **green plants make their own food**.

Plants need three main things:

1. ☀️ Sunlight
2. 💧 Water
3. 🌬️ Carbon dioxide

The plant uses these to make **food called glucose**.

As a result, the plant also releases **oxygen** into the air.

### Simple way to remember

**Sunlight + Water + Carbon dioxide → Food + Oxygen**

### 🌿 Example

Think of a plant like a tiny food factory.

The **sun provides energy**, and the leaves use that energy to make food.

### Quick question

Why do plants need sunlight?`;
    }

    return `### 🌱 Photosynthesis

**Photosynthesis** is the process by which green plants make their own food using light energy.

### What does a plant need?

- ☀️ **Sunlight** — provides energy
- 💧 **Water** — absorbed through the roots
- 🌬️ **Carbon dioxide** — enters through tiny openings in the leaves

The plant uses these materials to produce **glucose**, which is a type of sugar used as food.

**Oxygen** is released as a by-product.

### Simple summary

**Sunlight + Water + Carbon dioxide → Glucose + Oxygen**

### Why is photosynthesis important?

Photosynthesis is important because it:

1. Provides food for plants.
2. Supports food chains.
3. Releases oxygen into the atmosphere.
4. Helps remove carbon dioxide from the atmosphere.

### Quick check

What are the three main things a plant needs for photosynthesis?`;
  }

  // ----------------------------------------------------------
  // GRAVITY
  // ----------------------------------------------------------

  if (lower.includes('gravity')) {
    return `### 🌍 Gravity

**Gravity** is a force that pulls objects toward other objects with mass.

On Earth, gravity pulls things toward the ground.

### Example

When you drop a ball, it falls downward because Earth's gravity pulls it toward Earth.

### Easy way to remember

**Gravity = a pulling force**

### Quick question

What would happen to a ball if Earth had no gravity?`;
  }

  // ----------------------------------------------------------
  // WATER CYCLE
  // ----------------------------------------------------------

  if (
    lower.includes('water cycle') ||
    lower.includes('watercycle')
  ) {
    return `### 💧 Water Cycle

The water cycle describes how water continuously moves around Earth.

### Main stages

1. ☀️ **Evaporation** — heat turns liquid water into water vapor.
2. ☁️ **Condensation** — water vapor cools and forms clouds.
3. 🌧️ **Precipitation** — water falls as rain, snow, sleet, or hail.
4. 🌊 **Collection** — water collects in rivers, lakes, oceans, and other places.

Then the cycle repeats.

### Easy memory trick

**Evaporation → Condensation → Precipitation → Collection**

### Quick question

What happens during evaporation?`;
  }

  // ----------------------------------------------------------
  // CELL
  // ----------------------------------------------------------

  if (
    lower.includes('what is a cell') ||
    lower.includes('explain cell') ||
    lower.includes('cells')
  ) {
    return `### 🔬 What is a Cell?

A **cell** is the basic unit of life.

Think of a cell like a tiny building block that makes up living things.

### Examples

Your body contains many cells.

Plants also contain cells.

### Important idea

Different cells can have different jobs.

For example:

- Muscle cells help with movement.
- Nerve cells help send signals.
- Plant cells help plants grow and make food.

### Easy definition

**A cell is the smallest basic unit that can carry out the processes of life.**

### Quick question

Are plants made of cells?`;
  }

  // ----------------------------------------------------------
  // ATOM
  // ----------------------------------------------------------

  if (
    lower.includes('what is an atom') ||
    lower.includes('explain atom') ||
    lower === 'atom'
  ) {
    return `### ⚛️ What is an Atom?

An **atom** is a basic unit of matter.

Everything around us is made from atoms.

### Main parts

Atoms contain:

- **Protons**
- **Neutrons**
- **Electrons**

Protons and neutrons are found in the nucleus.

Electrons move around the nucleus.

### Simple example

A table, a pencil, water, and your body are all made from matter, and matter is made from atoms.

### Quick question

Name the three main particles found in an atom.`;
  }

  // ----------------------------------------------------------
  // VARIABLE
  // ----------------------------------------------------------

  if (
    lower.includes('what is a variable') ||
    lower.includes('variables')
  ) {
    return `### 🐍 Python Variables

A **variable** is a name used to store a value.

### Example

\`\`\`python
age = 15
name = "Alex"
\`\`\`

Here:

- \`age\` stores the number **15**.
- \`name\` stores the text **Alex**.

### Think of it like this

A variable is like a labeled box.

The label tells you what is inside the box.

### Example

\`\`\`python
score = 100
print(score)
\`\`\`

The program prints:

\`\`\`
100
\`\`\`

### Try it

Create a variable called \`favorite_subject\` and store a subject in it.`;
  }

  // ----------------------------------------------------------
  // PYTHON FUNCTION
  // ----------------------------------------------------------

  if (
    lower.includes('python function') ||
    lower.includes('what is a function') ||
    lower === 'function'
  ) {
    return `### 🐍 Python Functions

A **function** is a reusable block of code that performs a task.

### Example

\`\`\`python
def greet():
    print("Hello!")
\`\`\`

We can run the function by writing:

\`\`\`python
greet()
\`\`\`

### Why use functions?

Functions help us:

- Reuse code.
- Organize programs.
- Avoid repeating the same code.
- Make programs easier to understand.

### Simple idea

**Define once → use many times**

### Practice

Create a function called \`welcome\` that prints:

\`\`\`
Welcome to Python!
\`\`\``;
  }

  // ----------------------------------------------------------
  // PYTHON LOOP
  // ----------------------------------------------------------

  if (
    lower.includes('python loop') ||
    lower.includes('what is a loop') ||
    lower === 'loop'
  ) {
    return `### 🔁 Python Loops

A **loop** repeats a piece of code.

### Example

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

This prints:

\`\`\`
0
1
2
3
4
\`\`\`

### Why use loops?

Instead of writing the same instruction many times, we can use a loop.

### Simple idea

**Loop = repeat**

### Practice

Try changing \`range(5)\` to \`range(10)\`.

What numbers do you think will appear?`;
  }

  // ----------------------------------------------------------
  // PYTHON IF STATEMENT
  // ----------------------------------------------------------

  if (
    lower.includes('if statement') ||
    lower.includes('python if') ||
    lower.includes('conditional')
  ) {
    return `### 🐍 Python If Statements

An **if statement** allows a program to make a decision.

### Example

\`\`\`python
age = 18

if age >= 18:
    print("Adult")
\`\`\`

The program checks whether the condition is true.

### Simple idea

**IF something is true → do something**

### Another example

\`\`\`python
score = 90

if score >= 50:
    print("Pass")
\`\`\`

Because 90 is greater than 50, the program prints **Pass**.

### Practice

What do you think happens when \`score = 30\`?`;
  }

  // ----------------------------------------------------------
  // PYTHON LIST VS TUPLE
  // ----------------------------------------------------------

  if (
    lower.includes('list and tuple') ||
    lower.includes('list vs tuple') ||
    lower.includes('difference between a list and a tuple') ||
    lower.includes('tuple vs list')
  ) {
    return `### 🐍 Python: Lists vs Tuples

Both **Lists** and **Tuples** store collections of items, but they have key differences:

| Feature | List \`[]\` | Tuple \`()\` |
| :--- | :--- | :--- |
| **Mutability** | **Mutable** (can be changed) | **Immutable** (cannot be changed) |
| **Syntax** | Square brackets \`[1, 2, 3]\` | Parentheses \`(1, 2, 3)\` |
| **Performance** | Slightly slower | Faster and memory-efficient |
| **Use Case** | Data that needs adding/editing | Fixed constants, coordinates |

### Example Comparison:

\`\`\`python
# List (modifiable)
fruits = ["apple", "banana"]
fruits.append("orange") # ✓ Allowed!

# Tuple (fixed)
point = (10, 20)
# point[0] = 15 # ❌ TypeError: tuples cannot be modified
\`\`\`

### Key Takeaway
Use **Lists** when your data will change during program execution; use **Tuples** for fixed, protected values.`;
  }

  // ----------------------------------------------------------
  // PYTHON CODE LINE BY LINE
  // ----------------------------------------------------------

  if (
    lower.includes('line by line') ||
    lower.includes('explain this code') ||
    lower.includes('breakdown of this code')
  ) {
    return `### 🔍 Line-by-Line Python Code Explanation

Here is a structured breakdown of how the program executes:

1. **Initialization**: Variables and data structures are allocated in memory.
2. **Control Flow / Logic**: Python evaluates expressions and checks conditions from top to bottom.
3. **Loop Execution**: Any \`for\` or \`while\` blocks repeat their inner indented lines for each item.
4. **Function Calls**: Code jumps to the defined \`def\` block, processes the arguments, and returns values.
5. **Output Display**: The \`print()\` function outputs calculated results directly to the terminal.

💡 **Tip:** In Python, proper 4-space indentation defines which lines belong inside a function or loop!`;
  }

  // ----------------------------------------------------------
  // PYTHON DEBUGGING & ERRORS
  // ----------------------------------------------------------

  if (
    lower.includes('why am i getting this error') ||
    lower.includes('error') ||
    lower.includes('why does this code not work') ||
    lower.includes('fix the bug')
  ) {
    return `### 🛠️ Python Error Diagnosis & Fixes

Common Python errors and how to resolve them:

- **SyntaxError**: Missing colon \`:\` at the end of \`if\`, \`for\`, or \`def\` statements.
- **IndentationError**: Inconsistent spaces or tabs inside code blocks. Always use 4 spaces.
- **NameError**: Using a variable before assigning it, or a typo in the variable name.
- **TypeError**: Trying to combine incompatible types (e.g., adding a string to an integer: \`"age: " + 16\`). Use \`f"age: {16}"\` instead.
- **IndexError**: Trying to access a list item at an index that doesn't exist (e.g., \`list[5]\` when list only has 3 items).

💡 **How to fix:** Check the line number mentioned in the error message, verify spelling, and ensure variables are initialized.`;
  }

  // ----------------------------------------------------------
  // PYTHON CODE IMPROVEMENT
  // ----------------------------------------------------------

  if (
    lower.includes('improve') ||
    lower.includes('best practices') ||
    lower.includes('clean code')
  ) {
    return `### ✨ Suggestions for Python Code Improvement

Here are three ways to make your Python code cleaner and more Pythonic:

1. **Use f-strings for formatting**:
   \`\`\`python
   # Instead of: print("Hello " + name + ", age " + str(age))
   print(f"Hello {name}, age {age}")
   \`\`\`

2. **Use descriptive variable names**:
   Choose meaningful names like \`total_score\` instead of single letters like \`s\`.

3. **Keep functions small and focused**:
   Each function should ideally perform one clear task and return a result.`;
  }


  // ----------------------------------------------------------
  // FRACTIONS
  // ----------------------------------------------------------

  if (lower.includes('fraction')) {
    return `### ➗ Fractions

A **fraction** represents part of a whole.

For example:

**3/4**

The top number, **3**, is the numerator.

The bottom number, **4**, is the denominator.

### Example

Imagine a pizza divided into 4 equal pieces.

If you eat 3 pieces, you ate:

**3/4**

### Remember

- Numerator = top number
- Denominator = bottom number

### Practice

In **2/5**, what is the numerator?`;
  }

  // ----------------------------------------------------------
  // ALGEBRA
  // ----------------------------------------------------------

  if (
    lower.includes('algebra') ||
    lower.includes('solve for x')
  ) {
    return `### ➕ Algebra

Algebra uses letters and numbers to represent unknown values.

### Example

\`\`\`
x + 5 = 12
\`\`\`

We want to find **x**.

Subtract 5 from both sides:

\`\`\`
x = 12 - 5
\`\`\`

Therefore:

\`\`\`
x = 7
\`\`\`

### Final answer

**x = 7**

### Important idea

Whatever operation you perform on one side of an equation, perform the same operation on the other side.

### Practice

Try:

\`\`\`
x + 3 = 10
\`\`\`

What is x?`;
  }

  // ----------------------------------------------------------
  // GENERAL STUDY QUESTION
  // ----------------------------------------------------------

  return getGeneralTutorResponse(text, mode);
}

// ============================================================
// GENERAL TUTOR RESPONSE
// ============================================================

function getGeneralTutorResponse(text, mode) {
  if (mode === 'beginner') {
    return `### 📚 Let's Learn

You asked:

**${text}**

Let's break the topic into small, easy parts.

### Step 1 — Understand the idea

First, identify the main concept in the question.

### Step 2 — Learn an example

Try to connect the concept to something you already know.

### Step 3 — Practice

The best way to learn is to try a small example yourself.

### 💡 Study Tip

Don't worry if you don't understand something immediately. Break it into smaller pieces and learn one part at a time.

Can you tell me what you already know about this topic?`;
  }

  if (mode === 'exam') {
    return `### 📝 Exam Study

**Question:**

${text}

### How to study this topic

1. Learn the definition.
2. Understand the main concept.
3. Memorize important formulas or facts.
4. Practice questions.
5. Check your mistakes.

### Exam Tip

Write your answer clearly and include important keywords related to the topic.

### Practice

Try explaining the answer in your own words in 2–3 sentences.`;
  }

  if (mode === 'socratic') {
    return `### 🤔 Let's Think

Your question is:

**${text}**

Instead of giving you the answer immediately, let's discover it together.

**Question 1:** What do you already know about this topic?

**Question 2:** What part of the question seems most important?

**Question 3:** Can you think of an example?

Give it a try!`;
  }

  if (mode === 'deep') {
    return `### 📖 Detailed Explanation

You asked:

**${text}**

To understand this properly, start with the basic definition and then connect it to examples and applications.

### 1. Core idea

The first step is understanding what the concept means.

### 2. Important details

Look at the rules, relationships, and examples connected to the concept.

### 3. Application

Try using the concept in a real problem.

### 4. Practice

Create a small example and explain why your answer makes sense.

If you tell me the exact topic or question, I can break it down further.`;
  }

  return `### 📚 AI Tutor

You asked:

**${text}**

Let's understand it step by step.

### Step 1 — Understand

Start by identifying the main idea behind the question.

### Step 2 — Learn

Look at the definition, rules, and important facts.

### Step 3 — Example

Try connecting the concept to a simple real-world example.

### Step 4 — Practice

Use what you learned to solve a small problem.

### 💡 Remember

Understanding **why** something works is usually more useful than simply memorizing it.

If you give me the exact topic, I can explain it in a simpler way.`;
}

// ============================================================
// QUESTION SOLVER
// ============================================================

export function getMockSolverResponse(question) {
  const q = cleanText(question);

  if (!q) {
    return `### ❓ QUESTION

No question was entered.

### 📝 SOLUTION

Please enter a question and I'll solve it step by step.`;
  }

  // ----------------------------------------------------------
  // UPGRADED MATH & TRIGONOMETRY SOLVER
  // ----------------------------------------------------------
  const result = solveMathProblem(q);

  // If detected as a concept question, word problem, or syllabus inquiry,
  // invoke the AI Tutor fallback to provide a comprehensive step-by-step solution
  if (result.type === 'concept_question') {
    const tutorResponse = getMockTutorResponse(q, 'standard');
    return `### 🏷️ PROBLEM TYPE: AI Tutor Solution & Conceptual Explanation

### ❓ QUESTION
${q}

---

${tutorResponse}

---

### 💡 NOTE
This question was solved using the **AI Tutor**. You can also enter math calculations such as \`cos(90°) + sin(90°)\`, \`2sin(30°) + cos(60°)\`, \`tan(45°)\`, \`25% of 80\`, or \`x + 5 = 12\` for instant step-by-step calculations.`;
  }

  if (result.content) {
    return result.content;
  }

  // Fallback to AI Tutor for anything else
  const fallback = getMockTutorResponse(q, 'standard');
  return `### 🏷️ PROBLEM TYPE: AI Tutor Solution

### ❓ QUESTION
${q}

---

${fallback}`;
}

// ============================================================
// QUIZ DATA
// ============================================================

const quizTemplates = {
  math: [
    {
      question: 'What is 7 × 8?',
      options: ['54', '56', '64', '48'],
      correct: 1,
      explanation: '7 × 8 = 56.'
    },
    {
      question: 'What is 25 + 15?',
      options: ['30', '35', '40', '45'],
      correct: 2,
      explanation: '25 + 15 = 40.'
    },
    {
      question: 'What is 100 ÷ 4?',
      options: ['20', '25', '30', '40'],
      correct: 1,
      explanation: '100 ÷ 4 = 25.'
    },
    {
      question: 'What is 50 - 18?',
      options: ['28', '32', '38', '42'],
      correct: 1,
      explanation: '50 - 18 = 32.'
    },
    {
      question: 'What is 10% of 200?',
      options: ['10', '20', '30', '40'],
      correct: 1,
      explanation: '10% of 200 = 20.'
    }
  ],

  science: [
    {
      question: 'What planet do humans live on?',
      options: ['Mars', 'Earth', 'Venus', 'Jupiter'],
      correct: 1,
      explanation: 'Humans live on Earth.'
    },
    {
      question: 'What gas do humans need to breathe?',
      options: ['Oxygen', 'Helium', 'Hydrogen', 'Carbon dioxide'],
      correct: 0,
      explanation: 'Humans need oxygen for respiration.'
    },
    {
      question: 'What force pulls objects toward Earth?',
      options: ['Magnetism', 'Friction', 'Gravity', 'Electricity'],
      correct: 2,
      explanation: 'Gravity pulls objects toward Earth.'
    },
    {
      question: 'What is H2O commonly called?',
      options: ['Salt', 'Water', 'Oxygen', 'Hydrogen'],
      correct: 1,
      explanation: 'H2O is water.'
    },
    {
      question: 'Which organ pumps blood around the body?',
      options: ['Lung', 'Brain', 'Heart', 'Stomach'],
      correct: 2,
      explanation: 'The heart pumps blood around the body.'
    }
  ],

  programming: [
    {
      question: 'Which function displays text in Python?',
      options: ['show()', 'display()', 'print()', 'write()'],
      correct: 2,
      explanation: 'print() displays output in Python.'
    },
    {
      question: 'Which symbol starts a Python comment?',
      options: ['//', '#', '<!--', '/*'],
      correct: 1,
      explanation: 'Python comments normally begin with #.'
    },
    {
      question: 'Which keyword creates a Python function?',
      options: ['function', 'func', 'def', 'create'],
      correct: 2,
      explanation: 'Python uses def to define functions.'
    },
    {
      question: 'Which data type stores True or False?',
      options: ['String', 'Boolean', 'List', 'Float'],
      correct: 1,
      explanation: 'Boolean values are True or False.'
    },
    {
      question: 'Which one is a Python variable assignment?',
      options: ['x == 5', 'x = 5', 'x :=: 5', 'set x 5'],
      correct: 1,
      explanation: 'x = 5 assigns 5 to x.'
    }
  ],

  english: [
    {
      question: 'Which word is a noun?',
      options: ['Run', 'Beautiful', 'Teacher', 'Quickly'],
      correct: 2,
      explanation: 'Teacher is a noun because it names a person.'
    },
    {
      question: 'Which word is a verb?',
      options: ['Jump', 'Blue', 'Book', 'Happy'],
      correct: 0,
      explanation: 'Jump is a verb because it describes an action.'
    },
    {
      question: 'What is the opposite of hot?',
      options: ['Warm', 'Cold', 'Bright', 'Fast'],
      correct: 1,
      explanation: 'The opposite of hot is cold.'
    },
    {
      question: 'Which punctuation mark ends a normal statement?',
      options: ['?', '.', ',', ':'],
      correct: 1,
      explanation: 'A full stop or period ends a normal statement.'
    },
    {
      question: 'Which word is an adjective?',
      options: ['Quickly', 'Run', 'Beautiful', 'Teacher'],
      correct: 2,
      explanation: 'Beautiful is an adjective because it describes something.'
    }
  ]
};

// ============================================================
// MOCK QUIZ QUESTIONS
// ============================================================

export function getMockQuizQuestions(
  subject,
  count = 5,
  difficulty = 'medium'
) {
  const subjectKey = cleanText(subject)
    .toLowerCase()
    .replace(/\s+/g, '_');

  const questions =
    quizTemplates[subjectKey] || quizTemplates.math;

  const shuffled = [...questions].sort(
    () => Math.random() - 0.5
  );

  const requestedCount = Number(count) || 5;

  const selected = shuffled.slice(
    0,
    Math.min(requestedCount, shuffled.length)
  );

  return selected.map((q, index) => {
    const indices = q.options.map((_, i) => i);

    const shuffledIndices = [...indices].sort(
      () => Math.random() - 0.5
    );

    const newCorrect =
      shuffledIndices.indexOf(q.correct);

    return {
      id: index + 1,
      question: q.question,
      options: shuffledIndices.map(
        (i) => q.options[i]
      ),
      correct: newCorrect,
      explanation: q.explanation,
      difficulty
    };
  });
}

// ============================================================
// FLASHCARD DATA
// ============================================================

const flashcardTemplates = {
  math: [
    {
      front: 'What is addition?',
      back: 'Addition combines numbers to find a total.'
    },
    {
      front: 'What is subtraction?',
      back: 'Subtraction finds the difference between numbers.'
    },
    {
      front: 'What is multiplication?',
      back: 'Multiplication represents equal groups.'
    },
    {
      front: 'What is division?',
      back: 'Division separates a quantity into equal groups.'
    },
    {
      front: 'What is a fraction?',
      back: 'A fraction represents part of a whole.'
    }
  ],

  science: [
    {
      front: 'What is gravity?',
      back: 'Gravity is a force that attracts masses toward each other.'
    },
    {
      front: 'What is photosynthesis?',
      back: 'Photosynthesis is how green plants use light energy to make food.'
    },
    {
      front: 'What is the water cycle?',
      back: 'The water cycle describes the continuous movement of water through Earth’s environment.'
    },
    {
      front: 'What is an atom?',
      back: 'An atom is a basic unit of matter.'
    },
    {
      front: 'What is energy?',
      back: 'Energy is the ability to cause change or do work.'
    }
  ],

  programming: [
    {
      front: 'What is a variable?',
      back: 'A variable is a name that refers to a value.'
    },
    {
      front: 'What is a function?',
      back: 'A function is a reusable block of code that performs a task.'
    },
    {
      front: 'What is a loop?',
      back: 'A loop repeats code.'
    },
    {
      front: 'What is a Python list?',
      back: 'A list is an ordered collection of values.'
    },
    {
      front: 'What does print() do?',
      back: 'print() displays information in the program output.'
    }
  ],

  english: [
    {
      front: 'What is a noun?',
      back: 'A noun names a person, place, thing, or idea.'
    },
    {
      front: 'What is a verb?',
      back: 'A verb describes an action or state.'
    },
    {
      front: 'What is an adjective?',
      back: 'An adjective describes a noun.'
    },
    {
      front: 'What is an adverb?',
      back: 'An adverb often describes how, when, or where something happens.'
    },
    {
      front: 'What is a sentence?',
      back: 'A sentence expresses a complete thought.'
    }
  ]
};

// ============================================================
// MOCK FLASHCARDS
// ============================================================

export function getMockFlashcards(subject, count = 5) {
  const subjectKey = cleanText(subject)
    .toLowerCase()
    .replace(/\s+/g, '_');

  const cards =
    flashcardTemplates[subjectKey] ||
    flashcardTemplates.math;

  const shuffled = [...cards].sort(
    () => Math.random() - 0.5
  );

  const requestedCount = Number(count) || 5;

  return shuffled
    .slice(0, Math.min(requestedCount, shuffled.length))
    .map((card, index) => ({
      id: index + 1,
      front: card.front,
      back: card.back,
      difficulty: 'medium',
      reviewed: false
    }));
}

// ============================================================
// MOCK STUDY PLAN
// ============================================================

export function getMockStudyPlan(
  subjects = ['Math', 'Science', 'English'],
  days = 7,
  minutesPerDay = 60
) {
  const subjectList =
    Array.isArray(subjects) && subjects.length > 0
      ? subjects
      : ['Math', 'Science', 'English'];

  const totalDays = Math.max(
    1,
    Number(days) || 7
  );

  const totalMinutes = Math.max(
    15,
    Number(minutesPerDay) || 60
  );

  const topicMap = {
    Math: [
      'Arithmetic',
      'Fractions',
      'Algebra',
      'Geometry',
      'Practice Problems'
    ],

    Science: [
      'Physics',
      'Chemistry',
      'Biology',
      'Experiments',
      'Revision'
    ],

    English: [
      'Grammar',
      'Vocabulary',
      'Reading',
      'Writing',
      'Revision'
    ],

    Programming: [
      'Variables',
      'Conditions',
      'Loops',
      'Functions',
      'Projects'
    ]
  };

  const plan = [];

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const date = new Date();

    date.setDate(
      date.getDate() + dayIndex
    );

    const tasks = subjectList.map(
      (subject, subjectIndex) => {
        const subjectName =
          cleanText(subject) || 'General';

        const topics =
          topicMap[subjectName] || [
            'Review',
            'Practice'
          ];

        const topic =
          topics[
            (dayIndex + subjectIndex) %
              topics.length
          ];

        const duration = Math.max(
          5,
          Math.floor(
            totalMinutes /
              subjectList.length
          )
        );

        return {
          id: `${dayIndex + 1}-${subjectName}`
            .toLowerCase()
            .replace(/\s+/g, '-'),

          subject: subjectName,

          topic,

          duration,

          completed: false,

          type:
            dayIndex % 7 === 6
              ? 'revision'
              : 'study'
        };
      }
    );

    plan.push({
      day: date.toLocaleDateString(
        'en-US',
        {
          weekday: 'long'
        }
      ),

      date: date
        .toISOString()
        .split('T')[0],

      tasks
    });
  }

  return plan;
}

// ============================================================
// MOCK NOTE SUMMARY
// ============================================================

export function getMockNoteSummary(
  content,
  action = 'summarize'
) {
  const text = cleanText(content);

  if (!text) {
    return `### NOTE SUMMARY

No notes were provided.

Please add some notes and try again.`;
  }

  if (action === 'simplify') {
    return `### SIMPLE VERSION

Here is a simpler version of your notes:

${text}

### STUDY TIP

Focus on the main idea first, then learn the important details.`;
  }

  if (action === 'questions') {
    return `### PRACTICE QUESTIONS

Based on your notes, try these questions:

1. What is the main idea?
2. What are the most important facts?
3. Can you explain the topic in your own words?
4. Can you give an example?

### YOUR NOTES

${text}`;
  }

  return `### SUMMARY

Here are some useful study points:

1. **Main Concept:** Find the central idea.
2. **Key Details:** Remember important facts and definitions.
3. **Applications:** Think about how the knowledge can be used.
4. **Connections:** Connect the topic with things you already know.

### YOUR NOTES

${text}

### STUDY TIP

Try explaining the topic without looking at your notes.`;
}

// ============================================================
// MOCK CODING RESPONSE
// ============================================================

export function getMockCodingResponse(
  topic,
  type = 'learn'
) {
  const cleanTopic =
    cleanText(topic) || 'Python';

  if (type === 'challenge') {
    return {
      concept: cleanTopic,

      example: `# Example: ${cleanTopic}
print("Hello, World!")`,

      explanation:
        `This example introduces the basic idea of ${cleanTopic}.`,

      challenge:
        `Write a small Python program that uses ${cleanTopic}. Start with a simple version and then improve it.`,

      hint:
        `Look at the example and think about which part of the code you can change.`
    };
  }

  return `### 🐍 Python: ${cleanTopic}

Let's learn **${cleanTopic}** step by step.

### WHAT IS IT?

${cleanTopic} is a programming concept that becomes easier when you practice it with small examples.

### EXAMPLE

\`\`\`python
print("Let's practice ${cleanTopic}!")
\`\`\`

### KEY POINTS

1. Learn the basic syntax.
2. Understand what each line does.
3. Change the example.
4. Run the program.
5. Build a small project.

### PRACTICE

Write your own Python example using **${cleanTopic}**.

Start simple and improve it step by step.`;
}

// ============================================================
// STRUCTURED INTERMEDIATE SYLLABUS MOCK RESPONSE
// ============================================================

export function generateStructuredIntermediateResponse(text, mode, context = {}) {
  const stream = context.stream || 'MPC';
  const year = context.year || '1st Year / Class 11';
  const subject = context.subject || 'Physics';
  const chapter = context.chapter || 'Mechanics';
  const topic = context.topic || 'Newton\'s Laws';
  const action = context.action || 'Explain Topic';
  const lower = (text + ' ' + topic + ' ' + chapter).toLowerCase();

  // Action: Simple Explanation
  if (action === 'Simple Explanation' || mode === 'beginner' || lower.includes('simple')) {
    return `### 💡 ${topic} — Simple Explanation
**Stream: ${stream} | ${year} | ${subject} → ${chapter}**

Let's break down **${topic}** in simple, intuitive terms with clear everyday examples!

---

### 🌟 The Core Concept
* **What is it?** ${topic} is an essential concept in **${subject}** that explains how systems behave in the real world.
* **Analogy**: Think of ${topic} like a set of building blocks. Once you understand the fundamental rule, everything else clicks into place easily.

---

### 🔑 3 Key Takeaways
1. **Rule 1**: Master the basic definition and fundamental equation/principle of ${topic}.
2. **Rule 2**: Identify how changing one variable influences the rest of the system.
3. **Rule 3**: Relate theoretical concepts to daily observations.

---

### 🎯 Example in Action
When studying **${topic}** for ${year} exams:
- Break complex problems down into given values, required targets, and the relevant principle.
- Write each step clearly with correct units and terminology.

---

### 🧪 Quick Practice Question
How would you explain the importance of **${topic}** in ${subject} in one sentence?`;
  }

  // Action: Detailed Explanation
  if (action === 'Detailed Explanation' || mode === 'deep' || lower.includes('detailed') || lower.includes('derivation')) {
    return `### 🧠 ${topic} — Comprehensive Deep Dive
**Stream: ${stream} | ${year} | ${subject} → ${chapter}**

---

### 1. Conceptual Framework & Definitions
**${topic}** forms a foundational pillar in ${subject}. It provides rigorous quantitative and analytical frameworks required for Intermediate Board examinations and competitive entrance tests (JEE/NEET/EAMCET/CA Foundation).

---

### 2. Theoretical Principles & Governing Equations
- **Fundamental Law**: Describes the underlying interactions and invariants governing ${topic}.
- **Mathematical Expression**: Formulates relationships between primary variables, parameters, and boundary conditions.
- **Assumptions & Scope**: Applies under standard conditions, isolating primary effects from extraneous perturbations.

---

### 3. Step-by-Step Analytical Insights
1. **Initial State & Setup**: Establish coordinate frames, reference levels, and known quantities.
2. **Mechanisms / Processes**: Detail each consecutive transition or reaction phase.
3. **Equilibrium & Conservation**: Apply conservation principles (Mass, Energy, Charge, or Momentum) where applicable.

---

### 4. Advanced Applications & Edge Cases
- Behavior under extreme limit cases and asymptotic values.
- Inter-disciplinary connections across ${stream} subjects.

---

### 📌 Summary Card
- **Primary Formula/Principle**: Core formula and dimensional analysis for ${topic}.
- **SI Units & Constants**: Standard notations used in Intermediate ${subject}.`;
  }

  // Action: Solve Problems / Step-by-Step Solutions
  if (action === 'Solve Problems' || action === 'Step-by-Step Solutions' || lower.includes('solve') || lower.includes('step')) {
    return `### 🧩 Step-by-Step Problem Solver: ${topic}
**Intermediate Syllabus — ${stream} | ${year} | ${subject}**

---

### ❓ PROBLEM
A standard Intermediate board exam question on **${topic}** (${chapter}):
Calculate the primary required value given standard conditions and parameters.

---

### 🎯 GIVEN DATA & CONCEPT
- **Subject / Chapter**: ${subject} — ${chapter}
- **Governing Concept**: ${topic}
- **Required**: Determine final numerical / analytical result with full intermediate steps.

---

### 📝 STEP-BY-STEP SOLUTION

**Step 1: State the fundamental formula / law**
Write down the primary formula for ${topic} and define each variable.

**Step 2: Substitute given values with SI units**
Ensure all dimensions and units are unified before carrying out computations.

**Step 3: Simplify and calculate intermediate expressions**
Compute step-by-step to avoid calculation errors and retain precision.

**Step 4: State the final result with appropriate units and significant figures**
Highlight the final answer clearly for maximum marks in examiner evaluation.

---

### ✅ FINAL VERIFICATION
- Double-check dimensional consistency and physical/economic sense.
- Try varying the initial parameters to test your problem-solving speed!`;
  }

  // Action: Generate MCQs
  if (action === 'Generate MCQs' || lower.includes('mcq')) {
    return `### 🔘 High-Yield MCQs: ${topic}
**Stream: ${stream} | ${year} | ${subject} (${chapter})**

**Q1. What is the fundamental principle behind ${topic}?**
- A) Conservation of energy / core equilibrium *(Correct)*
- B) Random fluctuation
- C) Inverse variation under all conditions
- D) Linear degradation
*Explanation: ${topic} fundamentally relies on standard conservation and equilibrium laws in ${subject}.*

**Q2. In ${chapter}, when applying principles of ${topic}, which condition must be met?**
- A) Temperature must approach infinity
- B) System boundaries must be well-defined *(Correct)*
- C) Only qualitative descriptions are valid
- D) No mathematical models apply
*Explanation: Defining standard initial and boundary conditions is essential for rigorous analysis in ${subject}.*

**Q3. Which of the following best characterizes ${topic} at the Intermediate level?**
- A) Purely theoretical with no practical application
- B) Standard core curriculum topic with direct numerical and analytical relevance *(Correct)*
- C) Deprecated historical concept
- D) Applicable only in micro-systems
*Explanation: ${topic} is a high-frequency topic in Class 11–12 / Intermediate board exams.*

**Q4. What is the standard SI unit / representation associated with ${topic}?**
- A) Dimensionless ratio or standard derived SI unit *(Correct)*
- B) Imperial units only
- C) No units exist
- D) Arbitrary scale
*Explanation: Standard units must always be included in Intermediate board solutions.*

**Q5. In exam problem-solving for ${topic}, what is the most common student pitfall?**
- A) Writing too neatly
- B) Unit mismatch and skipping step-by-step reasoning *(Correct)*
- C) Using the standard formula
- D) Stating assumptions clearly
*Explanation: Always verify units and include full formula statements to secure maximum step marks.*`;
  }

  // Action: Summarize Chapter / Revision Mode / Exam Prep
  if (action === 'Summarize Chapter' || action === 'Revision Mode' || action === 'Exam Preparation' || lower.includes('summar') || lower.includes('revis') || lower.includes('exam')) {
    return `### 🏆 Rapid Revision & Exam Blueprint: ${topic}
**Stream: ${stream} | ${year} | ${subject} → ${chapter}**

---

### 📋 High-Yield Summary & Core Definitions
* **Core Topic**: ${topic}
* **Chapter Significance**: Essential for ${year} ${subject} board exams and entrance tests.
* **Key Concept**: Understand definitions, standard diagram/graphical representations, and mathematical models.

---

### ⚡ Essential Formulas & High-Probability Points
- **Primary Equation / Law**: State the fundamental law governing ${topic}.
- **Diagrams / Graphs**: Practice standard labeling (crucial for 4-mark and 8-mark questions).
- **Key Relationships**: Be prepared to explain direct and inverse dependencies between parameters.

---

### ⚠️ Common Mistakes to Avoid
1. Forgetting to write units in final calculations.
2. Missing definitions or assumptions when stating laws/theorems.
3. Incomplete diagrams without proper axis labels or annotations.

---

### 🎯 Top 3 Board Exam Practice Questions
1. **Short Answer (2 Marks)**: Define ${topic} and give its SI unit or main characteristic.
2. **Medium Answer (4 Marks)**: Explain the principle/mechanism of ${topic} with a suitable example/diagram.
3. **Long Answer (8 Marks)**: State and derive the complete formula/theorem for ${topic} and solve a numerical problem.`;
  }

  // Default: Comprehensive Explain Topic
  return `### 📖 ${topic}
**Stream: ${stream} | ${year} | ${subject} → ${chapter}**

Welcome to your study module on **${topic}**! Here is a structured overview designed for the **Intermediate ${year} (${stream})** curriculum.

---

### 1. Introduction & Core Concept
**${topic}** is a pivotal component of **${chapter}** in **${subject}**. It develops critical analytical skills and forms the basis for subsequent advanced topics.

---

### 2. Key Principles & Terminology
- **Fundamental Definition**: A clear, board-standard definition of ${topic}.
- **Core Components**: The primary factors, variables, and interactions involved.
- **Physical / Theoretical Interpretation**: How ${topic} works in practical and academic contexts.

---

### 3. Step-by-Step Learning Guide
1. **Understand the Foundation**: Review the basic definitions and prerequisites.
2. **Apply the Principles**: Work through standard examples and typical problem types.
3. **Practice & Review**: Test your knowledge using MCQs, step-by-step problem solving, and chapter summaries.

---

### 💡 Suggested Next Actions
Use the quick action buttons above:
- Click **"Simple Explanation"** for intuitive analogies.
- Click **"Solve Problems"** for step-by-step numerical/theoretical walkthroughs.
- Click **"Generate MCQs"** to test your exam readiness!`;
}