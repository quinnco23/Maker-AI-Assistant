export const vinylCutterCertificationModule = {
    id: "vinyl-cutter-basic-operator",
    title: "Vinyl Cutter Basic Operator",
    version: "1.0.0",
    passingScore: 80,
    estimatedMinutes: 8,
    levels: [
      {
        id: "vinyl-overview",
        type: "lesson",
        title: "Vinyl Cutter Overview",
        shortTitle: "Overview",
        xp: 10,
        narrative: [
          "A vinyl cutter uses a small blade to cut adhesive vinyl, heat-transfer vinyl, paper, and other thin sheet materials.",
          "The machine does not cut all the way through the backing when properly set. It scores the top material so designs can be weeded and transferred.",
          "Your goal in this certification is to understand safe loading, blade depth, test cuts, weeding, and cleanup.",
        ],
      },
      {
        id: "vinyl-material-loading",
        type: "lesson",
        title: "Material Loading",
        shortTitle: "Loading",
        xp: 10,
        narrative: [
          "Load material straight so it feeds smoothly through the cutter.",
          "Use the pinch rollers only in approved roller positions.",
          "Confirm the material width and origin before sending a cut job.",
        ],
      },
      {
        id: "vinyl-blade-depth",
        type: "lesson",
        title: "Blade Depth and Test Cuts",
        shortTitle: "Blade",
        xp: 15,
        narrative: [
          "Blade depth is one of the most important vinyl cutter settings.",
          "Too little blade depth may not cut the vinyl cleanly. Too much blade depth can cut through the backing or damage the cutting strip.",
          "Always run a test cut when using a new material, blade, or setting.",
        ],
      },
      {
        id: "vinyl-scenario",
        type: "scenario",
        title: "Scenario: Cutting Through the Backing",
        shortTitle: "Scenario",
        xp: 20,
        prompt:
          "You run a test cut and notice the blade is cutting through both the vinyl and the backing paper. What should you do?",
        choices: [
          {
            id: "continue-job",
            label: "Continue the full job because the design is still cutting.",
            isCorrect: false,
            feedback:
              "Do not continue. Cutting through the backing can damage the machine and waste material.",
          },
          {
            id: "reduce-depth",
            label: "Stop, reduce blade depth or force, and run another test cut.",
            isCorrect: true,
            feedback:
              "Correct. Adjust settings before running the full job.",
          },
          {
            id: "pull-material",
            label: "Pull the material by hand while it cuts.",
            isCorrect: false,
            feedback:
              "Never pull material by hand while the machine is operating.",
          },
        ],
      },
      {
        id: "vinyl-quiz",
        type: "quick_check",
        title: "Vinyl Cutter Multiple Choice Quiz",
        shortTitle: "Quiz",
        xp: 25,
        questions: [
          {
            id: "vinyl-q1",
            prompt: "Why should you run a test cut before a full vinyl job?",
            choices: [
              {
                id: "vinyl-q1-a",
                label:
                  "To confirm blade depth, force, and material settings are correct.",
                isCorrect: true,
              },
              {
                id: "vinyl-q1-b",
                label: "To warm up the machine motor.",
                isCorrect: false,
              },
              {
                id: "vinyl-q1-c",
                label: "To make the design larger.",
                isCorrect: false,
              },
            ],
            explanation:
              "A test cut helps verify that the vinyl cuts cleanly without cutting through the backing.",
          },
          {
            id: "vinyl-q2",
            prompt: "What can happen if blade depth is set too deep?",
            choices: [
              {
                id: "vinyl-q2-a",
                label:
                  "The blade may cut through the backing or damage the cutting strip.",
                  isCorrect: true,
              },
              {
                id: "vinyl-q2-b",
                label: "The machine will automatically fix the design.",
                isCorrect: false,
              },
              {
                id: "vinyl-q2-c",
                label: "The vinyl will weed itself.",
                isCorrect: false,
              },
            ],
            explanation:
              "Too much blade exposure can cut too deeply and damage consumable machine parts.",
          },
          {
            id: "vinyl-q3",
            prompt: "What should you check before sending a cut job?",
            choices: [
              {
                id: "vinyl-q3-a",
                label:
                  "Material alignment, origin, size, blade settings, and cut preview.",
                  isCorrect:true,
              },
              {
                id: "vinyl-q3-b",
                label: "Only the color of the vinyl.",
                isCorrect: false,
              },
              {
                id: "vinyl-q3-c",
                label: "Only whether the machine is plugged in.",
                isCorrect: false,
              },
            ],
            explanation:
              "Good setup prevents wasted vinyl, misaligned cuts, and machine issues.",
          },
        ],
      },
      {
        id: "vinyl-weeding-cleanup",
        type: "lesson",
        title: "Weeding and Cleanup",
        shortTitle: "Cleanup",
        xp: 10,
        narrative: [
          "After cutting, unload the material carefully and weed away unwanted vinyl using approved tools.",
          "Keep sharp weeding tools pointed away from your body and return them after use.",
          "Remove scraps from the work area and leave the cutter ready for the next member.",
        ],
      },
    ],
  };