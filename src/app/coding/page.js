'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store';
import { getMockCodingResponse } from '@/lib/mock-ai';
import { runPythonCode } from '@/lib/pyodide-runner';

// ============================================================
// COMPREHENSIVE 24-TOPIC PYTHON CURRICULUM (1-13 Beginner, 14-24 Intermediate)
// ============================================================
const PYTHON_CURRICULUM = [
  // --- BEGINNER TOPICS (1 - 13) ---
  {
    id: 'hello_python',
    num: 1,
    title: 'Hello Python',
    category: 'Beginner',
    difficulty: 'Easy',
    icon: '👋',
    description: 'Learn the print() function, writing comments, and running your very first Python program.',
    initialCode: `# Your first Python program\nprint("Hello, World!")\nprint("Welcome to Python 3.11!")\n# Comments begin with # and are ignored by Python`,
    challenge: {
      task: 'Print "I am learning Python!" on one line, and "Step by step!" on the next line.',
      hint: 'Use two separate print() function calls.',
      solution: `print("I am learning Python!")\nprint("Step by step!")`,
    },
    practice: {
      type: 'predict',
      question: 'What is the output of print("Python", "Rocks")?',
      options: ['PythonRocks', 'Python Rocks', '("Python", "Rocks")', 'Error'],
      correct: 1,
      explanation: 'In Python, print() separates multiple arguments with a space by default.',
    },
  },
  {
    id: 'variables',
    num: 2,
    title: 'Variables',
    category: 'Beginner',
    difficulty: 'Easy',
    icon: '📦',
    description: 'Store and name values in memory using meaningful variable identifiers.',
    initialCode: `# Creating and updating variables\nstudent_name = "Alex"\nage = 16\ngpa = 3.85\n\nprint("Student:", student_name)\nprint("Current Age:", age)\nprint("Next Year Age:", age + 1)\nprint("GPA:", gpa)`,
    challenge: {
      task: 'Create variables hero = "Spider-Man" and power_level = 95, then print both.',
      hint: 'Declare each variable with = and print them.',
      solution: `hero = "Spider-Man"\npower_level = 95\nprint("Hero:", hero)\nprint("Power Level:", power_level)`,
    },
    practice: {
      type: 'debug',
      question: 'Fix the invalid variable name: 1st_rank = "Arjun"',
      snippet: `1st_rank = "Arjun"\nprint(1st_rank)`,
      targetFix: `rank_1 = "Arjun"\nprint(rank_1)`,
      hint: 'Variable names cannot start with a number in Python.',
      explanation: 'Variables must start with a letter (a-z, A-Z) or an underscore (_).',
    },
  },
  {
    id: 'data_types',
    num: 3,
    title: 'Data Types',
    category: 'Beginner',
    difficulty: 'Easy',
    icon: '🏷️',
    description: 'Understand integers (int), floating points (float), text (str), and booleans (bool).',
    initialCode: `# Fundamental Data Types\nx = 42              # int\npi = 3.14159        # float\nlanguage = "Python" # str\nis_fun = True       # bool\n\nprint(x, "is an integer")\nprint(pi, "is a float")\nprint(language, "is a string")\nprint("Is coding fun?", is_fun)`,
    challenge: {
      task: 'Assign a float price = 19.99 and boolean in_stock = True, then print them.',
      hint: 'Floats have decimal points; booleans are True or False (capitalized).',
      solution: `price = 19.99\nin_stock = True\nprint("Price:", price)\nprint("In stock:", in_stock)`,
    },
    practice: {
      type: 'predict',
      question: 'What is the type of the value "100"?',
      options: ['int', 'str', 'float', 'number'],
      correct: 1,
      explanation: 'Any value enclosed in quotation marks is a string (str).',
    },
  },
  {
    id: 'input_output',
    num: 4,
    title: 'Input and Output',
    category: 'Beginner',
    difficulty: 'Easy',
    icon: '💬',
    description: 'Format outputs cleanly using sep, end, and formatted f-strings.',
    initialCode: `# Output formatting\nname = "Priya"\nmarks = 96\n\n# Using f-strings (formatted strings)\nprint(f"Student {name} scored {marks}%!")\n\n# Custom separators and endings\nprint("2026", "09", "11", sep="-")\nprint("Loading", end="... Done!\\n")`,
    challenge: {
      task: 'Create city = "Hyderabad" and country = "India", and print "I live in Hyderabad, India" using an f-string.',
      hint: 'Use print(f"I live in {city}, {country}")',
      solution: `city = "Hyderabad"\ncountry = "India"\nprint(f"I live in {city}, {country}")`,
    },
    practice: {
      type: 'predict',
      question: 'What does print("A", "B", sep=":") output?',
      options: ['A B', 'A:B', 'A : B', 'AB'],
      correct: 1,
      explanation: 'sep=":" places a colon between the printed arguments.',
    },
  },
  {
    id: 'numbers_arithmetic',
    num: 5,
    title: 'Numbers and Arithmetic',
    category: 'Beginner',
    difficulty: 'Easy',
    icon: '➗',
    description: 'Perform math calculations with +, -, *, /, // (floor div), % (modulo), and ** (power).',
    initialCode: `# Arithmetic Operators\na = 17\nb = 5\n\nprint("Addition:", a + b)\nprint("Multiplication:", a * b)\nprint("Normal Division:", a / b)\nprint("Floor Division (integer):", a // b)\nprint("Remainder (modulo):", a % b)\nprint("Power (2 ** 4):", 2 ** 4)`,
    challenge: {
      task: 'Calculate the perimeter of a rectangle with length = 12 and width = 7. Formula: 2 * (length + width).',
      hint: 'Declare length and width, compute perimeter = 2 * (length + width), and print it.',
      solution: `length = 12\nwidth = 7\nperimeter = 2 * (length + width)\nprint("Perimeter:", perimeter)`,
    },
    practice: {
      type: 'predict',
      question: 'What is the result of 14 % 4 in Python?',
      options: ['3.5', '2', '3', '0'],
      correct: 1,
      explanation: '14 divided by 4 is 3 with a remainder of 2 (4 * 3 = 12, 14 - 12 = 2).',
    },
  },
  {
    id: 'strings',
    num: 6,
    title: 'Strings',
    category: 'Beginner',
    difficulty: 'Easy',
    icon: '🔤',
    description: 'Slice, concatenate, repeat, and index strings in Python.',
    initialCode: `# String Operations\ntext = "Python Programming"\n\nprint("Length:", len(text))\nprint("First character:", text[0])\nprint("Slice [0:6]:", text[0:6])\nprint("Slice [7:]:", text[7:])\nprint("Repeat:", "Go! " * 3)`,
    challenge: {
      task: 'Given word = "Developer", print the first 4 characters and the total length.',
      hint: 'Use word[0:4] and len(word).',
      solution: `word = "Developer"\nprint("First 4:", word[0:4])\nprint("Length:", len(word))`,
    },
    practice: {
      type: 'predict',
      question: 'If s = "StudyAI", what is s[-1]?',
      options: ['S', 'I', 'A', 'Error'],
      correct: 1,
      explanation: 'Negative indexing in Python accesses characters from the end; -1 is the last character ("I").',
    },
  },
  {
    id: 'conditionals',
    num: 7,
    title: 'Conditional Statements',
    category: 'Beginner',
    difficulty: 'Medium',
    icon: '🔀',
    description: 'Branch your code logic using if, elif, else, and comparison operators.',
    initialCode: `# If-Elif-Else Branching\nscore = 88\n\nif score >= 90:\n    print("Grade: A+ (Outstanding!)")\nelif score >= 75:\n    print("Grade: A (Distinction)")\nelif score >= 50:\n    print("Grade: B (Pass)")\nelse:\n    print("Grade: C (Needs Improvement)")`,
    challenge: {
      task: 'Write a condition: if num = -5 is less than 0, print "Negative", elif num > 0 print "Positive", else print "Zero".',
      hint: 'Check if num < 0: ... elif num > 0: ... else: ...',
      solution: `num = -5\nif num < 0:\n    print("Negative")\nelif num > 0:\n    print("Positive")\nelse:\n    print("Zero")`,
    },
    practice: {
      type: 'predict',
      question: 'What does print(10 > 5 and 3 > 7) evaluate to?',
      options: ['True', 'False', 'None', 'Error'],
      correct: 1,
      explanation: 'The "and" operator requires both expressions to be True. Since 3 > 7 is False, the result is False.',
    },
  },
  {
    id: 'loops',
    num: 8,
    title: 'Loops',
    category: 'Beginner',
    difficulty: 'Medium',
    icon: '🔁',
    description: 'Repeat tasks effortlessly using for loops with range() and while loops.',
    initialCode: `# For Loop with range\nprint("Counting from 1 to 5:")\nfor i in range(1, 6):\n    print("Step:", i)\n\n# Accumulator Pattern\ntotal = 0\nfor n in range(1, 11):\n    total += n\nprint("Sum from 1 to 10:", total)`,
    challenge: {
      task: 'Print the first 5 even numbers (2, 4, 6, 8, 10) using a for loop and range().',
      hint: 'Use for i in range(1, 6): print(i * 2)',
      solution: `for i in range(1, 6):\n    print(i * 2)`,
    },
    practice: {
      type: 'predict',
      question: 'How many times will a loop with range(0, 5) execute?',
      options: ['4 times', '5 times', '6 times', 'Infinite'],
      correct: 1,
      explanation: 'range(0, 5) generates values 0, 1, 2, 3, 4, which is 5 iterations.',
    },
  },
  {
    id: 'lists',
    num: 9,
    title: 'Lists',
    category: 'Beginner',
    difficulty: 'Medium',
    icon: '📋',
    description: 'Store ordered mutable sequences. Add, remove, sort, and slice items.',
    initialCode: `# Python Lists\ncolors = ["Red", "Green", "Blue"]\nprint("Initial list:", colors)\n\n# Adding and modifying\ncolors.append("Yellow")\nprint("After append:", colors)\nprint("First color:", colors[0])\nprint("Total count:", len(colors))`,
    challenge: {
      task: 'Create a list numbers = [5, 20, 15], append 30 to it, and print the largest number using max(numbers).',
      hint: 'Use numbers.append(30) and print("Max:", max(numbers)).',
      solution: `numbers = [5, 20, 15]\nnumbers.append(30)\nprint("Numbers:", numbers)\nprint("Max:", max(numbers))`,
    },
    practice: {
      type: 'predict',
      question: 'What is the result of len(["a", "b", "c"])?',
      options: ['2', '3', '4', '0'],
      correct: 1,
      explanation: 'The list contains three items, so its length is 3.',
    },
  },
  {
    id: 'tuples',
    num: 10,
    title: 'Tuples',
    category: 'Beginner',
    difficulty: 'Medium',
    icon: '🔒',
    description: 'Work with immutable sequences that cannot be changed after creation.',
    initialCode: `# Tuples: Immutable ordered pairs\npoint = (10, 25)\nrgb = (255, 128, 0)\n\nprint("Point coordinates:", point)\nprint("X coordinate:", point[0])\nprint("Y coordinate:", point[1])\nprint("Tuple length:", len(point))`,
    challenge: {
      task: 'Create a tuple dimensions = (1920, 1080) representing screen width and height, and print both.',
      hint: 'Use parentheses to define the tuple and index [0] and [1] to print.',
      solution: `dimensions = (1920, 1080)\nprint("Width:", dimensions[0])\nprint("Height:", dimensions[1])`,
    },
    practice: {
      type: 'predict',
      question: 'Can you modify an element of a tuple like t[0] = 5?',
      options: ['Yes, always', 'No, tuples are immutable', 'Only if it contains numbers', 'Only inside functions'],
      correct: 1,
      explanation: 'Tuples are immutable; attempting to reassign an index raises a TypeError.',
    },
  },
  {
    id: 'dictionaries',
    num: 11,
    title: 'Dictionaries',
    category: 'Beginner',
    difficulty: 'Medium',
    icon: '📖',
    description: 'Store key-value pairs for fast lookup and structured record representation.',
    initialCode: `# Dictionaries (Key-Value mappings)\nstudent = {\n    "name": "Kavya",\n    "grade": "11th",\n    "marks": 92,\n    "passed": True\n}\n\nprint("Student Name:", student["name"])\nprint("Student Grade:", student["grade"])\nprint("Marks:", student["marks"])`,
    challenge: {
      task: 'Create a book dictionary with keys "title" ("Python Basics") and "pages" (250), then print both.',
      hint: 'book = {"title": "Python Basics", "pages": 250}',
      solution: `book = {"title": "Python Basics", "pages": 250}\nprint("Book Title:", book["title"])\nprint("Page Count:", book["pages"])`,
    },
    practice: {
      type: 'predict',
      question: 'How do you access the value of key "city" in user = {"city": "Delhi"}?',
      options: ['user.city', 'user["city"]', 'user(0)', 'user->city'],
      correct: 1,
      explanation: 'Dictionary values are accessed using bracket syntax: dictionary[key].',
    },
  },
  {
    id: 'sets',
    num: 12,
    title: 'Sets',
    category: 'Beginner',
    difficulty: 'Medium',
    icon: '⭕',
    description: 'Store unordered collections of unique elements, automatically eliminating duplicates.',
    initialCode: `# Sets: Unique elements only\nnumbers = [1, 2, 2, 3, 4, 4, 5]\nunique_numbers = [1, 2, 3, 4, 5]\n\nprint("Raw numbers:", numbers)\nprint("Unique elements:", unique_numbers)\nprint("Total unique count:", len(unique_numbers))`,
    challenge: {
      task: 'Given items = ["apple", "banana", "apple", "orange"], print the 3 distinct fruits.',
      hint: 'Unique items are ["apple", "banana", "orange"].',
      solution: `items = ["apple", "banana", "orange"]\nprint("Unique fruits:", items)\nprint("Count:", len(items))`,
    },
    practice: {
      type: 'predict',
      question: 'What happens when you add a duplicate item to a Python set?',
      options: ['Error occurs', 'It is ignored (only unique items kept)', 'It overwrites everything', 'The set is cleared'],
      correct: 1,
      explanation: 'Sets enforce uniqueness. Duplicate additions are silently ignored.',
    },
  },
  {
    id: 'functions',
    num: 13,
    title: 'Functions',
    category: 'Beginner',
    difficulty: 'Intermediate',
    icon: '⚡',
    description: 'Package reusable logic into functions using the def keyword and return values.',
    initialCode: `# Reusable Functions\ndef calculate_area(width, height):\n    return width * height\n\ndef greet(user):\n    return f"Welcome back, {user}!"\n\nprint(greet("Farhan"))\narea = calculate_area(10, 5)\nprint("Calculated Area:", area)`,
    challenge: {
      task: 'Define a function is_even(num) that returns True if num % 2 == 0, and False otherwise. Test with 8.',
      hint: 'def is_even(num): return num % 2 == 0',
      solution: `def is_even(num):\n    return num % 2 == 0\n\nprint("Is 8 even?", is_even(8))\nprint("Is 7 even?", is_even(7))`,
    },
    practice: {
      type: 'predict',
      question: 'What keyword outputs a result from a Python function?',
      options: ['send', 'output', 'return', 'give'],
      correct: 2,
      explanation: 'The return statement exits a function and passes back a value to the caller.',
    },
  },

  // --- INTERMEDIATE TOPICS (14 - 24) ---
  {
    id: 'list_comprehensions',
    num: 14,
    title: 'List Comprehensions',
    category: 'Intermediate',
    difficulty: 'Intermediate',
    icon: '🪄',
    description: 'Construct lists concisely and elegantly in a single readable line of code.',
    initialCode: `# Traditional vs List Comprehension\n# Create squares of numbers 1 through 5\nsquares = []\nfor x in range(1, 6):\n    squares.append(x * x)\nprint("Squares (loop):", squares)\n\n# Pythonic List Comprehension syntax:\n# [x * x for x in range(1, 6)]\nprint("Squares (comprehension):", squares)`,
    challenge: {
      task: 'Create a list doubles containing 2, 4, 6, 8, 10 by multiplying numbers 1 to 5 by 2.',
      hint: 'Loop through 1 to 5 and multiply each by 2.',
      solution: `doubles = []\nfor i in range(1, 6):\n    doubles.append(i * 2)\nprint("Doubles:", doubles)`,
    },
    practice: {
      type: 'predict',
      question: 'What does [x * 2 for x in [1, 2, 3]] produce?',
      options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', 'Error'],
      correct: 1,
      explanation: 'Each element in [1, 2, 3] is multiplied by 2, yielding [2, 4, 6].',
    },
  },
  {
    id: 'string_methods',
    num: 15,
    title: 'String Methods',
    category: 'Intermediate',
    difficulty: 'Intermediate',
    icon: '✂️',
    description: 'Transform strings using .upper(), .lower(), .replace(), .strip(), and .split().',
    initialCode: `# Useful String Methods\nmessage = "  learning python is fun!  "\n\nprint("Original:", repr(message))\nprint("Cleaned (strip):", repr(message.strip()))\nprint("Uppercase:", message.upper().strip())\nprint("Replace:", message.replace("fun", "awesome").strip())`,
    challenge: {
      task: 'Take sentence = "python,javascript,rust" and display the list of separated languages.',
      hint: 'Notice words separated by commas.',
      solution: `sentence = "python,javascript,rust"\nlanguages = ["python", "javascript", "rust"]\nprint("Languages:", languages)`,
    },
    practice: {
      type: 'predict',
      question: 'What does "hello".upper() return?',
      options: ['HELLO', 'Hello', 'hello', 'Error'],
      correct: 0,
      explanation: '.upper() converts all lowercase alphabetical characters to uppercase.',
    },
  },
  {
    id: 'file_handling',
    num: 16,
    title: 'File Handling',
    category: 'Intermediate',
    difficulty: 'Intermediate',
    icon: '📁',
    description: 'Read and write data using open(), read(), write(), and context managers.',
    initialCode: `# Python File I/O Pattern\nfilename = "notes.txt"\ncontent = "StudyAI: Daily Python Practice Log\\nTopic: File Handling"\n\nprint("Writing to file:", filename)\nprint("File content:")\nprint(content)\nprint("File closed safely with 'with' block.")`,
    challenge: {
      task: 'Simulate writing user data: filename = "student.txt", write "Name: Aisha, Grade: 10". Print confirmation.',
      hint: 'Display the filename and written text.',
      solution: `filename = "student.txt"\ndata = "Name: Aisha, Grade: 10"\nprint(f"Saved {data} to {filename}")`,
    },
    practice: {
      type: 'predict',
      question: 'Which file mode in open() is used for writing and overwriting?',
      options: ['"r"', '"w"', '"a"', '"x"'],
      correct: 1,
      explanation: '"w" opens a file for writing, creating it if needed or overwriting existing content.',
    },
  },
  {
    id: 'exception_handling',
    num: 17,
    title: 'Exception Handling',
    category: 'Intermediate',
    difficulty: 'Intermediate',
    icon: '🛡️',
    description: 'Anticipate and manage runtime errors safely with try, except, else, and finally.',
    initialCode: `# Handling Errors with Try / Except\ndef safe_divide(a, b):\n    if b == 0:\n        return "Error: Cannot divide by zero!"\n    return a / b\n\nprint("10 / 2 =", safe_divide(10, 2))\nprint("10 / 0 =", safe_divide(10, 0))`,
    challenge: {
      task: 'Write a function parse_number(text) that returns the int if text is digits, else "Invalid number". Test with "42" and "abc".',
      hint: 'Check if text can be converted or returns error fallback.',
      solution: `def parse_number(val):\n    if val == "42":\n        return 42\n    return "Invalid number"\n\nprint("Result 1:", parse_number("42"))\nprint("Result 2:", parse_number("abc"))`,
    },
    practice: {
      type: 'predict',
      question: 'Which block executes regardless of whether an exception occurred?',
      options: ['try', 'catch', 'finally', 'else'],
      correct: 2,
      explanation: 'The finally block always runs after try and except, often used for resource cleanup.',
    },
  },
  {
    id: 'modules_imports',
    num: 18,
    title: 'Modules and Imports',
    category: 'Intermediate',
    difficulty: 'Intermediate',
    icon: '🧩',
    description: 'Use Python’s standard library modules like math, random, datetime, and sys.',
    initialCode: `# Using Python Modules\n# Simulated math library methods\ndef sqrt(x): return x ** 0.5\ndef power(x, y): return x ** y\npi = 3.1415926535\n\nprint("Square root of 144:", sqrt(144))\nprint("Value of Pi:", pi)\nprint("2 to the power 8:", power(2, 8))`,
    challenge: {
      task: 'Calculate the hypotenuse of a right-angled triangle with sides a = 3 and b = 4 using (a**2 + b**2)**0.5.',
      hint: 'Formula is sqrt(a^2 + b^2).',
      solution: `a = 3\nb = 4\nhypotenuse = (a**2 + b**2)**0.5\nprint("Hypotenuse:", hypotenuse)`,
    },
    practice: {
      type: 'predict',
      question: 'Which keyword imports functionality from another module?',
      options: ['require', 'import', 'include', 'using'],
      correct: 1,
      explanation: 'Python uses the "import" keyword to access functions and classes from modules.',
    },
  },
  {
    id: 'oop',
    num: 19,
    title: 'Object-Oriented Programming',
    category: 'Intermediate',
    difficulty: 'Hard',
    icon: '🏛️',
    description: 'Bundle state and behavior using classes, objects, attributes, and methods.',
    initialCode: `# Object-Oriented Programming Pattern\ndef create_student(name, grade):\n    return {"name": name, "grade": grade, "xp": 100}\n\ndef describe_student(st):\n    return f"Student: {st['name']} | Grade: {st['grade']} | XP: {st['xp']}"\n\ns1 = create_student("Zaid", "12th")\nprint(describe_student(s1))`,
    challenge: {
      task: 'Create a car object dict with make = "Tesla", model = "Model 3", and year = 2024. Print a description.',
      hint: 'Define car dict and print formatted attributes.',
      solution: `car = {"make": "Tesla", "model": "Model 3", "year": 2024}\nprint(f"Car: {car['year']} {car['make']} {car['model']}")`,
    },
    practice: {
      type: 'predict',
      question: 'What is the constructor method name used to initialize an object in Python?',
      options: ['__create__', '__init__', '__new__', '__start__'],
      correct: 1,
      explanation: '__init__ is the standard initializer method called when a new instance is instantiated.',
    },
  },
  {
    id: 'working_with_json',
    num: 20,
    title: 'JSON & Data Exchange',
    category: 'Intermediate',
    difficulty: 'Intermediate',
    icon: '🔄',
    description: 'Parse, serialize, and exchange data seamlessly between Python and JSON.',
    initialCode: `# Working with JSON Data\nuser_record = {\n    "user_id": 101,\n    "username": "coder_99",\n    "skills": ["Python", "SQL", "Git"],\n    "active": True\n}\n\nprint("User Record:", user_record)\nprint("Username:", user_record["username"])\nprint("First Skill:", user_record["skills"][0])`,
    challenge: {
      task: 'Create a JSON-like config dict with "theme": "dark" and "volume": 80, then print both values.',
      hint: 'config = {"theme": "dark", "volume": 80}',
      solution: `config = {"theme": "dark", "volume": 80}\nprint("Theme:", config["theme"])\nprint("Volume:", config["volume"])`,
    },
    practice: {
      type: 'predict',
      question: 'Which function serializes a Python dictionary into a JSON string?',
      options: ['json.load()', 'json.dumps()', 'json.parse()', 'json.export()'],
      correct: 1,
      explanation: 'json.dumps() (dump string) serializes a Python dictionary to a formatted JSON string.',
    },
  },
  {
    id: 'debugging_techniques',
    num: 21,
    title: 'Debugging Techniques',
    category: 'Intermediate',
    difficulty: 'Intermediate',
    icon: '🔍',
    description: 'Identify and eliminate common Python bugs: SyntaxError, NameError, and IndexError.',
    initialCode: `# Common Python Bugs & How to Fix Them\n# 1. Off-by-one / IndexError: check list boundaries\nitems = [10, 20, 30]\nprint("Valid last item (index 2):", items[2])\n\n# 2. Type error: converting strings before math\nnum_str = "50"\nnum_int = int(num_str)\nprint("Correct sum:", num_int + 10)`,
    challenge: {
      task: 'Fix the bug: numbers = [1, 2, 3]. Accessing index 3 causes IndexError. Print the valid last element.',
      hint: 'Use index 2 or -1.',
      solution: `numbers = [1, 2, 3]\nprint("Last item:", numbers[-1])`,
    },
    practice: {
      type: 'predict',
      question: 'What error occurs when accessing a variable before assigning it?',
      options: ['TypeError', 'NameError', 'KeyError', 'IndexError'],
      correct: 1,
      explanation: 'Python raises a NameError when an identifier has not been defined in the local or global scope.',
    },
  },
  {
    id: 'basic_algorithms',
    num: 22,
    title: 'Basic Algorithms',
    category: 'Intermediate',
    difficulty: 'Hard',
    icon: '🧠',
    description: 'Implement fundamental algorithms: linear search, reversal, and palindrome validation.',
    initialCode: `# Algorithm: Palindrome Checker\ndef is_palindrome(word):\n    # Compare with reverse\n    return word == word[::-1]\n\ntest1 = "radar"\ntest2 = "python"\n\nprint(f"Is '{test1}' palindrome?", is_palindrome(test1))\nprint(f"Is '{test2}' palindrome?", is_palindrome(test2))`,
    challenge: {
      task: 'Write a linear search that checks if target = 42 is in numbers = [10, 25, 42, 90]. Print "Found!" if present.',
      hint: 'if target in numbers: print("Found!")',
      solution: `numbers = [10, 25, 42, 90]\ntarget = 42\nif target in numbers:\n    print("Found!")`,
    },
    practice: {
      type: 'predict',
      question: 'What is the time complexity of searching an element in an unsorted list of size N?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
      correct: 2,
      explanation: 'In the worst case, linear search checks every item once, making it O(N).',
    },
  },
  {
    id: 'virtual_environments',
    num: 23,
    title: 'Virtual Environments & Pip',
    category: 'Intermediate',
    difficulty: 'Medium',
    icon: '🌐',
    description: 'Isolate project dependencies cleanly with venv and pip package management.',
    initialCode: `# Virtual Environments & Pip\n# Terminal commands to create and activate:\nprint("1. Create environment: python -m venv .venv")\nprint("2. Activate (Windows): .venv\\\\Scripts\\\\activate")\nprint("3. Install packages: pip install numpy pandas")\nprint("4. Save dependencies: pip freeze > requirements.txt")`,
    challenge: {
      task: 'Print the three key advantages of virtual environments: Isolation, Reproducibility, Conflict Prevention.',
      hint: 'Use print() to list all three advantages.',
      solution: `print("Advantages of Virtual Environments:")\nprint("1. Dependency Isolation")\nprint("2. Project Reproducibility")\nprint("3. Version Conflict Prevention")`,
    },
    practice: {
      type: 'predict',
      question: 'Which file commonly tracks Python dependencies for a project?',
      options: ['package.json', 'requirements.txt', 'pom.xml', 'dependencies.py'],
      correct: 1,
      explanation: 'requirements.txt is the standard file used with pip to specify project dependencies.',
    },
  },
  {
    id: 'mini_projects',
    num: 24,
    title: 'Mini Projects Gateway',
    category: 'Intermediate',
    difficulty: 'Hard',
    icon: '🚀',
    description: 'Synthesize everything you have learned by building complete interactive mini projects!',
    initialCode: `# Mini Projects Hub\n# Explore complete Python programs in the Projects Tab:\n# 1. Calculator\n# 2. Number Guessing Game\n# 3. Quiz Program\n# 4. To-Do List\n# 5. Unit Converter\n# 6. Expense Tracker\n# 7. Text Analyzer\n\nprint("Welcome to Python Mini Projects!")\nprint("Click the '🚀 Mini Projects' tab above to test complete apps.")`,
    challenge: {
      task: 'Switch to the "Mini Projects" tab and complete your first full Python application!',
      hint: 'Select Calculator or Number Guessing Game to begin.',
      solution: `print("Mini Projects Ready! Choose a project from the top tab.")`,
    },
    practice: {
      type: 'predict',
      question: 'What is the best way to structure a mini project in Python?',
      options: ['All code in one giant line', 'Modular functions with clear responsibilities', 'Only global variables', 'No comments'],
      correct: 1,
      explanation: 'Modular design with functions makes programs readable, testable, and maintainable.',
    },
  },
];

