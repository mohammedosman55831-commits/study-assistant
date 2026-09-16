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
// ============================================================
// CONVERSATION & TOPIC INTELLIGENCE HELPERS
// ============================================================

export function detectTopicFromText(text) {
  if (!text) return null;
  const lower = text.toLowerCase().trim();

  // 1. Ray Optics / Reflection of Light / Refraction / Mirrors / Lenses
  if (
    lower.includes('reflection of light') ||
    lower.includes('laws of reflection') ||
    lower.includes('law of reflection') ||
    lower.includes('plane mirror') ||
    lower.includes('spherical mirror') ||
    lower.includes('concave mirror') ||
    lower.includes('convex mirror') ||
    lower.includes('mirror formula') ||
    lower.includes('reflection') ||
    lower.includes('reflecting surface') ||
    lower.includes('specular reflection') ||
    lower.includes('diffuse reflection') ||
    lower.includes('ray optics') ||
    lower.includes('snell') ||
    lower.includes('refractive index') ||
    lower.includes('refraction of light') ||
    lower.includes('refraction') ||
    lower.includes('convex lens') ||
    lower.includes('concave lens') ||
    lower.includes('focal length') ||
    lower.includes('center of curvature') ||
    lower.includes('angle of incidence') ||
    lower.includes('angle of reflection') ||
    lower.includes('optics') ||
    (lower.includes('mirror') && !lower.includes('site')) ||
    (lower.includes('lens') && !lower.includes('clean'))
  ) {
    return {
      key: 'OPTICS_REFLECTION',
      name: 'Reflection of Light & Ray Optics',
      subject: 'Physics',
      chapter: 'Ray Optics and Optical Instruments',
      stream: 'MPC / BiPC',
      year: 'Class 10 / Intermediate 2nd Year',
    };
  }

  // 2. Thermodynamics / Heat / Zeroth & First Law / Internal Energy / Work Done
  if (
    lower.includes('thermodynamics') ||
    lower.includes('zeroth law') ||
    lower.includes('0th law') ||
    lower.includes('first law of thermodynamics') ||
    lower.includes('1st law of thermodynamics') ||
    lower.includes('second law of thermodynamics') ||
    lower.includes('2nd law of thermodynamics') ||
    lower.includes('zeroth and first law') ||
    lower.includes('internal energy') ||
    lower.includes('work done in thermodynamics') ||
    lower.includes('thermal equilibrium') ||
    lower.includes('isothermal') ||
    lower.includes('adiabatic') ||
    lower.includes('isobaric') ||
    lower.includes('isochoric') ||
    lower.includes('heat capacity') ||
    lower.includes('heat engine') ||
    lower.includes('carnot cycle') ||
    lower.includes('carnot engine') ||
    lower.includes("mayer's relation") ||
    (lower.includes('heat') && (lower.includes('work') || lower.includes('law') || lower.includes('energy') || lower.includes('temperature') || lower.includes('system')))
  ) {
    return {
      key: 'THERMODYNAMICS',
      name: 'Zeroth and First Law of Thermodynamics',
      subject: 'Physics',
      chapter: 'Thermodynamics & Thermal Properties of Matter',
      stream: 'MPC / BiPC',
      year: '1st Year / Class 11',
    };
  }

  // 3. Newton's Laws of Motion / Mechanics / Force / Momentum / Inertia
  if (
    lower.includes('newton') ||
    lower.includes('inertia') ||
    lower.includes('momentum') ||
    (lower.includes('law') && lower.includes('motion')) ||
    lower.includes('action and reaction') ||
    lower.includes('action-reaction') ||
    lower.includes('f = ma') ||
    lower.includes('friction') ||
    (lower.includes('force') && (lower.includes('acceleration') || lower.includes('mass') || lower.includes('motion') || lower.includes('body')))
  ) {
    return {
      key: 'NEWTON_LAWS',
      name: "Newton's Laws of Motion",
      subject: 'Physics',
      chapter: 'Mechanics & Laws of Motion',
      stream: 'MPC / BiPC',
      year: '1st Year / Class 11',
    };
  }

  // 4. Photosynthesis
  if (
    lower.includes('photosynthesis') ||
    lower.includes('photo synthesis') ||
    lower.includes('chlorophyll') ||
    lower.includes('chloroplast') ||
    lower.includes('calvin cycle') ||
    lower.includes('light reaction')
  ) {
    return {
      key: 'PHOTOSYNTHESIS',
      name: 'Photosynthesis',
      subject: 'Biology / Botany',
      chapter: 'Plant Physiology',
      stream: 'BiPC',
      year: '1st Year / Class 11',
    };
  }

  // 5. Gravitation / Gravity
  if (
    lower.includes('gravitation') ||
    lower.includes('gravity') ||
    lower.includes("kepler's law") ||
    lower.includes('escape velocity') ||
    lower.includes('gravitational potential')
  ) {
    return {
      key: 'GRAVITATION',
      name: 'Gravitation & Planetary Motion',
      subject: 'Physics',
      chapter: 'Gravitation',
      stream: 'MPC / BiPC',
      year: '1st Year / Class 11',
    };
  }

  // 6. Cell Biology
  if (
    lower.includes('what is a cell') ||
    lower.includes('explain cell') ||
    lower.includes('cell biology') ||
    lower.includes('mitochondria') ||
    lower.includes('eukaryotic') ||
    lower.includes('prokaryotic') ||
    lower.includes('organelles') ||
    lower.includes('cell nucleus') ||
    lower.includes('cell membrane')
  ) {
    return {
      key: 'CELL_BIOLOGY',
      name: 'Cell: The Unit of Life',
      subject: 'Biology / Zoology',
      chapter: 'Cell Structure and Function',
      stream: 'BiPC',
      year: '1st Year / Class 11',
    };
  }

  // 7. Calculus & Differentiation
  if (
    lower.includes('differentiation') ||
    lower.includes('derivative') ||
    lower.includes('calculus') ||
    lower.includes('chain rule') ||
    lower.includes('product rule') ||
    lower.includes('dy/dx') ||
    lower.includes('integration') ||
    lower.includes('definite integral')
  ) {
    return {
      key: 'CALCULUS',
      name: 'Differentiation & Calculus',
      subject: 'Mathematics',
      chapter: 'Calculus',
      stream: 'MPC / MEC',
      year: '1st Year / Class 11',
    };
  }

  // 8. Trigonometry
  if (
    lower.includes('trigonometry') ||
    lower.includes('trigonometric') ||
    lower.includes('sin theta') ||
    lower.includes('cos theta') ||
    lower.includes('tan theta') ||
    lower.includes('trig identities')
  ) {
    return {
      key: 'TRIGONOMETRY',
      name: 'Trigonometric Ratios & Identities',
      subject: 'Mathematics',
      chapter: 'Trigonometry',
      stream: 'MPC / MEC',
      year: '1st Year / Class 11',
    };
  }

  // 9. Quadratic Equations
  if (
    lower.includes('quadratic equation') ||
    lower.includes('quadratic formula') ||
    lower.includes('discriminant') ||
    lower.includes('roots of quadratic')
  ) {
    return {
      key: 'QUADRATIC_EQUATIONS',
      name: 'Quadratic Equations & Expressions',
      subject: 'Mathematics',
      chapter: 'Algebra',
      stream: 'MPC / MEC',
      year: '1st Year / Class 11',
    };
  }

  // 10. Python Programming
  if (
    lower.includes('python') ||
    lower.includes('python variable') ||
    lower.includes('python function') ||
    lower.includes('python loop') ||
    lower.includes('list vs tuple') ||
    lower.includes('list and tuple') ||
    lower.includes('python if') ||
    lower.includes('indentation error')
  ) {
    return {
      key: 'PYTHON_PROGRAMMING',
      name: 'Python Programming',
      subject: 'Computer Science',
      chapter: 'Python Basics & Functions',
      stream: 'MPC / CEC',
      year: '1st Year / Class 11',
    };
  }

  // 11. Economics - Demand & Supply
  if (
    lower.includes('demand and supply') ||
    lower.includes('law of demand') ||
    lower.includes('law of supply') ||
    lower.includes('elasticity of demand') ||
    lower.includes('equilibrium price')
  ) {
    return {
      key: 'DEMAND_SUPPLY',
      name: 'Theory of Demand & Supply',
      subject: 'Economics',
      chapter: 'Microeconomics',
      stream: 'MEC / CEC',
      year: '1st Year / Class 11',
    };
  }

  return null;
}

function extractConversationContext(messageOrMessages, syllabusContext = null) {
  let messages = [];
  let currentText = '';

  if (Array.isArray(messageOrMessages)) {
    messages = messageOrMessages;
    currentText = cleanText(messages[messages.length - 1]?.content || '');
  } else {
    currentText = cleanText(messageOrMessages);
    messages = [{ role: 'user', content: currentText }];
  }

  // Find last assistant message
  let lastAssistantMsg = '';
  for (let i = messages.length - 2; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      lastAssistantMsg = messages[i].content || '';
      break;
    }
  }

  // 1. Check if the current user message explicitly names a topic
  const currentTopicMatch = detectTopicFromText(currentText);

  // 2. If not, check recent conversation history in reverse order (most recent first)
  let historyTopicMatch = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    const topic = detectTopicFromText(messages[i].content || '');
    if (topic) {
      historyTopicMatch = topic;
      break;
    }
  }

  // 3. Topic from syllabusContext
  let syllabusTopicMatch = null;
  if (syllabusContext?.topic) {
    syllabusTopicMatch = detectTopicFromText(syllabusContext.topic);
  }

  // Priority Hierarchy:
  // (a) Current user message explicit topic (e.g. "Explain reflection of light" -> OPTICS)
  // (b) Recent conversation history topic (e.g. follow-up "Why?" after optics)
  // (c) Syllabus context topic match
  const chosenTopic = currentTopicMatch || historyTopicMatch || syllabusTopicMatch;

  let activeTopicKey = chosenTopic ? chosenTopic.key : null;
  let activeTopic = chosenTopic ? chosenTopic.name : (syllabusContext?.topic || '');
  let activeSubject = chosenTopic ? chosenTopic.subject : (syllabusContext?.subject || 'Physics');
  let activeChapter = chosenTopic ? chosenTopic.chapter : (syllabusContext?.chapter || 'General Science');
  let activeStream = syllabusContext?.stream || 'MPC';
  let activeYear = syllabusContext?.year || '1st Year / Class 11';

  return {
    messages,
    currentText,
    lastAssistantMsg,
    activeTopicKey,
    activeTopic,
    activeSubject,
    activeChapter,
    activeStream,
    activeYear,
    isCurrentMessageExplicitTopic: Boolean(currentTopicMatch),
  };
}

function isComprehensiveQuery(text, action, mode) {
  const lower = (text || '').toLowerCase();
  return (
    action === 'Detailed Explanation' ||
    action === 'Comprehensive Explanation' ||
    action === 'Explain Topic' ||
    mode === 'deep' ||
    lower.includes('comprehensiv') ||
    lower.includes('in detail') ||
    lower.includes('teach me this topic') ||
    lower.includes('teach me') ||
    lower.includes('explain the topic') ||
    lower.includes('explain topic') ||
    lower.includes('complete explanation') ||
    lower.includes('full explanation') ||
    lower.includes('explain me about') ||
    lower.includes('explain about') ||
    lower.includes('explain')
  );
}

// ============================================================
// FOLLOW-UP INTENT HANDLER
// ============================================================

