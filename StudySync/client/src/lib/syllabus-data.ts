export interface Topic {
  name: string;
  completed: boolean;
}

export interface Chapter {
  chapter: string;
  topics: string[];
}

export interface Subject {
  name: string;
  chapters: Chapter[];
}

export const syllabusData = {
  physics: [
    {
      chapter: "Physical World & Measurement",
      topics: ["Physical World", "Units and Measurements", "Accuracy and Precision", "Significant Figures"]
    },
    {
      chapter: "Kinematics",
      topics: ["Scalar and Vector Quantities", "Motion in a Straight Line", "Motion in a Plane", "Relative Velocity", "Projectile Motion"]
    },
    {
      chapter: "Laws of Motion",
      topics: ["Newton's Laws", "Free Body Diagrams", "Friction", "Circular Motion"]
    },
    {
      chapter: "Work, Energy, and Power",
      topics: ["Work and Kinetic Energy Theorem", "Power", "Conservative and Non-Conservative Forces", "Potential Energy"]
    },
    {
      chapter: "System of Particles and Rotational Motion",
      topics: ["Centre of Mass", "Torque and Angular Momentum", "Moment of Inertia", "Rolling Motion"]
    },
    {
      chapter: "Gravitation",
      topics: ["Universal Law of Gravitation", "Acceleration due to Gravity", "Satellite Motion", "Kepler's Laws"]
    },
    {
      chapter: "Mechanical Properties of Solids",
      topics: ["Stress and Strain", "Hooke's Law", "Young's Modulus"]
    },
    {
      chapter: "Mechanical Properties of Fluids",
      topics: ["Pressure and Pascal's Law", "Buoyancy", "Bernoulli's Theorem", "Viscosity"]
    },
    {
      chapter: "Thermal Properties of Matter",
      topics: ["Heat and Temperature", "Thermal Expansion", "Calorimetry", "Newton's Law of Cooling"]
    },
    {
      chapter: "Thermodynamics",
      topics: ["Zeroth and First Law", "Internal Energy", "Second Law", "Carnot Engine"]
    },
    {
      chapter: "Kinetic Theory of Gases",
      topics: ["Assumptions", "Pressure of an Ideal Gas", "RMS Velocity"]
    },
    {
      chapter: "Oscillations",
      topics: ["SHM", "Damped and Forced Oscillations", "Resonance"]
    },
    {
      chapter: "Waves",
      topics: ["Types of Waves", "Wave Equation", "Sound Waves", "Doppler Effect"]
    }
  ],
  chemistry: [
    {
      chapter: "Some Basic Concepts of Chemistry",
      topics: ["Mole Concept", "Empirical and Molecular Formula", "Stoichiometry"]
    },
    {
      chapter: "Structure of Atom",
      topics: ["Bohr's Model", "Quantum Numbers", "Orbitals", "Electronic Configuration"]
    },
    {
      chapter: "Classification of Elements & Periodicity",
      topics: ["Modern Periodic Law", "Periodic Trends"]
    },
    {
      chapter: "Chemical Bonding and Molecular Structure",
      topics: ["Lewis Structures", "VSEPR Theory", "Hybridization", "Molecular Orbital Theory"]
    },
    {
      chapter: "States of Matter: Gases and Liquids",
      topics: ["Gas Laws", "Ideal Gas Equation", "Kinetic Molecular Theory"]
    },
    {
      chapter: "Thermodynamics",
      topics: ["System and Surroundings", "Enthalpy", "First Law of Thermodynamics", "Hess's Law"]
    },
    {
      chapter: "Equilibrium",
      topics: ["Law of Mass Action", "Le Chatelier's Principle", "Ionic Equilibrium"]
    },
    {
      chapter: "Redox Reactions",
      topics: ["Oxidation Number", "Balancing Redox Reactions"]
    },
    {
      chapter: "Hydrogen",
      topics: ["Position in Periodic Table", "Properties", "Uses"]
    },
    {
      chapter: "The s-Block Element",
      topics: ["Group 1 and 2 Elements", "Properties and Trends", "Important Compounds"]
    },
    {
      chapter: "Some p-Block Elements",
      topics: ["Group 13 and 14", "Properties and Uses"]
    },
    {
      chapter: "Organic Chemistry: Basic Principles and Techniques",
      topics: ["IUPAC Nomenclature", "Reaction Mechanisms", "Electron Displacement Effects"]
    },
    {
      chapter: "Hydrocarbons",
      topics: ["Alkanes, Alkenes, Alkynes", "Aromatic Hydrocarbons", "Reactions and Mechanisms"]
    },
    {
      chapter: "Environmental Chemistry",
      topics: ["Atmospheric Pollution", "Water Pollution", "Green Chemistry"]
    }
  ],
  mathematics: [
    {
      chapter: "Sets",
      topics: ["Types of Sets", "Venn Diagrams", "Operations on Sets"]
    },
    {
      chapter: "Relations and Functions",
      topics: ["Cartesian Product", "Types of Relations", "Functions and Graphs"]
    },
    {
      chapter: "Trigonometric Functions",
      topics: ["Trigonometric Identities", "Graphs", "General Solutions"]
    },
    {
      chapter: "Principle of Mathematical Induction",
      topics: ["Basics of Induction", "Simple Proofs"]
    },
    {
      chapter: "Complex Numbers and Quadratic Equations",
      topics: ["Argand Plane", "Modulus and Argument", "Solving Quadratic Equations"]
    },
    {
      chapter: "Linear Inequalities",
      topics: ["Solutions in One Variable", "Solutions in Two Variables"]
    },
    {
      chapter: "Permutations and Combinations",
      topics: ["Fundamental Principle of Counting", "Factorials", "Circular Permutations"]
    },
    {
      chapter: "Binomial Theorem",
      topics: ["Binomial Expansion", "General Term", "Middle Term"]
    },
    {
      chapter: "Sequences and Series",
      topics: ["Arithmetic and Geometric Progressions", "Sum of n Terms", "Special Series"]
    },
    {
      chapter: "Straight Lines",
      topics: ["Slope", "Equation of Line", "Angle Between Lines"]
    },
    {
      chapter: "Conic Sections",
      topics: ["Parabola", "Ellipse", "Hyperbola"]
    },
    {
      chapter: "Introduction to 3D Geometry",
      topics: ["Direction Cosines and Ratios", "Equation of a Line"]
    },
    {
      chapter: "Limits and Derivatives",
      topics: ["Limits of Polynomials", "Derivatives (Basics)", "First Principle"]
    },
    {
      chapter: "Mathematical Reasoning",
      topics: ["Statements and Logical Operations", "Truth Tables"]
    },
    {
      chapter: "Statistics",
      topics: ["Mean, Median, Mode", "Standard Deviation"]
    },
    {
      chapter: "Probability",
      topics: ["Classical Definition", "Complementary Events", "Independent Events"]
    }
  ]
};

export type SubjectKey = keyof typeof syllabusData;