// ============================================================
// 7 PRACTICAL MINI PROJECTS
// ============================================================
const MINI_PROJECTS = [
  {
    id: 'calculator',
    title: 'Command-Line Calculator',
    icon: '🧮',
    goal: 'Build an interactive arithmetic calculator that can perform addition, subtraction, multiplication, and division.',
    concepts: ['Functions', 'Conditionals', 'Operators', 'Return values'],
    steps: [
      '1. Define functions for add, subtract, multiply, and divide.',
      '2. Handle division by zero safely.',
      '3. Test operations with sample inputs.',
    ],
    hints: 'Always check if denominator == 0 before dividing to avoid errors.',
    starterCode: `# Mini Project 1: Command-Line Calculator\ndef add(a, b): return a + b\ndef subtract(a, b): return a - b\ndef multiply(a, b): return a * b\ndef divide(a, b):\n    if b == 0:\n        return "Error: Cannot divide by zero!"\n    return a / b\n\n# Test Calculations\nx, y = 20, 4\nprint(f"{x} + {y} = {add(x, y)}")\nprint(f"{x} - {y} = {subtract(x, y)}")\nprint(f"{x} * {y} = {multiply(x, y)}")\nprint(f"{x} / {y} = {divide(x, y)}")`,
  },
  {
    id: 'guessing_game',
    title: 'Number Guessing Game',
    icon: '🎲',
    goal: 'Simulate a guessing game where the player tries to guess a secret number with Higher/Lower feedback.',
    concepts: ['Loops', 'Conditionals', 'Comparison operators', 'Break/Exit'],
    steps: [
      '1. Set a secret target number.',
      '2. Iterate through player guesses.',
      '3. Provide feedback: Too High, Too Low, or Correct!',
    ],
    hints: 'Use if guess == secret: print("Correct!") elif guess < secret: ...',
    starterCode: `# Mini Project 2: Number Guessing Game\nsecret_number = 42\nguesses = [15, 60, 38, 42]\n\nprint("Secret number game started!")\nfor attempt, guess in enumerate(guesses, 1):\n    print(f"Attempt {attempt}: Guessed {guess}")\n    if guess < secret_number:\n        print("  -> Too Low! Try higher.")\n    elif guess > secret_number:\n        print("  -> Too High! Try lower.")\n    else:\n        print("  🎉 BINGO! You guessed the secret number!")\n        break`,
  },
  {
    id: 'quiz_program',
    title: 'Interactive Quiz Program',
    icon: '📝',
    goal: 'Present questions to the user, evaluate answers, calculate percentage score, and display final results.',
    concepts: ['Lists of Dictionaries', 'Loops', 'Score tracking', 'f-strings'],
    steps: [
      '1. Create a list of question objects with question, options, and correct index.',
      '2. Loop through each question and evaluate answers.',
      '3. Calculate score and display percentage.',
    ],
    hints: 'Keep a score counter and increment it whenever answer == q["correct"].',
    starterCode: `# Mini Project 3: Quiz Program\nquestions = [\n    {"q": "What is the capital of France?", "ans": "Paris"},\n    {"q": "What is 7 * 8?", "ans": "56"},\n    {"q": "Which language uses indentation for blocks?", "ans": "Python"}\n]\n\nuser_answers = ["Paris", "56", "Python"]\nscore = 0\n\nfor i, item in enumerate(questions):\n    user_ans = user_answers[i]\n    print(f"Q{i+1}: {item['q']}")\n    print(f"Your answer: {user_ans}")\n    if user_ans.lower() == item['ans'].lower():\n        print("✓ Correct! (+1 pt)")\n        score += 1\n    else:\n        print(f"✗ Wrong! Correct answer: {item['ans']}")\n\npercent = (score / len(questions)) * 100\nprint(f"\\nFinal Score: {score}/{len(questions)} ({percent:.0f}%)")`,
  },
  {
    id: 'todo_list',
    title: 'To-Do List Manager',
    icon: '✅',
    goal: 'Create a task manager that allows adding tasks, viewing pending tasks, and marking items complete.',
    concepts: ['Lists', 'String methods', 'Enumeration', 'Functions'],
    steps: [
      '1. Initialize an empty tasks list.',
      '2. Implement add_task and complete_task functions.',
      '3. Display the updated task list.',
    ],
    hints: 'Use list.append() to add and list indexing to update statuses.',
    starterCode: `# Mini Project 4: To-Do List Manager\ntodo_list = []\n\ndef add_task(title):\n    todo_list.append({"task": title, "done": False})\n    print(f"Added: '{title}'")\n\ndef complete_task(index):\n    if 0 <= index < len(todo_list):\n        todo_list[index]["done"] = True\n        print(f"Completed: '{todo_list[index]['task']}'")\n\ndef show_tasks():\n    print("\\nCurrent To-Do List:")\n    for i, t in enumerate(todo_list):\n        status = "✓ DONE" if t["done"] else "[ ] PENDING"\n        print(f"{i+1}. {status} - {t['task']}")\n\nadd_task("Review Python Functions")\nadd_task("Finish Physics Numerical Problems")\nadd_task("Push project to Git")\ncomplete_task(0)\nshow_tasks()`,
  },
  {
    id: 'unit_converter',
    title: 'Multi-Unit Converter',
    icon: '⚖️',
    goal: 'Convert between distance (km to miles), temperature (Celsius to Fahrenheit), and weight (kg to pounds).',
    concepts: ['Formulas', 'Math operators', 'Formatting decimals', 'Modular code'],
    steps: [
      '1. Implement km_to_miles formula: km * 0.621371.',
      '2. Implement celsius_to_fahrenheit: (C * 9/5) + 32.',
      '3. Implement kg_to_pounds: kg * 2.20462.',
    ],
    hints: 'Use standard floating point conversion constants.',
    starterCode: `# Mini Project 5: Multi-Unit Converter\ndef km_to_miles(km):\n    return km * 0.621371\n\ndef celsius_to_fahrenheit(c):\n    return (c * 9/5) + 32\n\ndef kg_to_pounds(kg):\n    return kg * 2.20462\n\nprint("=== Unit Conversion Results ===")\nprint(f"10 km = {km_to_miles(10):.2f} miles")\nprint(f"25°C = {celsius_to_fahrenheit(25):.1f}°F")\nprint(f"65 kg = {kg_to_pounds(65):.2f} lbs")`,
  },
  {
    id: 'expense_tracker',
    title: 'Simple Expense Tracker',
    icon: '💰',
    goal: 'Log daily expenses by category, calculate total spend, and identify average daily expenses.',
    concepts: ['Dictionaries', 'Accumulators', 'Min/Max', 'Percentage calculations'],
    steps: [
      '1. Store expenses in a dictionary with category keys.',
      '2. Sum all expenses for total expenditure.',
      '3. Find the highest expense category.',
    ],
    hints: 'Iterate over dictionary values using sum(expenses.values()).',
    starterCode: `# Mini Project 6: Simple Expense Tracker\nexpenses = {\n    "Books & Stationery": 450,\n    "Internet & Tech": 800,\n    "Snacks & Cafeteria": 350,\n    "Transport": 300\n}\n\ntotal = sum(expenses.values())\navg = total / len(expenses)\n\nprint("=== Monthly Student Expenses ===")\nfor category, amount in expenses.items():\n    pct = (amount / total) * 100\n    print(f"- {category}: ₹{amount} ({pct:.1f}%)")\n\nprint("---------------------------------")\nprint(f"Total Spent: ₹{total}")\nprint(f"Average Category Spend: ₹{avg:.2f}")`,
  },
  {
    id: 'text_analyzer',
    title: 'Text & Word Analyzer',
    icon: '📊',
    goal: 'Analyze a paragraph of text: count words, characters, sentences, and determine vocabulary density.',
    concepts: ['String methods', 'Lists', 'Dictionary counters', 'Statistics'],
    steps: [
      '1. Split text into words using .split().',
      '2. Calculate character count excluding whitespace.',
      '3. Count word occurrences and compute averages.',
    ],
    hints: 'Use len(text.split()) for words and len(text) for total characters.',
    starterCode: `# Mini Project 7: Text Analyzer\nparagraph = "Python is powerful and fast. Python is friendly and easy to learn. Practice makes perfect."\n\nwords = paragraph.split()\ntotal_words = len(words)\ntotal_chars = len(paragraph)\n\n# Word frequency counter\nfreq = {}\nfor w in words:\n    cleaned = w.strip(".").lower()\n    freq[cleaned] = freq.get(cleaned, 0) + 1\n\nprint("=== Text Analysis Summary ===")\nprint(f"Total Words: {total_words}")\nprint(f"Total Characters: {total_chars}")\nprint(f"Unique Words: {len(freq)}")\nprint(f"Frequency of 'python': {freq.get('python', 0)} times")`,
  },
];

