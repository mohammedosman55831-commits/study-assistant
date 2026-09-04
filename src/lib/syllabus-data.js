/* ============================================================
   INTERMEDIATE / CLASS 11-12 SYLLABUS DATA STRUCTURE
   Modular, extensible dataset for MPC, BiPC, MEC, CEC streams
   ============================================================ */

export const SYLLABUS_YEARS = [
  { id: '1st_year', label: '1st Year / Class 11', shortLabel: 'Class 11', badge: '11th' },
  { id: '2nd_year', label: '2nd Year / Class 12', shortLabel: 'Class 12', badge: '12th' },
];

export const SYLLABUS_STREAMS = [
  {
    id: 'mpc',
    name: 'MPC',
    fullName: 'Mathematics, Physics, Chemistry',
    icon: '📐⚛️🧪',
    color: '#6366f1',
    description: 'Engineering & Physical Sciences Stream',
    subjectIds: ['mathematics', 'physics', 'chemistry'],
  },
  {
    id: 'bipc',
    name: 'BiPC',
    fullName: 'Biology, Physics, Chemistry',
    icon: '🧬⚛️🧪',
    color: '#10b981',
    description: 'Medical & Life Sciences Stream',
    subjectIds: ['biology', 'physics', 'chemistry'],
  },
  {
    id: 'mec',
    name: 'MEC',
    fullName: 'Mathematics, Economics, Commerce',
    icon: '📐📊💼',
    color: '#f59e0b',
    description: 'Commerce, Economics & Quantitative Stream',
    subjectIds: ['mathematics', 'economics', 'commerce'],
  },
  {
    id: 'cec',
    name: 'CEC',
    fullName: 'Civics, Economics, Commerce',
    icon: '🏛️📊💼',
    color: '#ec4899',
    description: 'Social Sciences, Public Admin & Business Stream',
    subjectIds: ['civics', 'economics', 'commerce'],
  },
];