function handleFollowUpIntent({
  currentText,
  lower,
  activeTopicKey,
  activeTopic,
  activeSubject,
  activeChapter,
  lastAssistantMsg,
  mode,
  syllabusContext,
}) {
  const topicLabel = activeTopic || 'this concept';
  const subjectLabel = activeSubject || 'Science & Math';

  // 1. Follow-up: "Why?" / "Why does that happen?"
  const isWhy =
    lower === 'why' ||
    lower === 'why?' ||
    lower.startsWith('why ') ||
    lower.includes('why does that happen') ||
    lower.includes('why so') ||
    lower.includes('what is the reason') ||
    lower.includes('how come') ||
    lower.includes('what causes this');

  if (isWhy) {
    if (activeTopicKey === 'OPTICS_REFLECTION' || lower.includes('reflect') || lower.includes('mirror') || lower.includes('light')) {
      return `### ðŸ’¡ Why Light Reflects & Why $\\angle i = \\angle r$
**Topic: Reflection of Light (Ray & Wave Optics)**

Great question! Let's understand the deep physics behind why light reflects the way it does:

---

### ðŸ” 1. Fermat's Principle of Least Time
Light always takes the **path of least time** to travel between two points. When light travels from source $A$ to reflecting surface and bounces to observer $B$, the only path that minimizes the total travel time is the one where the **angle of incidence strictly equals the angle of reflection** ($\angle i = \angle r$).

### ðŸ” 2. Wave Theory (Huygens' Principle)
When a planar light wavefront strikes a boundary:
1. Each point on the reflective surface acts as a secondary source of spherical wavelets.
2. The wavelets expand back into the same medium at speed $c$.
3. The common tangent envelope to all these wavelets forms the reflected wavefront, geometrically proving that $\sin i = \sin r \implies \angle i = \angle r$.

### ðŸ” 3. Electromagnetic Interaction at Atoms
When light (an oscillating electromagnetic wave) hits a polished mirror:
- The free electrons in the metallic silver coating oscillate in response to the light's electric field.
- These oscillating electrons immediately re-radiate an identical wave backwards with a $180^\\circ$ phase shift, preventing light from entering and sending it bouncing away cleanly!

---

### ðŸŒŸ Simple Everyday Example
Think of light like rolling a marble against a straight wooden wall. If you roll it straight at $90^\\circ$, it bounces straight back. If you roll it at a $45^\\circ$ angle, it ricochets away at an exact $45^\\circ$ angle!

---

### ðŸ§ª Think About This:
Why do you see a clear image in a polished plane mirror, but you cannot see your face when looking at a white wall, even though both reflect light?`;
    }

    if (activeTopicKey === 'THERMODYNAMICS' || lower.includes('thermodynamic') || lower.includes('heat') || lower.includes('internal energy')) {
      return `### ðŸ’¡ Why Thermodynamics & Conservation of Energy Work
**Topic: Zeroth and First Law of Thermodynamics**

Here is the fundamental physical "Why" behind heat, temperature, and internal energy:

---

### ðŸ” 1. Why Thermal Equilibrium Happens (Zeroth Law)
- At the microscopic level, temperature is the average kinetic energy of vibrating molecules.
- When two bodies are in thermal contact, fast-moving (hot) molecules collide with slower (cold) molecules, transferring kinetic energy until their average energies equalize.
- If System $A$ and System $B$ both match the molecular kinetic energy of System $C$, then $A$ and $B$ must have the exact same molecular kinetic energy ($T_A = T_B$).

### ðŸ” 2. Why $\\Delta Q = \\Delta U + \\Delta W$ (First Law)
- **Energy cannot be created or destroyed**. 
- When you pump heat energy ($\\Delta Q$) into a gas container:
  1. Part of the energy makes the gas molecules jiggle and bounce faster $\\rightarrow$ this is **Internal Energy ($\\Delta U = n C_v \\Delta T$)**.
  2. The remaining energy pushes the movable piston outwards against external atmospheric pressure $\\rightarrow$ this is **Mechanical Work ($\\Delta W = P\\Delta V$)**.
- Every single Joule of heat added must be accounted for by the sum of microscopic energy increase and macroscopic work!

---

### ðŸŒŸ Simple Everyday Example
When you vigorously pump air into a bicycle tire, the bottom of the pump gets warm. Why? Because you are performing mechanical work on the gas molecules ($\Delta W$), compressing them and increasing their internal kinetic energy ($\Delta U$), which registers directly as a temperature rise!

---

### ðŸ§ª Quick Thought Check:
In an adiabatic process where no heat enters or leaves ($\Delta Q = 0$), if a gas expands and does $100\\text{ J}$ of work ($\Delta W = +100\\text{ J}$), what happens to its internal energy and temperature?`;
    }

    if (activeTopicKey === 'NEWTON_LAWS' || lower.includes('inertia') || lower.includes('motion')) {
      return `### ðŸ’¡ Why Newton's Laws & Inertia Happen
**Topic: Newton's Laws of Motion & Classical Mechanics**

Great question! Let's explore the fundamental "Why" behind mechanics:

---

### ðŸ” The Root Cause: Conservation & Mass
1. **Matter Has Inertia (Mass)**: Every physical object possesses mass. Mass is literally the quantitative measure of how much an object resists having its state of motion changed.
2. **Forces Are Interactions, Not Properties**: An object doesn't "possess" force; force is an interaction between *two* bodies. Without an unbalanced external push or pull ($F_{\\text{net}} = 0$), momentum ($\vec{p} = m\vec{v}$) must remain constant.
3. **Action-Reaction Pairs**: When you push against a wall, the electromagnetic repulsion between your hand's atoms and the wall's atoms pushes back equally on your hand ($F_{12} = -F_{21}$).

---

### ðŸŒŸ Simple Everyday Example
When you stir sugar in a glass of water and stop stirring, the water keeps swirling. Why? Because the liquid particles already have rotational momentum, and friction takes time to slow each water molecule down!

---

### ðŸ§ª Think About This:
If you were floating in empty space far away from any gravity and threw a ball, when would it stop moving?`;
    }

    if (activeTopicKey === 'PHOTOSYNTHESIS') {
      return `### ðŸ’¡ Why Photosynthesis Occurs in Plants
**Topic: Plant Physiology â€” Photosynthesis**

Here is the biological and chemical "Why" behind photosynthesis:

---

### ðŸ” The Core Purpose
1. **Autotrophic Energy Conversion**: Unlike animals, plants cannot walk around to hunt for food. They must convert radiant light energy (photons from the sun) into stable chemical energy stored in molecular bonds (glucose sugar: $C_6H_{12}O_6$).
2. **The Role of Chlorophyll**: Green leaves contain chloroplasts packed with **chlorophyll** pigments that absorb blue and red light wavelengths while reflecting green light.
3. **Electron Excitation & Water Splitting**: Absorbed light energy excites electrons in Photosystem II, which splits water molecules ($2H_2O \\rightarrow 4H^+ + 4e^- + O_2$). The released oxygen is what living organisms breathe!

---

### ðŸ”‘ Key Takeaway
Photosynthesis is essentially nature's solar panel and sugar factory combined!

Would you like to explore the Light Reaction or Dark (Calvin) cycle next?`;
    }

    return `### ðŸ’¡ The Underlying Reason Behind ${topicLabel}
**Subject: ${subjectLabel}**

Here is why **${topicLabel}** behaves the way it does:

---

### 1. Fundamental Principle
In ${subjectLabel}, every observed rule is driven by underlying conservation laws (energy, momentum, mass) and system equilibrium.

### 2. Step-by-Step Cause and Effect:
1. **Initial Trigger / Condition**: An external change or input is introduced into the system.
2. **Intermediate Mechanism**: The system responds according to established governing laws.
3. **Equilibrium State**: The system stabilizes into a predictable, measurable outcome.

---

### ðŸŒŸ Intuitive Takeaway
${mode === 'beginner' ? `Think of it like balancing a scale: whenever one side changes, the system naturally adjusts to restore balance!` : `Understanding the fundamental causal mechanism ensures you can solve unfamiliar variants of this problem in exams.`}

Would you like a step-by-step example or a quick concept check?`;
  }

  // 2. Follow-up: "Explain step [N] again" / "Clarify step [N]"
  const stepMatch =
    lower.match(/(?:explain|clarify|what about|detail|how did you get|break down)\s*(?:the\s*)?step\s*(\d+)/i) ||
    lower.match(/^step\s*(\d+)\??$/i);

  if (stepMatch) {
    const stepNum = parseInt(stepMatch[1], 10);

    return `### ðŸ” Deep Dive: Clarifying Step ${stepNum}
**Topic: ${topicLabel} (${subjectLabel})**

Let's break down **Step ${stepNum}** in crystal-clear detail so you can master how and why this calculation/step works!

---

### ðŸ“ What Happens in Step ${stepNum}:
${
  stepNum === 1
    ? `* **Goal**: Identify all given quantities with correct signs and state the primary governing formula.\n* **Why it matters**: Writing down Given Data ($u, v, f, m, \\Delta Q, W$) and verifying SI units (meters, Joules, seconds, kg) prevents 80% of typical student exam mistakes!`
    : stepNum === 2
    ? `* **Goal**: Isolate the unknown variable and substitute known values.\n* **Why it matters**: Make sure not to mix up positive and negative signs (e.g. Cartesian sign convention for mirrors or expansion vs compression work in thermodynamics).`
    : stepNum === 3
    ? `* **Goal**: Carry out algebraic simplification step-by-step.\n* **Why it matters**: Perform fraction addition, common denominators, or multiplication carefully to retain precision before calculating the final value.`
    : `* **Goal**: Evaluate the final answer and attach standard SI units.\n* **Why it matters**: Examiners look for units (e.g. $\\text{cm}$, $\\text{J}$, $\\text{m/s}^2$, $\\text{N}$) and box the final result for maximum step marks!`
}

---

### ðŸ’¡ Pro Tip for Step ${stepNum}
${mode === 'beginner' ? 'Always double-check your arithmetic with simple numbers first to build confidence.' : 'In board exams, each step carries dedicated step marks even if the final arithmetic has a small slip!'}

Does Step ${stepNum} make total sense now, or would you like to solve a fresh practice problem together?`;
  }

  // 3. Follow-up: "Give another example" / "New example"
  const isExample =
    lower.includes('another example') ||
    lower.includes('more examples') ||
    lower.includes('one more example') ||
    lower.includes('different example') ||
    lower.includes('new example') ||
    (lower.includes('give') && lower.includes('example'));

  if (isExample) {
    if (activeTopicKey === 'OPTICS_REFLECTION' || lower.includes('reflect') || lower.includes('mirror') || lower.includes('light')) {
      return `### ðŸŒŸ Another Real-World Example: Reflection of Light & Mirrors

Here are three fresh, practical applications of reflection of light in everyday technology:

---

### 1. ðŸ¤¿ Submarine Periscope (Plane Mirrors)
- **The Setup**: A periscope uses two plane mirrors mounted parallel to each other at a $45^\\circ$ angle inside a tube.
- **The Physics**: Light from the surface enters the top, reflects by $90^\\circ$ downwards ($\angle i = \angle r = 45^\\circ$), travels down the tube, and reflects by another $90^\\circ$ into the observer's eyes!

### 2. ðŸ¦· Dentist's Examination Mirror (Concave Mirror)
- **The Setup**: When a dentist looks at a cavity in your molar, they place a small concave mirror very close to the tooth ($u < f$).
- **The Physics**: When an object is within the focal length of a concave mirror, it forms a **virtual, erect, and highly magnified image** ($m > +1$), making tiny tooth defects clearly visible!

### 3. ðŸš— Side Wing Mirror in Automobiles (Convex Mirror)
- **The Setup**: Marked with *"Objects in mirror are closer than they appear"*.
- **The Physics**: Convex mirrors always form **virtual, erect, and diminished images** ($m < +1$), which allows the driver to see a wide, panoramic field of view of trailing traffic!

---

### ðŸ”‘ Key Takeaway
Plane mirrors keep image size equal ($m=+1$), concave mirrors magnify close objects ($m>+1$), and convex mirrors shrink images to give wider views ($m<+1$)!`;
    }

    if (activeTopicKey === 'THERMODYNAMICS' || lower.includes('thermodynamic') || lower.includes('heat') || lower.includes('energy')) {
      return `### ðŸŒŸ Another Real-World Example: Thermodynamics in Action

Here are three real-world examples demonstrating the Zeroth and First Laws of Thermodynamics:

---

### 1. ðŸŒ¡ï¸ Metal Spoon in Hot Soup (Zeroth Law)
- When you leave a stainless-steel spoon in a bowl of hot soup ($85^\\circ\\text{C}$):
- Heat flows from the soup to the spoon until both reach the exact same temperature ($T_{\\text{soup}} = T_{\\text{spoon}}$).
- Once in **thermal equilibrium**, net heat transfer stops ($\Delta Q = 0$).

### 2. ðŸ’¨ Spraying an Aerosol Can / Deodorant (First Law & Adiabatic Expansion)
- When you hold down the nozzle of a spray can, pressurized gas expands very rapidly into the room.
- Because the expansion is so fast, there is no time for heat to enter from outside ($\Delta Q \\approx 0$).
- By the First Law: $\\Delta Q = \\Delta U + \\Delta W \\implies \\Delta U = -\\Delta W$.
- The gas performs positive work ($\Delta W > 0$) by pushing against atmospheric air, so its internal energy drops sharply ($\Delta U < 0$), making the nozzle and can feel **freezing cold**!

### 3. ðŸ² Pressure Cooker (Isochoric Heating)
- In a sealed pressure cooker with fixed volume ($\Delta V = 0$), the gas does zero work ($\Delta W = 0$).
- Therefore, all heat supplied from the stove directly boosts the water steam's internal energy ($\Delta Q = \Delta U = n C_v \Delta T$), skyrocketing the temperature and pressure to cook food 3x faster!

---

### ðŸ”‘ Key Takeaway
Whenever gas expands quickly, it cools down; whenever gas is compressed quickly, it heats up!`;
    }

    if (activeTopicKey === 'NEWTON_LAWS' || lower.includes('motion')) {
      return `### ðŸš€ Another Real-World Example: Newton's Laws of Motion

Here is a brand-new everyday scenario you can visualize easily!

---

### ðŸ›¹ The Scenario: Skateboarding on a Paved Street

1. **First Law (Inertia in Action)**:
   * When you place a skateboard on the ground, it sits completely still until you kick the ground to push it forward.
   * If the skateboard hits a sudden pebble on the road, the board stops abruptly, but you fly forward off the board. Why? Your body had inertia and wanted to keep moving at the same speed!

2. **Second Law ($F = ma$)**:
   * If a child pushes the skateboard, it accelerates gently.
   * If an adult pushes the skateboard with twice the force ($2F$), it accelerates twice as fast ($2a$).

3. **Third Law (Action & Reaction)**:
   * To push yourself forward on the skateboard, your foot pushes **backward** against the asphalt (Action).
   * The ground pushes your foot and skateboard **forward** with equal force (Reaction)!

---

### ðŸ”‘ Simple Takeaway
You cannot push forward without pushing something else backward!`;
    }

    if (activeTopicKey === 'PHOTOSYNTHESIS') {
      return `### ðŸŒ± Another Real-World Example: Photosynthesis

Here is a practical experiment you can see in real life!

---

### ðŸ§ª The Scenario: An Aquatic Waterweed (*Hydrilla*) in a Glass Beaker

1. **The Setup**: Place a fresh green water plant in a clear glass of water under a bright desk lamp.
2. **What Happens**: Within minutes, you will see continuous tiny bubbles rising from the plant stems to the top of the water.
3. **The Science**: Those bubbles are **pure Oxygen gas ($O_2$)** produced by the plant as it uses light energy from the lamp to convert water and dissolved carbon dioxide into glucose food!
4. **Takeaway**: More light intensity = more oxygen bubbles per minute!

---

Would you like another example, or should we test this concept with a quick question?`;
    }

    return `### ðŸŒŸ Another Real-World Example: ${topicLabel}
**Subject: ${subjectLabel}**

Here is a fresh scenario demonstrating **${topicLabel}**:

---

### 1. The Real-Life Situation
Consider a daily activity where **${topicLabel}** plays a direct, observable role.

### 2. How the Concept Applies:
* **The Action / Input**: An everyday input or condition occurs.
* **The Underlying Law**: The rules of **${topicLabel}** govern how the energy, matter, or value moves.
* **The Visible Result**: You observe the predicted outcome consistently and reliably.

---

### ðŸ’¡ Why This Example Matters
Relating classroom theory in ${subjectLabel} to real-life situations makes exam recall effortless!

Would you like to try a practice question on this?`;
  }

  // 4. Follow-up: "Make that simpler" / "Simpler language"
  const isSimpler =
    lower.includes('simpler') ||
    lower.includes('easier') ||
    lower.includes('make that simpler') ||
    lower.includes('make it simpler') ||
    lower.includes('simple words') ||
    lower.includes('too complex') ||
    lower.includes('too hard') ||
    lower.includes('eli5') ||
    lower.includes('for a beginner');

  if (isSimpler) {
    if (activeTopicKey === 'OPTICS_REFLECTION') {
      return `### ðŸŽˆ Super Simple Explanation: Reflection of Light

Let's make Reflection of Light as simple as bouncing a rubber ball! ðŸŽ¾

---

### ðŸªž 3 Ultra-Simple Points:

1. **What is it?**
   When light hits a smooth, shiny surface (like a mirror), it can't go through, so it **bounces right back into the room**. That bounce is called **reflection**.

2. **The Golden Rule (Bounce Angle)**:
   - If you throw a ball straight at a wall, it bounces straight back.
   - If you throw it at a $30^\\circ$ slant, it bounces off at the exact same $30^\\circ$ slant on the other side!
   - **Angle In = Angle Out** ($\angle i = \angle r$).

3. **Mirror Types Made Easy**:
   - **Flat Mirror**: Shows you exactly as you are (same size).
   - **Curved In (Concave like a cave)**: Zooms in when you are close (like shaving/makeup mirrors).
   - **Curved Out (Convex like the back of a spoon)**: Shrinks things so you can see a wide view (like car side mirrors).

---

### ðŸŽ¯ Quick Question:
If a ray of light hits a flat mirror at an angle of $40^\\circ$ to the normal line, what will the reflected angle be?`;
    }

    if (activeTopicKey === 'THERMODYNAMICS') {
      return `### ðŸŽˆ Super Simple Explanation: Thermodynamics & First Law

Let's understand Thermodynamics using the **Bank Account Analogy**! ðŸ’°

---

### ðŸ¦ 3 Ultra-Simple Points:

1. **Zeroth Law (Equal Temperature)**:
   If Friend A has the same money as Friend C, and Friend B has the same money as Friend C, then Friend A and Friend B have the exact same money! ($T_A = T_B$). In physics, this means they reach the same temperature.

2. **First Law (The Energy Bank Equation)**:
   $$\\text{Heat Deposited (}\\Delta Q\\text{)} = \\text{Money Saved (}\\Delta U\\text{)} + \\text{Money Spent on Shopping (}\\Delta W\\text{)}$$
   - **Heat in ($\\Delta Q$)**: Energy you feed into the gas.
   - **Internal Energy ($\\Delta U$)**: Energy the gas keeps to make itself hotter.
   - **Work done ($\\Delta W$)**: Energy the gas spends to push a piston.

3. **You Can't Cheat Nature**:
   You can't spend energy you didn't deposit or save! Energy is always $100\\%$ conserved.

---

### ðŸŽ¯ Quick Question:
If you put $500\\text{ J}$ of heat into a gas, and it does $200\\text{ J}$ of work, how much heat was saved as internal energy? (Hint: $500 - 200 = ?$ )`;
    }

    return `### ðŸŽˆ Super Simple Explanation: ${topicLabel}

Let's make this ultra-simple, like explaining it to a friend over coffee! â˜•

---

### ðŸ›‹ï¸ 3 Ultra-Simple Points:

1. **The Big Idea**:
   ${topicLabel} is just nature's (or math's) way of saying: *"Rules stay predictable, balanced, and conserved."*

2. **The Everyday Analogy**:
   Think of ${topicLabel} like a bicycle. If you pedal forward, you move. If you stop pedaling, friction slows you down. If you want to go twice as fast, you have to apply more effort!

3. **What You Need to Remember for Exams**:
   - **Input**: What you start with (Given values).
   - **Rule**: The core formula or governing law.
   - **Output**: The final result with correct units.

---

### ðŸŽ¯ Quick Check:
Does this simplified picture make it feel easier to understand? Let me know which part you want to practice!`;
  }

  // 5. Follow-up: "What is the difference?" / "Compare X and Y"
  const isDifference =
    lower.includes('difference') ||
    lower.includes('compare') ||
    lower.includes('versus') ||
    lower.includes(' vs ') ||
    lower.includes('distinguish');

  if (isDifference) {
    if (activeTopicKey === 'OPTICS_REFLECTION') {
      return `### âš–ï¸ Comparison: Concave Mirror vs Convex Mirror
**Topic: Ray Optics & Spherical Mirrors**

| Feature | Concave Mirror (Converging) ðŸ•³ï¸ | Convex Mirror (Diverging) ðŸ¥„ |
| :--- | :--- | :--- |
| **Shape** | Curved inwards towards center of curvature | Curved outwards away from center of curvature |
| **Focal Length ($f$)** | **Negative ($f < 0$)** | **Positive ($f > 0$)** |
| **Action on Light** | Converges parallel rays to a real focus | Diverges parallel rays; focus is virtual |
| **Nature of Image** | Mostly real & inverted (except when $u < f$, virtual & magnified) | **Always virtual, erect, and diminished** ($m < +1$) |
| **Field of View** | Narrow | **Wide panoramic field of view** |
| **Common Uses** | Dentists, solar furnaces, car headlights | Car rearview/side mirrors, shop security mirrors |

---

### ðŸ’¡ High-Yield Exam Tip
In numerical calculations, always assign $f = -\\text{value}$ for concave mirrors and $f = +\\text{value}$ for convex mirrors!`;
    }

    if (activeTopicKey === 'THERMODYNAMICS') {
      return `### âš–ï¸ Comparison: Isothermal vs Adiabatic Process
**Topic: Thermodynamics Processes**

| Feature | Isothermal Process ðŸŒ¡ï¸ | Adiabatic Process âš¡ |
| :--- | :--- | :--- |
| **Condition** | **Temperature constant ($\Delta T = 0$)** | **Zero heat exchange ($\Delta Q = 0$)** |
| **Governing Equation** | $PV = \\text{constant}$ (Boyle's Law) | $PV^\\gamma = \\text{constant}$ ($\\gamma = C_p/C_v$) |
| **Change in Internal Energy** | $\\Delta U = n C_v \\Delta T = 0$ | $\\Delta U = -\\Delta W$ |
| **First Law Form** | $\\Delta Q = \\Delta W$ | $\\Delta W = -\\Delta U$ |
| **Process Speed** | Occurs very **slowly** with conducting walls | Occurs very **rapidly** with insulated walls |
| **Slope of P-V Curve** | Steeper: $\\frac{dP}{dV} = -\\frac{P}{V}$ | Even steeper: $\\frac{dP}{dV} = -\\gamma \\frac{P}{V}$ ($\gamma > 1$) |
| **Real Example** | Slow melting of ice at $0^\\circ\\text{C}$ | Bursting of bicycle tube, rapid spray expansion |`;
    }

    return `### âš–ï¸ Concept Comparison & Key Differences
**Topic: ${topicLabel} (${subjectLabel})**

Here is a structured comparison table to help you master distinctions for exams:

---

| Feature / Aspect | Concept A (Primary Rule) | Concept B (Associated Principle) |
| :--- | :--- | :--- |
| **Basic Definition** | Describes the primary state or rate of change | Describes the reactive state or conservation law |
| **Key Formula** | Primary equation (e.g., $F = ma$, $\\Delta Q = \\Delta U + \\Delta W$) | Boundary condition / state equation |
| **Physical Meaning** | Direct cause-and-effect relationship | Systemic constraint or conservation |
| **Typical Exam Mistake** | Forgetting standard SI units | Confusing direction / sign conventions |

---

### ðŸ’¡ High-Yield Board Exam Tip
Whenever an exam asks *"Distinguish between A and B"*, always format your answer as a **Table** like above â€” examiners award full presentation marks for tabular comparisons!`;
  }

  // 6. Follow-up: "Quiz me on this" / "Practice question"
  const isQuiz =
    lower.includes('quiz me') ||
    lower.includes('test me') ||
    lower.includes('practice question') ||
    lower.includes('give me a question') ||
    lower.includes('ask me a question') ||
    lower.includes('test my understanding');

  if (isQuiz) {
    if (activeTopicKey === 'OPTICS_REFLECTION') {
      return `### ðŸ§ª Quick Concept Quiz: Reflection of Light

Let's test your optics knowledge! Here is an important board-exam question:

---

**Question**:
An object is placed at a distance of $20\\text{ cm}$ in front of a flat plane mirror. What is the distance between the object and its reflected image?

- **A)** $20\\text{ cm}$
- **B)** $40\\text{ cm}$
- **C)** $10\\text{ cm}$
- **D)** $0\\text{ cm}$

---

ðŸ‘‰ **Reply with your answer (A, B, C, or D)** and I'll explain the step-by-step reasoning!`;
    }

    if (activeTopicKey === 'THERMODYNAMICS') {
      return `### ðŸ§ª Quick Concept Quiz: Thermodynamics & First Law

Let's test your understanding of the First Law!

---

**Question**:
In an **adiabatic compression** of an ideal gas, no heat enters or leaves the system ($\\Delta Q = 0$), and work is done on the gas ($\\Delta W < 0$). What happens to the internal energy ($\\Delta U$) and temperature ($T$) of the gas?

- **A)** Internal energy decreases and temperature falls
- **B)** Internal energy increases and temperature rises
- **C)** Temperature remains constant because $\\Delta Q = 0$
- **D)** Internal energy remains zero

---

ðŸ‘‰ **Reply with your answer (A, B, C, or D)** and I'll check your answer immediately!`;
    }

    if (activeTopicKey === 'NEWTON_LAWS') {
      return `### ðŸ§ª Quick Concept Quiz: Newton's Laws

Let's test your mechanics understanding!

---

**Question**:
A book is resting completely still on a flat table. What is the net external force ($F_{\\text{net}}$) acting on the book?

- **A)** Equal to the weight of the book ($mg$)
- **B)** Zero ($0\\text{ N}$)
- **C)** Equal to the normal reaction force only
- **D)** Constantly increasing

---

ðŸ‘‰ **Reply with your answer (A, B, C, or D)** and I'll tell you if you're right and explain why!`;
    }

    return `### ðŸ§ª Quick Practice Challenge: ${topicLabel}

Let's see how well you've grasped **${topicLabel}**!

---

**Question**:
In ${subjectLabel}, when applying the core principle of **${topicLabel}**, which of the following is always true?

- **A)** The total system remains governed by fundamental conservation and balance laws.
- **B)** Variables change randomly with no predictable relationship.
- **C)** Initial given conditions do not affect the final outcome.
- **D)** Units do not need to be consistent across steps.

---

ðŸ‘‰ **Type your chosen option (A, B, C, or D)**, and I'll check your answer immediately!`;
  }

  // 7. Follow-up: Student answering a quiz (A, B, C, D)
  const isOptionAnswer = lower.match(/^(?:option\s*)?([a-d])(?:[\.\)]|\b)/i) || lower.match(/^([a-d])$/i);

  if (isOptionAnswer) {
    const chosen = isOptionAnswer[1].toUpperCase();
    const isCorrect = chosen === 'B' || chosen === 'A';

    return `### ${isCorrect ? 'ðŸŽ‰ Correct! Well Done!' : 'ðŸ¤” Good Try, Let\'s Review!'}

You selected **Option ${chosen}**.

---

### ðŸ’¡ Step-by-Step Reason:
${
  isCorrect
    ? `Excellent intuition! The system is governed by fundamental physical conservation and geometric laws. In plane mirrors, the image distance behind the mirror equals object distance in front ($v = -u = 20\\text{ cm}$, total separation $= 20 + 20 = 40\\text{ cm}$). In thermodynamics, adiabatic compression work done on the gas directly increases its internal energy ($\Delta U = -W > 0$), raising temperature!`
    : `Not quite! Remember to check both sides of the mirror or the sign of work. In mirrors, object-to-image distance is $2\\times u$. In thermodynamics, work done on gas adds energy to the gas, raising its temperature.`
}

---

### ðŸš€ What's next?
You've mastered this concept! Would you like to:
1. Try a **numerical problem calculation**?
2. Explore **another topic**?
3. Ask any specific doubts?`;
  }

  return null;
}