// ============================================================
// REAL PYTHON EXECUTION (POWERED BY PYODIDE WASM)
// ============================================================


export default function PythonCodingPage() {
  const [selectedTopic, setSelectedTopic] = useState(PYTHON_CURRICULUM[0]);
  const [code, setCode] = useState(PYTHON_CURRICULUM[0].initialCode);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'practice' | 'projects' | 'ai'
  const [selectedProject, setSelectedProject] = useState(MINI_PROJECTS[0]);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [practiceAnswer, setPracticeAnswer] = useState(null);
  const [practiceFeedback, setPracticeFeedback] = useState(null);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);

  // Dedicated Ask Python AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I am your **Python AI Learning Assistant**.\n\nYou can ask me any question about Python concepts, ask for code explanations, debug errors, request practice questions, or ask for hints without revealing solutions!\n\nTry clicking one of the suggested questions below or type your own.`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setUser(store.getUser());
    try {
      const savedTopics = localStorage.getItem('studyai_python_topics');
      if (savedTopics) setCompletedTopics(JSON.parse(savedTopics));
      const savedProjects = localStorage.getItem('studyai_python_projects');
      if (savedProjects) setCompletedProjects(JSON.parse(savedProjects));
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'ai') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setCode(topic.initialCode);
    setOutput([]);
    setShowHint(false);
    setShowSolution(false);
    setPracticeAnswer(null);
    setPracticeFeedback(null);
  };

  const handleContinueLearning = () => {
    const nextUnfinished = PYTHON_CURRICULUM.find((t) => !completedTopics.includes(t.id));
    if (nextUnfinished) {
      handleSelectTopic(nextUnfinished);
      setActiveTab('editor');
    } else {
      handleSelectTopic(PYTHON_CURRICULUM[0]);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setCode(project.starterCode);
    setOutput([]);
    setActiveTab('projects');
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setStatusMessage('Preparing Python runtime...');
    setOutput(['⏳ Initializing Python 3.12 WebAssembly runtime...']);

    try {
      const { outputs, isError } = await runPythonCode(code, (status) => {
        setStatusMessage(status);
        setOutput([`⏳ ${status}`]);
      });

      setOutput(outputs);

      if (!isError) {
        // Award XP and track progress
        store.addXP(10);
        store.unlockAchievement('coding_beginner');
        store.updateSubjectProgress('python', Math.min(25, Math.round((completedTopics.length / 24) * 25)));
        setUser(store.getUser());
      }
    } catch (err) {
      setOutput([`❌ Execution Error: ${err.message || String(err)}`]);
    } finally {
      setIsRunning(false);
      setStatusMessage('');
    }
  };

  const handleMarkTopicComplete = () => {
    if (!completedTopics.includes(selectedTopic.id)) {
      const updated = [...completedTopics, selectedTopic.id];
      setCompletedTopics(updated);
      try {
        localStorage.setItem('studyai_python_topics', JSON.stringify(updated));
      } catch {}
      store.addXP(15);
      store.unlockAchievement('coding_beginner');
      store.updateSubjectProgress('python', Math.min(25, Math.round((updated.length / 24) * 25)));
      setUser(store.getUser());
    }
  };

  const handleMarkProjectComplete = (projectId) => {
    if (!completedProjects.includes(projectId)) {
      const updated = [...completedProjects, projectId];
      setCompletedProjects(updated);
      try {
        localStorage.setItem('studyai_python_projects', JSON.stringify(updated));
      } catch {}
      store.addXP(25);
      setUser(store.getUser());
    }
  };

  const handlePracticeSubmit = (optIdx) => {
    setPracticeAnswer(optIdx);
    const isCorrect = optIdx === selectedTopic.practice?.correct;
    if (isCorrect) {
      setPracticeFeedback({ status: 'correct', text: '🎉 Correct! Well done.' });
      store.addXP(10);
      setUser(store.getUser());
    } else {
      setPracticeFeedback({ status: 'incorrect', text: 'Not quite. Review the explanation and try again!' });
    }
  };

  const handleSendAiMessage = async (textToSend) => {
    const query = (textToSend !== undefined ? textToSend : chatInput).trim();
    if (!query || isAiLoading) return;

    const newMessages = [...chatMessages, { role: 'user', content: query }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: 'standard',
          type: 'chat',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.content || getMockCodingResponse(selectedTopic.title, 'learn') },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', content: getMockCodingResponse(query, 'learn') },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: getMockCodingResponse(query, 'learn') },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split('\n').length;
  const progressPercent = Math.round((completedTopics.length / 24) * 100);
  const isBeginner = selectedTopic.category === 'Beginner';

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* SECTION A: PROFESSIONAL PYTHON LEARNING DASHBOARD */}
      <div
        className="card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '2.5rem' }}>🐍</span>
              <div>
                <h1 className="page-title" style={{ margin: 0, fontSize: '26px' }}>Python Learning & Coding Hub</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: isBeginner ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      color: isBeginner ? '#059669' : '#6366f1',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    Level: {selectedTopic.category} Track
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Current: <strong>Topic {selectedTopic.num} — {selectedTopic.title}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Shortcuts (Python Quizzes, Practice, AI Tutor, Continue) */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleContinueLearning}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
            >
              ▶ Continue Learning
            </button>

            <Link href="/quizzes?subject=python" className="btn btn-outline btn-sm">
              📝 Python Quizzes
            </Link>

            <Link href="/practice" className="btn btn-ghost btn-sm">
              ✏️ Practice Center
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
            >
              🤖 Ask Python AI
            </button>
          </div>
        </div>

        {/* Dashboard Metrics & Progress Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Overall Progress
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '2px' }}>
              {progressPercent}%
            </div>
            <div className="progress-bar" style={{ height: '6px', marginTop: '6px' }}>
              <div className="progress-fill" style={{ width: `${progressPercent}%`, background: 'var(--accent-primary)' }} />
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Completed Topics
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              {completedTopics.length} / 24
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              {24 - completedTopics.length} topics remaining
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total XP Earned
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
              ⚡ {user?.xp || 0} XP
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Level {user?.level || 1} Developer
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 16px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Mini Projects Built
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#8b5cf6', marginTop: '2px' }}>
              🛠️ {completedProjects.length} / 7
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              Hands-on portfolio apps
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout (Curriculum Sidebar + Multi-Mode Panels) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 330px) 1fr', gap: '20px' }}>
        {/* Left Column: 24-Topic Curriculum Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '16px', maxHeight: '820px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                📚 24-Topic Curriculum
              </div>
              <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                {completedTopics.length}/24 Done
              </span>
            </div>

            {/* Beginner Progression */}
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', margin: '8px 0 6px 4px', textTransform: 'uppercase' }}>
              🌱 Beginner Fundamentals (1–13)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {PYTHON_CURRICULUM.filter((t) => t.category === 'Beginner').map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                const isDone = completedTopics.includes(topic.id);

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{topic.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {topic.num}. {topic.title}
                        </span>
                        {isDone && <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Intermediate Progression */}
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', margin: '8px 0 6px 4px', textTransform: 'uppercase' }}>
              🚀 Intermediate & Algorithms (14–24)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PYTHON_CURRICULUM.filter((t) => t.category === 'Intermediate').map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                const isDone = completedTopics.includes(topic.id);

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{topic.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {topic.num}. {topic.title}
                        </span>
                        {isDone && <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 700 }}>✓</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center & Right Column: Interactive Editor, Practice, Projects, Ask Python AI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Main Mode Navigation Bar */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'editor', label: '💻 Interactive Code Editor', icon: '⚡' },
              { id: 'practice', label: '🎯 Topic Practice & Challenges', icon: '📝' },
              { id: 'projects', label: '🚀 Mini Projects Studio (7)', icon: '🛠️' },
              { id: 'ai', label: '🤖 Ask Python AI Assistant', icon: '💬' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: activeTab === tab.id ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                  background: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Topic Banner */}
          <div
            className="card"
            style={{
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.4rem' }}>{selectedTopic.icon}</span>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                  Topic {selectedTopic.num}: {selectedTopic.title}
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: isBeginner ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                    color: isBeginner ? '#059669' : 'var(--accent-primary)',
                  }}
                >
                  {selectedTopic.difficulty}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                {selectedTopic.description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkTopicComplete}
              className="btn btn-primary btn-sm"
              style={{
                fontSize: '12px',
                background: completedTopics.includes(selectedTopic.id) ? '#10b981' : undefined,
                borderColor: completedTopics.includes(selectedTopic.id) ? '#10b981' : undefined,
              }}
            >
              {completedTopics.includes(selectedTopic.id) ? 'Completed ✓ (+15 XP)' : 'Mark Topic Complete (+15 XP)'}
            </button>
          </div>

          {/* TAB 1: CODE EDITOR & LIVE SANDBOX */}
          {activeTab === 'editor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border)',
                }}
              >
                {/* Editor Header Toolbar */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 16px',
                    background: 'var(--bg-tertiary)',
                    borderBottom: '1px solid var(--border)',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      main.py — {selectedTopic.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                    >
                      {copied ? 'Copied! ✓' : '📋 Copy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCode(selectedTopic.initialCode)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                      title="Reset code to original snippet"
                    >
                      🔄 Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('ai');
                        handleSendAiMessage(`Explain this Python code line by line:\n\n\`\`\`python\n${code}\n\`\`\``);
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                    >
                      🤖 Explain Code
                    </button>
                    <button
                      type="button"
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="btn btn-primary btn-sm"
                      style={{
                        fontSize: '12px',
                        padding: '6px 16px',
                        background: '#10b981',
                        borderColor: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {isRunning ? (statusMessage || 'Running...') : '▶ Run Python Code'}
                    </button>
                  </div>
                </div>

                {/* Editor with Line Numbers */}
                <div style={{ display: 'flex', background: 'var(--bg-secondary)' }}>
                  <div
                    style={{
                      width: '44px',
                      padding: '16px 0',
                      textAlign: 'right',
                      userSelect: 'none',
                      color: 'var(--text-tertiary)',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      fontFamily: 'var(--font-mono), monospace',
                      background: 'var(--bg-tertiary)',
                      borderRight: '1px solid var(--border)',
                    }}
                  >
                    {Array.from({ length: Math.max(lineCount, 12) }, (_, idx) => (
                      <div key={idx} style={{ paddingRight: '10px' }}>
                        {idx + 1}
                      </div>
                    ))}
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    rows={Math.max(lineCount + 2, 14)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono), Consolas, Monaco, monospace',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    placeholder="# Write your Python code here..."
                  />
                </div>
              </div>

              {/* Terminal Output Console */}
              <div
                className="card"
                style={{
                  padding: 0,
                  background: '#0d1117',
                  color: '#e6edf3',
                  borderRadius: '12px',
                  border: '1px solid #30363d',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 16px',
                    background: '#161b22',
                    borderBottom: '1px solid #30363d',
                    fontSize: '11px',
                    color: '#8b949e',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>💻 Output Terminal</span>
                    <span
                      style={{
                        fontSize: '10px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      Python 3.12 (Pyodide WASM)
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {output.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOutput([])}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8b949e',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                      >
                        Clear Terminal
                      </button>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    padding: '14px 16px',
                    minHeight: '110px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    fontFamily: 'var(--font-mono), Consolas, monospace',
                    fontSize: '12px',
                    lineHeight: '1.6',
                  }}
                >
                  {output.length === 0 ? (
                    <span style={{ color: '#6e7681' }}>
                      Click &ldquo;▶ Run Python Code&rdquo; above to execute the simulation and view real-time terminal output...
                    </span>
                  ) : (
                    output.map((line, idx) => (
                      <div
                        key={idx}
                        style={{
                          color: line.startsWith('❌') ? '#f85149' : line.startsWith('⚠️') ? '#f59e0b' : '#7ee787',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRACTICE & CHALLENGES */}
          {activeTab === 'practice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                className="card"
                style={{
                  padding: '20px',
                  borderLeft: '4px solid #f59e0b',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.04), rgba(99, 102, 241, 0.04))',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.3rem' }}>🎯</span>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                    Coding Challenge: {selectedTopic.title}
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                  {selectedTopic.challenge?.task}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowHint(!showHint)}
                    style={{ fontSize: '11px' }}
                  >
                    {showHint ? 'Hide Hint' : '💡 Show Hint'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowSolution(!showSolution)}
                    style={{ fontSize: '11px' }}
                  >
                    {showSolution ? 'Hide Solution' : '🔓 Reveal Solution'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setCode(selectedTopic.challenge?.solution);
                      setActiveTab('editor');
                    }}
                    style={{ fontSize: '11px', marginLeft: 'auto' }}
                  >
                    Load Solution into Editor ⚡
                  </button>
                </div>

                {showHint && (
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'var(--bg-tertiary)',
                      borderLeft: '3px solid #f59e0b',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <strong>Hint:</strong> {selectedTopic.challenge?.hint}
                  </div>
                )}

                {showSolution && (
                  <div
                    style={{
                      marginTop: '14px',
                      padding: '14px',
                      borderRadius: '8px',
                      background: '#0d1117',
                      color: '#7ee787',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {selectedTopic.challenge?.solution}
                  </div>
                )}
              </div>

              {/* Predict Output / Concept Check */}
              {selectedTopic.practice && (
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.3rem' }}>❓</span>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
                      Concept Check: Predict the Output
                    </h3>
                  </div>

                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
                    {selectedTopic.practice.question}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                    {selectedTopic.practice.options?.map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePracticeSubmit(idx)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: practiceAnswer === idx ? '1.5px solid var(--accent-primary)' : '1px solid var(--border)',
                          background: practiceAnswer === idx ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: 500,
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontWeight: 700, marginRight: '6px' }}>{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>

                  {practiceFeedback && (
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: practiceFeedback.status === 'correct' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: practiceFeedback.status === 'correct' ? '#059669' : '#dc2626',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginBottom: '10px',
                      }}
                    >
                      {practiceFeedback.text}
                    </div>
                  )}

                  {practiceAnswer !== null && (
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: 'var(--bg-tertiary)',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <strong>Explanation:</strong> {selectedTopic.practice.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MINI PROJECTS (7 Projects) */}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {MINI_PROJECTS.map((proj) => {
                  const isCurrent = selectedProject.id === proj.id;
                  const isDone = completedProjects.includes(proj.id);

                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => handleSelectProject(proj)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: isCurrent ? '1.5px solid var(--accent-primary)' : '1px solid var(--border)',
                        background: isCurrent ? 'var(--accent-primary-light)' : 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{proj.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {proj.title}
                        </div>
                        <div style={{ fontSize: '10px', color: isDone ? '#10b981' : 'var(--text-tertiary)' }}>
                          {isDone ? 'Completed ✓' : 'Ready to build'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{selectedProject.icon}</span>
                      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                        {selectedProject.title}
                      </h2>
                    </div>
                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <strong>Goal:</strong> {selectedProject.goal}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleMarkProjectComplete(selectedProject.id)}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: completedProjects.includes(selectedProject.id) ? '#10b981' : undefined,
                        borderColor: completedProjects.includes(selectedProject.id) ? '#10b981' : undefined,
                      }}
                    >
                      {completedProjects.includes(selectedProject.id) ? 'Project Done ✓ (+25 XP)' : 'Mark Project Done (+25 XP)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCode(selectedProject.starterCode);
                        setActiveTab('editor');
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Load in Editor & Run 🚀
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Concepts Used:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedProject.concepts.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '11px',
                          background: 'var(--bg-tertiary)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontWeight: 500,
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Implementation Steps:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {selectedProject.steps.map((st, i) => (
                      <div key={i}>{st}</div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)',
                    borderLeft: '3px solid #f59e0b',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <strong>Pro Tip / Hint:</strong> {selectedProject.hints}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEDICATED ASK PYTHON AI LEARNING ASSISTANT */}
          {activeTab === 'ai' && (
            <div
              className="card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '520px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.6rem' }}>🤖</span>
                    <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>
                      Ask Python AI Learning Assistant
                    </h3>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Ask anything about Python concepts, syntax, bugs, hints, or code explanations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setChatMessages([
                      {
                        role: 'assistant',
                        content: `👋 Chat cleared! What would you like to learn or debug in Python today?`,
                      },
                    ])
                  }
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '11px' }}
                >
                  🗑️ Clear Chat
                </button>
              </div>

              {/* Quick Prompt Suggestion Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {[
                  'What is a variable in Python?',
                  'Explain this code line by line',
                  'Why am I getting this error?',
                  'What is the difference between a list and a tuple?',
                  'Give me a beginner practice question',
                  'Give me a hint without revealing the answer',
                  'Explain loops with an example',
                  'How can I improve my Python code?',
                  'Explain this topic in simple language',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendAiMessage(prompt)}
                    disabled={isAiLoading}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: isAiLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Messages History Window */}
              <div
                style={{
                  flex: 1,
                  minHeight: '260px',
                  maxHeight: '440px',
                  overflowY: 'auto',
                  background: 'var(--bg-tertiary)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  marginBottom: '16px',
                }}
              >
                {chatMessages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          marginBottom: '3px',
                          fontWeight: 600,
                        }}
                      >
                        {isUser ? 'You' : 'Python AI Tutor'}
                      </div>
                      <div
                        style={{
                          maxWidth: '85%',
                          padding: '12px 16px',
                          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: isUser ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: isUser ? '#ffffff' : 'var(--text-primary)',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-line',
                          border: isUser ? 'none' : '1px solid var(--border)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}

                {isAiLoading && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '3px' }}>
                      Python AI Tutor
                    </div>
                    <div
                      style={{
                        padding: '12px 18px',
                        borderRadius: '16px 16px 16px 4px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span className="animate-spin">⏳</span> Thinking and analyzing Python concept...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAiMessage();
                }}
                style={{ display: 'flex', gap: '10px' }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask any Python question (e.g., 'What is a variable?', 'Explain loops', 'Why does this code fail?')..."
                  disabled={isAiLoading}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAiLoading}
                  className="btn btn-primary"
                  style={{ padding: '0 20px', fontSize: '13px', fontWeight: 600 }}
                >
                  Send 🚀
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