export const SYLLABUS_SUBJECTS = {
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '📐',
    color: '#6366f1',
    description: 'Algebra, Calculus, Coordinate Geometry, Vectors, Trigonometry & Matrices',
    chapters: {
      '1st_year': [
        {
          id: 'algebra',
          name: 'Algebra',
          description: 'Functions, Mathematical Induction, Complex Numbers, Quadratic Equations',
          topics: [
            'Functions and Types of Functions',
            'Mathematical Induction',
            'Complex Numbers and Argand Plane',
            'Quadratic Expressions and Equations',
            'Theory of Equations',
            'Permutations and Combinations',
            'Binomial Theorem',
            'Partial Fractions',
          ],
        },
        {
          id: 'trigonometry',
          name: 'Trigonometry',
          description: 'Trigonometric Ratios, Transformations, Trigonometric Equations & Inverses',
          topics: [
            'Trigonometric Ratios up to Transformations',
            'Compound Angles and Multiple Angles',
            'Trigonometric Equations',
            'Inverse Trigonometric Functions',
            'Hyperbolic Functions',
            'Properties of Triangles and Heights & Distances',
          ],
        },
        {
          id: 'coordinate_geometry',
          name: 'Coordinate Geometry',
          description: 'Straight Lines, Pair of Straight Lines, Circles and Conic Sections',
          topics: [
            'Locus and Transformation of Axes',
            'The Straight Line and Slopes',
            'Pair of Straight Lines',
            'Circles and System of Circles',
            'Parabola, Ellipse and Hyperbola',
            'Three Dimensional Coordinates',
          ],
        },
        {
          id: 'matrices_determinants',
          name: 'Matrices and Determinants',
          description: 'Matrix Operations, Types, Determinants, Inverses and Cramer’s Rule',
          topics: [
            'Types of Matrices and Operations',
            'Determinants and Properties',
            'Adjoint and Inverse of a Matrix',
            'Solving Linear Equations (Cramer’s Rule, Matrix Inversion)',
            'Rank of a Matrix and Consistency',
          ],
        },
        {
          id: 'vectors',
          name: 'Vectors',
          description: 'Vector Algebra, Dot Product, Cross Product, Scalar and Vector Triple Products',
          topics: [
            'Addition of Vectors and Scalar Multiplication',
            'Linear Combination and Collinearity',
            'Scalar / Dot Product of Two Vectors',
            'Vector / Cross Product of Two Vectors',
            'Scalar Triple Product and Vector Triple Product',
          ],
        },
      ],
      '2nd_year': [
        {
          id: 'calculus',
          name: 'Calculus',
          description: 'Limits, Continuity, Differentiation, Applications and Definite Integrals',
          topics: [
            'Limits and Continuity',
            'Differentiation and Derivatives of Functions',
            'Successive Differentiation and Mean Value Theorems',
            'Applications of Derivatives (Tangents, Normals, Maxima & Minima)',
            'Indefinite Integration and Integration Methods',
            'Definite Integrals and Area Under Curves',
            'Differential Equations and Order/Degree Solutions',
          ],
        },
        {
          id: 'probability',
          name: 'Probability',
          description: 'Random Experiments, Conditional Probability, Bayes Theorem & Distributions',
          topics: [
            'Random Experiments, Events and Axiomatic Probability',
            'Addition Theorem and Conditional Probability',
            'Multiplication Theorem and Independent Events',
            'Bayes Theorem and Applications',
            'Random Variables and Probability Distributions',
            'Binomial Distribution and Poisson Distribution',
          ],
        },
        {
          id: 'statistics',
          name: 'Statistics',
          description: 'Measures of Central Tendency, Dispersion, Mean Deviation & Standard Deviation',
          topics: [
            'Measures of Dispersion (Range, Quartile Deviation)',
            'Mean Deviation about Mean and Median',
            'Variance and Standard Deviation',
            'Coefficient of Variation and Analysis of Frequency Distributions',
          ],
        },
      ],
    },
  },

  physics: {
    id: 'physics',
    name: 'Physics',
    icon: '⚛️',
    color: '#3b82f6',
    description: 'Mechanics, Waves, Thermodynamics, Electromagnetism, Optics & Modern Physics',
    chapters: {
      '1st_year': [
        {
          id: 'mechanics',
          name: 'Mechanics',
          description: 'Units, Kinematics, Laws of Motion, Work Energy Power, Rotational Dynamics & Gravitation',
          topics: [
            'Physical World and Units & Measurements',
            'Motion in a Straight Line and Motion in a Plane',
            "Newton's Laws of Motion and Friction",
            'Work, Energy, Power and Collisions',
            'System of Particles and Rotational Motion',
            'Law of Gravitation and Satellite Motion',
          ],
        },
        {
          id: 'properties_of_matter',
          name: 'Properties of Matter',
          description: 'Elasticity, Fluid Mechanics, Viscosity, Surface Tension & Thermal Properties',
          topics: [
            'Mechanical Properties of Solids (Stress, Strain, Hooke’s Law)',
            'Mechanical Properties of Fluids (Pascal’s Law, Bernoulli’s Theorem)',
            'Viscosity, Reynolds Number and Stokes’ Law',
            'Surface Tension and Capillarity',
            'Thermal Properties of Matter and Heat Transfer',
          ],
        },
        {
          id: 'thermodynamics',
          name: 'Thermodynamics',
          description: 'Laws of Thermodynamics, Heat Engines, Reversible Processes & Kinetic Theory',
          topics: [
            'Zeroth and First Law of Thermodynamics',
            'Isothermal and Adiabatic Processes',
            'Second Law of Thermodynamics and Carnot Engine',
            'Reversible and Irreversible Processes',
            'Kinetic Theory of Gases and Specific Heats',
          ],
        },
        {
          id: 'oscillations_waves',
          name: 'Oscillations and Waves',
          description: 'Simple Harmonic Motion, Wave Propagation, Superposition & Doppler Effect',
          topics: [
            'Simple Harmonic Motion (SHM) and Simple Pendulum',
            'Damped and Forced Oscillations, Resonance',
            'Transverse and Longitudinal Waves',
            'Speed of Sound and Beats',
            'Standing Waves in Strings and Organ Pipes',
            'Doppler Effect in Sound',
          ],
        },
      ],
      '2nd_year': [
        {
          id: 'electrostatics',
          name: 'Electrostatics',
          description: 'Electric Charges, Fields, Gauss Law, Potential & Capacitance',
          topics: [
            'Electric Charges and Coulomb’s Law',
            'Electric Field, Field Lines and Electric Dipole',
            'Gauss’s Law and its Applications',
            'Electrostatic Potential and Equipotential Surfaces',
            'Capacitance, Dielectrics and Energy Stored in Capacitor',
          ],
        },
        {
          id: 'current_electricity',
          name: 'Current Electricity',
          description: 'Ohm’s Law, Drift Velocity, Kirchhoff’s Laws, Potentiometer & Wheatstone Bridge',
          topics: [
            'Electric Current, Drift Velocity and Ohm’s Law',
            'Resistivity, Temperature Dependence and Combination of Resistors',
            'EMF, Internal Resistance and Cells in Series/Parallel',
            'Kirchhoff’s Rules and Wheatstone Bridge',
            'Meter Bridge and Potentiometer',
          ],
        },
        {
          id: 'magnetism',
          name: 'Magnetism',
          description: 'Biot-Savart Law, Ampere’s Law, Magnetic Dipole & Earth’s Magnetism',
          topics: [
            'Biot-Savart Law and Magnetic Field on Axis of Circular Loop',
            'Ampere’s Circuital Law and Solenoids',
            'Force on Moving Charge (Lorentz Force) and Current-Carrying Conductor',
            'Moving Coil Galvanometer and Conversion to Ammeter/Voltmeter',
            'Bar Magnet, Magnetic Dipole and Earth’s Magnetic Field',
            'Dia-, Para-, and Ferromagnetism',
          ],
        },
        {
          id: 'emi_ac',
          name: 'Electromagnetic Induction & AC',
          description: 'Faraday’s Laws, Lenz’s Law, Self/Mutual Inductance, AC Circuits & Transformers',
          topics: [
            'Faraday’s Law of Electromagnetic Induction and Lenz’s Law',
            'Motional EMF and Eddy Currents',
            'Self-Inductance and Mutual Inductance',
            'Alternating Current and LCR Series Circuits',
            'Resonance in AC Circuits and Power Factor',
            'Transformers and AC Generators',
          ],
        },
        {
          id: 'optics',
          name: 'Optics',
          description: 'Ray Optics, Lenses, Optical Instruments, Wave Optics, Interference & Diffraction',
          topics: [
            'Reflection and Refraction of Light (Snell’s Law, Total Internal Reflection)',
            'Refraction at Spherical Surfaces, Lens Maker’s Formula and Prisms',
            'Optical Instruments (Microscopes and Telescopes)',
            'Huygens’ Principle and Wavefronts',
            'Interference of Light and Young’s Double Slit Experiment',
            'Diffraction and Polarization of Light',
          ],
        },
        {
          id: 'modern_physics',
          name: 'Modern Physics',
          description: 'Photoelectric Effect, Dual Nature, Atomic Models, Nuclear Physics & Radioactivity',
          topics: [
            'Dual Nature of Radiation and Photoelectric Effect (Einstein’s Equation)',
            'de Broglie Wavelength and Davisson-Germer Experiment',
            'Rutherford and Bohr Models of Hydrogen Atom',
            'Atomic Spectra and Energy Levels',
            'Nucleus, Mass Defect and Binding Energy',
            'Radioactivity (Alpha, Beta, Gamma Decay) and Nuclear Fission/Fusion',
          ],
        },
        {
          id: 'semiconductor_electronics',
          name: 'Semiconductor Electronics',
          description: 'Energy Bands, P-N Junction Diode, Rectifiers, Zener Diode & Logic Gates',
          topics: [
            'Intrinsic and Extrinsic Semiconductors (p-type, n-type)',
            'P-N Junction Formation and Biasing (Forward and Reverse)',
            'P-N Junction as Half-wave and Full-wave Rectifier',
            'Zener Diode and Voltage Regulation',
            'Optoelectronic Junction Devices (Photodiode, LED, Solar Cell)',
            'Digital Electronics and Logic Gates (AND, OR, NOT, NAND, NOR)',
          ],
        },
      ],
    },
  },

  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '🧪',
    color: '#10b981',
    description: 'Physical, Inorganic, Organic Chemistry, Bonding, Thermodynamics & Coordination',
    chapters: {
      '1st_year': [
        {
          id: 'atomic_structure',
          name: 'Atomic Structure',
          description: 'Bohr’s Model, Quantum Mechanics, Quantum Numbers & Electronic Configuration',
          topics: [
            'Subatomic Particles and Thomson/Rutherford Models',
            'Bohr’s Model of Hydrogen Atom and Line Spectrum',
            'Dual Nature of Matter (de Broglie) and Heisenberg Uncertainty Principle',
            'Quantum Mechanical Model and Quantum Numbers (n, l, m, s)',
            'Shapes of Orbitals (s, p, d) and Node Concepts',
            'Aufbau Principle, Pauli Exclusion Principle and Hund’s Rule',
          ],
        },
        {
          id: 'chemical_bonding',
          name: 'Chemical Bonding',
          description: 'Ionic Bonding, Covalent Bonding, VSEPR Theory, Hybridization & Molecular Orbitals',
          topics: [
            'Octet Rule, Ionic Bond and Lattice Enthalpy',
            'Covalent Bond, Fajan’s Rules and Dipole Moment',
            'VSEPR Theory and Molecular Geometry',
            'Valence Bond Theory and Hybridization (sp, sp2, sp3, sp3d, sp3d2)',
            'Molecular Orbital Theory (MOT) and Bond Order',
            'Hydrogen Bonding (Inter and Intra-molecular)',
          ],
        },
        {
          id: 'physical_chemistry_1',
          name: 'Physical Chemistry',
          description: 'States of Matter, Chemical Thermodynamics, Chemical & Ionic Equilibrium',
          topics: [
            'Gas Laws, Ideal Gas Equation and Kinetic Molecular Theory',
            'Deviation from Ideal Behavior and Van der Waals Equation',
            'First Law of Thermodynamics, Enthalpy (ΔH) and Hess’s Law',
            'Second Law of Thermodynamics, Entropy (ΔS) and Gibbs Energy (ΔG)',
            'Law of Chemical Equilibrium and Le Chatelier’s Principle',
            'Ionic Equilibrium: pH, Buffer Solutions and Solubility Product (Ksp)',
          ],
        },
        {
          id: 'inorganic_chemistry_1',
          name: 'Inorganic Chemistry',
          description: 'Periodic Classification, Hydrogen, s-Block & p-Block (Group 13, 14) Elements',
          topics: [
            'Modern Periodic Table and Periodic Trends (Atomic Radius, IE, EA, EN)',
            'Hydrogen, Hydrides, Heavy Water and Hydrogen Peroxide',
            's-Block Elements (Alkali and Alkaline Earth Metals)',
            'Group 13 Elements (Boron Family, Borax, Diborane)',
            'Group 14 Elements (Carbon Family, Allotropes of Carbon, Silicones)',
          ],
        },
        {
          id: 'organic_chemistry_1',
          name: 'Organic Chemistry & Hydrocarbons',
          description: 'IUPAC Nomenclature, Isomerism, Reaction Mechanisms & Hydrocarbons',
          topics: [
            'Purification of Organic Compounds and Qualitative Analysis',
            'IUPAC Nomenclature of Organic Compounds',
            'Structural and Stereoisomerism',
            'Electronic Displacements: Inductive, Resonance, Hyperconjugation',
            'Alkanes: Preparation, Conformations and Halogenation Mechanism',
            'Alkenes & Alkynes: Markovnikov Addition, Ozonolysis and Acidity',
            'Aromatic Hydrocarbons: Benzene, Electrophilic Substitution & Friedel-Crafts',
          ],
        },
      ],
      '2nd_year': [
        {
          id: 'electrochemistry',
          name: 'Electrochemistry',
          description: 'Galvanic Cells, Nernst Equation, Conductance, Kohlrausch’s Law & Batteries',
          topics: [
            'Electrochemical Cells and Standard Electrode Potential',
            'Nernst Equation and Equilibrium Constant / Gibbs Energy Relation',
            'Conductance in Electrolytic Solutions and Kohlrausch’s Law',
            'Electrolysis and Faraday’s Laws of Electrolysis',
            'Batteries (Primary & Secondary), Fuel Cells and Corrosion',
          ],
        },
        {
          id: 'chemical_kinetics',
          name: 'Chemical Kinetics & Surface Chemistry',
          description: 'Rate of Reaction, Order & Molecularity, Integrated Rate Laws & Catalysis',
          topics: [
            'Rate of Chemical Reaction and Factors Affecting Rate',
            'Order and Molecularity of a Reaction',
            'Integrated Rate Laws (Zero and First Order Reactions)',
            'Half-life of Reaction and Pseudo First Order Reactions',
            'Arrhenius Equation and Activation Energy',
            'Adsorption, Colloids, Emulsions and Catalysis',
          ],
        },
        {
          id: 'coordination_compounds',
          name: 'Coordination Compounds & d-Block',
          description: 'd & f Block Elements, Werner’s Theory, IUPAC Nomenclature, VBT & Crystal Field Theory',
          topics: [
            'General Properties of Transition Elements (d-Block) and Lanthanoids/Actinoids',
            'Werner’s Theory of Coordination Compounds',
            'Ligands, Coordination Number and IUPAC Nomenclature',
            'Isomerism in Coordination Compounds (Geometric, Optical, Structural)',
            'Valence Bond Theory (VBT) and Inner/Outer Orbital Complexes',
            'Crystal Field Theory (CFT), Crystal Field Splitting and Color/Magnetism',
          ],
        },
        {
          id: 'organic_compounds_functional',
          name: 'Organic Functional Groups',
          description: 'Haloalkanes, Alcohols, Phenols, Ethers, Aldehydes, Ketones, Carboxylic Acids & Amines',
          topics: [
            'Haloalkanes and Haloarenes: SN1 and SN2 Mechanisms',
            'Alcohols, Phenols and Ethers: Preparation, Properties and Reactions',
            'Aldehydes and Ketones: Nucleophilic Addition, Aldol & Cannizzaro Reactions',
            'Carboxylic Acids and Derivatives: Acidity and Esterification',
            'Organic Compounds Containing Nitrogen: Amines, Diazonium Salts',
          ],
        },
        {
          id: 'biomolecules_polymers',
          name: 'Biomolecules & Polymers',
          description: 'Carbohydrates, Amino Acids, Proteins, Nucleic Acids, Polymers & Everyday Chemistry',
          topics: [
            'Carbohydrates: Monosaccharides (Glucose, Fructose), Disaccharides and Polysaccharides',
            'Proteins: Amino Acids, Peptide Bond, Primary/Secondary/Tertiary Structures',
            'Nucleic Acids: DNA, RNA Structure and Genetic Code',
            'Vitamins and Hormones Functions',
            'Polymers: Classification, Addition vs Condensation, Biodegradable Polymers',
            'Chemistry in Everyday Life: Drugs, Antiseptics, Detergents and Cleansing Agents',
          ],
        },
      ],
    },
  },

  biology: {
    id: 'biology',
    name: 'Biology',
    icon: '🧬',
    color: '#22c55e',
    description: 'Cell Biology, Plant & Human Physiology, Genetics, Evolution, Ecology & Biotechnology',
    chapters: {
      '1st_year': [
        {
          id: 'diversity_living_organisms',
          name: 'Diversity of Living Organisms',
          description: 'Taxonomy, Five Kingdom Classification, Plant & Animal Kingdoms',
          topics: [
            'The Living World and Taxonomic Hierarchy',
            'Biological Classification (Monera, Protista, Fungi, Viruses, Lichens)',
            'Plant Kingdom (Algae, Bryophytes, Pteridophytes, Gymnosperms, Angiosperms)',
            'Animal Kingdom: Non-chordates to Chordates Classification and Features',
          ],
        },
        {
          id: 'cell_biology',
          name: 'Cell Biology & Structure',
          description: 'Cell Theory, Organelles, Cell Membrane, Cell Cycle, Mitosis & Meiosis',
          topics: [
            'Cell as the Basic Unit of Life: Prokaryotic vs Eukaryotic Cells',
            'Cell Membrane (Fluid Mosaic Model) and Transport Mechanisms',
            'Cell Organelles: Nucleus, Mitochondria, ER, Golgi, Chloroplasts, Ribosomes',
            'Cell Cycle, Phases and Regulation',
            'Mitosis and its Significance',
            'Meiosis: Stages (Meiosis I, Meiosis II) and Genetic Variation',
          ],
        },
        {
          id: 'biomolecules_bio',
          name: 'Biomolecules',
          description: 'Carbohydrates, Lipids, Proteins, Enzymes, Mechanism & Kinetics',
          topics: [
            'Chemical Constituents of Living Cells and Primary/Secondary Metabolites',
            'Biomacromolecules: Proteins, Polysaccharides, Lipids and Nucleic Acids',
            'Enzymes: Properties, Classification, Activation Energy and Lock & Key / Induced Fit',
            'Factors Affecting Enzyme Activity (Temperature, pH, Substrate Concentration, Inhibitors)',
          ],
        },
        {
          id: 'plant_physiology',
          name: 'Plant Physiology',
          description: 'Photosynthesis, Respiration in Plants, Mineral Nutrition & Plant Growth',
          topics: [
            'Transport in Plants: Water Potential, Transpiration Pull and Phloem Translocation',
            'Mineral Nutrition: Essential Macro and Micronutrients, Nitrogen Cycle',
            'Photosynthesis: Light Reaction, Calvin Cycle (C3), Hatch-Slack (C4), CAM',
            'Photorespiration and Factors Affecting Photosynthesis',
            'Respiration in Plants: Glycolysis, Krebs Cycle, Electron Transport System (ETS), Fermentation',
            'Plant Growth Regulators: Auxins, Gibberellins, Cytokinins, Ethylene, Abscisic Acid',
          ],
        },
        {
          id: 'human_physiology',
          name: 'Human Physiology',
          description: 'Digestion, Respiration, Circulation, Excretion, Locomotion & Neural/Endocrine Control',
          topics: [
            'Digestion and Absorption: Alimentary Canal, Digestive Enzymes and Disorders',
            'Breathing and Exchange of Gases: Respiratory Volumes, Transport of O2 & CO2',
            'Body Fluids and Circulation: Blood Groups, Cardiac Cycle, ECG and Double Circulation',
            'Excretory Products and Elimination: Nephron Structure, Urine Formation, Osmoregulation',
            'Locomotion and Movement: Types of Muscles, Sliding Filament Theory, Skeletal System',
            'Neural Control: Nerve Impulse Generation/Conduction, Reflex Arc, Sense Organs',
            'Chemical Coordination: Endocrine Glands, Hormones and Feedback Mechanisms',
          ],
        },
      ],
      '2nd_year': [
        {
          id: 'reproduction',
          name: 'Reproduction',
          description: 'Reproduction in Organisms, Sexual Reproduction in Plants & Human Reproduction',
          topics: [
            'Modes of Asexual and Sexual Reproduction',
            'Flower Structure, Pollination and Double Fertilization in Angiosperms',
            'Development of Endosperm, Embryo and Seed Formation',
            'Human Reproductive System: Male and Female Anatomy',
            'Gametogenesis: Spermatogenesis and Oogenesis',
            'Menstrual Cycle, Fertilization, Implantation and Embryonic Development',
            'Reproductive Health: Contraception, STDs and Assisted Reproductive Technologies (IVF/ART)',
          ],
        },
        {
          id: 'genetics',
          name: 'Genetics & Molecular Inheritance',
          description: 'Mendelian Principles, Chromosomal Theory, DNA Structure, Replication & Gene Expression',
          topics: [
            'Mendel’s Laws of Inheritance: Monohybrid and Dihybrid Crosses',
            'Incomplete Dominance, Codominance and Multiple Alleles (ABO Blood Groups)',
            'Chromosomal Theory of Inheritance, Linkage and Recombination',
            'Sex Determination and Sex-Linked Genetic Disorders (Hemophilia, Color Blindness)',
            'Structure of DNA and RNA, Search for Genetic Material (Griffith, Hershey-Chase)',
            'DNA Replication: Semiconservative Mechanism and Meselson-Stahl Experiment',
            'Transcription, Genetic Code, Translation and Lac Operon Concept',
            'Human Genome Project and DNA Fingerprinting',
          ],
        },
        {
          id: 'evolution',
          name: 'Evolution',
          description: 'Origin of Life, Theories of Evolution, Natural Selection & Human Evolution',
          topics: [
            'Origin of Life and Miller-Urey Experiment',
            'Evidences of Evolution: Homologous/Analogous Organs, Paleontology, Embryology',
            'Darwinian Theory of Natural Selection and Mutation Theory',
            'Hardy-Weinberg Principle and Gene Frequency Equilibrium',
            'Adaptive Radiation and Speciation',
            'Origin and Evolution of Modern Man',
          ],
        },
        {
          id: 'biotechnology',
          name: 'Biotechnology',
          description: 'Recombinant DNA Technology, PCR, Cloning Vectors & Applications in Health/Agriculture',
          topics: [
            'Principles and Processes of Biotechnology: Restriction Enzymes, Ligases',
            'Cloning Vectors (Plasmids, Bacteriophages) and Competent Host Transformation',
            'Polymerase Chain Reaction (PCR) and Agarose Gel Electrophoresis',
            'Bioreactors and Downstream Processing',
            'Biotechnology Applications in Agriculture: Bt Cotton, RNA Interference',
            'Biotechnology Applications in Medicine: Recombinant Insulin, Gene Therapy, Molecular Diagnostics',
            'Transgenic Animals, Biosafety and Ethical Issues / Biopiracy',
          ],
        },
        {
          id: 'ecology',
          name: 'Ecology & Environment',
          description: 'Organisms and Populations, Ecosystems, Biodiversity Conservation & Environmental Issues',
          topics: [
            'Organisms and Environment: Abiotic Factors, Adaptations and Population Attributes',
            'Population Interactions: Mutualism, Competition, Predation, Parasitism, Commensalism',
            'Ecosystem: Energy Flow, Food Chains/Webs, Ecological Pyramids and Nutrient Cycles',
            'Ecological Succession (Primary and Secondary)',
            'Biodiversity: Patterns, Loss of Biodiversity (Evil Quartet) and Conservation Strategies',
            'Environmental Issues: Pollution, Greenhouse Effect, Ozone Depletion and Deforestation',
          ],
        },
      ],
    },
  },

  economics: {
    id: 'economics',
    name: 'Economics',
    icon: '📊',
    color: '#06b6d4',
    description: 'Microeconomics, Macroeconomics, National Income, Public Finance & Indian Economy',
    chapters: {
      '1st_year': [
        {
          id: 'intro_economics',
          name: 'Introduction to Economics',
          description: 'Definitions of Economics, Micro vs Macro, Scarcity and Central Problems',
          topics: [
            'Definitions of Economics (Wealth, Welfare, Scarcity, Growth)',
            'Microeconomics vs Macroeconomics Scope and Importance',
            'Central Problems of an Economy (What, How, For Whom to Produce)',
            'Production Possibility Curve (PPC) and Opportunity Cost',
          ],
        },
        {
          id: 'microeconomics',
          name: 'Microeconomics & Consumer Theory',
          description: 'Utility Analysis, Law of Diminishing Marginal Utility, Indifference Curves & Demand',
          topics: [
            'Cardinal Utility Analysis and Law of Diminishing Marginal Utility',
            'Ordinal Utility Analysis: Indifference Curves, Properties and Consumer Equilibrium',
            'Theory of Demand: Law of Demand, Determinants and Demand Schedule',
            'Elasticity of Demand (Price, Income, Cross Elasticity) and Measurement Methods',
            'Theory of Production: Production Function, Law of Variable Proportions, Returns to Scale',
            'Cost and Revenue Concepts: Total, Average, Marginal Curves',
            'Market Structures: Perfect Competition, Monopoly, Monopolistic Competition, Oligopoly',
          ],
        },
        {
          id: 'macroeconomics_intro',
          name: 'Macroeconomics & National Income',
          description: 'Circular Flow of Income, Aggregates (GDP, GNP, NNP), National Income Measurement',
          topics: [
            'Introduction to Macroeconomic Variables and Circular Flow of Income (Two/Three/Four Sector)',
            'National Income Concepts: GDP, GNP, NNP, NDP at Market Price and Factor Cost',
            'Nominal vs Real GDP and GDP Deflator',
            'Methods of Measuring National Income: Output/Value Added, Income, Expenditure Methods',
            'Difficulties and Limitations of National Income Calculation',
          ],
        },
        {
          id: 'money_banking',
          name: 'Money and Banking',
          description: 'Barter System, Functions of Money, Commercial Banks, Credit Creation & Central Bank (RBI)',
          topics: [
            'Evolution of Money, Barter System and its Inconveniences',
            'Functions and Types of Money, High Powered Money and Money Supply Measures (M1, M2, M3, M4)',
            'Commercial Banks: Functions and Process of Credit Creation / Money Multiplier',
            'Central Bank (Reserve Bank of India): Functions and Monetary Policy Tools (CRR, SLR, Repo, Reverse Repo)',
          ],
        },
      ],
      '2nd_year': [
        {
          id: 'public_finance',
          name: 'Public Finance & Government Budget',
          description: 'Public vs Private Finance, Government Budget, Taxes, Fiscal Policy & Public Debt',
          topics: [
            'Meaning and Scope of Public Finance vs Private Finance',
            'Principle of Maximum Social Advantage',
            'Public Revenue: Direct and Indirect Taxes, GST, Non-tax Revenue',
            'Public Expenditure: Objectives, Classification and Canon of Expenditure',
            'Government Budget: Revenue vs Capital Budget, Fiscal Deficit, Revenue Deficit, Primary Deficit',
            'Public Debt: Internal vs External Debt, Management and Redemption Methods',
            'Fiscal Policy: Objectives and Role in Economic Stabilization',
          ],
        },
        {
          id: 'international_trade',
          name: 'International Trade',
          description: 'Internal vs International Trade, Comparative Advantage, Balance of Payments & WTO',
          topics: [
            'Difference between Internal Trade and International Trade',
            'Theories of International Trade: Absolute Advantage and Comparative Cost Theory',
            'Terms of Trade and Factors Influencing Terms of Trade',
            'Balance of Trade vs Balance of Payments (Current and Capital Account)',
            'Disequilibrium in Balance of Payments: Causes and Corrective Measures',
            'Foreign Exchange Rate (Fixed vs Flexible) and International Organizations (IMF, World Bank, WTO)',
          ],
        },
        {
          id: 'economic_development',
          name: 'Economic Development & Growth',
          description: 'Economic Growth vs Development, HDI, Sustainable Development & Planning',
          topics: [
            'Economic Growth vs Economic Development Differences',
            'Indicators of Development: Per Capita Income, PQLI, Human Development Index (HDI)',
            'Characteristics of Developing and Emerging Economies',
            'Poverty, Unemployment, Inequality: Types, Causes and Poverty Alleviation Programs',
            'Sustainable Economic Development and Environmental Protection',
            'Planning in India: Five Year Plans to NITI Aayog',
          ],
        },
        {
          id: 'indian_economy',
          name: 'Indian Economy',
          description: 'Agriculture, Industrial Policy, Service Sector, Economic Reforms 1991 (LPG) & Demographics',
          topics: [
            'Structure of Indian Economy: Primary, Secondary and Tertiary Sectors',
            'Demographic Trends in India: Population Growth, Literacy, Sex Ratio and Demographic Dividend',
            'Agriculture Sector: Role, Green Revolution, Agricultural Marketing, Credit and Food Security',
            'Industrial Sector: Industrial Policies (1956, 1991), MSMEs, Make in India, Disinvestment',
            'Economic Reforms of 1991: Liberalization, Privatization, Globalization (LPG) and Impact',
            'Service Sector Growth: IT, Banking, Tourism and Infrastructure Development',
          ],
        },
      ],
    },
  },

  commerce: {
    id: 'commerce',
    name: 'Commerce',
    icon: '💼',
    color: '#8b5cf6',
    description: 'Business Organisation, Accounting, Financial Accounting, Management, Marketing & Entrepreneurship',
    chapters: {
      '1st_year': [
        {
          id: 'intro_commerce',
          name: 'Introduction to Commerce & Business',
          description: 'Nature of Business, Industry, Commerce, Trade & Auxiliaries to Trade',
          topics: [
            'Human Activities: Economic vs Non-economic Activities',
            'Concept, Nature and Objectives of Business',
            'Classification of Business: Industry (Primary, Secondary, Tertiary) and Commerce',
            'Trade and Auxiliaries to Trade (Banking, Insurance, Transport, Warehousing, Advertising)',
            'Business Risk: Nature, Causes and Types of Risks',
          ],
        },
        {
          id: 'business_organisation',
          name: 'Forms of Business Organisation',
          description: 'Sole Proprietorship, Partnership, Joint Hindu Family, Cooperatives & Joint Stock Company',
          topics: [
            'Sole Proprietorship: Features, Merits, Demerits and Suitability',
            'Partnership: Features, Types of Partners, Partnership Deed, Registration and Dissolution',
            'Joint Hindu Family Business (HUF): Karta, Features and Limitations',
            'Cooperative Societies: Principles, Types (Consumer, Producer, Housing, Credit), Merits & Demerits',
            'Joint Stock Company: Definition, Features, Types (Private vs Public, OPC)',
            'Formation of a Company: Promotion, Incorporation, Capital Subscription, Commencement of Business',
            'Key Documents: Memorandum of Association (MoA), Articles of Association (AoA), Prospectus',
          ],
        },
        {
          id: 'accounting_fundamentals',
          name: 'Accounting Fundamentals',
          description: 'Book-keeping, Double Entry System, Journal, Ledger, Trial Balance & Subsidiary Books',
          topics: [
            'Meaning, Objectives, Scope and Limitations of Accounting',
            'Accounting Concepts and Conventions (Going Concern, Accrual, Matching, Conservatism)',
            'Double Entry System: Golden Rules of Accounting (Personal, Real, Nominal Accounts)',
            'Source Documents and Preparation of Accounting Vouchers',
            'Journalizing Transactions and Posting to Ledger Accounts',
            'Subsidiary Books: Cash Book (Single, Double, Triple Column, Petty Cash), Purchases/Sales Books',
            'Bank Reconciliation Statement (BRS): Causes of Differences and Preparation',
            'Trial Balance: Objectives, Methods of Preparation and Detection of Errors',
          ],
        },
        {
          id: 'financial_accounting_1',
          name: 'Financial Accounting & Final Accounts',
          description: 'Capital vs Revenue, Depreciation, Final Accounts with Adjustments',
          topics: [
            'Distinction between Capital and Revenue (Expenditure, Receipts, Profits, Losses)',
            'Depreciation: Meaning, Causes, Straight Line Method (SLM) and Written Down Value (WDV) Method',
            'Provisions and Reserves: Meaning, Types and Differences',
            'Trading Account, Profit & Loss Account and Balance Sheet Preparation',
            'Adjustments in Final Accounts: Closing Stock, Outstanding/Prepaid Expenses, Bad Debts, Depreciation',
          ],
        },
      ],
      '2nd_year': [
        {
          id: 'business_management',
          name: 'Business Management',
          description: 'Principles of Management, Planning, Organising, Staffing, Directing & Controlling',
          topics: [
            'Management: Concept, Objectives, Importance and Nature (Science, Art, Profession)',
            'Principles of Management: Henri Fayol’s 14 Principles and F.W. Taylor’s Scientific Management',
            'Functions of Management: Planning, Organizing, Staffing, Directing, Controlling',
            'Planning: Meaning, Importance, Types of Plans and Planning Process',
            'Organizing: Organizational Structure (Functional vs Divisional), Delegation and Decentralization',
            'Staffing: Recruitment, Selection Process, Training and Development',
            'Directing: Motivation Theories (Maslow), Leadership Styles, Communication Barriers',
            'Controlling: Importance, Controlling Process and Relationship with Planning',
          ],
        },
        {
          id: 'financial_markets_banking',
          name: 'Banking & Financial Markets',
          description: 'Money Market, Capital Market, Stock Exchange, SEBI, Commercial Banking Services',
          topics: [
            'Financial Markets Overview: Money Market vs Capital Market',
            'Money Market Instruments: Treasury Bills, Commercial Paper, Call Money, Certificate of Deposit',
            'Capital Market: Primary Market (IPO, Right Issue) and Secondary Market (Stock Exchange)',
            'Stock Exchange Operations: Trading Procedure, Demat Account, Depository System (NSDL, CDSL)',
            'Securities and Exchange Board of India (SEBI): Objectives, Regulatory and Development Functions',
            'Modern Banking Services: E-Banking, NEFT, RTGS, IMPS, UPI, Debit/Credit Cards',
          ],
        },
        {
          id: 'marketing_management',
          name: 'Marketing Management',
          description: 'Marketing Concepts, Marketing Mix (4Ps: Product, Price, Place, Promotion) & Consumer Protection',
          topics: [
            'Marketing vs Selling Differences and Marketing Management Philosophies',
            'Functions of Marketing (Market Research, Standardization, Packaging, Branding)',
            'Marketing Mix: The 4 Ps (Product, Price, Place, Promotion)',
            'Product: Branding, Packaging, Labeling and Product Life Cycle',
            'Pricing: Factors Influencing Price Determination and Pricing Strategies',
            'Physical Distribution (Place): Channels of Distribution and Logistics',
            'Promotion Mix: Advertising, Personal Selling, Sales Promotion, Public Relations',
            'Consumer Protection: Consumer Rights, Responsibilities and Consumer Protection Act (Redressal Agencies)',
          ],
        },
        {
          id: 'entrepreneurship',
          name: 'Entrepreneurship Development',
          description: 'Entrepreneurial Traits, Startups, Business Plans, Funding, MSME & Innovation',
          topics: [
            'Entrepreneurship: Concept, Functions and Characteristics of an Entrepreneur',
            'Entrepreneur vs Intrapreneur vs Manager',
            'Process of Setting up a Business Enterprise / Startup India Initiative',
            'Business Plan Formulation: Project Report, Feasibility Analysis',
            'Sources of Finance for Entrepreneurs: Angel Investors, Venture Capital, Crowd Funding, Mudra Loans',
            'Government Support and Incentives for Micro, Small and Medium Enterprises (MSMEs)',
            'Intellectual Property Rights (IPR): Patents, Copyrights, Trademarks and Trade Secrets',
          ],
        },
      ],
    },
  },

  civics: {
    id: 'civics',
    name: 'Civics & Political Science',
    icon: '🏛️',
    color: '#ec4899',
    description: 'Constitution, Fundamental Rights, Legislature, Executive, Judiciary, Federalism & Democracy',
    chapters: {
      '1st_year': [
        {
          id: 'political_science_intro',
          name: 'Political Theory & State',
          description: 'Nature and Scope of Political Science, State Elements, Sovereignty & Nation',
          topics: [
            'Nature, Scope and Significance of Political Science',
            'State: Definition, Essential Elements (Population, Territory, Government, Sovereignty)',
            'Sovereignty: Meaning, Attributes, Types (Internal, External, Legal, Political, Popular) and Austin’s Theory',
            'Nation, Nationality and Nationalism',
            'Law: Meaning, Sources, Classification and Rule of Law',
            'Liberty and Equality: Concepts, Types and Relationship between Liberty and Equality',
            'Justice: Meaning, Dimensions (Legal, Political, Social, Economic) and Rights & Duties',
          ],
        },
        {
          id: 'constitution_framework',
          name: 'Constitution & Preamble',
          description: 'Making of Constitution, Features of Indian Constitution, Preamble & Amendment Process',
          topics: [
            'Making of the Indian Constitution and Constituent Assembly',
            'Preamble to the Indian Constitution: Philosophy and Key Terms (Sovereign, Socialist, Secular, Democratic, Republic)',
            'Salient Features of the Indian Constitution (Written, Lengthiest, Flexible yet Rigid, Federal with Unitary Bias)',
            'Procedure for Constitutional Amendments (Article 368) and Basic Structure Doctrine',
          ],
        },
        {
          id: 'fundamental_rights_duties',
          name: 'Fundamental Rights and Duties',
          description: 'Fundamental Rights (Articles 12-35), Writs, Directive Principles (DPSP) & Fundamental Duties',
          topics: [
            'Fundamental Rights: Right to Equality, Right to Freedom, Right against Exploitation',
            'Right to Freedom of Religion, Cultural & Educational Rights, Right to Constitutional Remedies (Article 32)',
            'Writs: Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari',
            'Directive Principles of State Policy (DPSP): Classification (Socialistic, Gandhian, Liberal-Intellectual) and Importance',
            'Fundamental Duties (Article 51A): Origin (42nd Amendment), List and Significance',
            'Relationship and Balance between Fundamental Rights and Directive Principles',
          ],
        },
        {
          id: 'forms_of_government',
          name: 'Forms of Government & Democracy',
          description: 'Democracy (Direct & Indirect), Parliamentary vs Presidential, Unitary vs Federal',
          topics: [
            'Democracy: Meaning, Types (Direct and Indirect), Conditions for Success of Democracy',
            'Parliamentary Form of Government: Features, Merits and Demerits',
            'Presidential Form of Government: Features, Merits and Demerits',
            'Unitary Government vs Federal Government: Features, Merits and Differences',
          ],
        },
      ],
      '2nd_year': [
        {
          id: 'union_legislature_executive',
          name: 'Union Legislature and Executive',
          description: 'President, Vice-President, Prime Minister, Union Cabinet, Lok Sabha & Rajya Sabha',
          topics: [
            'President of India: Qualifications, Election, Powers (Executive, Legislative, Financial, Judicial, Emergency) and Impeachment',
            'Vice-President of India: Election, Role and Functions as Chairman of Rajya Sabha',
            'Prime Minister and Council of Ministers: Powers, Functions, Role and Relationship with President',
            'Union Parliament: Lok Sabha (Composition, Powers, Speaker) and Rajya Sabha (Composition, Special Powers)',
            'Law Making Procedure in Parliament (Ordinary Bill, Money Bill, Constitutional Amendment Bill)',
            'Parliamentary Committees (Public Accounts Committee, Estimates Committee, Standing Committees)',
          ],
        },
        {
          id: 'state_government',
          name: 'State Government & Local Governance',
          description: 'Governor, Chief Minister, State Legislature, Panchayati Raj & Urban Local Bodies (73rd & 74th Amendments)',
          topics: [
            'Governor of a State: Appointment, Constitutional Position, Discretionary and Executive Powers',
            'Chief Minister and State Council of Ministers: Functions, Role and Relationship with Governor',
            'State Legislature: Legislative Assembly (Vidhan Sabha) and Legislative Council (Vidhan Parishad)',
            '73rd Constitutional Amendment Act: 3-Tier Panchayati Raj System (Gram Panchayat, Panchayat Samiti, Zilla Parishad)',
            '74th Constitutional Amendment Act: Urban Local Bodies (Municipal Corporation, Municipality, Nagar Panchayat)',
            'Democratic Decentralization and Citizen Participation in Local Governance',
          ],
        },
        {
          id: 'judiciary',
          name: 'Judiciary in India',
          description: 'Supreme Court, High Courts, Subordinate Courts, Judicial Review & Public Interest Litigation (PIL)',
          topics: [
            'Supreme Court of India: Composition, Appointment of Judges (Collegium System), Qualifications and Removal',
            'Jurisdiction of Supreme Court: Original, Appellate, Advisory, Writ and Revisory Jurisdictions',
            'High Courts: Composition, Jurisdiction and Powers of Superintendence',
            'Subordinate Courts and Lok Adalats / Fast Track Courts',
            'Judicial Independence, Judicial Review and Judicial Activism',
            'Public Interest Litigation (PIL) and Access to Justice for Marginalized Sections',
          ],
        },
        {
          id: 'elections_democracy',
          name: 'Elections, Federalism & Indian Democracy',
          description: 'Election Commission of India, Electoral Reforms, Center-State Relations & Political Parties',
          topics: [
            'Election Commission of India: Composition, Powers, Functions and Model Code of Conduct',
            'Electoral Process in India and Need for Electoral Reforms (EVMs, VVPAT, Electoral Bonds, Criminalization of Politics)',
            'Indian Federalism: Center-State Relations (Legislative, Administrative, Financial Relations) and Sarkaria Commission',
            'NITI Aayog and Inter-State Council',
            'Party System in India: National vs Regional Parties, Coalition Politics and Anti-Defection Law (10th Schedule)',
            'Challenges to Indian Democracy: Communalism, Regionalism, Casteism, Corruption and Criminalization',
          ],
        },
      ],
    },
  },
};

