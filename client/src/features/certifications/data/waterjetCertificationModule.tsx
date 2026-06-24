export const waterjetCertificationModule = {
  id: "waterjet-cutter-safety-core",
  title: "Waterjet Cutter Safety Core",
  version: "1.0.0",
  passingScore: 85,
  estimatedMinutes: 15,
  levels: [
    {
      id: "waterjet-overview",
      type: "lesson",
      title: "Waterjet Cutter Overview",
      shortTitle: "Overview",
      xp: 10,
      narrative: [
        "A waterjet cutter uses high-pressure water, often mixed with abrasive, to cut sheet materials such as metal, stone, glass, tile, plastics, and composites.",
        "The machine can cut very hard materials, but the cutting stream is extremely dangerous and must never be approached while active.",
        "Your goal in this certification is to understand material setup, water level, piercing, standoff, emergency stop, and cleanup basics.",
      ],
    },
    {
      id: "waterjet-ppe",
      type: "lesson",
      title: "PPE and Area Safety",
      shortTitle: "PPE",
      xp: 10,
      narrative: [
        "Wear approved eye protection near the waterjet.",
        "Hearing protection may be required during cutting.",
        "Keep hands, tools, and loose items away from the cutting head and slats while the machine is active.",
      ],
    },
    {
      id: "waterjet-material-setup",
      type: "lesson",
      title: "Material Setup and Support",
      shortTitle: "Setup",
      xp: 15,
      narrative: [
        "Confirm the material is appropriate for the waterjet and fits fully within the cutting area.",
        "Material must sit flat and be supported by the slats or approved fixtures.",
        "Small parts may tip, fall, or shift during cutting, so tabs or additional planning may be required.",
      ],
    },
    {
      id: "waterjet-piercing",
      type: "lesson",
      title: "Piercing and Cut Planning",
      shortTitle: "Piercing",
      xp: 15,
      narrative: [
        "Piercing is often the most forceful part of a waterjet job.",
        "Some materials require special pierce settings to avoid cracking, delamination, or excessive splashback.",
        "Always verify the toolpath, pierce points, material thickness, and cut quality settings before starting.",
      ],
    },
    {
      id: "waterjet-scenario",
      type: "scenario",
      title: "Scenario: Part Tips Up During Cutting",
      shortTitle: "Scenario",
      xp: 20,
      prompt:
        "During a waterjet cut, a small part tips upward near the cutting path. What should you do?",
      options: [
        {
          id: "keep-cutting",
          label: "Let the job continue because the waterjet can cut through it.",
          correct: false,
          feedback:
            "A tipped part can collide with the cutting head or affect the cut path. Do not ignore it.",
        },
        {
          id: "pause-alert-staff",
          label: "Pause or stop the job safely and notify staff.",
          correct: true,
          feedback:
            "Correct. Stop the job safely and get help before reaching into the machine or restarting.",
        },
        {
          id: "push-down",
          label: "Push the part down by hand while the machine is cutting.",
          correct: false,
          feedback:
            "Never place your hands near the cutting head or active cutting area.",
        },
      ],
    },
    {
      id: "waterjet-quiz",
      type: "quick_check",
      title: "Waterjet Multiple Choice Quiz",
      shortTitle: "Quiz",
      xp: 25,
      questions: [
        {
          id: "waterjet-q1",
          question: "What makes the waterjet cutting stream dangerous?",
          answers: [
            {
              id: "waterjet-q1-a",
              label:
                "It uses extremely high-pressure water and may include abrasive.",
              correct: true,
            },
            {
              id: "waterjet-q1-b",
              label: "It is only dangerous when cutting metal.",
              correct: false,
            },
            {
              id: "waterjet-q1-c",
              label: "It is safe to touch because it is water.",
              correct: false,
            },
          ],
          explanation:
            "The waterjet stream can cut hard materials and is extremely hazardous. Never approach the active cutting area.",
        },
        {
          id: "waterjet-q2",
          question: "What should you verify before starting a waterjet job?",
          answers: [
            {
              id: "waterjet-q2-a",
              label:
                "Material type, thickness, toolpath, pierce points, and cut settings.",
              correct: true,
            },
            {
              id: "waterjet-q2-b",
              label: "Only that the file name is correct.",
              correct: false,
            },
            {
              id: "waterjet-q2-c",
              label: "Only that the machine is turned on.",
              correct: false,
            },
          ],
          explanation:
            "Waterjet setup requires checking material, thickness, toolpath, pierce behavior, and safe positioning.",
        },
        {
          id: "waterjet-q3",
          question: "What should you do before reaching into the waterjet bed?",
          answers: [
            {
              id: "waterjet-q3-a",
              label: "Confirm the machine is stopped and the cutting head is safe.",
              correct: true,
            },
            {
              id: "waterjet-q3-b",
              label: "Reach in quickly between cuts.",
              correct: false,
            },
            {
              id: "waterjet-q3-c",
              label: "Move parts while the machine is cutting.",
              correct: false,
            },
          ],
          explanation:
            "Never reach into the machine while it is active. Wait until the job is stopped and safe.",
        },
      ],
    },
    {
      id: "waterjet-cleanup",
      type: "lesson",
      title: "Shutdown and Cleanup",
      shortTitle: "Cleanup",
      xp: 10,
      content: [
        "Wait until the job is complete and the machine is fully stopped before removing parts.",
        "Handle cut parts carefully; edges may be sharp.",
        "Clean up scrap, return tools, and report any nozzle, abrasive, water level, or cut quality issues to staff.",
      ],
    },
  ],
};