// ============================================================
// TOPIC GENERATORS
// ============================================================

// 1. REFLECTION OF LIGHT & RAY OPTICS
function getReflectionOfLightResponse({ mode, isComprehensive, action, lower, text }) {
  if (lower.includes('simple') || mode === 'beginner' || action === 'Simple Explanation') {
    return `### ðŸªž Reflection of Light (Simple Explanation)
**Class 10 & Intermediate Physics â€” Ray Optics**

Reflection of light is how we see the world around us! Here is the concept explained in simple, crystal-clear terms. ðŸŒŸ

---

### 1ï¸âƒ£ What is Reflection of Light?
When a beam of light traveling through air strikes a polished surface (like a glass mirror or shiny metal) and **bounces back into the same medium**, this phenomenon is called **reflection of light**.

---

### 2ï¸âƒ£ The Two Golden Laws of Reflection
1. **First Law**: The incident ray, the reflected ray, and the normal line (perpendicular to the mirror at the point where light hits) all lie in the **exact same plane**.
2. **Second Law**: The angle of incidence ($\angle i$) is strictly equal to the angle of reflection ($\angle r$):
   $$\\angle i = \\angle r$$

---

### 3ï¸âƒ£ Types of Mirrors & How They Work
* **Plane (Flat) Mirror**:
  - Image is **virtual, erect**, and identical in size ($m = +1$).
  - The image is **laterally inverted** (your left hand appears as the right hand).
* **Concave Mirror (Curved In like a cave ðŸ•³ï¸)**:
  - Can focus parallel light rays to a point (converging).
  - Used in headlights, shaving mirrors, and dentist tools.
* **Convex Mirror (Curved Out like a spoon back ðŸ¥„)**:
  - Diverges light and gives a wide field of view.
  - Used as rear-view mirrors in cars (*"Objects in mirror are closer than they appear"*).

---

### ðŸ’¡ Quick Summary Formula Card
| Mirror | Focal Length ($f$) | Image Type | Real-Life Application |
| :--- | :--- | :--- | :--- |
| **Plane Mirror** | $\\infty$ (Infinity) | Virtual, Erect, Same size ($m=+1$) | Dressing mirrors |
| **Concave Mirror** | Negative ($f < 0$) | Real & inverted, or Virtual & magnified | Headlights, Dentists |
| **Convex Mirror** | Positive ($f > 0$) | Always Virtual, Erect, Diminished | Car rearview mirrors |

---

### ðŸ§ª Check Your Understanding
If a ray of light strikes a plane mirror at an angle of $35^\\circ$ to the normal, what is the angle between the incident ray and the reflected ray? (Hint: $\\angle i + \\angle r = ?$ )`;
  }

  if (lower.includes('mcq') || action === 'Generate MCQs') {
    return `### ðŸ”˜ MCQs: Reflection of Light & Ray Optics (Board Level)

**Q1. A ray of light is incident on a plane mirror at an angle of $30^\\circ$ with the mirror surface. The angle of reflection is:**
- A) $30^\\circ$
- B) $60^\\circ$ *(Correct)*
- C) $90^\\circ$
- D) $45^\\circ$
*Explanation: The angle of incidence is measured from the NORMAL, so $\\angle i = 90^\\circ - 30^\\circ = 60^\\circ$. By 2nd Law, $\\angle r = \\angle i = 60^\\circ$.*

**Q2. The focal length ($f$) of a spherical mirror of radius of curvature $R = 30\\text{ cm}$ is:**
- A) $30\\text{ cm}$
- B) $60\\text{ cm}$
- C) $15\\text{ cm}$ *(Correct)*
- D) $7.5\\text{ cm}$
*Explanation: For spherical mirrors of small aperture, $f = R/2 = 30/2 = 15\\text{ cm}$.*

**Q3. To obtain a virtual, erect, and magnified image using a concave mirror, where should the object be placed?**
- A) At the center of curvature ($C$)
- B) At infinity
- C) Between the focus ($F$) and the pole ($P$) *(Correct)*
- D) Beyond $C$
*Explanation: When an object is placed between $P$ and $F$ of a concave mirror, the reflected rays diverge and appear to meet behind the mirror, forming a virtual and magnified image.*

**Q4. Why are convex mirrors used as rear-view mirrors in vehicles?**
- A) They form inverted images
- B) They always form virtual, erect, and diminished images giving a wide field of view *(Correct)*
- C) They produce magnified images
- D) They have zero focal length
*Explanation: Convex mirrors diverge light, always producing erect, diminished images that allow drivers to monitor a wide traffic area.*

**Q5. The mirror formula relating object distance ($u$), image distance ($v$), and focal length ($f$) is:**
- A) $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$
- B) $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$ *(Correct)*
- C) $f = u + v$
- D) $m = +\\frac{v}{u}$
*Explanation: $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$ is the standard mirror formula under Cartesian sign conventions.*`;
  }

  if (lower.includes('solve') || action === 'Solve Problems') {
    return `### ðŸ§© Step-by-Step Problem Solver: Mirror Formula & Optics

### â“ PROBLEM
An object of height $h_o = 4\\text{ cm}$ is placed at a distance of $u = 30\\text{ cm}$ in front of a **concave mirror** of focal length $f = 20\\text{ cm}$.
Find:
1. The position (distance $v$) of the image.
2. The nature of the image (real or virtual).
3. The height ($h_i$) of the image.

---

### ðŸŽ¯ GIVEN DATA & SIGN CONVENTION
- Object height: $h_o = +4\\text{ cm}$
- Object distance: $u = -30\\text{ cm}$ (measured opposite to incident light)
- Focal length of concave mirror: $f = -20\\text{ cm}$ (focus lies in front)

---

### ðŸ“ STEP-BY-STEP SOLUTION

**Step 1: State the Mirror Formula**
$$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$

**Step 2: Isolate Image Distance ($\\frac{1}{v}$)**
$$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u}$$

**Step 3: Substitute Known Values with Signs**
$$\\frac{1}{v} = \\frac{1}{-20} - \\frac{1}{-30} = -\\frac{1}{20} + \\frac{1}{30}$$
Find the LCM of 20 and 30 (which is 60):
$$\\frac{1}{v} = \\frac{-3 + 2}{60} = -\\frac{1}{60}$$
$$v = -60\\text{ cm}$$

**Step 4: Determine Image Nature & Magnification ($m$)**
- Since $v = -60\\text{ cm}$ (negative), the image is **Real and Inverted**, formed $60\\text{ cm}$ in front of the mirror.
- Magnification Formula:
  $$m = -\\frac{v}{u} = -\\frac{-60}{-30} = -(2) = -2$$
- Image Height:
  $$h_i = m \\times h_o = (-2) \\times 4\\text{ cm} = -8\\text{ cm}$$

---

### âœ… FINAL ANSWERS
1. **Image Distance ($v$)**: $60\\text{ cm}$ in front of the mirror ($v = -60\\text{ cm}$).
2. **Nature**: **Real and Inverted**, 2 times magnified.
3. **Image Height ($h_i$)**: $8\\text{ cm}$ downwards ($h_i = -8\\text{ cm}$).`;
  }

  // Comprehensive / Detailed Explanation (8-Part Structure)
  return `### ðŸªž Reflection of Light & Ray Optics (Comprehensive Guide)
**Class 10 & Intermediate Physics â€” Optics**

Welcome to the comprehensive study module on **Reflection of Light**! Below is the complete curriculum breakdown with definitions, mathematical derivations, sign conventions, real-world applications, and practice problems.

---

### 1. Definition & Core Concept
**Reflection of light** is the phenomenon in which a beam of light traveling in an optical medium encounters the interface of another medium (or a polished surface) and bounces back into the original medium.
- Light travels along straight lines in a uniform medium (Rectilinear propagation).
- Reflection enables us to perceive non-luminous objects around us.

---

### 2. Main Principles & Laws of Reflection
Whenever light reflects from any surface (plane or curved), it strictly obeys the **Two Fundamental Laws of Reflection**:

1. **First Law**: The incident ray, the reflected ray, and the normal to the reflecting surface at the point of incidence all lie in the **same plane**.
2. **Second Law**: The angle of incidence ($\\angle i$) is always equal to the angle of reflection ($\\angle r$):
   $$\\angle i = \\angle r$$

* **Specular (Regular) Reflection**: Occurs on smooth surfaces (plane mirrors, calm water) where parallel incident rays reflect as parallel reflected rays, forming crisp images.
* **Diffuse (Irregular) Reflection**: Occurs on rough surfaces (walls, paper) where rays scatter in various directions due to microscopic irregularities, making surfaces visible without forming glare.

---

### 3. Important Formulas & Sign Conventions
* **Mirror Formula**:
  $$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$
* **Relationship between Focal Length ($f$) and Radius of Curvature ($R$)**:
  $$f = \\frac{R}{2}$$
* **Linear Magnification ($m$)**:
  $$m = \\frac{\\text{Height of image } (h_i)}{\\text{Height of object } (h_o)} = -\\frac{v}{u}$$
* **New Cartesian Sign Convention**:
  - Pole ($P$) of the mirror is taken as the origin $(0, 0)$.
  - Distances measured in the direction of incident light are **Positive ($+$)**.
  - Distances measured opposite to incident light are **Negative ($-$)**.
  - Object distance $u$ is always **Negative ($-$)**.
  - Concave mirror focal length: **Negative ($f < 0$)**.
  - Convex mirror focal length: **Positive ($f > 0$)**.

---

### 4. Step-by-Step Ray Diagram Guide for Spherical Mirrors
To construct ray diagrams and locate images accurately:
1. **Ray 1 (Parallel Ray)**: A ray parallel to the principal axis passes through (or appears to diverge from) the principal focus ($F$) after reflection.
2. **Ray 2 (Focal Ray)**: A ray passing through the focus ($F$) emerges parallel to the principal axis after reflection.
3. **Ray 3 (Center of Curvature Ray)**: A ray passing through the center of curvature ($C$) strikes the mirror normally ($\angle i = 0^\circ$) and retraces its path back ($\angle r = 0^\circ$).
4. **Ray 4 (Pole Ray)**: A ray incident at the pole ($P$) reflects symmetrically making $\angle i = \angle r$ with the principal axis.
5. The intersection of at least two reflected rays determines the exact image location, nature (real/inverted vs virtual/erect), and magnification.

---

### 5. Real-World Applications & Examples
- **Plane Mirrors**: Used in home dressing mirrors, solar cookers, and periscopes ($m = +1$, virtual, erect, laterally inverted).
- **Concave Mirrors**: Used in automobile headlights and searchlights (bulb placed at focus $F$ to produce a powerful parallel beam), solar concentrators, and by dentists/ENT doctors to examine magnified cavities ($u < f$).
- **Convex Mirrors**: Used as rearview and traffic side mirrors because they form erect, diminished images ($m < +1$) with a wide field of view.

---

### 6. Common Mistakes to Avoid in Exams
- âš ï¸ **Measuring angles from the mirror surface**: Always measure $\angle i$ and $\angle r$ from the **Normal line** perpendicular to the surface.
- âš ï¸ **Forgetting sign conventions in formulas**: Always substitute $u, v, f$ with their respective algebraic signs ($+$ or $-$).
- âš ï¸ **Confusing Mirror formula with Lens formula**:
  - Mirror: $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$ and $m = -\\frac{v}{u}$.
  - Lens: $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$ and $m = +\\frac{v}{u}$.

---

### 7. Short Exam Summary
- $\\angle i = \\angle r$ holds universally for all reflecting boundaries.
- Concave mirror produces both real/inverted images ($u > f$) and virtual/erect images ($u < f$).
- Convex mirror always produces virtual, erect, and diminished images regardless of object position.
- Power of mirror: $P = -\\frac{1}{f\\text{ (in meters)}}$.

---

### 8. Practice Question
**Question**: An object is placed at a distance of $15\\text{ cm}$ in front of a concave mirror of focal length $10\\text{ cm}$.
1. Find the position of the image ($v$).
2. Calculate the linear magnification ($m$).
*(Hint: Use $1/f = 1/v + 1/u$ where $f = -10\\text{ cm}$ and $u = -15\\text{ cm}$. Expected answer: $v = -30\\text{ cm}, m = -2$).*`;
}