// ============================================================
// SYLLABUS QUICK ACTIONS
// ============================================================

export const SYLLABUS_ACTIONS = [
  { id: 'explain', label: 'Explain Topic', icon: '📖', promptPrefix: 'Explain the topic comprehensively: ' },
  { id: 'simple', label: 'Simple Explanation', icon: '💡', promptPrefix: 'Explain this topic in very simple, easy-to-understand terms with everyday analogies: ' },
  { id: 'detailed', label: 'Detailed Explanation', icon: '🧠', promptPrefix: 'Provide a deep, rigorous, and detailed explanation including formulas, derivations, and mechanisms: ' },
  { id: 'questions', label: 'Ask Questions', icon: '❓', promptPrefix: 'Ask me 3 conceptual questions to test my understanding of: ' },
  { id: 'solve', label: 'Solve Problems', icon: '🧩', promptPrefix: 'Show a typical Intermediate level problem and its step-by-step solution for: ' },
  { id: 'step_by_step', label: 'Step-by-Step Solutions', icon: '🪜', promptPrefix: 'Provide step-by-step solutions to important numerical/theoretical questions in: ' },
  { id: 'practice', label: 'Practice Questions', icon: '📝', promptPrefix: 'Generate 5 practice questions with varied difficulty levels for: ' },
  { id: 'mcqs', label: 'Generate MCQs', icon: '🔘', promptPrefix: 'Generate 5 multiple choice questions (MCQs) with 4 options, correct answer, and explanations for: ' },
  { id: 'quiz', label: 'Generate Quiz', icon: '🎯', promptPrefix: 'Create an interactive quiz with diverse question types for: ' },
  { id: 'hints', label: 'Give Hints', icon: '🔍', promptPrefix: 'Give me strategic hints and key memory cues to remember important concepts in: ' },
  { id: 'summarize', label: 'Summarize Chapter', icon: '📑', promptPrefix: 'Provide a concise, high-yield summary highlighting all key definitions, formulas, and concepts for: ' },
  { id: 'revision', label: 'Revision Mode', icon: '🔄', promptPrefix: 'Activate rapid revision mode with bullet points, essential formulas, and core takeaways for: ' },
  { id: 'exam_prep', label: 'Exam Preparation', icon: '🏆', promptPrefix: 'Provide high-probability Intermediate Board exam questions, marking guidelines, common mistakes to avoid, and model answers for: ' },
];

