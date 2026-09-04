/* ============================================================
   SSC / CLASS 6-10 SYLLABUS DATA STRUCTURE
   Configurable, extensible dataset for secondary school
   ============================================================ */

export const SSC_CLASSES = [
  { id: 'class_6', label: 'Class 6', shortLabel: '6th', badge: '6' },
  { id: 'class_7', label: 'Class 7', shortLabel: '7th', badge: '7' },
  { id: 'class_8', label: 'Class 8', shortLabel: '8th', badge: '8' },
  { id: 'class_9', label: 'Class 9', shortLabel: '9th', badge: '9' },
  { id: 'class_10', label: 'Class 10', shortLabel: '10th', badge: '10' },
];

export const SSC_SUBJECTS = {
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '📐',
    color: '#6366f1',
    chapters: {
      class_6: [
        { id: 'knowing_numbers', name: 'Knowing Our Numbers', description: 'Large numbers, estimation, roman numerals', topics: ['Comparing Numbers', 'Large Numbers', 'Estimation', 'Roman Numerals'] },
        { id: 'whole_numbers', name: 'Whole Numbers', description: 'Properties and patterns of whole numbers', topics: ['Number Line', 'Properties of Whole Numbers', 'Patterns in Whole Numbers'] },
        { id: 'integers', name: 'Playing with Numbers & Integers', description: 'Factors, multiples, integers on number line', topics: ['Factors and Multiples', 'Prime and Composite Numbers', 'HCF and LCM', 'Integers', 'Addition and Subtraction of Integers'] },
        { id: 'fractions_decimals', name: 'Fractions and Decimals', description: 'Operations on fractions and decimals', topics: ['Types of Fractions', 'Comparing Fractions', 'Addition and Subtraction of Fractions', 'Decimals', 'Operations on Decimals'] },
        { id: 'basic_geometry', name: 'Basic Geometrical Ideas', description: 'Points, lines, curves, polygons', topics: ['Points, Lines, Segments, Rays', 'Curves and Polygons', 'Angles', 'Triangles and Quadrilaterals', 'Circles'] },
        { id: 'mensuration_6', name: 'Mensuration', description: 'Perimeter and area of basic shapes', topics: ['Perimeter of Rectangles and Squares', 'Area of Rectangles and Squares', 'Area of Triangles', 'Area of Combined Shapes'] },
      ],
      class_7: [
        { id: 'integers_7', name: 'Integers', description: 'Multiplication and division of integers, properties', topics: ['Properties of Integers', 'Multiplication of Integers', 'Division of Integers'] },
        { id: 'fractions_decimals_7', name: 'Fractions and Decimals', description: 'Multiplication and division of fractions and decimals', topics: ['Multiplication of Fractions', 'Division of Fractions', 'Multiplication of Decimals', 'Division of Decimals'] },
        { id: 'rational_numbers_7', name: 'Rational Numbers', description: 'Introduction and operations on rational numbers', topics: ['What are Rational Numbers', 'Equivalent Rational Numbers', 'Operations on Rational Numbers'] },
        { id: 'algebraic_expressions_7', name: 'Algebraic Expressions', description: 'Terms, coefficients, like terms, addition', topics: ['Terms and Coefficients', 'Like and Unlike Terms', 'Addition and Subtraction of Expressions'] },
        { id: 'linear_equations_7', name: 'Simple Equations', description: 'Solving simple linear equations', topics: ['Setting Up Equations', 'Solving Equations', 'Applications of Simple Equations'] },
        { id: 'triangles_7', name: 'Triangles and Congruence', description: 'Properties of triangles, congruence criteria', topics: ['Properties of Triangles', 'Exterior Angle Property', 'Triangle Inequality', 'Congruence of Triangles'] },
        { id: 'mensuration_7', name: 'Perimeter and Area', description: 'Area of parallelograms, triangles, circles', topics: ['Area of Parallelogram', 'Area of Triangle', 'Circumference of Circle', 'Area of Circle'] },
      ],
      class_8: [
        { id: 'rational_numbers_8', name: 'Rational Numbers', description: 'Properties and representation on number line', topics: ['Properties of Rational Numbers', 'Representation on Number Line', 'Between Two Rational Numbers'] },
        { id: 'linear_equations_8', name: 'Linear Equations in One Variable', description: 'Solving linear equations with variables on both sides', topics: ['Equations with Variable on One Side', 'Equations with Variables on Both Sides', 'Reducing Equations', 'Word Problems'] },
        { id: 'exponents_powers', name: 'Exponents and Powers', description: 'Laws of exponents, standard form', topics: ['Laws of Exponents', 'Powers with Negative Exponents', 'Standard Form of Numbers'] },
        { id: 'squares_roots', name: 'Squares and Square Roots', description: 'Perfect squares, patterns, finding square roots', topics: ['Properties of Perfect Squares', 'Patterns in Squares', 'Finding Square Roots', 'Square Roots of Decimals'] },
        { id: 'cubes_roots', name: 'Cubes and Cube Roots', description: 'Perfect cubes, finding cube roots', topics: ['Perfect Cubes', 'Cube Roots by Prime Factorisation', 'Cube Roots of Large Numbers'] },
        { id: 'quadrilaterals_8', name: 'Understanding Quadrilaterals', description: 'Polygons, angle sum, types of quadrilaterals', topics: ['Angle Sum Property', 'Types of Quadrilaterals', 'Parallelogram Properties', 'Special Parallelograms'] },
        { id: 'mensuration_8', name: 'Mensuration (3D)', description: 'Surface area and volume of cube, cuboid, cylinder', topics: ['Surface Area of Cube and Cuboid', 'Volume of Cube and Cuboid', 'Surface Area of Cylinder', 'Volume of Cylinder'] },
        { id: 'data_handling_8', name: 'Data Handling', description: 'Bar graphs, pie charts, probability', topics: ['Organizing Data', 'Pie Charts', 'Probability Introduction'] },
      ],
      class_9: [
        { id: 'number_systems_9', name: 'Number Systems', description: 'Real numbers, irrational numbers, laws of exponents', topics: ['Natural, Whole, Integers, Rationals', 'Irrational Numbers', 'Real Numbers and Number Line', 'Laws of Exponents for Real Numbers'] },
        { id: 'polynomials_9', name: 'Polynomials', description: 'Zeroes of polynomial, factorisation, algebraic identities', topics: ['Polynomials in One Variable', 'Zeroes of a Polynomial', 'Remainder Theorem', 'Factorisation of Polynomials', 'Algebraic Identities'] },
        { id: 'coordinate_geometry_9', name: 'Coordinate Geometry', description: 'Cartesian plane, plotting points', topics: ['Cartesian System', 'Plotting Points', 'Quadrants and Signs'] },
        { id: 'linear_equations_9', name: 'Linear Equations in Two Variables', description: 'Solutions and graph of linear equations', topics: ['Linear Equations ax + by + c = 0', 'Solution of Linear Equation', 'Graph of Linear Equation'] },
        { id: 'triangles_9', name: 'Triangles', description: 'Congruence, properties and inequalities', topics: ['Congruence Rules (SSS, SAS, ASA, RHS)', 'Properties of Isosceles Triangle', 'Inequalities in Triangles'] },
        { id: 'quadrilaterals_9', name: 'Quadrilaterals', description: 'Angle sum, types, mid-point theorem', topics: ['Angle Sum of Quadrilateral', 'Properties of Parallelogram', 'Mid-Point Theorem'] },
        { id: 'circles_9', name: 'Circles', description: 'Chord properties, angles, cyclic quadrilaterals', topics: ['Chords and Their Properties', 'Angles Subtended by Chords', 'Cyclic Quadrilaterals'] },
        { id: 'surface_areas_volumes_9', name: 'Surface Areas and Volumes', description: 'Cube, cuboid, cylinder, cone, sphere', topics: ['Surface Area of Cube and Cuboid', 'Surface Area of Cylinder and Cone', 'Surface Area of Sphere', 'Volume of Cube, Cuboid, Cylinder', 'Volume of Cone and Sphere'] },
        { id: 'statistics_9', name: 'Statistics', description: 'Mean, median, mode of data', topics: ['Collection and Presentation of Data', 'Mean of Data', 'Median of Data', 'Mode of Data'] },
        { id: 'probability_9', name: 'Probability', description: 'Experimental probability', topics: ['Experimental Probability', 'Empirical Probability', 'Events and Outcomes'] },
      ],
      class_10: [
        { id: 'real_numbers_10', name: 'Real Numbers', description: 'Euclid division, fundamental theorem of arithmetic', topics: ['Euclid\'s Division Lemma', 'Fundamental Theorem of Arithmetic', 'HCF and LCM using Prime Factorisation', 'Irrational Numbers Proofs', 'Decimal Expansions of Rationals'] },
        { id: 'sets_10', name: 'Sets', description: 'Set notation, types, operations and Venn diagrams', topics: ['Representation of Sets', 'Types of Sets', 'Union, Intersection, Complement', 'Venn Diagrams'] },
        { id: 'polynomials_10', name: 'Polynomials', description: 'Zeroes, relationship between zeroes and coefficients', topics: ['Zeroes of a Polynomial', 'Relationship between Zeroes and Coefficients', 'Division Algorithm for Polynomials'] },
        { id: 'pair_linear_10', name: 'Pair of Linear Equations', description: 'Graphical and algebraic methods of solving', topics: ['Graphical Method', 'Substitution Method', 'Elimination Method', 'Cross-Multiplication Method', 'Consistency of System'] },
        { id: 'quadratic_equations_10', name: 'Quadratic Equations', description: 'Factorisation, completing square, quadratic formula', topics: ['Standard Form of Quadratic', 'Solution by Factorisation', 'Completing the Square', 'Quadratic Formula', 'Nature of Roots (Discriminant)'] },
        { id: 'progressions_10', name: 'Progressions', description: 'AP and GP, nth term, sum of n terms', topics: ['Arithmetic Progression (AP)', 'nth Term of AP', 'Sum of First n Terms of AP', 'Geometric Progression (GP)', 'Applications of Progressions'] },
        { id: 'coordinate_geometry_10', name: 'Coordinate Geometry', description: 'Distance formula, section formula, area of triangle', topics: ['Distance Formula', 'Section Formula', 'Mid-Point Formula', 'Area of Triangle using Coordinates'] },
        { id: 'trigonometry_10', name: 'Trigonometry', description: 'Trigonometric ratios, identities, heights and distances', topics: ['Trigonometric Ratios', 'Trigonometric Ratios of Specific Angles', 'Trigonometric Identities', 'Heights and Distances'] },
        { id: 'mensuration_10', name: 'Mensuration', description: 'Surface areas and volumes of combinations of solids', topics: ['Surface Area of Combinations of Solids', 'Volume of Combinations of Solids', 'Frustum of a Cone'] },
        { id: 'statistics_10', name: 'Statistics', description: 'Mean, median, mode of grouped data, ogives', topics: ['Mean of Grouped Data', 'Median of Grouped Data', 'Mode of Grouped Data', 'Ogive (Cumulative Frequency Curve)'] },
        { id: 'probability_10', name: 'Probability', description: 'Classical definition, simple problems', topics: ['Classical Definition of Probability', 'Complementary Events', 'Simple Problems on Probability', 'Impossible and Sure Events'] },
      ],
    },
  },
  science: {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: '#3b82f6',
    chapters: {
      class_6: [
        { id: 'food', name: 'Food: Where Does It Come From', description: 'Sources of food, components', topics: ['Sources of Food', 'Food Materials and Sources', 'Plant Parts as Food', 'Animal Products'] },
        { id: 'living_things', name: 'The Living World', description: 'Characteristics of living organisms', topics: ['Living and Non-Living Things', 'Habitat and Adaptation', 'Characteristics of Living Organisms'] },
        { id: 'materials', name: 'Sorting Materials', description: 'Properties and grouping of materials', topics: ['Objects and Materials', 'Properties of Materials', 'Grouping Materials'] },
        { id: 'body_movements', name: 'Body Movements', description: 'Joints, bones and movement in animals', topics: ['Human Body Movements', 'Joints and Bones', 'Movement in Other Animals'] },
      ],
      class_7: [
        { id: 'nutrition', name: 'Nutrition in Plants and Animals', description: 'Photosynthesis, digestion in animals', topics: ['Photosynthesis', 'Modes of Nutrition in Plants', 'Nutrition in Animals', 'Digestion in Humans'] },
        { id: 'heat', name: 'Heat and Temperature', description: 'Measurement of temperature, heat transfer', topics: ['Hot and Cold', 'Measurement of Temperature', 'Transfer of Heat'] },
        { id: 'acids_bases_7', name: 'Acids, Bases and Salts', description: 'Natural indicators, neutralisation', topics: ['Acids and Bases', 'Natural Indicators', 'Neutralisation'] },
        { id: 'weather_climate', name: 'Weather, Climate and Adaptations', description: 'Weather vs climate, adaptations of animals', topics: ['Weather and Climate', 'Climate and Adaptation', 'Animals in Different Climates'] },
      ],
      class_8: [
        { id: 'crop_production', name: 'Crop Production and Management', description: 'Agricultural practices', topics: ['Agricultural Practices', 'Basic Farming Practices', 'Irrigation', 'Crop Protection'] },
        { id: 'microorganisms', name: 'Microorganisms', description: 'Types of microorganisms, useful and harmful', topics: ['Types of Microorganisms', 'Useful Microorganisms', 'Harmful Microorganisms', 'Food Preservation'] },
        { id: 'synthetic_fibres', name: 'Synthetic Fibres and Plastics', description: 'Types of synthetic fibres, plastics', topics: ['Synthetic Fibres', 'Types of Synthetic Fibres', 'Plastics', 'Biodegradable and Non-biodegradable'] },
        { id: 'metals_nonmetals_8', name: 'Metals and Non-Metals', description: 'Physical and chemical properties', topics: ['Physical Properties of Metals and Non-Metals', 'Chemical Properties', 'Reactivity Series', 'Uses of Metals and Non-Metals'] },
        { id: 'force_pressure_8', name: 'Force and Pressure', description: 'Force, friction, pressure in fluids', topics: ['Force', 'Types of Forces', 'Pressure', 'Pressure in Fluids', 'Atmospheric Pressure'] },
        { id: 'light_8', name: 'Light', description: 'Reflection, laws of reflection', topics: ['Laws of Reflection', 'Regular and Diffused Reflection', 'Multiple Images', 'Human Eye', 'Visually Impaired Aids'] },
      ],
      class_9: [
        { id: 'matter_9', name: 'Matter Around Us', description: 'States of matter, particle nature', topics: ['Physical Nature of Matter', 'States of Matter', 'Change of State', 'Evaporation'] },
        { id: 'atoms_molecules_9', name: 'Atoms and Molecules', description: 'Laws of chemical combination, atomic mass', topics: ['Laws of Chemical Combination', 'Atoms and Atomic Mass', 'Molecules and Molecular Mass', 'Mole Concept and Molar Mass'] },
        { id: 'structure_atom_9', name: 'Structure of the Atom', description: 'Subatomic particles, atomic models', topics: ['Charged Particles in Matter', 'Thomson Model', 'Rutherford Model', 'Bohr Model', 'Electron Configuration'] },
        { id: 'motion_9', name: 'Motion', description: 'Distance, displacement, velocity, acceleration', topics: ['Distance and Displacement', 'Speed and Velocity', 'Acceleration', 'Equations of Motion', 'Graphical Representation of Motion'] },
        { id: 'force_laws_9', name: 'Force and Laws of Motion', description: 'Newton\'s laws, conservation of momentum', topics: ['Balanced and Unbalanced Forces', 'First Law of Motion (Inertia)', 'Second Law of Motion (F=ma)', 'Third Law of Motion', 'Conservation of Momentum'] },
        { id: 'gravitation_9', name: 'Gravitation', description: 'Universal law of gravitation, free fall, weight', topics: ['Universal Law of Gravitation', 'Free Fall', 'Weight and Mass', 'Thrust and Pressure', 'Archimedes\' Principle', 'Relative Density'] },
        { id: 'work_energy_9', name: 'Work and Energy', description: 'Work, energy, power, kinetic and potential energy', topics: ['Work Done by a Force', 'Energy and Its Forms', 'Kinetic Energy', 'Potential Energy', 'Law of Conservation of Energy', 'Power'] },
        { id: 'tissues_9', name: 'Tissues', description: 'Plant and animal tissues', topics: ['Plant Tissues (Meristematic, Permanent)', 'Animal Tissues (Epithelial, Connective, Muscular, Nervous)'] },
        { id: 'diversity_organisms_9', name: 'Diversity in Living Organisms', description: 'Classification, taxonomy', topics: ['Basis of Classification', 'Classification and Evolution', 'Five Kingdom Classification'] },
      ],
      class_10: [
        { id: 'chemical_reactions_10', name: 'Chemical Reactions and Equations', description: 'Types of reactions, balancing equations', topics: ['Chemical Equations', 'Balancing Chemical Equations', 'Types of Chemical Reactions', 'Oxidation and Reduction', 'Corrosion and Rancidity'] },
        { id: 'acids_bases_salts_10', name: 'Acids, Bases and Salts', description: 'pH scale, importance of pH, salts', topics: ['Properties of Acids and Bases', 'pH Scale', 'Importance of pH in Everyday Life', 'Salts and Their Properties', 'Chemicals from Common Salt'] },
        { id: 'metals_nonmetals_10', name: 'Metals and Non-Metals', description: 'Reactivity series, ionic bonding, corrosion', topics: ['Physical Properties', 'Chemical Properties of Metals', 'Reactivity Series', 'Ionic Bonding', 'Occurrence and Extraction of Metals', 'Corrosion'] },
        { id: 'carbon_compounds_10', name: 'Carbon and Its Compounds', description: 'Covalent bonding, carbon compounds', topics: ['Bonding in Carbon', 'Versatile Nature of Carbon', 'Nomenclature', 'Chemical Properties of Carbon Compounds', 'Important Carbon Compounds', 'Soaps and Detergents'] },
        { id: 'life_processes_10', name: 'Life Processes', description: 'Nutrition, respiration, transportation, excretion', topics: ['Nutrition (Autotrophic and Heterotrophic)', 'Respiration', 'Transportation in Humans and Plants', 'Excretion'] },
        { id: 'control_coordination_10', name: 'Control and Coordination', description: 'Nervous system, hormones, plant hormones', topics: ['Nervous System', 'Reflex Actions', 'Human Brain', 'Coordination in Plants', 'Hormones in Animals'] },
        { id: 'heredity_evolution_10', name: 'Heredity and Evolution', description: 'Mendel\'s contribution, evolution', topics: ['Mendel\'s Contribution', 'Sex Determination', 'Evolution and Classification', 'Speciation', 'Evolution Should Not Be Equated With Progress'] },
        { id: 'light_10', name: 'Light - Reflection and Refraction', description: 'Mirrors, lenses, refraction', topics: ['Reflection of Light', 'Spherical Mirrors', 'Mirror Formula', 'Refraction of Light', 'Lenses', 'Lens Formula', 'Power of Lens'] },
        { id: 'electricity_10', name: 'Electricity', description: 'Current, potential difference, resistance', topics: ['Electric Current and Circuit', 'Potential Difference', 'Ohm\'s Law', 'Resistance and Resistivity', 'Combination of Resistors', 'Heating Effect of Electric Current', 'Electric Power'] },
        { id: 'magnetic_effects_10', name: 'Magnetic Effects of Electric Current', description: 'Magnetic field, electromagnetic induction', topics: ['Magnetic Field and Field Lines', 'Force on Current-Carrying Conductor', 'Electric Motor', 'Electromagnetic Induction', 'Electric Generator', 'Domestic Electric Circuits'] },
      ],
    },
  },
  social_science: {
    id: 'social_science',
    name: 'Social Science',
    icon: '🌍',
    color: '#f59e0b',
    chapters: {
      class_6: [
        { id: 'history_6', name: 'History - Our Past', description: 'Ancient civilizations and early India', topics: ['What, Where, How and When', 'Early Humans', 'First Farmers and Herders', 'First Cities'] },
        { id: 'geography_6', name: 'Geography - The Earth', description: 'Earth, globe, maps', topics: ['The Earth in the Solar System', 'Globe and Maps', 'Motions of the Earth', 'Major Domains of the Earth'] },
      ],
      class_7: [
        { id: 'history_7', name: 'History - Medieval India', description: 'Delhi Sultanate, Mughal Empire', topics: ['New Kings and Kingdoms', 'Delhi Sultanate', 'Mughal Empire', 'Towns, Traders, and Craftspersons'] },
        { id: 'geography_7', name: 'Geography - Our Environment', description: 'Natural environment, resources', topics: ['Environment', 'Natural Vegetation and Wildlife', 'Water Resources', 'Human Environment'] },
      ],
      class_8: [
        { id: 'history_8', name: 'History - Modern India', description: 'British rule, national movement', topics: ['How, When and Where', 'From Trade to Territory', 'Ruling the Countryside', 'The Making of National Movement'] },
        { id: 'geography_8', name: 'Geography - Resources', description: 'Land, soil, water, minerals', topics: ['Resources', 'Land, Soil, Water Resources', 'Mineral and Power Resources', 'Agriculture', 'Industries'] },
        { id: 'civics_8', name: 'Civics - Social and Political Life', description: 'Indian Constitution, Parliament', topics: ['The Indian Constitution', 'Understanding Secularism', 'Parliament and Laws', 'Judiciary'] },
      ],
      class_9: [
        { id: 'history_9', name: 'History - India and Contemporary World', description: 'French Revolution, socialism, Nazism', topics: ['The French Revolution', 'Socialism in Europe', 'Nazism and Rise of Hitler', 'Pastoralists in the Modern World'] },
        { id: 'geography_9', name: 'Geography - Contemporary India', description: 'Physical features, climate, drainage', topics: ['India - Size and Location', 'Physical Features of India', 'Drainage', 'Climate', 'Natural Vegetation and Wildlife', 'Population'] },
        { id: 'civics_9', name: 'Democratic Politics', description: 'Democracy, elections, institutions', topics: ['What is Democracy?', 'Constitutional Design', 'Electoral Politics', 'Working of Institutions', 'Democratic Rights'] },
        { id: 'economics_9', name: 'Economics', description: 'People as resource, poverty', topics: ['The Story of Village Palampur', 'People as Resource', 'Poverty as a Challenge', 'Food Security in India'] },
      ],
      class_10: [
        { id: 'history_10', name: 'History - India and Contemporary World II', description: 'Nationalism, globalization', topics: ['The Rise of Nationalism in Europe', 'Nationalism in India', 'The Making of a Global World', 'The Age of Industrialisation', 'Print Culture and the Modern World'] },
        { id: 'geography_10', name: 'Geography - Contemporary India II', description: 'Resources, manufacturing, lifelines', topics: ['Resources and Development', 'Water Resources', 'Agriculture', 'Minerals and Energy Resources', 'Manufacturing Industries', 'Lifelines of National Economy'] },
        { id: 'civics_10', name: 'Democratic Politics II', description: 'Power sharing, federalism, political parties', topics: ['Power Sharing', 'Federalism', 'Democracy and Diversity', 'Gender, Religion and Caste', 'Political Parties', 'Outcomes of Democracy'] },
        { id: 'economics_10', name: 'Understanding Economic Development', description: 'Development, sectors, money', topics: ['Development', 'Sectors of the Indian Economy', 'Money and Credit', 'Globalisation and the Indian Economy', 'Consumer Rights'] },
      ],
    },
  },
  english: {
    id: 'english',
    name: 'English',
    icon: '📖',
    color: '#ec4899',
    chapters: {
      class_6: [
        { id: 'grammar_6', name: 'Grammar', description: 'Parts of speech, tenses, sentence structure', topics: ['Nouns and Pronouns', 'Verbs and Tenses', 'Adjectives and Adverbs', 'Sentences and Punctuation'] },
        { id: 'writing_6', name: 'Writing Skills', description: 'Paragraphs, letters, short compositions', topics: ['Paragraph Writing', 'Letter Writing', 'Story Writing'] },
      ],
      class_7: [
        { id: 'grammar_7', name: 'Grammar', description: 'Advanced tenses, voice, modals', topics: ['Tenses (All Types)', 'Active and Passive Voice', 'Modals', 'Prepositions and Conjunctions'] },
        { id: 'writing_7', name: 'Writing Skills', description: 'Essays, diary entry, notice', topics: ['Essay Writing', 'Diary Entry', 'Notice and Message Writing'] },
      ],
      class_8: [
        { id: 'grammar_8', name: 'Grammar', description: 'Clauses, reported speech, determiners', topics: ['Clauses and Phrases', 'Reported Speech', 'Determiners', 'Subject-Verb Agreement'] },
        { id: 'writing_8', name: 'Writing Skills', description: 'Formal letters, articles, reports', topics: ['Formal Letter Writing', 'Article Writing', 'Report Writing'] },
      ],
      class_9: [
        { id: 'grammar_9', name: 'Grammar', description: 'Transformation, synthesis, comprehension', topics: ['Transformation of Sentences', 'Synthesis of Sentences', 'Error Correction', 'Reading Comprehension'] },
        { id: 'writing_9', name: 'Writing Skills', description: 'Letters, essays, notices, articles', topics: ['Formal and Informal Letters', 'Essay Writing', 'Notice and Poster Writing', 'Article and Speech Writing'] },
      ],
      class_10: [
        { id: 'grammar_10', name: 'Grammar', description: 'Advanced grammar for board exams', topics: ['Tenses (Revision)', 'Voice Change', 'Reported Speech', 'Clauses', 'Error Correction', 'Sentence Reordering'] },
        { id: 'writing_10', name: 'Writing Skills', description: 'Board exam writing formats', topics: ['Letter Writing (Formal/Informal)', 'Essay Writing', 'Article Writing', 'Report Writing', 'Paragraph Writing'] },
      ],
    },
  },
  telugu: {
    id: 'telugu',
    name: 'Telugu',
    icon: '📝',
    color: '#14b8a6',
    chapters: {
      class_6: [{ id: 'telugu_6', name: 'Telugu Language', description: 'Telugu grammar and literature', topics: ['Padyam', 'Gadyam', 'Vyakaranam'] }],
      class_7: [{ id: 'telugu_7', name: 'Telugu Language', description: 'Telugu grammar and literature', topics: ['Padyam', 'Gadyam', 'Vyakaranam', 'Rachanalu'] }],
      class_8: [{ id: 'telugu_8', name: 'Telugu Language', description: 'Telugu grammar and literature', topics: ['Padyam', 'Gadyam', 'Vyakaranam', 'Rachanalu'] }],
      class_9: [{ id: 'telugu_9', name: 'Telugu Language', description: 'Telugu grammar and literature', topics: ['Padyam', 'Gadyam', 'Vyakaranam', 'Rachanalu', 'Prabandham'] }],
      class_10: [{ id: 'telugu_10', name: 'Telugu Language', description: 'Telugu grammar and literature for board exams', topics: ['Padyam', 'Gadyam', 'Vyakaranam', 'Rachanalu', 'Prabandham'] }],
    },
  },
  hindi: {
    id: 'hindi',
    name: 'Hindi',
    icon: '📕',
    color: '#f97316',
    chapters: {
      class_6: [{ id: 'hindi_6', name: 'Hindi Language', description: 'Hindi grammar and literature', topics: ['Vyakaran', 'Gadya', 'Kavita', 'Lekhan'] }],
      class_7: [{ id: 'hindi_7', name: 'Hindi Language', description: 'Hindi grammar and literature', topics: ['Vyakaran', 'Gadya', 'Kavita', 'Lekhan'] }],
      class_8: [{ id: 'hindi_8', name: 'Hindi Language', description: 'Hindi grammar and literature', topics: ['Vyakaran', 'Gadya', 'Kavita', 'Lekhan', 'Nibandh'] }],
      class_9: [{ id: 'hindi_9', name: 'Hindi Language', description: 'Hindi grammar and literature', topics: ['Vyakaran', 'Gadya', 'Kavita', 'Lekhan', 'Nibandh'] }],
      class_10: [{ id: 'hindi_10', name: 'Hindi Language', description: 'Hindi grammar and literature for board exams', topics: ['Vyakaran', 'Gadya', 'Kavita', 'Lekhan', 'Nibandh'] }],
    },
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getSSCClasses() {
  return SSC_CLASSES;
}

export function getSSCClassById(classId) {
  return SSC_CLASSES.find(c => c.id === classId) || SSC_CLASSES[0];
}

export function getSSCSubjects() {
  return Object.values(SSC_SUBJECTS);
}

export function getSSCSubjectById(subjectId) {
  return SSC_SUBJECTS[subjectId] || null;
}

export function getSSCChaptersForSubject(subjectId, classId = 'class_10') {
  const subject = getSSCSubjectById(subjectId);
  if (!subject || !subject.chapters) return [];
  return subject.chapters[classId] || [];
}

export function getSSCTopicsForChapter(subjectId, classId, chapterId) {
  const chapters = getSSCChaptersForSubject(subjectId, classId);
  const chapter = chapters.find(c => c.id === chapterId);
  return chapter ? chapter.topics : [];
}