// 2. THERMODYNAMICS (ZEROTH AND FIRST LAW)
function getThermodynamicsResponse({ mode, isComprehensive, action, lower, text }) {
  if (lower.includes('simple') || mode === 'beginner' || action === 'Simple Explanation') {
    return `### ðŸ”¥ Thermodynamics: Zeroth and First Law (Simple Explanation)
**Class 11 & Intermediate 1st Year Physics â€” Thermal Physics**

Thermodynamics is the study of heat, energy, and work. Let's break it down into easy, intuitive ideas with daily life examples! ðŸš€

---

### 1ï¸âƒ£ Zeroth Law: The Concept of Temperature ðŸŒ¡ï¸
> *"If Body A is in thermal equilibrium with Body C, and Body B is in thermal equilibrium with Body C, then Body A and Body B are in thermal equilibrium with each other."*

* **Simple Idea**: **Thermal equilibrium** means two things have the exact same temperature, so no heat flows between them.
* **Why it matters**: This law allows us to build **thermometers**! When you place a thermometer in your mouth, it reaches thermal equilibrium with your body, measuring your temperature accurately.

---

### 2ï¸âƒ£ First Law: The Conservation of Energy Law âš¡
> *"Energy cannot be created or destroyed; it only changes form. When you add heat to a gas, that heat is split between raising the gas temperature and making the gas do mechanical work."*

$$\\Delta Q = \\Delta U + \\Delta W$$

* **$\\Delta Q$ (Heat Added)**: The heat energy you put into the system.
* **$\\Delta U$ (Internal Energy)**: Energy the gas molecules keep, making them move faster (temperature rises).
* **$\\Delta W$ (Work Done)**: Energy spent by expanding gas to push outward ($W = P\\Delta V$).

---

### ðŸ’¡ The 4 Classic Thermodynamic Processes Made Easy
1. **Isothermal (Constant Temperature, $\\Delta T = 0$)**: All heat added turns directly into work ($\\Delta Q = \\Delta W$).
2. **Adiabatic (Zero Heat Transfer, $\\Delta Q = 0$)**: Gas expands by spending its own internal energy, so it cools down ($\\Delta W = -\\Delta U$).
3. **Isobaric (Constant Pressure, $\\Delta P = 0$)**: Heating a gas under a freely moving piston (both temperature and volume increase).
4. **Isochoric (Constant Volume, $\\Delta V = 0$)**: Gas trapped in a rigid closed box does zero work ($\\Delta W = 0 \\implies \\Delta Q = \\Delta U$).

---

### ðŸ§ª Quick Check Your Understanding
If you supply $300\\text{ J}$ of heat to a gas and it does $100\\text{ J}$ of work pushing a piston, how much did its internal energy increase?`;
  }

  if (lower.includes('mcq') || action === 'Generate MCQs') {
    return `### ðŸ”˜ MCQs: Zeroth and First Law of Thermodynamics (Intermediate Level)

**Q1. The Zeroth Law of Thermodynamics leads directly to the concept of:**
- A) Internal Energy
- B) Temperature *(Correct)*
- C) Work done
- D) Entropy
*Explanation: The Zeroth Law defines thermal equilibrium and establishes temperature as the fundamental property that determines whether heat will flow between systems.*

**Q2. In an adiabatic process, the First Law of Thermodynamics takes the form:**
- A) $\\Delta Q = \\Delta U$
- B) $\\Delta U = -\\Delta W$ *(Correct)*
- C) $\\Delta Q = \\Delta W$
- D) $\\Delta U = 0$
*Explanation: In an adiabatic process, $\\Delta Q = 0$. By the 1st Law, $0 = \\Delta U + \\Delta W \\implies \\Delta W = -\\Delta U$.*

**Q3. For an ideal gas undergoing an isothermal expansion, which of the following is true?**
- A) $\\Delta U > 0$
- B) $\\Delta U = 0$ and $\\Delta Q = \\Delta W$ *(Correct)*
- C) $\\Delta W = 0$
- D) Temperature decreases
*Explanation: For an ideal gas, internal energy depends only on temperature ($U = n C_v T$). In an isothermal process, $\\Delta T = 0 \\implies \\Delta U = 0$, so $\\Delta Q = \\Delta W$.*

**Q4. Work done by an ideal gas during an isochoric process is:**
- A) Positive
- B) Negative
- C) Zero ($0\\text{ J}$) *(Correct)*
- D) Dependent on temperature
*Explanation: In an isochoric process, volume is constant ($\\Delta V = 0$). Since $W = \\int P\\, dV = 0$, the work done is strictly zero.*

**Q5. A system absorbs $600\\text{ J}$ of heat and performs $250\\text{ J}$ of work. The change in internal energy is:**
- A) $+850\\text{ J}$
- B) $+350\\text{ J}$ *(Correct)*
- C) $-350\\text{ J}$
- D) $+250\\text{ J}$
*Explanation: Using $\\Delta Q = \\Delta U + \\Delta W \\implies \\Delta U = \\Delta Q - \\Delta W = 600 - 250 = +350\\text{ J}$.*`;
  }

  if (lower.includes('solve') || action === 'Solve Problems') {
    return `### ðŸ§© Step-by-Step Problem Solver: First Law of Thermodynamics

### â“ PROBLEM
A cylinder fitted with a frictionless piston contains $2\\text{ moles}$ of an ideal gas at a pressure of $P = 1.5 \\times 10^5\\text{ Pa}$. The gas absorbs $Q = 1200\\text{ J}$ of heat and expands isobarically from an initial volume $V_1 = 0.004\\text{ m}^3$ to a final volume $V_2 = 0.008\\text{ m}^3$.
Find:
1. The work done by the gas ($\\Delta W$).
2. The change in internal energy ($\\Delta U$).
3. Does the temperature of the gas increase or decrease?

---

### ðŸŽ¯ GIVEN DATA
- Pressure: $P = 1.5 \\times 10^5\\text{ Pa}$ (constant, isobaric)
- Initial volume: $V_1 = 0.004\\text{ m}^3$
- Final volume: $V_2 = 0.008\\text{ m}^3$
- Heat absorbed: $\\Delta Q = +1200\\text{ J}$

---

### ðŸ“ STEP-BY-STEP SOLUTION

**Step 1: Calculate Work Done by the Gas ($\\Delta W$)**
For a constant-pressure (isobaric) process:
$$\\Delta W = P\\Delta V = P(V_2 - V_1)$$
$$\\Delta W = (1.5 \\times 10^5\\text{ Pa}) \\times (0.008 - 0.004)\\text{ m}^3$$
$$\\Delta W = 1.5 \\times 10^5 \\times 0.004 = 600\\text{ J}$$

**Step 2: Apply the First Law of Thermodynamics**
$$\\Delta Q = \\Delta U + \\Delta W$$
$$\\Delta U = \\Delta Q - \\Delta W$$

**Step 3: Substitute Values**
$$\\Delta U = 1200\\text{ J} - 600\\text{ J} = +600\\text{ J}$$

**Step 4: Analyze Temperature Change**
Since $\\Delta U = n C_v \\Delta T = +600\\text{ J} > 0$, the change in temperature is positive ($\\Delta T > 0$). Therefore, the temperature of the gas **increases**.

---

### âœ… FINAL ANSWERS
1. **Work Done by Gas ($\\Delta W$)**: $+600\\text{ J}$
2. **Change in Internal Energy ($\\Delta U$)**: $+600\\text{ J}$
3. **Temperature Behavior**: Temperature increases as internal energy rises.`;
  }

  // Comprehensive / Detailed Explanation (8-Part Structure)
  return `### ðŸ”¥ Zeroth and First Law of Thermodynamics (Comprehensive Guide)
**Class 11 / Intermediate 1st Year Physics â€” Thermal Properties & Thermodynamics**

Welcome to the comprehensive study module on **Zeroth and First Law of Thermodynamics**! Below is the complete curriculum breakdown including fundamental definitions, energy conservation equations, process derivations, sign conventions, real-world examples, and exam problem solving.

---

### 1. Definition & Core Concept
**Thermodynamics** is the branch of physics that governs the relationships between heat, work, temperature, and internal energy, describing how thermal energy is converted to and from mechanical energy.
- **Thermodynamic System**: A specified collection of matter bounded by a real or imaginary surface.
- **Surroundings**: Everything outside the system boundary.
- **Thermodynamic State Variables**: Pressure ($P$), Volume ($V$), Temperature ($T$), Internal Energy ($U$), and Moles ($n$).

---

### 2. Main Principles & Governing Laws

#### 1ï¸âƒ£ Zeroth Law of Thermodynamics (Thermal Equilibrium & Temperature)
> *"If two thermodynamic systems $A$ and $B$ are each in thermal equilibrium with a third system $C$, then $A$ and $B$ are also in thermal equilibrium with each other."*
- **Mathematical Form**: If $T_A = T_C$ and $T_B = T_C$, then $T_A = T_B$.
- **Significance**: The Zeroth Law validates the concept of **Temperature** as a universal scalar state property and provides the physical basis for all **Thermometry**.

#### 2ï¸âƒ£ First Law of Thermodynamics (Conservation of Energy)
> *"Energy cannot be created or destroyed. When a quantity of heat $\\Delta Q$ is supplied to a closed system, it is consumed partly in increasing the internal energy $\\Delta U$ of the system and partly in doing external work $\\Delta W$ against surroundings."*
- **Mathematical Form**:
  $$\\Delta Q = \\Delta U + \\Delta W \\quad \\text{or} \\quad dQ = dU + dW$$
- **Internal Energy ($U$)**: The sum of microscopic kinetic and molecular potential energies of all molecules. For an ideal gas, internal energy depends solely on temperature:
  $$\\Delta U = n C_v \\Delta T$$

---

### 3. Important Formulas & Sign Conventions

#### Standard Sign Conventions (Physics):
* **Heat ($\\Delta Q$)**: $\\Delta Q > 0$ when heat enters the system; $\\Delta Q < 0$ when heat leaves the system.
* **Work Done ($\\Delta W$)**: $\\Delta W > 0$ when work is done **by** the system (expansion); $\\Delta W < 0$ when work is done **on** the system (compression).
* **Internal Energy ($\\Delta U$)**: $\\Delta U > 0$ when temperature rises; $\\Delta U < 0$ when temperature drops.

#### The Four Fundamental Thermodynamic Processes:
| Process | Defining Condition | Work Done ($W$) | First Law Form |
| :--- | :--- | :--- | :--- |
| **Isothermal** | $T = \\text{const} \\implies \\Delta U = 0$ | $W = nRT \\ln\\left(\\frac{V_2}{V_1}\\right)$ | $\\Delta Q = \\Delta W$ |
| **Adiabatic** | $\\Delta Q = 0$ (Thermal isolation) | $W = \\frac{P_1V_1 - P_2V_2}{\\gamma - 1} = -\\Delta U$ | $\\Delta W = -\\Delta U$ |
| **Isobaric** | $P = \\text{const}$ | $W = P(V_2 - V_1) = nR\\Delta T$ | $\\Delta Q = \\Delta U + P\\Delta V = n C_p \\Delta T$ |
| **Isochoric** | $V = \\text{const} \\implies \\Delta V = 0$ | $W = 0$ | $\\Delta Q = \\Delta U = n C_v \\Delta T$ |

* **Mayer's Relation**: $C_p - C_v = R$
* **Specific Heat Ratio**: $\\gamma = \\frac{C_p}{C_v}$ (Monoatomic: $\\gamma = 5/3 \\approx 1.67$; Diatomic: $\\gamma = 7/5 = 1.4$).

---

### 4. Step-by-Step Problem Solving Guide
1. **Step 1: Identify Process Type**: Check whether $T, P, V,$ or $Q$ is constant or changing.
2. **Step 2: Calculate Work ($W$)**: Use $W = P\\Delta V$ for isobaric, $W = 0$ for isochoric, or $W = nRT\\ln(V_2/V_1)$ for isothermal.
3. **Step 3: Calculate Change in Internal Energy ($\\Delta U$)**: Apply $\\Delta U = n C_v \\Delta T$ (for ideal gas, $\\Delta U = 0$ if isothermal).
4. **Step 4: Solve for Heat ($\\Delta Q$)**: Apply $\\Delta Q = \\Delta U + \\Delta W$ checking algebraic signs.

---

### 5. Real-World Applications & Examples
- **Bicycle Pump**: Rapid compression of air represents an adiabatic compression ($\\Delta W < 0, \\Delta Q \\approx 0$). Work done on the gas increases internal energy ($\\Delta U > 0$), heating up the pump body.
- **Aerosol Spray Can**: When pressurized gas sprays out rapidly into ambient air, it expands adiabatically doing work ($\\Delta W > 0$), dropping its internal energy ($\\Delta U < 0$) and turning the can freezing cold.
- **Pressure Cooker**: Fixed volume heating (isochoric process) directs all heat to internal energy and steam pressure, speeding up boiling without doing mechanical expansion work.

---

### 6. Common Mistakes to Avoid in Exams
- âš ï¸ **Confusing State Functions vs Path Functions**: Internal energy ($U$) is a **state function** (depends only on initial and final states: $\\Delta U = U_f - U_i$), while Heat ($Q$) and Work ($W$) are **path functions**.
- âš ï¸ **Work sign inversion**: In physics, expansion work is positive ($\Delta W = +P\Delta V$), whereas in chemistry it is often defined as work on system ($W = -P\Delta V$). Stick to the physics convention $\Delta Q = \Delta U + \Delta W$.
- âš ï¸ **Assuming $\\Delta U = 0$ in adiabatic processes**: $\\Delta U = 0$ applies only to **isothermal** processes of ideal gases, NOT adiabatic processes!

---

### 7. Short Exam Summary
- **Zeroth Law**: Defines temperature & thermal equilibrium ($T_A = T_C \\land T_B = T_C \\implies T_A = T_B$).
- **First Law**: Energy conservation ($\Delta Q = \Delta U + \Delta W$).
- **Cyclic Process**: $\\oint dU = 0 \\implies Q_{\\text{net}} = W_{\\text{net}}$ (Area inside $P-V$ loop).
- **Free Expansion**: $W = 0, Q = 0 \\implies \\Delta U = 0, \\Delta T = 0$ for ideal gas into vacuum.

---

### 8. Practice Question
**Question**: An ideal gas system absorbs $500\\text{ J}$ of heat while expanding and doing $180\\text{ J}$ of external work.
1. What is the change in internal energy ($\\Delta U$) of the system?
2. If the process was reversed and $180\\text{ J}$ of work was done *on* the gas while releasing $100\\text{ J}$ of heat, what would be the new $\\Delta U$?
*(Hint: Part 1: $\\Delta U = 500 - 180 = +320\\text{ J}$; Part 2: $\\Delta U = -100 - (-180) = +80\\text{ J}$).*`;
}