// ============================================================
// HELPER SELECTOR FUNCTIONS
// ============================================================

export function getStreams() {
  return SYLLABUS_STREAMS;
}

export function getStreamById(streamId) {
  return SYLLABUS_STREAMS.find(s => s.id === streamId) || SYLLABUS_STREAMS[0];
}

export function getYears() {
  return SYLLABUS_YEARS;
}

export function getYearById(yearId) {
  return SYLLABUS_YEARS.find(y => y.id === yearId) || SYLLABUS_YEARS[0];
}

export function getSubjectsForStream(streamId) {
  const stream = getStreamById(streamId);
  return stream.subjectIds.map(id => SYLLABUS_SUBJECTS[id]).filter(Boolean);
}

export function getSubjectById(subjectId) {
  return SYLLABUS_SUBJECTS[subjectId] || null;
}

export function getChaptersForSubject(subjectId, yearId = '1st_year') {
  const subject = getSubjectById(subjectId);
  if (!subject || !subject.chapters) return [];
  return subject.chapters[yearId] || subject.chapters['1st_year'] || [];
}

export function getChapterById(subjectId, yearId, chapterId) {
  const chapters = getChaptersForSubject(subjectId, yearId);
  return chapters.find(c => c.id === chapterId) || chapters[0] || null;
}

export function getTopicsForChapter(subjectId, yearId, chapterId) {
  const chapter = getChapterById(subjectId, yearId, chapterId);
  return chapter ? chapter.topics : [];
}

/**
 * Build a structured prompt message and system context for AI Tutor
 */
export function buildSyllabusPrompt({ streamId, yearId, subjectId, chapterId, topicName, actionId, userQuery }) {
  const stream = getStreamById(streamId);
  const year = getYearById(yearId);
  const subject = getSubjectById(subjectId);
  const chapter = getChapterById(subjectId, yearId, chapterId);
  const action = SYLLABUS_ACTIONS.find(a => a.id === actionId) || SYLLABUS_ACTIONS[0];

  const prefix = action.promptPrefix;
  const target = topicName || (chapter ? chapter.name : subject ? subject.name : 'Intermediate Syllabus');
  
  const formattedQuery = userQuery
    ? userQuery
    : `${prefix}${target}`;

  return {
    query: formattedQuery,
    context: {
      stream: stream.name,
      streamFullName: stream.fullName,
      year: year.label,
      yearBadge: year.badge,
      subject: subject ? subject.name : '',
      chapter: chapter ? chapter.name : '',
      topic: topicName || '',
      action: action.label,
    },
  };
}
