export const laserCutterSafetyCoreModule = {
    id: "laser-cutter-safety-core",
    title: "Laser Cutter Safety Core",
    subtitle: "Safe startup, material checks, monitoring, and shutdown",
    machineType: "laser_cutter",
    version: "1.0.0",
    passingScore: 85,
    estimatedMinutes: 10,
    levels: [
      {
        id: "lvl-1-laser-basics",
        type: "lesson",
        title: "Level 1: Laser Cutting Overview",
        shortTitle: "Process Overview",
        xp: 10,
        narrative: [

          "Laser cutting uses a high-power laser which is directed through optics and computer numerical control (CNC) to direct the beam or material. Typically, the process uses a motion control system to follow a CNC or G-code of the pattern that is to be cut onto the material. The focused laser beam burns, melts, vaporises or is blown away by a jet of gas to leave a high-quality surface finished edge."
          
        ],
        media: { 
          kind: "image",
          url: "/images/certification/SpeedyTrotec.jpg", 
          alt: "Laser cutter overview with bed, lid, controls, and exhaust highlighted"
        },
        callouts: [
          "Rapid processing times",
          "Reduced energy consumption & bills due to greater efficiency",
          "Greater reliability and performance - no optics to adjust or align and no lamps to replace.",
          "Minimal maintenance.",
          "The ability to process highly reflective materials such as copper and brass.",
          "Higher productivity - lower operational costs offer a greater return on your investment."
        ],
        keyTakeaways: [
          "Laser cutting is excellent for both one-off jobs and low-to-medium volume production orders",
          "Use laser cutting to achieve precise, easy, and accurately reproducible parts",
          "Laser cutting is perfect for batches producing different parts form the same base material, with little to no change in setup"
        ],
        ctaLabel: "Begin Safety Check"
      },
      {
        id: "lvl-2-material-check",
        type: "lesson",
        title: "Level 2: Meet the Machine",
        shortTitle: "laser Cutter",
        xp: 20,
      
        narrative: [
          "The Trotec Speedy 360 is a high-performance 32 x 20 inch (813 x 508 mm) CO2 or flexx (CO2 + fiber) laser engraver/cutter. It is designed for speed and precision, offering up to 140 inches per second engraving speed. It features Ruby® laser software, automatic sonar focusing, and a modular table system to suit various materials"
        ],
        media: { 
          kind: "image",
          url: "/images/certification/SpeedyTrotec.jpg", 
          alt: "Laser cutter overview with bed, lid, controls, and exhaust highlighted"
        },

        callouts: [
          "Working Area: 32 x 20 inches (813 x 508 mm).",
          "Laser Power: Available in CO2 (60W-120W) or Flexx (CO2+Fiber) models",
          "Speed & Accuracy: 140 inches per second (ips) engraving speed and 5G acceleration.",
          "Workpiece Size: Accommodates pieces up to inches",
          "Software: Includes Ruby® laser software for managing, designing, and operating.",
          "Focusing: Sonar Technology (automatic focus).",
          "Key Capabilities: High-speed cutting, engraving, and marking with optional rotary attachment.",
          "Build: Compact design that fits through standard doors."
        ],
      },
      {
        id: "lvl-3-approved-vs-not-approved",
        type: "quick_check",
        title: "Level 3: Approved vs Not Approved",
        shortTitle: "Material Rules",
        xp: 20,
        questions: [
          {
            id: "q1",
            question: "Which material is commonly approved for laser cutting in makerspaces?",
            answers: [
              { id: "q1a", label: "Laser-safe plywood", correct: true },
              { id: "q1b", label: "PVC sheet", correct: false },
              { id: "q1c", label: "Unknown vinyl", correct: false }
            ],
            explanation: "Laser-safe plywood is commonly approved. PVC and unknown vinyl are unsafe."
          }
        ]
      },
      // {
      //   id: "lvl-4-monitor-the-cut",
      //   type: "hotspot",
      //   title: "Level 4: Watch the Bed",
      //   shortTitle: "Monitor the Cut",
      //   xp: 25,
      //   prompt: "Tap the conditions that should make you pause or stop the job.",
      //   imageUrl: "/images/certifications/laser-cutter/cut-monitoring-scene.png",
      //   imageAlt: "Laser bed scene showing both normal and unsafe cut conditions",
      //   hotspots: [
      //     {
      //       id: "hs-1",
      //       x: 22,
      //       y: 46,
      //       radius: 8,
      //       label: "Persistent flame at cut point",
      //       isCorrect: true,
      //       feedback: "Correct. Persistent flame is a stop-and-check condition."
      //     },
      //     {
      //       id: "hs-2",
      //       x: 48,
      //       y: 68,
      //       radius: 8,
      //       label: "Smoke building unusually under the lid",
      //       isCorrect: true,
      //       feedback: "Correct. Unusual smoke behavior can indicate a problem with material or settings."
      //     },
      //     {
      //       id: "hs-3",
      //       x: 74,
      //       y: 30,
      //       radius: 8,
      //       label: "Laser head moving normally over material",
      //       isCorrect: false,
      //       feedback: "That alone is not a warning sign."
      //     },
      //     {
      //       id: "hs-4",
      //       x: 58,
      //       y: 22,
      //       radius: 8,
      //       label: "Small brief spark that immediately disappears",
      //       isCorrect: false,
      //       feedback: "You are looking for sustained unsafe conditions, not every brief visual change."
      //     }
      //   ],
      //   minCorrect: 2
      // },
      {
        id: "lvl-5-clean-shutdown",
        type: "scenario",
        title: "Level 5: Clean Shutdown",
        shortTitle: "Shutdown",
        xp: 15,
        prompt: "Your job finishes successfully. What should you do before leaving the machine?",
        situation: "The material is cut, the bed has scraps, and the machine area smells like normal exhaust.",
        choices: [
          {
            id: "shutdown-a",
            label: "Take your pieces and leave immediately so the next person can use it.",
            isCorrect: false,
            feedback: "Not correct. Shared tools should be reset and cleaned for the next operator."
          },
          {
            id: "shutdown-b",
            label: "Remove scraps, check for smoldering pieces, clean the bed area, and leave the station ready.",
            isCorrect: true,
            feedback: "Correct. Cleanup and fire-check are part of safe laser operation."
          },
          {
            id: "shutdown-c",
            label: "Leave scraps if the machine still looks mostly usable.",
            isCorrect: false,
            feedback: "No. Scrap and debris should be removed after use."
          }
        ]
      }
    ]
  };