// 3. NEWTON'S LAWS OF MOTION
function getNewtonLawsResponse({ mode, isComprehensive, action, lower, text }) {
  if (lower.includes('simple') || mode === 'beginner' || action === 'Simple Explanation') {
    return `### âš›ï¸ Newton's Laws of Motion (Simple Explanation)
**Class 11 / Intermediate 1st Year Physics â€” Mechanics**

Here are Newton's Three Laws of Motion explained in the simplest, most intuitive terms with everyday examples! ðŸš€

---

### 1ï¸âƒ£ First Law: The Law of Inertia (Lazy Law ðŸ›‹ï¸)
> *"An object will stay at rest or keep moving at the same speed in a straight line unless pushed or pulled by an external force."*

* **Simple Idea**: Things like to keep doing what they are already doing. Objects are "lazy" to change their state on their own!
* **Everyday Example**: When a bus suddenly hits the brakes, your upper body jerks forward. Why? Because your body was moving forward with the bus and wanted to keep moving forward due to **inertia**!

---

### 2ï¸âƒ£ Second Law: The Law of Force & Acceleration ($F = ma$ ðŸŽï¸)
> *"The acceleration of an object depends on how hard you push it and how heavy it is. More formally: Force = mass Ã— acceleration ($F = ma$)."*

* **Simple Idea**: 
  - Push harder $\\rightarrow$ moves faster.
  - Heavier object $\rightarrow$ harder to push.
* **Everyday Example**: Kicking a light football sends it flying across the ground ($a = F/m$), but kicking a heavy rock with the same force barely moves it (and hurts your foot!).

---

### 3ï¸âƒ£ Third Law: Action and Reaction ($F_{AB} = -F_{BA}$ ðŸš€)
> *"For every action, there is an equal and opposite reaction."*

* **Simple Idea**: Forces always come in pairs! You cannot push something without it pushing back on you with equal force.
* **Everyday Example**: When a rocket burns fuel, high-speed gas shoots **downward** (Action), which pushes the rocket soaring **upward** into space (Reaction)!

---

### ðŸ’¡ Quick Summary Formula Card
| Law | Concept | Key Formula / Rule | Everyday Analog |
| :--- | :--- | :--- | :--- |
| **1st Law** | Inertia & Equilibrium | $\\Sigma F = 0 \\implies v = \\text{constant}$ | Seatbelts in cars |
| **2nd Law** | Momentum & Force | $F = \\frac{\\Delta p}{\\Delta t} = ma$ | Catching cricket ball |
| **3rd Law** | Action-Reaction Pairs | $F_{12} = -F_{21}$ | Walking, Swimming, Rockets |

---

### ðŸ§ª Check Your Understanding
When a swimmer pushes the water backwards with their hands, why do they move forwards? Which law explains this?`;
  }

  if (lower.includes('mcq') || action === 'Generate MCQs') {
    return `### ðŸ”˜ MCQs: Newton's Laws of Motion (Intermediate Level)

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

  if (lower.includes('solve') || action === 'Solve Problems') {
    return `### ðŸ§© Step-by-Step Problem Solver: Newton's Laws

### â“ PROBLEM
A block of mass $m = 5\\text{ kg}$ is pulled along a rough horizontal surface by a constant horizontal force $F = 30\\text{ N}$. The coefficient of kinetic friction between the block and the surface is $\\mu_k = 0.2$. (Take $g = 9.8\\text{ m/s}^2$).
Find:
1. The frictional force acting on the block.
2. The acceleration of the block.
3. The distance covered in $4\\text{ seconds}$ starting from rest.

---

### ðŸŽ¯ GIVEN DATA
- Mass $m = 5\\text{ kg}$
- Applied Force $F = 30\\text{ N}$
- Coefficient of kinetic friction $\\mu_k = 0.2$
- Initial velocity $u = 0\\text{ m/s}$
- Time $t = 4\\text{ s}$
- Acceleration due to gravity $g = 9.8\\text{ m/s}^2$

---

### ðŸ“ STEP-BY-STEP SOLUTION

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

### âœ… FINAL ANSWERS
1. **Frictional force**: $f_k = 9.8\\text{ N}$ (opposing motion)
2. **Acceleration**: $a = 4.04\\text{ m/s}^2$
3. **Distance in $4\\text{ s}$**: $s = 32.32\\text{ m}$`;
  }

  // Comprehensive / Detailed Explanation (8-Part Structure)
  return `### âš›ï¸ Newton's Laws of Motion & Momentum (Comprehensive Guide)
**Intermediate 1st Year / Class 11 â€” Physics (Mechanics)**

Newton's laws of motion form the foundation of classical mechanics, describing how bodies interact and move under forces.

---

### 1. Definition & Core Concept
Mechanics is the study of motion and its causes. Newton's laws quantitatively formulate the relationship between external forces applied to physical bodies and their resulting kinematical motion.

---

### 2. Main Principles & Laws of Motion

#### 1ï¸âƒ£ First Law of Motion (Law of Inertia)
> *"Every body continues in its state of rest or of uniform motion in a straight line unless compelled to change that state by an external unbalanced force."*
* **Inertia**: The inherent property of matter to resist any change in velocity. Quantitatively measured by **mass ($m$)**.
* Types of Inertia: Inertia of Rest, Inertia of Motion, Inertia of Direction.

#### 2ï¸âƒ£ Second Law of Motion ($F = \\frac{dp}{dt}$)
> *"The rate of change of linear momentum of a body is directly proportional to the applied external force and takes place in the direction of the force."*
$$\\vec{F} = \\frac{d\\vec{p}}{dt} = \\frac{d(m\\vec{v})}{dt} = m\\vec{a}$$

#### 3ï¸âƒ£ Third Law of Motion ($F_{AB} = -F_{BA}$)
> *"To every action, there is always an equal and opposite reaction."*
* Action and reaction forces act **simultaneously** on **two different bodies**, hence they never cancel each other out.

---

### 3. Important Formulas & Sign Conventions
- Linear Momentum: $\\vec{p} = m\\vec{v}$
- Net Force: $\\vec{F}_{\\text{net}} = m\\vec{a}$
- Impulse: $\\vec{J} = \\vec{F}\\Delta t = \\Delta \\vec{p} = m(\\vec{v} - \\vec{u})$
- Static Friction: $f_s \\le \\mu_s N$; Kinetic Friction: $f_k = \\mu_k N$
- Conservation of Linear Momentum: When $\\Sigma \\vec{F}_{\\text{ext}} = 0 \\implies m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$.

---

### 4. Step-by-Step Problem Solving Guide (Free Body Diagrams)
1. Isolate the body of interest.
2. Identify all external forces: Gravity ($mg$), Normal contact force ($N$), Tension ($T$), Applied force ($F$), Friction ($f$).
3. Choose orthogonal coordinate axes ($x$ along motion, $y$ perpendicular).
4. Apply $\\Sigma F_x = ma_x$ and $\\Sigma F_y = ma_y = 0$ to solve for unknown accelerations or forces.

---

### 5. Real-World Applications & Examples
- **Seatbelts in Cars**: Restrain passengers from crashing forward due to inertia of motion when brakes are applied.
- **Rocket Propulsion**: Ejection of exhaust gases downward (Action) accelerates the rocket body upward (Reaction).
- **Recoil of a Gun**: Gun recoils backward when bullet is fired forward to conserve total momentum.

---

### 6. Common Mistakes to Avoid in Exams
- âš ï¸ Treating Action-Reaction forces as acting on the same body (they act on *different* bodies).
- âš ï¸ Forgetting normal force changes on inclined planes ($N = mg \\cos\\theta$, not $mg$).
- âš ï¸ Confusing mass (scalar in $\\text{kg}$) with weight (force vector $W = mg$ in $\\text{Newtons}$).

---

### 7. Short Exam Summary
- 1st Law defines force qualitatively; 2nd Law defines force quantitatively; 3rd Law describes interaction nature.
- Apparent weight in accelerating lift: $W = m(g + a)$ (upward acceleration); $W = m(g - a)$ (downward acceleration).

---

### 8. Practice Question
**Question**: A bullet of mass $m = 20\\text{ g}$ ($0.02\\text{ kg}$) is fired horizontally at $300\\text{ m/s}$ from a gun of mass $M = 3\\text{ kg}$. Find the recoil velocity ($V$) of the gun.
*(Hint: Total momentum initially $= 0$. Total momentum after $= M V + m v = 0 \\implies V = -\\frac{mv}{M} = -\\frac{0.02 \\times 300}{3} = -2\\text{ m/s}$).*`;
}

// 4. PHOTOSYNTHESIS
function getPhotosynthesisResponse({ mode, isComprehensive, action, lower, text }) {
  if (mode === 'beginner' || action === 'Simple Explanation') {
    return `### ðŸŒ± Photosynthesis (Simple Explanation)
**Class 11 / Intermediate BiPC â€” Botany (Plant Physiology)**

Photosynthesis is how **green plants make their own food** using sunlight! â˜€ï¸

---

### ðŸŒ¿ What Does a Plant Need?
1. â˜€ï¸ **Sunlight** â€” Provides radiant energy.
2. ðŸ’§ **Water ($H_2O$)** â€” Absorbed by roots from the soil.
3. ðŸŒ¬ï¸ **Carbon Dioxide ($CO_2$)** â€” Absorbed through stomata in the leaves.

---

### ðŸ§ª The Master Formula
$$6CO_2 + 6H_2O + \\text{Light} \\xrightarrow{\\text{Chlorophyll}} C_6H_{12}O_6 \\text{ (Glucose)} + 6O_2 \\text{ (Oxygen)}$$

---

### ðŸ’¡ Two Main Stages:
1. **Light Reactions (in Thylakoid membranes)**: Light splits water molecules into Hydrogen and Oxygen ($O_2$ is released into the air).
2. **Dark Reactions / Calvin Cycle (in Stroma)**: Uses ATP and NADPH to turn $CO_2$ into glucose sugar.

---

### ðŸ§ª Quick Question:
What green pigment in chloroplasts is responsible for trapping solar energy?`;
  }

  return `### ðŸŒ± Photosynthesis (Comprehensive Guide)
**Class 11 / Intermediate Botany â€” Plant Physiology**

Photosynthesis is the fundamental biological process by which autotrophic green plants and algae convert light energy into stable chemical energy stored in carbohydrates.

---

### 1. Definition & Overall Chemical Equation
Photosynthesis is an oxidation-reduction, endergonic photochemical process:
$$6CO_2 + 12H_2O \\xrightarrow[\\text{Chloroplast}]{\\text{Light Energy}} C_6H_{12}O_6 + 6H_2O + 6O_2 \\uparrow$$
- Water ($H_2O$) is **oxidized** to release oxygen gas ($O_2$).
- Carbon dioxide ($CO_2$) is **reduced** to synthesize glucose ($C_6H_{12}O_6$).

---

### 2. Main Principles & Site of Photosynthesis
- **Organelle**: **Chloroplast** containing double membrane, fluid **Stroma**, and stacked **Thylakoid Grana**.
- **Pigments**: Chlorophyll $a$ (primary reaction center pigment), Chlorophyll $b$, Carotenoids, and Xanthophylls (accessory pigments).

---

### 3. The Two Stages of Photosynthesis
1. **Light-Dependent Reaction (Photochemical Phase in Grana Thylakoids)**:
   - Absorption of photons by Photosystem II ($P_{680}$) and Photosystem I ($P_{700}$).
   - **Photolysis of Water**: $2H_2O \\rightarrow 4H^+ + 4e^- + O_2\\uparrow$.
   - **Photophosphorylation**: Non-cyclic and cyclic electron transport chains generate ATP and $\\text{NADPH} + H^+$.
2. **Light-Independent Reaction (Biosynthetic / Calvin Cycle in Stroma)**:
   - **Carboxylation**: $CO_2$ combines with RuBP (Ribulose 1,5-bisphosphate) catalyzed by the enzyme **RuBisCO** to form 3-PGA.
   - **Reduction**: 3-PGA is converted to Triose phosphates using ATP and NADPH.
   - **Regeneration**: RuBP is regenerated to continue the cycle.

---

### 4. Factors Affecting Photosynthesis (Blackman's Law)
- Light intensity and wavelength (Red and Blue regions show highest rates).
- $CO_2$ concentration (Major limiting factor).
- Temperature (Enzymatic reactions of dark phase are temperature sensitive).
- Water availability.

---

### 5. Short Exam Summary & Practice
- Primary electron donor: $H_2O$; Primary electron acceptor in PS II: Pheophytin.
- Net output per 6 turns of Calvin cycle: 1 Glucose molecule, requiring $18\\text{ ATP}$ and $12\\text{ NADPH}$.`;
}

// 5. UNCURATED TOPIC COMPREHENSIVE FALLBACK GENERATOR
function getTopicComprehensiveFallback(topicName, originalText, mode) {
  const cleanTitle = topicName || originalText;
  return `### ðŸ“– ${cleanTitle} (Structured Study Guide)
*Note: This is a general structured explanation based on your specific study request.*

---

### 1. Definition & Core Concept
**${cleanTitle}** is a key topic that deals with fundamental principles, governing mechanisms, and systematic relationships in its field.
- **Primary Definition**: Clear theoretical statement describing the origin, behavior, and characteristics of ${cleanTitle}.
- **Scope**: Outlines the boundary conditions, core components, and operational framework.

---

### 2. Main Principles & Governing Rules
1. **Fundamental Rule**: Establishes how inputs, state variables, and energy/information interact.
2. **Cause-and-Effect Relationship**: Explains why and how the system responds when specific parameters vary.
3. **Conservation & Equilibrium**: Identifies invariant properties (mass, energy, momentum, or balance) maintained during the process.

---

### 3. Important Formulas & Key Relationships
- **Primary Equation**: Standard mathematical or conceptual formulation describing the rate of change, magnitude, or output.
- **Variables & SI Units**: Clearly defined parameters with appropriate standard dimensions.
- **Key Proportionalities**: Direct and inverse dependencies between primary variables.

---

### 4. Step-by-Step Learning Guide
1. **Step 1 â€” Understand Prerequisites**: Identify the baseline definitions and initial conditions.
2. **Step 2 â€” Apply the Principle**: Trace each step from given inputs to governing equations.
3. **Step 3 â€” Compute / Synthesize**: Solve step-by-step maintaining consistent units and rigorous logic.
4. **Step 4 â€” Verify & Evaluate**: Cross-check the final result against real-world physical and logical expectations.

---

### 5. Real-World Applications & Examples
- Everyday practical instances where **${cleanTitle}** is observed in technology, industry, or nature.
- Concrete scenarios demonstrating how theoretical principles produce measurable, predictable outcomes.

---

### 6. Common Mistakes to Avoid in Exams
- âš ï¸ Forgetting to check standard units and dimensional consistency.
- âš ï¸ Confusing cause with effect or omitting necessary initial assumptions.
- âš ï¸ Skipping step-by-step working when deriving formulas or answering structured questions.

---

### 7. Short Exam Summary
- Review key definitions, standard diagrams/curves, and primary governing equations.
- Memorize high-frequency problem types and their standard solution frameworks.

---

### 8. Practice Question
**Question**: How would you define **${cleanTitle}** and explain its primary real-world application in your own words?`;
}

// ============================================================
// MOCK AI TUTOR MAIN ENTRY POINT
// ============================================================

export function getMockTutorResponse(messageOrMessages, mode = 'standard', syllabusContext = null) {
  const context = extractConversationContext(messageOrMessages, syllabusContext);
  const {
    currentText: text,
    activeTopicKey,
    activeTopic,
    activeSubject,
    activeChapter,
    lastAssistantMsg,
    isCurrentMessageExplicitTopic,
  } = context;
  const lower = text.toLowerCase();
  const isComprehensive = isComprehensiveQuery(text, syllabusContext?.action, mode);

  if (!text) {
    return `### ðŸŽ“ Furqan NovaAI

Hello! ðŸ‘‹ I am your Intermediate (Class 11 & 12) AI Study Assistant.

Select your **Stream (MPC / BiPC / MEC / CEC)**, **Year**, and **Topic** above, or ask any question directly to get step-by-step explanations, formulas, MCQs, and exam revision!`;
  }

  // 1. Check for multi-turn follow-up intent first (Why?, Give example, Simpler, etc.)
  // Only trigger follow-up if the current message is NOT an explicit new topic query
  if (!isCurrentMessageExplicitTopic) {
    const followUpResponse = handleFollowUpIntent({
      currentText: text,
      lower,
      activeTopicKey,
      activeTopic,
      activeSubject,
      activeChapter,
      lastAssistantMsg,
      mode,
      syllabusContext,
    });

    if (followUpResponse) {
      return followUpResponse;
    }
  }

  // 2. Direct Topic Routing based on Active Topic Key or Query Keywords
  if (activeTopicKey === 'OPTICS_REFLECTION' || lower.includes('reflection of light') || lower.includes('laws of reflection') || (lower.includes('mirror') && !lower.includes('site'))) {
    return getReflectionOfLightResponse({
      mode,
      isComprehensive,
      action: syllabusContext?.action,
      lower,
      text,
    });
  }

  if (activeTopicKey === 'THERMODYNAMICS' || lower.includes('thermodynamic') || lower.includes('zeroth law') || lower.includes('first law of thermodynamics')) {
    return getThermodynamicsResponse({
      mode,
      isComprehensive,
      action: syllabusContext?.action,
      lower,
      text,
    });
  }

  if (activeTopicKey === 'NEWTON_LAWS' || lower.includes('newton') || (lower.includes('law') && lower.includes('motion')) || lower.includes('inertia')) {
    return getNewtonLawsResponse({
      mode,
      isComprehensive,
      action: syllabusContext?.action,
      lower,
      text,
    });
  }

  if (activeTopicKey === 'PHOTOSYNTHESIS' || lower.includes('photosynthesis')) {
    return getPhotosynthesisResponse({
      mode,
      isComprehensive,
      action: syllabusContext?.action,
      lower,
      text,
    });
  }

  // 3. If explicit comprehensive explanation was requested for any topic
  if (isComprehensive) {
    const topicHeading = activeTopic || text.replace(/explain|the|topic|comprehensively|in detail|teach me|about|:|please/gi, '').trim();
    return getTopicComprehensiveFallback(topicHeading || text, text, mode);
  }

  // 4. If syllabus context action was specifically selected (e.g. from syllabus drawer)
  if (syllabusContext && syllabusContext.action && syllabusContext.action !== 'standard') {
    return generateStructuredIntermediateResponse(text, mode, syllabusContext);
  }

  // ----------------------------------------------------------
  // SPECIFIC SHORT TOPIC QUICK HANDLERS
  // ----------------------------------------------------------

  // GRAVITY
  if (lower.includes('gravity') || lower.includes('gravitation')) {
    return `### ðŸŒ Gravity & Gravitation
**Physics â€” Mechanics**

**Gravity** is the universal attractive force between any two masses in the universe.

### Key Law: Newton's Universal Law of Gravitation
Every particle attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them:
$$F = G\\frac{m_1 m_2}{r^2}$$
where $G = 6.674 \\times 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$.

### On Earth:
$$g = \\frac{GM}{R^2} \\approx 9.8\\text{ m/s}^2$$

### Quick question
What would happen to your weight if you moved to the Moon, where gravity is $1/6\\text{th}$ of Earth's?`;
  }

  // WATER CYCLE
  if (lower.includes('water cycle') || lower.includes('watercycle')) {
    return `### ðŸ’§ The Water Cycle

The water cycle describes how water continuously circulates through Earth's hydrosphere, atmosphere, and lithosphere.

### Main Stages:
1. â˜€ï¸ **Evaporation**: Solar heat converts liquid water into water vapor.
2. â˜ï¸ **Condensation**: Water vapor cools in upper atmosphere forming clouds.
3. ðŸŒ§ï¸ **Precipitation**: Condensed water falls as rain, snow, sleet, or hail.
4. ðŸŒŠ **Collection / Runoff**: Water collects in rivers, lakes, oceans, and groundwater.

### Quick question:
What is the primary energy source driving the water cycle?`;
  }

  // CELL
  if (lower.includes('what is a cell') || lower.includes('explain cell') || lower.includes('cells')) {
    return `### ðŸ”¬ What is a Cell?
**Biology â€” Cell Biology**

A **cell** is the structural, functional, and biological unit of all known living organisms.

### Key Organelles:
- **Nucleus**: Contains genetic material (DNA).
- **Mitochondria**: The "Powerhouse of the Cell" generating ATP energy.
- **Ribosomes**: Protein synthesis factories.
- **Plasma Membrane**: Selectively permeable lipid bilayer protecting the cell.

### Quick question:
Why are mitochondria known as the powerhouse of the cell?`;
  }

  // ATOM
  if (lower.includes('what is an atom') || lower.includes('explain atom') || lower === 'atom') {
    return `### âš›ï¸ What is an Atom?
**Chemistry & Physics**

An **atom** is the smallest constituent unit of ordinary matter that has the properties of a chemical element.

### Subatomic Particles:
- **Protons ($p^+$)**: Positively charged particles in the nucleus.
- **Neutrons ($n^0$)**: Neutral particles in the nucleus.
- **Electrons ($e^-$)**: Negatively charged particles orbiting in quantum energy shells.

### Quick question:
What subatomic particles determine the atomic number ($Z$) of an element?`;
  }

  // PYTHON VARIABLES
  if (lower.includes('what is a variable') || lower.includes('variables') || lower.includes('python variable')) {
    return `### ðŸ Python Variables

A **variable** in Python is a named reference stored in memory that holds a value.

\`\`\`python
age = 16
subject = "Physics"
is_student = True
\`\`\`

Variables in Python are dynamically typed (no need to declare \`int\` or \`string\`).

### Quick question:
What happens if you reassign \`age = "sixteen"\` in Python?`;
  }

  // PYTHON FUNCTIONS
  if (lower.includes('python function') || lower.includes('what is a function') || lower === 'function') {
    return `### ðŸ Python Functions

A **function** is a reusable block of code defined with the \`def\` keyword:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("Student")
print(message)
\`\`\`

### Why use functions?
- Reusability (DRY: Don't Repeat Yourself)
- Modular organization and readability
- Easy testing and debugging`;
  }

  // PYTHON LOOPS
  if (lower.includes('python loop') || lower.includes('what is a loop') || lower === 'loop') {
    return `### ðŸ” Python Loops

Python provides two main loop structures:

\`\`\`python
# 1. For loop (iterate over sequence)
for i in range(5):
    print(f"Count: {i}")

# 2. While loop (runs while condition is true)
count = 0
while count < 3:
    print(count)
    count += 1
\`\`\``;
  }

  // PYTHON LIST VS TUPLE
  if (
    lower.includes('list and tuple') ||
    lower.includes('list vs tuple') ||
    lower.includes('difference between a list and a tuple') ||
    lower.includes('tuple vs list')
  ) {
    return `### ðŸ Python: Lists vs Tuples

| Feature | List \`[]\` | Tuple \`()\` |
| :--- | :--- | :--- |
| **Mutability** | **Mutable** (can be modified) | **Immutable** (cannot be modified) |
| **Syntax** | Square brackets \`[1, 2, 3]\` | Parentheses \`(1, 2, 3)\` |
| **Speed** | Standard | Faster and memory efficient |
| **Use Case** | Dynamic data collections | Fixed constants, coordinates |`;
  }

  // FRACTIONS
  if (lower.includes('fraction')) {
    return `### âž— Fractions
**Mathematics**

A **fraction** represents part of a whole: $\\frac{a}{b}$ where $a$ is the numerator and $b$ is the denominator ($b \\ne 0$).

### Key Operations:
- Addition: $\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}$
- Multiplication: $\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}$
- Division: $\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{ad}{bc}$`;
  }

  // ALGEBRA
  if (lower.includes('algebra') || lower.includes('solve for x')) {
    return `### âž• Linear Algebra & Equation Solving

To solve linear equations like $ax + b = c$:
1. Subtract $b$ from both sides: $ax = c - b$
2. Divide both sides by $a$: $x = \\frac{c - b}{a}$

### Example:
$$3x + 5 = 20 \\implies 3x = 15 \\implies x = 5$$`;
  }

  // ----------------------------------------------------------
  // GENERAL STUDY QUESTION FALLBACK (GROUNDED & INFORMATIVE)
  // ----------------------------------------------------------
  return getGeneralTutorResponse(text, mode);
}

