export const cncRouterCertificationModule = {
    id: "cnc-router-safety-core",
    title: "CNC Router Safety Core",
    version: "1.0.0",
    passingScore: 85,
    estimatedMinutes: 15,
    levels: [
      {
        id: "cnc-router-intro",
        type: "lesson",
        title: "CNC Overview",
        shortTitle: "Overview",
        xp: 10,
        narrative: [
          "Computer Numerical Control (CNC) is a subtractive manufacturing process where pre-programmed computer software dictates the movement of factory tools and machinery. It automates the cutting, shaping, and drilling of raw materials (like metal, wood, and plastic) with extreme precision and repeatability.",
        ],

        callouts: [
          "Design (CAD): Engineers create a 2D or 3D digital model of the desired part using Computer-Aided Design (CAD) software.",
          "Programming (CAM): The digital model is translated into instructions using Computer-Aided Manufacturing (CAM) software, converting the design into a coordinate language called G-code.",
          "Execution: The G-code is fed into the CNC machine's computer, which directs the tools to move across exact X, Y, and Z axes.",
          "Machining: The machine acts as a highly advanced, automated router or mill, carving the raw material by shaving away excess stock until the final part matches the CAD design"
        ],
        // keyTakeaways: [
          
        //   "Material Extrusion (e.g., FDM/FFF): Melts and extrudes thermoplastic filament through a nozzle.",
        //   "Powder Bed Fusion (e.g., SLS, MJF): Uses a laser or heat to fuse powdered materials (plastics, metal).",
        //   "Vat Photopolymerization (e.g., SLA, DLP): Uses light to cure liquid resin into solid plastic.",
        //   "Material Jetting: Deposits droplets of material that are cured instantly.",
        //   "Binder Jetting: Uses a binding agent to glue powder layers together.",
        //   "Directed Energy Deposition: Deposits and melts material simultaneously, often using metal powder or wire.",
        //   "Sheet Lamination: Bonds sheets of material together."
  
        // ],
      },
      {
        id: "cnc-router-ppe",
        type: "lesson",
        title: "CNC Router Overview",
        shortTitle: "machine",
        xp: 10,
        narrative: [
          "A CNC (Computer Numerical Control) router is an automated, computer-driven cutting system that carves and shapes materials like wood, plastic, foam, and soft metals. It operates via digital instructions, automating routing tasks with high-speed spindles (up to 30,000 RPM) to create precise, repeatable designs.",
        ],

        callouts: [
          "The Axes: The router head moves in three primary directions: X (left/right), Y (back/forth), and Z (up/down). Advanced models may include a fourth rotary axis",
          "The G-Code: The machine reads digital instructions known as G-code, which dictates the exact coordinates, cutting speed, and path the router bit must take",
          "Execution: The G-code is fed into the CNC machine's computer, which directs the tools to move across exact X, Y, and Z axes.",
          "Machining: The machine acts as a highly advanced, automated router or mill, carving the raw material by shaving away excess stock until the final part matches the CAD design"
        ],
      },
      {
        id: "cnc-router-workholding",
        type: "lesson",
        title: "Workholding and Material Setup",
        shortTitle: "Safety",
        xp: 15,
        narrative: [
          "Poor workholding is one of the most common causes of CNC router accidents and failed jobs.",
          "Use clamps, screws, vacuum hold-down, tabs, or other approved methods to keep material from shifting.",
          "Always confirm clamps and screws are outside the cutting path before starting the job.",
        ],
      },
      {
        id: "cnc-router-toolpath-check",
        type: "lesson",
        title: "Toolpath and Bit Check",
        shortTitle: "Toolpath",
        xp: 15,
        narrative: [
          "Confirm the selected bit matches the toolpath settings before running a job.",
          "Check spindle speed, feed rate, cut depth, and material thickness.",
          "Run a preview or simulation when available to confirm the toolpath stays within the expected area.",
        ],
      },
      {
        id: "cnc-router-emergency",
        type: "scenario",
        title: "Scenario: Material Starts Moving",
        shortTitle: "Emergency",
        xp: 20,
        prompt:
          "During a cut, you notice the material shifting slightly on the bed. What should you do?",
        choices: [
          {
            id: "keep-running",
            label: "Let the job continue and watch closely.",
            correct: false,
            explanation:
              "Never allow a job to continue if the material is moving. This can break the bit, damage the machine, or throw material.",
          },
          {
            id: "pause-or-estop",
            label: "Pause or emergency stop the machine, then notify staff.",
            correct: true,
            explanation:
              "Correct. Stop the machine safely and get help before resetting or re-running the job.",
          },
          {
            id: "hold-material",
            label: "Hold the material down by hand.",
            correct: false,
            explanation:
              "Never place your hands near the cutting area while the machine is operating.",
          },
        ],
      },
      {
        id: "cnc-router-quiz",
        type: "quick_check",
        title: "CNC Router Multiple Choice Quiz",
        shortTitle: "Quiz",
        xp: 25,
        questions: [
          {
            id: "cnc-q1",
            question: "What should you verify before starting a CNC router job?",
            answers: [
              {
                id: "cnc-q1-a",
                label:
                  "The material is secure, the bit matches the toolpath, and the cut area is clear.",
                correct: true,
              },
              {
                id: "cnc-q1-b",
                label: "Only that the file has been uploaded.",
                correct: false,
              },
              {
                id: "cnc-q1-c",
                label: "Only that the machine is powered on.",
                correct: false,
              },
            ],
            explanation:
              "Safe CNC operation requires checking workholding, tooling, toolpath, and the machine area before cutting.",
          },
          {
            id: "cnc-q2",
            question: "What should you do if the material shifts during cutting?",
            answers: [
              {
                id: "cnc-q2-a",
                label: "Pause or emergency stop the machine.",
                correct: true,
              },
              {
                id: "cnc-q2-b",
                label: "Push the material back into place by hand.",
                correct: false,
              },
              {
                id: "cnc-q2-c",
                label: "Increase the feed rate.",
                correct: false,
              },
            ],
            explanation:
              "Moving material is unsafe. Stop the job and get staff help before continuing.",
          },
          {
            id: "cnc-q3",
            question: "Why should clamps and screws be checked before cutting?",
            answers: [
              {
                id: "cnc-q3-a",
                label: "They may be in the cutting path and could be hit by the bit.",
                correct: true,
              },
              {
                id: "cnc-q3-b",
                label: "They make the router louder.",
                correct: false,
              },
              {
                id: "cnc-q3-c",
                label: "They reduce dust collection.",
                correct: false,
              },
            ],
            explanation:
              "Cutting into metal clamps or screws can break tooling and damage the machine.",
          },
        ],
      },
      {
        id: "cnc-router-cleanup",
        type: "lesson",
        title: "Shutdown and Cleanup",
        shortTitle: "Cleanup",
        xp: 10,
        narrative: [
          "After cutting, wait for the spindle to fully stop before reaching into the machine area.",
          "Remove parts, scrap, and dust using approved cleanup tools.",
          "Return bits, clamps, and accessories to their proper storage locations.",
        ],
      },
    ],
  };