import type { CertificationModule } from "./types";

export const prusaMk4sCertificationModule: CertificationModule = {
  id: "cert-prusa-mk4s-operator",
  machineId: "prusa-mk4s",
  version: "1.0.0",
  title: "Prusa MK4S Operator Badge",
  subtitle: "Learn it. Print it. Earn it.",
  theme: {
    icon: "printer-3d",
    primaryLabel: "Safety XP",
    progressLabel: "Badge Print Progress",
  },
  estimatedMinutes: 8,
  passingScore: 80,
  maxAttemptsBeforeReview: 3,
  badge: {
    id: "badge-prusa-mk4s-operator",
    title: "MK4S Certified Operator",
    description:
      "Awarded to users who demonstrate safe startup, printing, monitoring, and shutdown on the Prusa MK4S.",
    expiresInDays: 365,
    tierThresholds: {
      bronze: 80,
      silver: 90,
      gold: 100,
    },
  },
  intro: {
    headline: "Welcome to the MK4S preflight challenge",
    body:
      "This badge unlocks independent use of the Prusa MK4S in the makerspace. You will complete five short levels and one final boss challenge.",
    objectives: [
      "Identify the key printer parts users interact with",
      "Start a print safely using the approved workflow",
      "Recognize when to stop a bad print early",
      "Remove parts safely and reset the station for the next user",
    ],
    warnings: [
      "The nozzle and bed can stay hot after printing.",
      "Do not force printer parts by hand.",
      "Only use approved materials and approved slicer profiles.",
      "Never walk away until the first layer looks correct.",
    ],
  },
  levels: [
    {
      id: "lvl-1-meet-the-mk4s",
      type: "lesson",
      title: "Level 1: Meet the MK4S",
      shortTitle: "Meet the Printer",
      xp: 10,
      unlocks: ["lvl-2-safe-startup"],
      media: {
        kind: "image",
        //url: "/public/prusamk4.jpg",
        alt: "Prusa MK4S overview with key user-facing parts labeled",
        
        
      },
      narrative: [
        "The Prusa MK4S is a desktop FDM printer designed to be approachable for beginners while still delivering fast, high-quality results.",
        "The main parts you need to recognize are the print sheet, heated bed, nozzle area, screen, spool holder, and filament path.",
        "As an operator, your job is not to tune every setting. Your job is to use the approved workflow safely and leave the printer in good condition.",
      ],
      callouts: [
        "Hot zone: nozzle and bed",
        "User touchpoints: screen, sheet, filament, print removal",
        "Do not force axes or moving parts by hand",
      ],
      keyTakeaways: [
        "Know the hot parts before you touch anything.",
        "Use the screen and approved software workflow instead of improvising.",
        "Treat the print sheet as a tool surface that must stay clean and undamaged.",
      ],
      ctaLabel: "Start Preflight",
    },
    {
      id: "lvl-2-safe-startup",
      type: "scenario",
      title: "Level 2: Safe Startup",
      shortTitle: "Preflight Check",
      xp: 15,
      unlocks: ["lvl-3-approved-workflow"],
      prompt: "You arrive at the MK4S and want to begin a print.",
      situation:
        "There is some leftover plastic near the nozzle area and fingerprints on the print sheet. The previous user is gone.",
      choices: [
        {
          id: "a",
          label: "Start the print anyway. The printer will handle it.",
          correct: false,
          feedback:
            "Not safe. You should inspect the printer and prep the build surface before printing.",
          points: 0,
        },
        {
          id: "b",
          label:
            "Inspect the printer, confirm the sheet is installed correctly, and clean the sheet if needed before starting.",
          correct: true,
          feedback:
            "Correct. A quick preflight check reduces failed prints and protects the machine.",
          points: 15,
        },
        {
          id: "c",
          label: "Push the nozzle aside by hand so you can see better.",
          correct: false,
          feedback:
            "Do not force printer parts by hand. Use the controls and approved workflow.",
          points: 0,
        },
        {
          id: "d",
          label: "Remove the sheet and scrape it with any nearby metal tool.",
          correct: false,
          feedback:
            "Wrong move. Use approved cleaning/removal practices to avoid damaging the sheet.",
          points: 0,
        },
      ],
      successMessage:
        "Preflight complete. Good operators inspect before they print.",
    },
    {
      id: "lvl-3-approved-workflow",
      type: "sort",
      title: "Level 3: Approved Workflow",
      shortTitle: "Load & Print",
      xp: 20,
      unlocks: ["lvl-4-first-layer-watch"],
      prompt: "Sort each action into the correct bucket.",
      categories: ["Approved", "Not Approved"],
      items: [
        {
          id: "item-1",
          label: "Use an approved PrusaSlicer profile for the machine and material",
          correctCategory: "Approved",
          feedback:
            "Yes. Approved profiles are the baseline workflow for consistent results.",
        },
        {
          id: "item-2",
          label: "Guess your own nozzle temperature because it might be faster",
          correctCategory: "Not Approved",
          feedback:
            "No. Beginners should not freestyle temperatures on shared machines.",
        },
        {
          id: "item-3",
          label: "Confirm the selected material matches the filament actually loaded",
          correctCategory: "Approved",
          feedback:
            "Correct. Material/profile mismatches can ruin prints and waste time.",
        },
        {
          id: "item-4",
          label: "Use random internet g-code from an unknown source without review",
          correctCategory: "Not Approved",
          feedback:
            "Not approved. Shared makerspace workflows should use trusted files and reviewed settings.",
        },
        {
          id: "item-5",
          label: "Watch the printer begin the print instead of walking away immediately",
          correctCategory: "Approved",
          feedback:
            "Correct. Monitoring startup is required for safe operation.",
        },
      ],
    },
    {
      id: "lvl-4-first-layer-watch",
      type: "hotspot",
      title: "Level 4: First Layer Watch",
      shortTitle: "Spot the Problem",
      xp: 20,
      unlocks: ["lvl-5-reset-the-station"],
      prompt: "Tap the areas that would make you stop and inspect the print.",
      imageUrl: "/images/certifications/prusa-mk4s/first-layer-scene.png",
      imageAlt:
        "A first-layer print scene showing one good area and several warning signs",
      requiredCorrect: 3,
      hotspots: [
        {
          id: "hs-1",
          x: 24,
          y: 58,
          label: "Filament not sticking to the sheet",
          correct: true,
          feedback:
            "Correct. Poor first-layer adhesion is a stop-and-check issue.",
        },
        {
          id: "hs-2",
          x: 54,
          y: 42,
          label: "Stringy blob forming near the nozzle path",
          correct: true,
          feedback:
            "Correct. Unexpected blobbing or spaghetti is a warning sign.",
        },
        {
          id: "hs-3",
          x: 72,
          y: 60,
          label: "First layer lines look even and consistent",
          correct: false,
          feedback:
            "That area looks healthy. You are looking for warning signs, not good print zones.",
        },
        {
          id: "hs-4",
          x: 36,
          y: 31,
          label: "Part of the first layer is dragging or lifting",
          correct: true,
          feedback:
            "Correct. Dragging/lifting often means you should stop and inspect.",
        },
      ],
    },
    {
      id: "lvl-5-reset-the-station",
      type: "quick_check",
      title: "Level 5: Reset the Station",
      shortTitle: "Clean Shutdown",
      xp: 15,
      unlocks: ["boss-mk4s-final"],
      questions: [
        {
          id: "q1",
          question:
            "What should you do before removing a finished part from the print surface?",
          answers: [
            {
              id: "a",
              label: "Check that the print and surface are safe to handle",
              correct: true,
            },
            {
              id: "b",
              label: "Twist the part off immediately while the printer is still moving",
              correct: false,
            },
            {
              id: "c",
              label: "Pull on the extruder to make room",
              correct: false,
            },
          ],
          explanation:
            "Correct removal starts with confirming the printer is done and the part/surface are safe to handle.",
        },
        {
          id: "q2",
          question:
            "After your print is removed, what is the best next step for a shared makerspace printer?",
          answers: [
            {
              id: "a",
              label: "Leave scraps and fingerprints for the next user",
              correct: false,
            },
            {
              id: "b",
              label: "Clean up the station and leave the printer ready for the next operator",
              correct: true,
            },
            {
              id: "c",
              label: "Start experimenting with settings on the machine menu",
              correct: false,
            },
          ],
          explanation:
            "Shared tools should be reset and left ready for the next user.",
        },
      ],
    },
  ],
  finalChallenge: {
    id: "boss-mk4s-final",
    title: "Final Boss: Save the Print Farm",
    bossName: "The Spaghetti Monster",
    xp: 50,
    passingScore: 80,
    rounds: [
      {
        type: "multiple_choice",
        id: "boss-1",
        question:
          "Which workflow is best for a beginner using a shared MK4S?",
        answers: [
          {
            id: "a",
            label: "Use approved PrusaSlicer profiles and approved materials",
            correct: true,
          },
          {
            id: "b",
            label: "Change settings by feel until it works",
            correct: false,
          },
          {
            id: "c",
            label: "Use any leftover file on the SD card without checking it",
            correct: false,
          },
        ],
        explanation:
          "Approved profiles and materials are the safest and most reliable shared workflow.",
      },
      {
        type: "multiple_choice",
        id: "boss-2",
        question:
          "What is the most important thing to do when the print starts?",
        answers: [
          {
            id: "a",
            label: "Leave immediately because the printer is automatic",
            correct: false,
          },
          {
            id: "b",
            label: "Watch the first layer and confirm it is printing correctly",
            correct: true,
          },
          {
            id: "c",
            label: "Open advanced settings and increase speed",
            correct: false,
          },
        ],
        explanation:
          "The first layer is the highest-value checkpoint in the entire print.",
      },
      {
        type: "multiple_choice",
        id: "boss-3",
        question:
          "Which parts should you assume may be hot after or during printing?",
        answers: [
          {
            id: "a",
            label: "The nozzle and heated bed",
            correct: true,
          },
          {
            id: "b",
            label: "Only the screen",
            correct: false,
          },
          {
            id: "c",
            label: "Only the frame",
            correct: false,
          },
        ],
        explanation:
          "The nozzle and bed are the key hot-surface hazards for operators.",
      },
      {
        type: "multiple_choice",
        id: "boss-4",
        question:
          "What should you do if the first layer is peeling up and turning into spaghetti?",
        answers: [
          {
            id: "a",
            label: "Ignore it and hope later layers fix it",
            correct: false,
          },
          {
            id: "b",
            label: "Stop the print and inspect the setup before retrying",
            correct: true,
          },
          {
            id: "c",
            label: "Push the filament down by hand while printing",
            correct: false,
          },
        ],
        explanation:
          "Stopping early prevents wasted material, mess, and possible machine issues.",
      },
      {
        type: "scenario",
        id: "boss-5",
        prompt:
          "You sliced a model for PLA, but the printer currently has a different material loaded and no staff member is nearby. What do you do?",
        choices: [
          {
            id: "a",
            label:
              "Print anyway because the machine will figure it out automatically",
            correct: false,
            explanation:
              "No. Material/profile mismatches can cause failures or poor results.",
          },
          {
            id: "b",
            label:
              "Pause and correct the workflow: confirm approved material, approved profile, and correct loaded filament before printing",
            correct: true,
            explanation:
              "Correct. Shared machines need a verified, not guessed, workflow.",
          },
          {
            id: "c",
            label: "Change random temperatures until they look about right",
            correct: false,
            explanation:
              "No. Random temperature changes are not approved beginner workflow.",
          },
        ],
      },
      {
        type: "scenario",
        id: "boss-6",
        prompt:
          "Your print is done. The part is still warm and stuck firmly to the flexible sheet. What is the best response?",
        choices: [
          {
            id: "a",
            label: "Force it off with the nearest sharp metal object",
            correct: false,
            explanation:
              "No. That risks damaging the surface and the part.",
          },
          {
            id: "b",
            label:
              "Use safe removal practice, allow conditions to help release the part, and avoid damaging the sheet",
            correct: true,
            explanation:
              "Correct. Print removal should protect both the operator and the sheet.",
          },
          {
            id: "c",
            label: "Pull the print free while the printer is still active",
            correct: false,
            explanation:
              "No. Wait for safe, complete print end-state and use proper removal method.",
          },
        ],
      },
      {
        type: "multiple_choice",
        id: "boss-7",
        question:
          "What is the correct end-of-session habit on a makerspace MK4S?",
        answers: [
          {
            id: "a",
            label: "Leave scraps and fingerprints because cleaning is optional",
            correct: false,
          },
          {
            id: "b",
            label: "Reset the station so the next user starts with a clean printer",
            correct: true,
          },
          {
            id: "c",
            label: "Change machine settings for the next person",
            correct: false,
          },
        ],
        explanation:
          "A clean reset is part of safe shared-equipment operation.",
      },
      {
        type: "multiple_choice",
        id: "boss-8",
        question:
          "What should a certified beginner be able to do independently?",
        answers: [
          {
            id: "a",
            label:
              "Operate the printer safely using approved workflow and recognize when to stop and get help",
            correct: true,
          },
          {
            id: "b",
            label: "Tune every advanced setting from memory",
            correct: false,
          },
          {
            id: "c",
            label: "Repair hardware issues without staff approval",
            correct: false,
          },
        ],
        explanation:
          "Certification should prove safe operation, not advanced repair authority.",
      },
    ],
  },
  completion: {
    successTitle: "Badge Printed",
    successBody:
      "You are now certified to operate the Prusa MK4S using the approved makerspace workflow.",
    nextSteps: [
      "Return to the machine access page",
      "Show your badge if staff verification is required",
      "Start with approved materials and approved slicer profiles",
    ],
    failTitle: "Print Failed - Retry Available",
    failBody:
      "Review the key safety points and try the boss challenge again.",
    reviewLevelIds: [
      "lvl-2-safe-startup",
      "lvl-3-approved-workflow",
      "lvl-4-first-layer-watch",
    ],
  },
};