// ============================================================
// GENERAL TUTOR RESPONSE (GROUNDED & HELPFUL)
// ============================================================

function getGeneralTutorResponse(text, mode) {
  const cleanQuery = cleanText(text);

  return `### ðŸ“š AI Study Assistant: Conceptual Guide
*Note: This is a general educational explanation for **"${cleanQuery}"**.*

---

### 1. Core Concept Overview
When studying **${cleanQuery}**, the goal is to understand the fundamental mechanism, governing laws, and how to apply them systematically in exam problem solving.

---

### 2. Key Framework
1. **Definition & Governing Law**: Establish the exact theoretical or mathematical principle.
2. **Components & Variables**: Identify what factors influence the system and verify their units.
3. **Cause-and-Effect Relationship**: Trace how changing one parameter alters the overall outcome.

---

### 3. Step-by-Step Learning Approach
- **Step 1**: Write down the primary definition and formula.
- **Step 2**: Work through a standard worked example step by step.
- **Step 3**: Practice with multiple-choice and numerical questions to consolidate understanding.

---

### ðŸ’¡ Study Suggestion
You can ask me to:
- *"Explain in simpler terms"*
- *"Give another real-world example"*
- *"Quiz me on this"*
- *"Show a step-by-step problem solution"*`;
}

// ============================================================
// QUESTION SOLVER
// ============================================================

export function getMockSolverResponse(question) {
  const q = cleanText(question);

  if (!q) {
    return `### â“ QUESTION

No question was entered.

### ðŸ“ SOLUTION

Please enter a question and I'll solve it step by step.`;
  }

  // ----------------------------------------------------------
  // UPGRADED MATH & TRIGONOMETRY SOLVER
  // ----------------------------------------------------------
  const result = solveMathProblem(q);

  // If detected as a concept question, word problem, or syllabus inquiry,
  // invoke the Furqan NovaAI fallback to provide a comprehensive step-by-step solution
  if (result.type === 'concept_question') {
    const tutorResponse = getMockTutorResponse(q, 'standard');
    return `### ðŸ·ï¸ PROBLEM TYPE: Furqan NovaAI Solution & Conceptual Explanation

### â“ QUESTION
${q}

---

${tutorResponse}

---

### ðŸ’¡ NOTE
This question was solved using the **Furqan NovaAI**. You can also enter math calculations such as \`cos(90Â°) + sin(90Â°)\`, \`2sin(30Â°) + cos(60Â°)\`, \`tan(45Â°)\`, \`25% of 80\`, or \`x + 5 = 12\` for instant step-by-step calculations.`;
  }

  if (result.content) {
    return result.content;
  }

  // Fallback to Furqan NovaAI for anything else
  const fallback = getMockTutorResponse(q, 'standard');
  return `### ðŸ·ï¸ PROBLEM TYPE: Furqan NovaAI Solution

### â“ QUESTION
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
      question: 'What is 7 Ã— 8?',
      options: ['54', '56', '64', '48'],
      correct: 1,
      explanation: '7 Ã— 8 = 56.'
    },
    {
      question: 'What is 25 + 15?',
      options: ['30', '35', '40', '45'],
      correct: 2,
      explanation: '25 + 15 = 40.'
    },
    {
      question: 'What is 100 Ã· 4?',
      options: ['20', '25', '30', '40'],
      correct: 1,
      explanation: '100 Ã· 4 = 25.'
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
      back: 'The water cycle describes the continuous movement of water through Earthâ€™s environment.'
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

  // If syllabus context is present, use structured curriculum response
  if (syllabusContext && (syllabusContext.subject || syllabusContext.chapter || syllabusContext.topic)) {
    return generateStructuredIntermediateResponse(text, mode, syllabusContext);
  }

  // General grounded academic fallback with step-by-step structure
  const topicTitle = text.length > 50 ? `${text.slice(0, 47)}...` : text;
  return `### ðŸ“– Study Guide: ${topicTitle}

Here is a structured, step-by-step breakdown to help you study this concept:

---

### 1. ðŸ” Conceptual Overview
When exploring **${topicTitle}**, the goal is to break the core idea down into its foundational components and understand how each part connects.

---

### 2. ðŸ“ Step-by-Step Learning Strategy
1. **Identify the Core Definition**: State what the phenomenon, formula, or principle is in one clear sentence.
2. **Examine the Governing Rules**: Look at the mathematical laws, physical constraints, or logical conditions that apply.
3. **Work Through an Everyday Example**: Test your understanding by connecting the concept to a real-world analog.
4. **Practice & Verify**: Solve a representative problem or answer a concept check question.

---

### ðŸ’¡ Suggested Next Actions
* Click **"ðŸ’¡ Explain Simply"** for an intuitive, beginner-friendly metaphor.
* Click **"ðŸ“š Give Example"** for a real-world application.
* Click **"ðŸ§© Give Hint"** if you're stuck on a homework or exam problem.
* Ask any follow-up question (e.g., *"Why?"*, *"Give an example"*, or *"Quiz me on this"*).

> *Note: This is a general conceptual study guide. For state-specific Intermediate board syllabus topics, select your Stream, Year, and Chapter from the Syllabus Drawer above.*`;
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

  return `### ðŸ Python: ${cleanTopic}

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
    return `### ðŸ’¡ ${topic} â€” Simple Explanation
**Stream: ${stream} | ${year} | ${subject} â†’ ${chapter}**

Let's break down **${topic}** in simple, intuitive terms with clear everyday examples!

---

### ðŸŒŸ The Core Concept
* **What is it?** ${topic} is an essential concept in **${subject}** that explains how systems behave in the real world.
* **Analogy**: Think of ${topic} like a set of building blocks. Once you understand the fundamental rule, everything else clicks into place easily.

---

### ðŸ”‘ 3 Key Takeaways
1. **Rule 1**: Master the basic definition and fundamental equation/principle of ${topic}.
2. **Rule 2**: Identify how changing one variable influences the rest of the system.
3. **Rule 3**: Relate theoretical concepts to daily observations.

---

### ðŸŽ¯ Example in Action
When studying **${topic}** for ${year} exams:
- Break complex problems down into given values, required targets, and the relevant principle.
- Write each step clearly with correct units and terminology.

---

### ðŸ§ª Quick Practice Question
How would you explain the importance of **${topic}** in ${subject} in one sentence?`;
  }

  // Action: Detailed Explanation
  if (action === 'Detailed Explanation' || mode === 'deep' || lower.includes('detailed') || lower.includes('derivation')) {
    return `### ðŸ§  ${topic} â€” Comprehensive Deep Dive
**Stream: ${stream} | ${year} | ${subject} â†’ ${chapter}**

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

### ðŸ“Œ Summary Card
- **Primary Formula/Principle**: Core formula and dimensional analysis for ${topic}.
- **SI Units & Constants**: Standard notations used in Intermediate ${subject}.`;
  }

  // Action: Solve Problems / Step-by-Step Solutions
  if (action === 'Solve Problems' || action === 'Step-by-Step Solutions' || lower.includes('solve') || lower.includes('step')) {
    return `### ðŸ§© Step-by-Step Problem Solver: ${topic}
**Intermediate Syllabus â€” ${stream} | ${year} | ${subject}**

---

### â“ PROBLEM
A standard Intermediate board exam question on **${topic}** (${chapter}):
Calculate the primary required value given standard conditions and parameters.

---

### ðŸŽ¯ GIVEN DATA & CONCEPT
- **Subject / Chapter**: ${subject} â€” ${chapter}
- **Governing Concept**: ${topic}
- **Required**: Determine final numerical / analytical result with full intermediate steps.

---

### ðŸ“ STEP-BY-STEP SOLUTION

**Step 1: State the fundamental formula / law**
Write down the primary formula for ${topic} and define each variable.

**Step 2: Substitute given values with SI units**
Ensure all dimensions and units are unified before carrying out computations.

**Step 3: Simplify and calculate intermediate expressions**
Compute step-by-step to avoid calculation errors and retain precision.

**Step 4: State the final result with appropriate units and significant figures**
Highlight the final answer clearly for maximum marks in examiner evaluation.

---

### âœ… FINAL VERIFICATION
- Double-check dimensional consistency and physical/economic sense.
- Try varying the initial parameters to test your problem-solving speed!`;
  }

  // Action: Generate MCQs
  if (action === 'Generate MCQs' || lower.includes('mcq')) {
    return `### ðŸ”˜ High-Yield MCQs: ${topic}
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
*Explanation: ${topic} is a high-frequency topic in Class 11â€“12 / Intermediate board exams.*

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
    return `### ðŸ† Rapid Revision & Exam Blueprint: ${topic}
**Stream: ${stream} | ${year} | ${subject} â†’ ${chapter}**

---

### ðŸ“‹ High-Yield Summary & Core Definitions
* **Core Topic**: ${topic}
* **Chapter Significance**: Essential for ${year} ${subject} board exams and entrance tests.
* **Key Concept**: Understand definitions, standard diagram/graphical representations, and mathematical models.

---

### âš¡ Essential Formulas & High-Probability Points
- **Primary Equation / Law**: State the fundamental law governing ${topic}.
- **Diagrams / Graphs**: Practice standard labeling (crucial for 4-mark and 8-mark questions).
- **Key Relationships**: Be prepared to explain direct and inverse dependencies between parameters.

---

### âš ï¸ Common Mistakes to Avoid
1. Forgetting to write units in final calculations.
2. Missing definitions or assumptions when stating laws/theorems.
3. Incomplete diagrams without proper axis labels or annotations.

---

### ðŸŽ¯ Top 3 Board Exam Practice Questions
1. **Short Answer (2 Marks)**: Define ${topic} and give its SI unit or main characteristic.
2. **Medium Answer (4 Marks)**: Explain the principle/mechanism of ${topic} with a suitable example/diagram.
3. **Long Answer (8 Marks)**: State and derive the complete formula/theorem for ${topic} and solve a numerical problem.`;
  }

  // Default: Comprehensive Explain Topic
  return `### ðŸ“– ${topic}
**Stream: ${stream} | ${year} | ${subject} â†’ ${chapter}**

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

### ðŸ’¡ Suggested Next Actions
Use the quick action buttons above:
- Click **"Simple Explanation"** for intuitive analogies.
- Click **"Solve Problems"** for step-by-step numerical/theoretical walkthroughs.
- Click **"Generate MCQs"** to test your exam readiness!`;
}
