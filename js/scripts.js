document.documentElement.classList.add("js");

const canvas = document.querySelector("#world");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-game");
const freeRoamButton = document.querySelector("#free-roam");
const newStoryButton = document.querySelector("#new-story");
const gameHud = document.querySelector("#game-hud");
const chapterLabel = document.querySelector("#chapter-label");
const objectiveLabel = document.querySelector("#objective-label");
const currentZone = document.querySelector("#current-zone");
const targetTitle = document.querySelector("#target-title");
const targetDistance = document.querySelector("#target-distance");
const navArrow = document.querySelector("#nav-arrow");
const visitedCount = document.querySelector("#visited-count");
const missionProgressLabel = document.querySelector(".hud-progress > span");
const storyCount = document.querySelector("#story-count");
const speedReadout = document.querySelector("#speed-readout");
const vehicleHud = document.querySelector("#vehicle-hud");
const vehicleSpeed = document.querySelector("#vehicle-speed");
const boostMeter = document.querySelector("#boost-meter");
const conditionReadout = document.querySelector("#condition-readout");
const chapterCard = document.querySelector("#chapter-card");
const chapterNumber = document.querySelector("#chapter-number");
const chapterTitle = document.querySelector("#chapter-title");
const chapterCopy = document.querySelector("#chapter-copy");
const chapterProgress = document.querySelector("#chapter-progress");
const pickupToast = document.querySelector("#pickup-toast");
const pickupTitle = document.querySelector("#pickup-title");
const interactionPrompt = document.querySelector("#interaction-prompt");
const interactionTitle = document.querySelector("#interaction-title");
const detailPanel = document.querySelector("#detail-panel");
const detailType = document.querySelector("#detail-type");
const detailPeriod = document.querySelector("#detail-period");
const detailTitle = document.querySelector("#detail-title");
const detailIndex = document.querySelector("#detail-index");
const detailOrg = document.querySelector("#detail-org");
const detailLead = document.querySelector("#detail-lead");
const detailCopy = document.querySelector("#detail-copy");
const detailTags = document.querySelector("#detail-tags");
const detailLink = document.querySelector("#detail-link");
const detailSecondary = document.querySelector("#detail-secondary");
const closeDetailButton = document.querySelector("#close-detail");
const mapPanel = document.querySelector("#map-panel");
const mapGrid = document.querySelector("#map-grid");
const closeMapButton = document.querySelector("#close-map");
const gameToolbar = document.querySelector("#game-toolbar");
const mapButton = document.querySelector("#map-button");
const restartButton = document.querySelector("#restart-button");
const fullscreenButton = document.querySelector("#fullscreen-button");
const touchControls = document.querySelector("#touch-controls");
const touchInspect = document.querySelector("#touch-inspect");
const worldLegend = document.querySelector("#world-legend");
const gameStatus = document.querySelector("#game-status");
const endingScreen = document.querySelector("#ending-screen");
const continueGameButton = document.querySelector("#continue-game");
const replayStoryButton = document.querySelector("#replay-story");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const touchDevice = window.matchMedia("(pointer: coarse)").matches;

const TYPE_COLORS = {
  profile: 0xf2f7ef,
  experience: 0x71d7ff,
  project: 0xc9ff58,
  education: 0xb79aff,
  toolkit: 0xffbf69,
  contact: 0xff8ea8
};

const entries = [
  {
    id: "profile", type: "profile", label: "CHROMEPET / ARRIVAL", title: "Adithya U R", org: "Chennai roots · Stockholm systems", period: "NOW", x: -48, z: 40,
    lead: "I make machine learning work outside the notebook.",
    copy: ["I design the path from raw data to reliable compute—and make every run reproducible, governed, and explainable.", "My sweet spot is where large-scale data processing, GPU workloads, workload identity, and platform engineering meet."],
    tags: ["ML systems", "Data platforms", "GPU infrastructure", "MLOps"],
    href: "https://github.com/adithyaur99", linkLabel: "GitHub", secondaryHref: "https://www.linkedin.com/in/adithya-u-r-79586612b/", secondaryLabel: "LinkedIn"
  },
  {
    id: "scania-data", type: "experience", label: "SENSOR / DATA DEPOT", title: "Data Engineer", org: "Scania", period: "OCT 2023 — PRESENT", x: 8, z: -6,
    lead: "Building governed data paths for high-volume, multimodal sensor information.",
    copy: ["I work across ingestion, processing, transformation, quality, security, and reliable access for autonomous-vehicle analytics and downstream AI workflows.", "The recurring challenge is turning raw camera, LiDAR, RADAR, and log outputs into trustworthy inputs for people, models, and simulation."],
    tags: ["PySpark", "Databricks", "AWS", "Data governance"]
  },
  {
    id: "scania-automation", type: "experience", label: "AUTOMATION / YARD", title: "Automation Specialist", org: "Scania", period: "AUG 2022 — SEP 2023", x: 1, z: 7,
    lead: "Turning operational problems into cloud applications and automation.",
    copy: ["I translated business needs into data-intensive tools that connected changing demand, suppliers, and production decisions in real time.", "The work combined software, automation, and applied AI to shorten feedback loops and support faster decisions."],
    tags: ["Cloud applications", "Automation", "Applied AI", "APIs"]
  },
  {
    id: "ericsson", type: "experience", label: "SEMANTIC / SIGNALS", title: "ML Engineering Intern", org: "Ericsson", period: "JUN 2021 — OCT 2021", x: -14, z: -13,
    lead: "Semantic support-ticket retrieval with Sentence-BERT and retrieval-augmented generation.",
    copy: ["I built and compared approaches for finding similar historical tickets, then deployed the strongest model through an end-to-end MLOps path.", "The project connected model quality to an actual retrieval workflow rather than stopping at an offline notebook."],
    tags: ["Sentence-BERT", "RAG", "NLP", "Model deployment"]
  },
  {
    id: "agnikul", type: "experience", label: "TRAJECTORY / YARD", title: "Software Engineer", org: "Agnikul Cosmos", period: "MAR 2020 — AUG 2020", x: -12, z: 0,
    lead: "From orbital trajectories to real-time Linux for small launch vehicles.",
    copy: ["I worked across trajectory optimization, payload tooling, and real-time software architecture.", "That systems foundation still shapes how I reason about latency, constraints, failure modes, and interfaces in modern ML platforms."],
    tags: ["C++", "Linux", "Optimization", "Real-time systems"]
  },
  {
    id: "dataset-integrity", type: "project", label: "DVC / INTEGRITY WHARF", title: "Portable Dataset Integrity", org: "Open-source experiment", period: "2026", x: 22, z: 12,
    lead: "DVC reproduces the pipeline. A portable manifest proves every byte.",
    copy: ["The experiment separates development-time reproducibility from runtime verification.", "It combines deterministic fixtures, SHA-256 digests, atomic publication, completion markers, idempotency, and corruption detection without requiring cloud access or private data."],
    tags: ["DVC", "Python", "SHA-256", "Data contracts"],
    href: "https://github.com/adithyaur99/portable-dataset-integrity", linkLabel: "Open source"
  },
  {
    id: "flyte-skypilot", type: "project", label: "FLYTE × SKYPILOT TOWER", title: "Flyte × SkyPilot Fallback", org: "Open-source experiment", period: "2026", x: 24, z: -18,
    lead: "Regional GPU fallback that explains why every candidate succeeded or failed.",
    copy: ["Capacity and transient failures can retry. Policy and authentication failures stop the launch instead of silently widening access.", "The result is a deterministic SkyPilot-shaped launch plan with Flyte-style orchestration evidence and synthetic infrastructure inputs."],
    tags: ["Flyte", "SkyPilot", "GPU scheduling", "Failure policy"],
    href: "https://github.com/adithyaur99/flyte-skypilot-fallback", linkLabel: "Open source"
  },
  {
    id: "spark-gpu", type: "project", label: "SPARK / GPU FOUNDRY", title: "Spark GPU Feed", org: "Open-source experiment", period: "2026", x: 31, z: -8,
    lead: "A deterministic model of whether Spark can keep a GPU fed.",
    copy: ["Partition count, model initialization, row calls, and vectorized batches become explicit variables instead of hidden benchmark assumptions.", "The simulator estimates throughput and utilization while rejecting impossible parameter combinations and overstated claims."],
    tags: ["Spark", "GPU", "Vectorization", "Throughput"],
    href: "https://github.com/adithyaur99/spark-gpu-feed", linkLabel: "Open source"
  },
  {
    id: "credentials", type: "project", label: "IDENTITY / ACCESS GATE", title: "Credential Isolation", org: "Open-source experiment", period: "2026", x: 27, z: 2,
    lead: "Short-lived, path-scoped credentials with no ambient fallback.",
    copy: ["The experiment verifies allowed reads, denied reads, expiry, refresh, and strict isolation from environment credentials, instance metadata, and shared profiles.", "Positive tests show intended access works; negative tests prove the boundary holds."],
    tags: ["Workload identity", "Least privilege", "Refresh", "Negative tests"],
    href: "https://github.com/adithyaur99/credential-isolation", linkLabel: "Open source"
  },
  {
    id: "modal-gpu", type: "project", label: "MODAL / CLOUD TERRACE", title: "Modal GPU Data Path", org: "Open-source experiment", period: "2026", x: 35, z: -21,
    lead: "A portable data contract crossing into serverless GPU execution.",
    copy: ["This experiment makes the handoff between published data and an on-demand GPU runtime explicit: validate inputs, prepare the launch, preserve evidence, and keep cloud-specific behavior behind a narrow adapter.", "Synthetic fixtures keep the whole path independently runnable."],
    tags: ["Modal", "Serverless GPU", "Data path", "Run evidence"],
    href: "https://github.com/adithyaur99/modal-gpu-data-path", linkLabel: "Open source"
  },
  {
    id: "experiment-index", type: "project", label: "25 / SYSTEMS BAZAAR", title: "MLOps Experiments", org: "Open-source collection", period: "2026", x: 35, z: -32,
    lead: "Twenty-five small systems answering concrete MLOps questions.",
    copy: ["The collection spans portable data, GPU execution, orchestration, scheduling, workload identity, evaluation, lineage, observability, and cost-aware placement.", "Every experiment has synthetic fixtures, an independent history, tests, limitations, an MIT license, and a clean-room statement."],
    tags: ["MLOps", "AWS", "Evaluation", "Open source"],
    href: "https://github.com/adithyaur99/mlops-experiments", linkLabel: "Explore all 25"
  },
  {
    id: "kth", type: "education", label: "MAA → ARN / KTH", title: "MSc Autonomous Systems", org: "KTH Royal Institute of Technology", period: "AUG 2020 — AUG 2022", x: -27, z: -26,
    lead: "Autonomous systems, perception, robotics, and the software around them.",
    copy: ["My master’s work focused on single-stage image segmentation for autonomous heavy-duty vehicles.", "The programme connected algorithms to real sensors, embedded constraints, and complete autonomous-system architectures."],
    tags: ["Computer vision", "Autonomous systems", "Segmentation", "Robotics"]
  },
  {
    id: "anna", type: "education", label: "MIT / CHROMEPET", title: "BE Electronics & Communication", org: "Madras Institute of Technology · Anna University", period: "AUG 2016 — AUG 2020", x: -28, z: 18,
    lead: "This is where the signal run begins: electronics, embedded systems, and the first intelligent vehicle.",
    copy: ["At the MIT Campus in Chromepet, electronics, communication systems, embedded programming, and signal processing formed the hardware-and-systems base behind my later ML work.", "My bachelor thesis explored deep-learning-based self-driving systems with TensorFlow and Nvidia Jetson."],
    tags: ["Embedded systems", "Signal processing", "TensorFlow", "Nvidia Jetson"]
  },
  {
    id: "toolkit", type: "toolkit", label: "MIT / PROJECT GARAGE", title: "From Sensor to System", org: "Selected toolkit", period: "CURRENT", x: -19, z: 9,
    lead: "Tools matter most when their boundaries are clear.",
    copy: ["Data: Python, SQL, PySpark, Spark, Databricks, DVC. ML and GPU: PyTorch, TensorFlow, OpenCV, TensorRT, MLflow.", "Platform: AWS, Terraform, Docker, Flyte, SkyPilot, Modal. Systems: C, C++, Shell, Linux, APIs, and CI/CD."],
    tags: ["Python", "Databricks", "AWS", "PyTorch", "Terraform", "Flyte"]
  },
  {
    id: "contact", type: "contact", label: "MARINA / OPEN SIGNAL", title: "Let’s Build Something", org: "Adithya U R", period: "OPEN CHANNEL", x: 44, z: -30,
    lead: "If the problem lives between data, compute, identity, and evidence, I want to hear it.",
    copy: ["I’m based in Stockholm and interested in ambitious ML systems, data platform, and infrastructure work.", "Send me an email, browse the code, or continue the conversation on LinkedIn."],
    tags: ["Stockholm", "ML systems", "Data engineering", "Platform engineering"],
    href: "mailto:adithyaur1999@gmail.com", linkLabel: "Email me", secondaryHref: "https://www.linkedin.com/in/adithya-u-r-79586612b/", secondaryLabel: "LinkedIn"
  }
].map((entry, index) => ({ ...entry, index: index + 1, color: TYPE_COLORS[entry.type] }));

const missions = [
  {
    id: "first-signal", number: "01", kicker: "IGNITION", title: "Build the first machine.", location: "MIT Chromepet", targetId: "anna", ordered: false,
    copy: "Collect the sensor, communication, and compute modules around campus. Return to MIT when the first intelligent vehicle is ready.",
    reward: "ROVER ONLINE", completion: "A model is one part. The system around it makes the machine move.",
    items: [
      { id: "camera", label: "CAMERA SENSOR", x: -39, z: 26, kind: "sensor" },
      { id: "signal", label: "ECE SIGNAL BOARD", x: -35, z: 22, kind: "signal" },
      { id: "jetson", label: "NVIDIA JETSON", x: -34, z: 16, kind: "gpu" }
    ]
  },
  {
    id: "launch-window", number: "02", kicker: "REAL-TIME", title: "Trace the trajectory.", location: "Agnikul launch yard", targetId: "agnikul", ordered: true,
    copy: "Cross the three trajectory gates in order. Respect the constraints, lock the path, then return to the launch console.",
    reward: "BOOST ONLINE", completion: "Trajectory locked. Real-time checks green.",
    items: [
      { id: "trajectory-a", label: "TRAJECTORY A", x: -24, z: 13, kind: "ring" },
      { id: "trajectory-b", label: "TRAJECTORY B", x: -22, z: 5, kind: "ring" },
      { id: "trajectory-c", label: "TRAJECTORY C", x: -15, z: 4, kind: "ring" }
    ]
  },
  {
    id: "semantic-signal", number: "03", kicker: "MEANING", title: "Find the solved signal.", location: "Semantic radio district", targetId: "ericsson", ordered: false,
    copy: "Collect the three semantic neighbors around the query beacon. Match meaning, not just keywords, then activate the radio mast.",
    reward: "SEMANTIC COMPASS", completion: "Evaluation chose the signal that ships.",
    items: [
      { id: "intent", label: "USER INTENT", x: -11, z: -5, kind: "semantic" },
      { id: "context", label: "TICKET CONTEXT", x: -17, z: -7, kind: "semantic" },
      { id: "match", label: "SOLVED MATCH", x: -18, z: -12, kind: "semantic" }
    ]
  },
  {
    id: "sensor-to-trust", number: "04", kicker: "DATA", title: "Turn raw motion into trust.", location: "Autonomous data corridor", targetId: "scania-data", ordered: true,
    copy: "Route a changing-demand crate, then collect Camera, LiDAR, RADAR, and Logs in order. Deliver the governed stream to the data depot.",
    reward: "GOVERNED CAPSULE", completion: "Raw became reliable, structured, and ready for downstream systems.",
    items: [
      { id: "demand", label: "LIVE DEMAND", x: -4, z: 5, kind: "crate" },
      { id: "camera-stream", label: "CAMERA", x: 0, z: 1, kind: "sensor" },
      { id: "lidar-stream", label: "LIDAR", x: 3, z: -1, kind: "sensor" },
      { id: "radar-stream", label: "RADAR", x: 5, z: -3, kind: "sensor" },
      { id: "log-stream", label: "LOGS", x: 4, z: -6, kind: "data" }
    ]
  },
  {
    id: "trusted-runtime", number: "05", kicker: "OSS SYSTEMS", title: "Prove, place, and run.", location: "Open systems bazaar", targetId: "experiment-index", ordered: true,
    copy: "Seal the DVC manifest, cross the scoped identity gate, feed the Spark GPU, dispatch through Flyte and SkyPilot, then launch the same contract on Modal.",
    reward: "RUNTIME ONLINE", completion: "Capacity may retry. Policy may not. Every byte and decision left evidence.",
    items: [
      { id: "manifest", label: "DVC MANIFEST", x: 18, z: 15, kind: "manifest" },
      { id: "token", label: "SCOPED TOKEN", x: 24, z: 5, kind: "credential" },
      { id: "batch", label: "SPARK BATCH", x: 28, z: -5, kind: "gpu" },
      { id: "capacity", label: "CAPACITY ROUTE", x: 22, z: -14, kind: "route" },
      { id: "modal", label: "MODAL RUNTIME", x: 30, z: -23, kind: "cloud" }
    ]
  },
  {
    id: "leave-evidence", number: "06", kicker: "FINALE", title: "Leave evidence. Send the signal.", location: "Marina data coast", targetId: "contact", ordered: true,
    copy: "Carry Data, Model, Run, and Evaluation evidence down the coast. Activate the lighthouse to connect Chennai roots with the systems still ahead.",
    reward: "OPEN SIGNAL", completion: "The system is online. The channel is open.",
    items: [
      { id: "data-evidence", label: "DATA", x: 37, z: -36, kind: "evidence" },
      { id: "model-evidence", label: "MODEL", x: 40, z: -35, kind: "evidence" },
      { id: "run-evidence", label: "RUN", x: 43, z: -34, kind: "evidence" },
      { id: "eval-evidence", label: "EVALUATION", x: 36, z: -27, kind: "evidence" }
    ]
  }
];

const SAVE_KEY = "adithya-signal-run-v1";
const ACTIVATION_KINDS = new Set(["semantic", "credential", "route", "cloud"]);

const state = {
  mode: "loading",
  resumeMode: "menu",
  playMode: "story",
  elapsed: 0,
  player: { x: -46, y: 0, z: 30, heading: 1.05, speed: 0, verticalVelocity: 0, airborne: false },
  visited: new Set(),
  targetId: "anna",
  nearbyId: null,
  nearbyItemId: null,
  selectedId: null,
  zone: "Chromepet station",
  cameraOrbit: 0,
  missionIndex: 0,
  missionCollected: new Set(),
  completedMissions: [],
  inventory: [],
  storyComplete: false,
  endingPending: false,
  chapterQueued: false,
  chapterUntil: 0,
  toastUntil: 0,
  boost: 100,
  condition: 100,
  missionMessage: "Every system begins as a signal."
};

const controls = { up: false, down: false, left: false, right: false, boost: false, brake: false };
let game = null;
let pendingStart = false;
let pendingMode = "story";
let chapterUiSignature = "";

function activeMission() {
  return missions[state.missionIndex] ?? null;
}

function pointDistance(point) {
  return Math.hypot(state.player.x - point.x, state.player.z - point.z);
}

function missionItemById(id) {
  return activeMission()?.items.find((item) => item.id === id) ?? null;
}

function currentObjective() {
  if (state.playMode === "free" || state.storyComplete) {
    const entry = entryById(state.targetId) ?? nearestUnvisited();
    return entry ? { ...entry, objectiveType: "landmark" } : null;
  }
  const mission = activeMission();
  if (!mission) return null;
  const uncollected = mission.items.filter((item) => !state.missionCollected.has(item.id));
  const item = mission.ordered ? uncollected[0] : [...uncollected].sort((left, right) => pointDistance(left) - pointDistance(right))[0];
  if (item) return { ...item, title: item.label, objectiveType: item.kind };
  const entry = entryById(mission.targetId);
  return entry ? { ...entry, title: `Return to ${entry.title}`, objectiveType: "debrief" } : null;
}

function saveStory() {
  if (state.playMode !== "story") return;
  const payload = {
    version: 1,
    missionIndex: state.missionIndex,
    missionCollected: [...state.missionCollected],
    completedMissions: state.completedMissions,
    inventory: state.inventory,
    visited: [...state.visited],
    storyComplete: state.storyComplete
  };
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(payload)); } catch {}
}

function loadStorySave() {
  try {
    const payload = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null");
    if (!payload || payload.version !== 1 || !Number.isInteger(payload.missionIndex) || payload.missionIndex < 0 || payload.missionIndex >= missions.length) return null;
    if (![payload.missionCollected, payload.completedMissions, payload.inventory, payload.visited].every(Array.isArray)) return null;
    return payload;
  } catch {
    return null;
  }
}

function restoreStory(payload) {
  state.playMode = "story";
  state.missionIndex = Math.min(payload?.missionIndex ?? 0, missions.length - 1);
  state.missionCollected = new Set(payload?.missionCollected ?? []);
  state.completedMissions = [...(payload?.completedMissions ?? [])];
  state.inventory = [...(payload?.inventory ?? [])];
  state.visited = new Set(payload?.visited ?? []);
  state.storyComplete = Boolean(payload?.storyComplete);
  state.endingPending = false;
  state.chapterQueued = false;
  state.nearbyItemId = null;
  state.targetId = activeMission()?.targetId ?? "contact";
}

const savedStory = loadStorySave();
if (savedStory && !savedStory.storyComplete && savedStory.missionIndex > 0) {
  startButton.firstChild.textContent = "Continue the journey ";
}
newStoryButton.hidden = !savedStory || savedStory.storyComplete;

function entryById(id) {
  return entries.find((entry) => entry.id === id) ?? null;
}

function distanceTo(entry) {
  return Math.hypot(state.player.x - entry.x, state.player.z - entry.z);
}

function nearestUnvisited() {
  const candidates = entries.filter((entry) => !state.visited.has(entry.id));
  const pool = candidates.length ? candidates : entries;
  return [...pool].sort((left, right) => distanceTo(left) - distanceTo(right))[0] ?? null;
}

function getZone() {
  if (state.player.x < -36) return "Chromepet station";
  if (state.player.x < -20 && state.player.z > 8) return "MIT Chromepet";
  if (state.player.x < -5 && state.player.z > -4) return "Trajectory yard";
  if (state.player.x < 0 && state.player.z <= -4) return "Semantic rooftops";
  if (state.player.x < 16) return "Autonomous data corridor";
  if (state.player.x < 39) return "Open systems bazaar";
  return "Marina data coast";
}

function buildMap() {
  mapGrid.replaceChildren();
  const island = document.createElement("div");
  island.className = "map-island";
  mapGrid.append(island);
  ["main", "west", "east", "south"].forEach((name) => {
    const road = document.createElement("i");
    road.className = `map-road map-road-${name}`;
    island.append(road);
  });
  [["CHROMEPET + MIT", "west"], ["DATA CORRIDOR", "east"], ["OSS BAZAAR → MARINA", "south"]].forEach(([label, zone]) => {
    const district = document.createElement("span");
    district.className = `map-district map-district-${zone}`;
    district.textContent = label;
    island.append(district);
  });
  entries.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `map-pin map-pin-${entry.type}`;
    button.dataset.destination = entry.id;
    button.style.setProperty("--map-x", `${((entry.x + 50) / 100) * 100}%`);
    button.style.setProperty("--map-y", `${((38 - entry.z) / 78) * 100}%`);
    button.setAttribute("aria-label", `Set route to ${entry.title}`);
    const dot = document.createElement("i");
    const number = document.createElement("span");
    number.textContent = String(entry.index).padStart(2, "0");
    const title = document.createElement("small");
    title.textContent = entry.title;
    button.append(dot, number, title);
    button.addEventListener("click", () => {
      if (state.playMode === "story" && !state.storyComplete) {
        state.missionMessage = "The Signal Run keeps the active chapter route locked.";
        closeMap();
        updateInterface();
        return;
      }
      state.targetId = entry.id;
      closeMap();
      updateInterface();
      game?.updateTargetVisual();
    });
    island.append(button);
  });
}

function fillDetail(entry) {
  detailType.textContent = `${entry.type.toUpperCase()} / ${String(entry.index).padStart(2, "0")}`;
  detailPeriod.textContent = entry.period;
  detailTitle.textContent = entry.title;
  detailIndex.textContent = String(entry.index).padStart(2, "0");
  detailOrg.textContent = entry.org;
  detailLead.textContent = entry.lead;
  detailCopy.replaceChildren();
  entry.copy.forEach((copy) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = copy;
    detailCopy.append(paragraph);
  });
  detailTags.replaceChildren();
  entry.tags.forEach((tag) => {
    const item = document.createElement("li");
    item.textContent = tag;
    detailTags.append(item);
  });
  detailLink.hidden = !entry.href;
  if (entry.href) {
    detailLink.href = entry.href;
    detailLink.firstChild.textContent = `${entry.linkLabel ?? "Open link"} `;
  }
  detailSecondary.hidden = !entry.secondaryHref;
  if (entry.secondaryHref) {
    detailSecondary.href = entry.secondaryHref;
    detailSecondary.firstChild.textContent = `${entry.secondaryLabel ?? "More"} `;
  }
}

function updateMapButtons() {
  mapGrid.querySelectorAll("[data-destination]").forEach((button) => {
    const id = button.dataset.destination;
    button.classList.toggle("is-visited", state.visited.has(id));
    button.classList.toggle("is-target", state.targetId === id);
    const entry = entryById(id);
    const status = state.visited.has(id) ? "visited" : state.targetId === id ? "current target" : "set route";
    button.dataset.status = status;
    button.setAttribute("aria-label", `${entry.title}, ${status}`);
  });
}

function missionReady() {
  const mission = activeMission();
  return Boolean(mission && mission.items.every((item) => state.missionCollected.has(item.id)));
}

function queueChapterCard() {
  state.chapterUntil = state.elapsed + 7;
  state.chapterQueued = false;
}

function collectMissionItem(item) {
  if (!item || state.missionCollected.has(item.id)) return;
  state.missionCollected.add(item.id);
  if (!state.inventory.includes(item.label)) state.inventory.push(item.label);
  state.toastUntil = state.elapsed + 2.25;
  pickupTitle.textContent = item.label;
  const mission = activeMission();
  const remaining = mission.items.length - state.missionCollected.size;
  state.missionMessage = remaining ? `${item.label} acquired. ${remaining} objective${remaining === 1 ? "" : "s"} remaining.` : `All parts ready. Return to ${entryById(mission.targetId)?.title}.`;
  game?.updateMissionVisuals();
  game?.updateTargetVisual();
  saveStory();
  updateInterface();
}

function completeMissionAt(entryId) {
  if (state.playMode !== "story" || state.storyComplete) return false;
  const mission = activeMission();
  if (!mission || mission.targetId !== entryId || !missionReady()) return false;
  if (!state.completedMissions.includes(mission.id)) state.completedMissions.push(mission.id);
  if (!state.inventory.includes(mission.reward)) state.inventory.push(mission.reward);
  state.missionMessage = mission.completion;
  game?.completeMissionVisual(mission.id);
  if (state.missionIndex >= missions.length - 1) {
    state.storyComplete = true;
    state.endingPending = true;
  } else {
    state.missionIndex += 1;
    state.missionCollected.clear();
    state.targetId = activeMission().targetId;
    state.chapterQueued = true;
  }
  saveStory();
  game?.updateMissionVisuals();
  game?.updateTargetVisual();
  return true;
}

function updateInterface() {
  const exploring = state.mode === "exploring";
  startScreen.hidden = !["loading", "menu"].includes(state.mode);
  gameHud.hidden = !exploring;
  vehicleHud.hidden = !exploring;
  gameToolbar.hidden = !exploring;
  worldLegend.hidden = !exploring;
  touchControls.hidden = !exploring || !touchDevice;
  detailPanel.hidden = state.mode !== "reading";
  mapPanel.hidden = state.mode !== "map";
  endingScreen.hidden = state.mode !== "complete";

  const nearby = entryById(state.nearbyId);
  const nearbyItem = missionItemById(state.nearbyItemId);
  const interaction = nearbyItem ?? nearby;
  interactionPrompt.hidden = !exploring || !interaction || touchDevice;
  touchInspect.hidden = !exploring || !interaction || !touchDevice;
  if (interaction) {
    interactionTitle.textContent = nearbyItem ? `Activate ${nearbyItem.label}` : nearby.title;
    touchInspect.textContent = nearbyItem ? "Activate" : "Read";
  }

  state.zone = getZone();
  currentZone.textContent = state.zone;
  const mission = activeMission();
  if (state.playMode === "story" && mission && !state.storyComplete) {
    chapterLabel.textContent = `CHAPTER ${mission.number} / ${String(missions.length).padStart(2, "0")} · ${mission.kicker}`;
    visitedCount.textContent = `${state.missionCollected.size} / ${mission.items.length}`;
    missionProgressLabel.textContent = missionReady() ? "RETURN TO LANDMARK" : "MISSION PARTS";
  } else {
    chapterLabel.textContent = state.storyComplete ? "SIGNAL RUN COMPLETE" : "FREE ROAM";
    visitedCount.textContent = `${state.visited.size} / ${entries.length}`;
    missionProgressLabel.textContent = "DISCOVERED";
  }
  storyCount.textContent = `${state.visited.size} / ${entries.length}`;
  speedReadout.textContent = `${Math.round(Math.abs(state.player.speed) * 9)} KM/H`;
  vehicleSpeed.textContent = String(Math.round(Math.abs(state.player.speed) * 9));
  boostMeter.style.width = `${state.boost}%`;
  conditionReadout.textContent = `${Math.round(state.condition)}%`;

  const target = currentObjective();
  if (target) {
    targetTitle.textContent = target.title;
    targetDistance.textContent = `${Math.round(pointDistance(target))} m`;
    objectiveLabel.textContent = target.objectiveType === "debrief" ? "CHAPTER DEBRIEF" : target.objectiveType === "landmark" ? "NEXT LANDMARK" : "ACTIVE OBJECTIVE";
    const targetAngle = Math.atan2(target.x - state.player.x, -(target.z - state.player.z));
    const relativeAngle = targetAngle - state.player.heading;
    navArrow.style.transform = `rotate(${relativeAngle}rad)`;
  }

  const showChapter = exploring && state.playMode === "story" && !state.storyComplete && state.elapsed < state.chapterUntil;
  chapterCard.hidden = !showChapter;
  if (showChapter && mission) {
    const signature = `${mission.id}:${[...state.missionCollected].join(",")}`;
    if (signature !== chapterUiSignature) {
      chapterUiSignature = signature;
      chapterNumber.textContent = `CHAPTER ${mission.number} · ${mission.kicker} · ${mission.location}`;
      chapterTitle.textContent = mission.title;
      chapterCopy.textContent = mission.copy;
      chapterProgress.replaceChildren();
      mission.items.forEach((item) => {
        const chip = document.createElement("span");
        chip.textContent = item.label;
        chip.classList.toggle("is-done", state.missionCollected.has(item.id));
        chapterProgress.append(chip);
      });
    }
  } else {
    chapterUiSignature = "";
  }
  pickupToast.hidden = !exploring || state.elapsed >= state.toastUntil;

  if (state.mode === "loading") gameStatus.textContent = "Building Chennai memory map";
  if (state.mode === "menu") gameStatus.textContent = "The Signal Run is ready";
  if (state.mode === "exploring") gameStatus.textContent = nearby ? "Career landmark in range" : state.missionMessage;
  if (state.mode === "reading") gameStatus.textContent = "Reading landmark";
  if (state.mode === "map") gameStatus.textContent = "Choosing route";
  if (state.mode === "complete") gameStatus.textContent = "All systems online";
  updateMapButtons();
}

function missionSpawn(index = state.missionIndex) {
  return [
    { x: -46, z: 30, heading: 1.05 },
    { x: -29, z: 18, heading: .78 },
    { x: -12, z: 2, heading: 0 },
    { x: -8, z: 4, heading: 2.65 },
    { x: 15, z: 7, heading: 2.6 },
    { x: 34, z: -30, heading: .8 }
  ][Math.min(index, missions.length - 1)];
}

function placePlayerAt(spawn) {
  state.player.x = spawn.x;
  state.player.y = 0;
  state.player.z = spawn.z;
  state.player.heading = spawn.heading;
  state.player.speed = 0;
  state.player.verticalVelocity = 0;
  state.player.airborne = false;
  state.boost = 100;
  state.condition = 100;
  state.toastUntil = -1;
  state.nearbyId = null;
  state.nearbyItemId = null;
  state.cameraOrbit = 0;
  Object.keys(controls).forEach((key) => { controls[key] = false; });
}

function startGame() {
  if (!game) {
    pendingStart = true;
    pendingMode = "story";
    gameStatus.textContent = "World still loading";
    return;
  }
  if (savedStory && !savedStory.storyComplete) restoreStory(savedStory);
  else restoreStory(null);
  placePlayerAt(missionSpawn());
  state.mode = "exploring";
  state.resumeMode = "exploring";
  state.missionMessage = activeMission()?.copy ?? "Follow the signal.";
  queueChapterCard();
  game?.resetVisuals();
  game?.updateMissionVisuals();
  updateInterface();
  canvas.focus({ preventScroll: true });
}

function startFreeRoam() {
  if (!game) {
    pendingStart = true;
    pendingMode = "free";
    return;
  }
  state.playMode = "free";
  state.mode = "exploring";
  state.resumeMode = "exploring";
  state.targetId = "profile";
  state.missionMessage = "Every landmark is open. Pick a route or follow the street signs.";
  placePlayerAt({ x: -46, z: 30, heading: 1.05 });
  game.resetVisuals();
  game.updateMissionVisuals();
  updateInterface();
  canvas.focus({ preventScroll: true });
}

function resetGame() {
  state.mode = "exploring";
  state.resumeMode = "exploring";
  const spawn = state.playMode === "story" && !state.storyComplete ? missionSpawn() : { x: -46, z: 30, heading: 1.05 };
  placePlayerAt(spawn);
  state.selectedId = null;
  game?.resetVisuals();
  game?.updateMissionVisuals();
  updateInterface();
  canvas.focus({ preventScroll: true });
}

function openEntry(id, resumeMode = "exploring") {
  const entry = entryById(id);
  if (!entry) return;
  state.resumeMode = resumeMode;
  state.mode = "reading";
  state.selectedId = id;
  state.player.speed = 0;
  state.visited.add(id);
  Object.keys(controls).forEach((key) => { controls[key] = false; });
  fillDetail(entry);
  if (state.playMode === "free" && state.targetId === id) state.targetId = nearestUnvisited()?.id ?? id;
  game?.markVisited(id);
  completeMissionAt(id);
  game?.updateTargetVisual();
  updateInterface();
  detailPanel.focus({ preventScroll: true });
}

function openNearby() {
  if (state.mode !== "exploring") return;
  const item = missionItemById(state.nearbyItemId);
  if (item && ACTIVATION_KINDS.has(item.kind)) {
    collectMissionItem(item);
    state.nearbyItemId = null;
    return;
  }
  if (state.nearbyId) openEntry(state.nearbyId);
}

function closeDetail() {
  if (state.mode !== "reading") return;
  if (state.endingPending) {
    state.endingPending = false;
    state.mode = "complete";
    state.selectedId = null;
    updateInterface();
    continueGameButton.focus({ preventScroll: true });
    return;
  }
  if (state.chapterQueued) {
    const source = entryById(state.selectedId);
    const objective = currentObjective();
    if (source && objective) {
      const dx = objective.x - source.x;
      const dz = objective.z - source.z;
      const length = Math.max(Math.hypot(dx, dz), .001);
      state.player.x = source.x + dx / length * 4.15;
      state.player.z = source.z + dz / length * 4.15;
      state.player.heading = Math.atan2(dx, -dz);
      state.player.speed = 0;
    }
  }
  state.mode = state.resumeMode;
  state.selectedId = null;
  if (state.chapterQueued && state.mode === "exploring") queueChapterCard();
  game?.updateMissionVisuals();
  game?.updateTargetVisual();
  updateInterface();
  if (state.mode === "exploring") canvas.focus({ preventScroll: true });
  else startButton.focus({ preventScroll: true });
}

function continueFreeRoam() {
  state.playMode = "free";
  state.mode = "exploring";
  state.resumeMode = "exploring";
  state.targetId = nearestUnvisited()?.id ?? "contact";
  state.missionMessage = "Signal Run complete. The whole city is open.";
  game?.updateMissionVisuals();
  updateInterface();
  canvas.focus({ preventScroll: true });
}

function replayStory() {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
  newStoryButton.hidden = true;
  restoreStory(null);
  state.visited.clear();
  state.elapsed = 0;
  state.selectedId = null;
  state.nearbyId = null;
  state.missionMessage = activeMission().copy;
  placePlayerAt(missionSpawn(0));
  state.mode = "exploring";
  state.resumeMode = "exploring";
  queueChapterCard();
  game?.resetVisuals();
  game?.updateMissionVisuals();
  updateInterface();
  canvas.focus({ preventScroll: true });
}

function openMap() {
  if (state.mode !== "exploring") return;
  state.mode = "map";
  state.player.speed = 0;
  Object.keys(controls).forEach((key) => { controls[key] = false; });
  updateInterface();
  mapPanel.focus({ preventScroll: true });
}

function closeMap() {
  if (state.mode !== "map") return;
  state.mode = "exploring";
  updateInterface();
  canvas.focus({ preventScroll: true });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.querySelector(".world-shell")?.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function setControl(name, active) {
  if (name in controls && state.mode === "exploring") controls[name] = active;
}

const controlKeys = {
  ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
  ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
  ShiftLeft: "boost", ShiftRight: "boost", KeyB: "boost", ControlLeft: "brake"
};

function trapDialogFocus(event) {
  if (event.code !== "Tab" || !["reading", "map"].includes(state.mode)) return false;
  const panel = state.mode === "reading" ? detailPanel : mapPanel;
  const focusable = [...panel.querySelectorAll("a[href]:not([hidden]), button:not([hidden]), [tabindex]:not([tabindex='-1'])")]
    .filter((element) => !element.disabled && element.offsetParent !== null);
  if (!focusable.length) return false;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
  return true;
}

window.addEventListener("keydown", (event) => {
  trapDialogFocus(event);
  const interactiveTarget = event.target instanceof Element && Boolean(event.target.closest("button, a, input, select, textarea, summary, [role='button']"));
  if (event.code === "Enter" && interactiveTarget) return;
  if (event.code === "Enter") event.preventDefault();
  if (event.code in controlKeys) {
    event.preventDefault();
    setControl(controlKeys[event.code], true);
  }
  if (event.code === "Space" && state.mode === "exploring" && !event.repeat) {
    event.preventDefault();
    game?.jump();
  }
  if (event.code === "Enter" && ["loading", "menu"].includes(state.mode)) startGame();
  else if (event.code === "Enter" && state.mode === "exploring" && (state.nearbyItemId || state.nearbyId)) openNearby();
  else if (event.code === "Enter" && state.mode === "reading") closeDetail();
  else if (event.code === "Enter" && state.mode === "map") closeMap();
  else if (event.code === "Enter" && state.mode === "complete") continueFreeRoam();
  if (event.code === "KeyM") state.mode === "map" ? closeMap() : openMap();
  if (event.code === "KeyR" && state.mode === "exploring") resetGame();
  if (event.code === "KeyF") toggleFullscreen();
  if (event.code === "Escape" && state.mode === "reading") closeDetail();
  else if (event.code === "Escape" && state.mode === "map") closeMap();
  else if (event.code === "Escape" && document.fullscreenElement) document.exitFullscreen?.();
});

window.addEventListener("keyup", (event) => {
  if (event.code in controlKeys) {
    event.preventDefault();
    controls[controlKeys[event.code]] = false;
  }
});

window.addEventListener("blur", () => {
  Object.keys(controls).forEach((key) => { controls[key] = false; });
});

touchControls.querySelectorAll("[data-control]").forEach((button) => {
  const name = button.dataset.control;
  const activate = (event) => {
    event.preventDefault();
    setControl(name, true);
    button.classList.add("is-active");
  };
  const deactivate = (event) => {
    event.preventDefault();
    controls[name] = false;
    button.classList.remove("is-active");
  };
  button.addEventListener("pointerdown", activate);
  button.addEventListener("pointerup", deactivate);
  button.addEventListener("pointercancel", deactivate);
  button.addEventListener("pointerleave", deactivate);
});
touchControls.querySelector("[data-action='jump']")?.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  game?.jump();
});
touchControls.querySelector("[data-action='map']")?.addEventListener("click", (event) => {
  event.preventDefault();
  openMap();
});

startButton.addEventListener("click", startGame);
freeRoamButton.addEventListener("click", startFreeRoam);
closeDetailButton.addEventListener("click", closeDetail);
mapButton.addEventListener("click", openMap);
closeMapButton.addEventListener("click", closeMap);
restartButton.addEventListener("click", resetGame);
fullscreenButton.addEventListener("click", toggleFullscreen);
touchInspect.addEventListener("click", openNearby);
continueGameButton.addEventListener("click", continueFreeRoam);
replayStoryButton.addEventListener("click", replayStory);
newStoryButton.addEventListener("click", replayStory);
buildMap();
updateInterface();

async function buildWorld() {
  let THREE;
  let GLTFLoader;
  try {
    [THREE, { GLTFLoader }] = await Promise.all([
      import("three"),
      import("three/addons/loaders/GLTFLoader.js")
    ]);
  } catch (error) {
    gameStatus.textContent = "3D could not load — use Skip the game";
    startButton.disabled = true;
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, touchDevice ? 1.15 : 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .98;
  renderer.shadowMap.enabled = !touchDevice;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = 16;
  skyCanvas.height = 512;
  const skyContext = skyCanvas.getContext("2d");
  const skyGradient = skyContext.createLinearGradient(0, 0, 0, 512);
  skyGradient.addColorStop(0, "#526273");
  skyGradient.addColorStop(.52, "#b18e72");
  skyGradient.addColorStop(.82, "#d9844f");
  skyGradient.addColorStop(1, "#6b3f33");
  skyContext.fillStyle = skyGradient;
  skyContext.fillRect(0, 0, 16, 512);
  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  skyTexture.colorSpace = THREE.SRGBColorSpace;

  const cityBackdrop = await new THREE.TextureLoader().loadAsync("assets/img/chennai-sunset-world.jpg").catch(() => null);
  if (cityBackdrop) {
    cityBackdrop.colorSpace = THREE.SRGBColorSpace;
  }

  const scene = new THREE.Scene();
  scene.background = cityBackdrop ?? skyTexture;
  scene.fog = new THREE.FogExp2(0x7b7469, .009);
  const camera = new THREE.PerspectiveCamera(51, 1, .1, 230);
  camera.position.set(-10, 28, 54);

  scene.add(new THREE.HemisphereLight(0xd3dce0, 0x44372e, 1.72));
  const sun = new THREE.DirectionalLight(0xffc47b, 4.1);
  sun.position.set(-44, 24, 52);
  sun.castShadow = !touchDevice;
  sun.shadow.mapSize.set(touchDevice ? 512 : 1536, touchDevice ? 512 : 1536);
  sun.shadow.camera.left = -58;
  sun.shadow.camera.right = 58;
  sun.shadow.camera.top = 58;
  sun.shadow.camera.bottom = -58;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 115;
  scene.add(sun);
  if (!cityBackdrop) {
    const sunDisc = new THREE.Mesh(
      new THREE.SphereGeometry(5.8, 20, 12),
      new THREE.MeshBasicMaterial({ color: 0xffd28a, fog: false })
    );
    sunDisc.position.set(-76, 28, -82);
    scene.add(sunDisc);
  }

  const world = new THREE.Group();
  scene.add(world);

  function makeSurfaceTexture(base, variation = 22, size = 256) {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = size;
    textureCanvas.height = size;
    const context = textureCanvas.getContext("2d", { willReadFrequently: true });
    const pixels = context.createImageData(size, size);
    for (let index = 0; index < pixels.data.length; index += 4) {
      const coarse = Math.sin(index * .00071) * variation * .36;
      const grain = (randomTexture(index) - .5) * variation;
      pixels.data[index] = Math.max(0, Math.min(255, base[0] + coarse + grain));
      pixels.data[index + 1] = Math.max(0, Math.min(255, base[1] + coarse + grain));
      pixels.data[index + 2] = Math.max(0, Math.min(255, base[2] + coarse + grain));
      pixels.data[index + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    for (let stain = 0; stain < 36; stain += 1) {
      const alpha = .018 + ((stain * 17) % 9) * .005;
      context.fillStyle = `rgba(15, 12, 9, ${alpha})`;
      context.beginPath();
      context.ellipse((stain * 67) % size, (stain * 113) % size, 4 + (stain % 14), 2 + (stain % 8), stain, 0, Math.PI * 2);
      context.fill();
    }
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return texture;
  }

  function randomTexture(index) {
    const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
  }

  const asphaltTexture = makeSurfaceTexture([44, 45, 43], 34);
  asphaltTexture.repeat.set(3, 18);
  const concreteTexture = makeSurfaceTexture([149, 137, 117], 29);
  concreteTexture.repeat.set(3, 3);
  const dirtTexture = makeSurfaceTexture([112, 89, 61], 38);
  dirtTexture.repeat.set(7, 7);
  const plasterTexture = makeSurfaceTexture([171, 153, 126], 24);
  plasterTexture.repeat.set(2, 3);

  const materials = {
    water: new THREE.MeshPhysicalMaterial({ color: 0x496f78, roughness: .24, metalness: .16, transparent: true, opacity: .9, envMapIntensity: .8 }),
    sand: new THREE.MeshStandardMaterial({ color: 0x9c7950, map: dirtTexture, roughness: 1 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x56654a, map: dirtTexture, roughness: 1 }),
    grassDark: new THREE.MeshStandardMaterial({ color: 0x304d3e, roughness: 1 }),
    road: new THREE.MeshStandardMaterial({ color: 0x4b4b47, map: asphaltTexture, roughness: .96, metalness: .02 }),
    roadLine: new THREE.MeshStandardMaterial({ color: 0xd8b163, roughness: .9, emissive: 0x3d260b, emissiveIntensity: .12 }),
    cream: new THREE.MeshStandardMaterial({ color: 0xb9a98d, map: plasterTexture, roughness: .9 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x202a2b, roughness: .72, metalness: .2 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xb95b2f, roughness: .62, metalness: .06 }),
    blue: new THREE.MeshStandardMaterial({ color: 0x3c6d77, roughness: .58, metalness: .14 }),
    purple: new THREE.MeshStandardMaterial({ color: 0x6b5a7b, roughness: .72 }),
    lime: new THREE.MeshStandardMaterial({ color: 0x4e7152, roughness: .67 }),
    pink: new THREE.MeshStandardMaterial({ color: 0x8a4e55, roughness: .76 }),
    oxide: new THREE.MeshStandardMaterial({ color: 0x7f3b2d, roughness: .88 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0x968a78, map: concreteTexture, roughness: 1 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xd58a24, roughness: .62, metalness: .08 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x344e53, roughness: .18, metalness: .12, transmission: .08, transparent: true, opacity: .86, envMapIntensity: 1.2 }),
    tire: new THREE.MeshStandardMaterial({ color: 0x111313, roughness: 1 }),
    white: new THREE.MeshStandardMaterial({ color: 0xd5d0c5, roughness: .82 })
  };

  function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], shadows = true) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.castShadow = shadows;
    mesh.receiveShadow = shadows;
    parent.add(mesh);
    return mesh;
  }

  function roundedBoxGeometry(width, height, depth, radius = .1, bevelSegments = 3) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const safeRadius = Math.min(radius, halfWidth - .001, halfHeight - .001);
    const shape = new THREE.Shape();
    shape.moveTo(-halfWidth + safeRadius, -halfHeight);
    shape.lineTo(halfWidth - safeRadius, -halfHeight);
    shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + safeRadius);
    shape.lineTo(halfWidth, halfHeight - safeRadius);
    shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - safeRadius, halfHeight);
    shape.lineTo(-halfWidth + safeRadius, halfHeight);
    shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - safeRadius);
    shape.lineTo(-halfWidth, -halfHeight + safeRadius);
    shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + safeRadius, -halfHeight);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments,
      steps: 1,
      bevelSize: Math.min(safeRadius * .42, .08),
      bevelThickness: Math.min(safeRadius * .42, .08)
    });
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
  }

  const staticColliders = [];
  const cameraBlockers = [];
  const cameraBlockerMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false });
  function addCameraBlocker(x, z, width, depth, height, rotationY = 0) {
    const blocker = addMesh(world, new THREE.BoxGeometry(width, height, depth), cameraBlockerMaterial, [x, .58 + height / 2, z], [0, rotationY, 0], false);
    blocker.userData.cameraBlocker = true;
    cameraBlockers.push(blocker);
    return blocker;
  }

  const water = addMesh(world, new THREE.PlaneGeometry(30, 120), materials.water, [53, -.72, -4], [-Math.PI / 2, 0, 0], false);
  water.material.side = THREE.DoubleSide;
  addMesh(world, new THREE.BoxGeometry(108, 1.2, 82), materials.sand, [-1, -.66, -1]);
  addMesh(world, new THREE.BoxGeometry(98, .7, 76), materials.grass, [-4, .02, 0]);
  addMesh(world, new THREE.PlaneGeometry(9, 76), materials.sand, [43, .39, 0], [-Math.PI / 2, 0, 0], false);

  const districtPatches = [
    [-30, 16, 32, 31, 0xb88768], [-10, -9, 29, 38, 0x608f75], [22, -5, 34, 51, 0x728f68], [38, -25, 12, 19, 0xb66d57]
  ];
  districtPatches.forEach(([x, z, width, depth, color]) => {
    const patchMaterial = new THREE.MeshStandardMaterial({ color, roughness: .95, transparent: true, opacity: .58 });
    addMesh(world, new THREE.PlaneGeometry(width, depth), patchMaterial, [x, .56, z], [-Math.PI / 2, 0, 0], false);
  });

  function addRoad(pointPairs, width = 4.8) {
    const curve = new THREE.CatmullRomCurve3(pointPairs.map(([x, z]) => new THREE.Vector3(x, .63, z)), false, "catmullrom", .18);
    const segments = Math.max(42, pointPairs.length * 18);
    const positions = [];
    const uvs = [];
    const indices = [];
    for (let index = 0; index <= segments; index += 1) {
      const ratio = index / segments;
      const point = curve.getPointAt(ratio);
      const tangent = curve.getTangentAt(ratio).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(width / 2);
      positions.push(point.x + side.x, point.y, point.z + side.z, point.x - side.x, point.y, point.z - side.z);
      uvs.push(0, ratio, 1, ratio);
      if (index < segments) {
        const base = index * 2;
        indices.push(base, base + 2, base + 1, base + 2, base + 3, base + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const road = addMesh(world, geometry, materials.road, [0, 0, 0], [0, 0, 0], false);
    for (let index = 4; index < segments; index += 5) {
      const point = curve.getPointAt(index / segments);
      const tangent = curve.getTangentAt(index / segments).normalize();
      const dash = addMesh(world, new THREE.BoxGeometry(.1, .025, 1.05), materials.roadLine, [point.x, .66, point.z], [0, Math.atan2(tangent.x, tangent.z), 0], false);
      dash.castShadow = false;
    }
    [-1, 1].forEach((direction) => {
      const curbPoints = [];
      for (let index = 0; index <= Math.min(segments, 72); index += 1) {
        const ratio = index / Math.min(segments, 72);
        const point = curve.getPointAt(ratio);
        const tangent = curve.getTangentAt(ratio).normalize();
        const edge = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(direction * (width / 2 + .14));
        curbPoints.push(new THREE.Vector3(point.x + edge.x, .72, point.z + edge.z));
      }
      const curbCurve = new THREE.CatmullRomCurve3(curbPoints, false, "catmullrom", .18);
      addMesh(world, new THREE.TubeGeometry(curbCurve, curbPoints.length * 2, .105, 5, false), materials.concrete, [0, 0, 0], [0, 0, 0], false);
    });
    return curve;
  }

  addRoad([[-49, 33], [-42, 29], [-35, 23], [-28, 18], [-19, 9], [-12, 0], [0, 6], [8, -6]], 5.6);
  addRoad([[-20, 10], [-16, 0], [-14, -13], [-27, -26]], 4.7);
  addRoad([[0, 6], [13, 10], [22, 12], [27, 2], [31, -8], [24, -18], [35, -21], [35, -32], [44, -30]], 5);
  addRoad([[-14, -13], [0, -8], [8, -6], [20, -4], [31, -8]], 4.6);
  addRoad([[35, 19], [38, 6], [41, -10], [44, -30]], 4.6);

  [[-42, 29], [-28, 18], [0, 6], [27, 2], [35, -32]].forEach(([x, z]) => addMesh(world, new THREE.CylinderGeometry(4.15, 4.15, .09, 32), materials.road, [x, .62, z], [0, 0, 0], false));

  function makeCanvasSprite(lines, accent = "#f07b4a", scale = [6.4, 1.6]) {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 1024;
    labelCanvas.height = 256;
    const context = labelCanvas.getContext("2d");
    context.shadowColor = "rgba(35, 45, 43, .25)";
    context.shadowBlur = 24;
    context.fillStyle = "rgba(255, 247, 226, .96)";
    context.fillRect(22, 24, 980, 208);
    context.shadowBlur = 0;
    context.fillStyle = accent;
    context.fillRect(22, 24, 22, 208);
    context.fillStyle = "#243238";
    context.font = "700 29px monospace";
    context.fillText(lines[0], 78, 87);
    context.font = "700 52px sans-serif";
    context.fillText(lines[1], 78, 169);
    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
    sprite.scale.set(scale[0], scale[1], 1);
    return sprite;
  }

  const districtSigns = [];
  function makeDistrictSign(title, subtitle, x, z, color) {
    const sign = makeCanvasSprite([subtitle, title], color, [7.8, 1.95]);
    sign.position.set(x, 5.8, z);
    world.add(sign);
    districtSigns.push(sign);
    [-3.6, 3.6].forEach((offset) => addMesh(world, new THREE.CylinderGeometry(.08, .11, 4.5, 8), materials.dark, [x + offset, 2.7, z]));
  }
  makeDistrictSign("வணக்கம், சென்னை", "VANAKKAM, CHENNAI", -40, 38, "#ef6c35");
  makeDistrictSign("MIT CHROMEPET", "குரோம்பேட்டை · CAMPUS ROAD", -26, 31, "#a94432");
  makeDistrictSign("SYSTEMS BAZAAR", "DATA · IDENTITY · COMPUTE", 23, 20, "#138a64");
  makeDistrictSign("MARINA DATA COAST", "OPEN SIGNAL →", 39, -17, "#2396b7");

  let randomSeed = 93017;
  function random() {
    randomSeed = (randomSeed * 16807) % 2147483647;
    return (randomSeed - 1) / 2147483646;
  }

  function addTree(x, z, scale = 1) {
    const tree = new THREE.Group();
    tree.position.set(x, .58, z);
    addMesh(tree, new THREE.CylinderGeometry(.12 * scale, .2 * scale, 2.45 * scale, 7), new THREE.MeshStandardMaterial({ color: 0x83583b, roughness: .96 }), [0, 1.22 * scale, 0], [0, 0, (random() - .5) * .12]);
    for (let leaf = 0; leaf < 7; leaf += 1) {
      const angle = leaf / 7 * Math.PI * 2;
      const frond = addMesh(tree, new THREE.ConeGeometry(.34 * scale, 1.9 * scale, 5), leaf % 2 ? materials.grassDark : materials.lime, [Math.cos(angle) * .55 * scale, 2.65 * scale, Math.sin(angle) * .55 * scale], [Math.PI / 2.6, 0, -angle], false);
      frond.rotation.y = angle;
    }
    world.add(tree);
  }

  for (let index = 0; index < 58; index += 1) {
    const x = -47 + random() * 89;
    const z = -36 + random() * 72;
    if (entries.every((entry) => Math.hypot(entry.x - x, entry.z - z) > 5.8)) addTree(x, z, .58 + random() * .62);
  }

  function addCityBlock(x, z, width, depth, height, colorMaterial = materials.cream) {
    const block = new THREE.Group();
    block.position.set(x, .58, z);
    const floorCount = Math.max(2, Math.floor(height / 1.42));
    addMesh(block, new THREE.BoxGeometry(width, height, depth), colorMaterial, [0, height / 2, 0]);
    addMesh(block, new THREE.BoxGeometry(width + .16, .26, depth + .16), materials.concrete, [0, .16, 0]);
    addMesh(block, new THREE.BoxGeometry(width + .18, .18, depth + .18), materials.oxide, [0, height + .09, 0]);
    addMesh(block, new THREE.BoxGeometry(width + .12, .52, .16), materials.concrete, [0, height + .28, -depth / 2 + .08]);
    if (height > 2.8) {
      addMesh(block, new THREE.CylinderGeometry(.46, .5, .62, 12), random() > .5 ? materials.blue : materials.dark, [width * .22, height + .4, 0]);
      addMesh(block, new THREE.CylinderGeometry(.045, .06, 1.35, 7), materials.dark, [-width * .28, height + .74, depth * .12]);
    }
    const windows = Math.max(2, Math.floor(width / .92));
    for (let floor = 0; floor < floorCount; floor += 1) {
      const windowY = Math.min(height - .52, .82 + floor * 1.32);
      for (let index = 0; index < windows; index += 1) {
        const wx = -width / 2 + .52 + index * ((width - 1.04) / Math.max(windows - 1, 1));
        const window = addMesh(block, new THREE.BoxGeometry(.38, .56, .055), materials.glass, [wx, windowY, -depth / 2 - .035], [0, 0, 0], false);
        if ((index + floor) % 4 === 0) window.material = materials.dark;
      }
      if (floor > 0 && floor % 2 === 1 && width > 4.8) {
        const balconyX = floor % 4 === 1 ? -width * .2 : width * .2;
        addMesh(block, new THREE.BoxGeometry(width * .42, .1, .65), materials.concrete, [balconyX, windowY - .42, -depth / 2 - .31]);
        addMesh(block, new THREE.BoxGeometry(width * .42, .42, .045), materials.dark, [balconyX, windowY - .2, -depth / 2 - .64], [0, 0, 0], false);
      }
    }
    const sideRows = Math.max(1, Math.floor(depth / 1.25));
    for (let index = 0; index < sideRows; index += 1) {
      const wz = -depth / 2 + .62 + index * ((depth - 1.24) / Math.max(sideRows - 1, 1));
      addMesh(block, new THREE.BoxGeometry(.055, .52, .38), materials.glass, [width / 2 + .035, Math.min(height - .6, 1.35), wz], [0, 0, 0], false);
    }
    if (width > 4.4) {
      addMesh(block, new THREE.BoxGeometry(.58, .42, .26), materials.concrete, [-width * .3, Math.min(height - .6, 2.1), -depth / 2 - .18]);
      addMesh(block, new THREE.BoxGeometry(.42, .025, .3), materials.dark, [-width * .3, Math.min(height - .36, 2.34), -depth / 2 - .19], [Math.PI / 2, 0, 0], false);
    }
    world.add(block);
    staticColliders.push({ x, z, halfX: width / 2 + .72, halfZ: depth / 2 + .72 });
    addCameraBlocker(x, z, width + .3, depth + .3, height + .35);
  }

  [
    [-46, 17, 5, 4, 5.2], [-40, 12, 6, 4, 6.4], [-34, 7, 4.8, 4, 5.6], [-23, 30, 7, 4, 6.5],
    [-14, 25, 5, 5, 5.2], [-5, 26, 7, 4, 7], [5, 26, 5, 5, 5.8], [15, 27, 6, 4, 6.6],
    [30, 28, 7, 4, 6.2], [39, 24, 4, 5, 7.4], [-5, -19, 6, 4, 5.6], [6, -20, 5, 5, 6.4],
    [14, -28, 6, 4, 5.8], [22, -32, 5, 4, 6.7], [-40, -9, 6, 5, 6.2], [-38, -20, 5, 4, 5.4]
  ].forEach(([x, z, width, depth, height], index) => addCityBlock(x, z, width, depth, height, index % 3 === 0 ? materials.concrete : index % 3 === 1 ? materials.cream : materials.pink));

  function addDistantBlock(x, z, width, depth, height, material, rotation = 0) {
    const block = new THREE.Group();
    block.position.set(x, .58, z);
    block.rotation.y = rotation;
    addMesh(block, new THREE.BoxGeometry(width, height, depth), material, [0, height / 2, 0], [0, 0, 0], false);
    addMesh(block, new THREE.BoxGeometry(width + .1, .18, depth + .1), materials.concrete, [0, height + .08, 0], [0, 0, 0], false);
    const floors = Math.max(2, Math.floor(height / 1.25));
    const columns = Math.max(2, Math.floor(width / 1.1));
    for (let floor = 0; floor < floors; floor += 1) {
      for (let column = 0; column < columns; column += 1) {
        const wx = -width / 2 + .55 + column * ((width - 1.1) / Math.max(columns - 1, 1));
        const lit = (floor * 3 + column * 5 + Math.round(x)) % 7 === 0;
        const windowMaterial = lit ? new THREE.MeshStandardMaterial({ color: 0xf4c47b, emissive: 0xff9f42, emissiveIntensity: .65, roughness: .5 }) : materials.glass;
        addMesh(block, new THREE.BoxGeometry(.34, .46, .035), windowMaterial, [wx, .78 + floor * 1.18, -depth / 2 - .025], [0, 0, 0], false);
      }
    }
    if (height > 6) addMesh(block, new THREE.CylinderGeometry(.42, .46, .58, 12), materials.dark, [width * .18, height + .38, 0], [0, 0, 0], false);
    world.add(block);
  }

  for (let index = 0; index < 11; index += 1) {
    const width = 4.4 + (index % 3) * 1.1;
    addDistantBlock(-49 + index * 9.5, -44 - (index % 2) * 2.2, width, 5.2, 4.2 + (index % 4) * .58, [materials.concrete, materials.cream, materials.oxide][index % 3], (index % 3 - 1) * .05);
  }
  for (let index = 0; index < 7; index += 1) {
    addDistantBlock(-55 - (index % 2) * 2, 28 - index * 10.5, 5.2, 5.6, 4.4 + (index % 4) * .68, index % 2 ? materials.cream : materials.pink, Math.PI / 2);
  }

  function addStreetLight(x, z, rotation = 0, powered = false) {
    const lamp = new THREE.Group();
    lamp.position.set(x, .58, z);
    lamp.rotation.y = rotation;
    addMesh(lamp, new THREE.CylinderGeometry(.055, .085, 4.45, 8), materials.dark, [0, 2.22, 0]);
    addMesh(lamp, new THREE.BoxGeometry(1.22, .065, .07), materials.dark, [.55, 4.36, 0]);
    const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0xffd594, emissive: 0xff9d3f, emissiveIntensity: 2.8, roughness: .3 });
    addMesh(lamp, new THREE.BoxGeometry(.34, .12, .22), bulbMaterial, [1.1, 4.27, 0], [0, 0, -.12], false);
    if (powered && !touchDevice) {
      const glow = new THREE.PointLight(0xffb766, 4.5, 11, 2.2);
      glow.position.set(1.1, 4.1, 0);
      lamp.add(glow);
    }
    world.add(lamp);
  }

  [
    [-45, 31, -.7], [-37, 26, -.7], [-29, 20, -.7], [-20, 11, -.9], [-9, 2, 1.25],
    [3, 5, -.45], [11, 8, -.15], [21, 10, .6], [28, 1, 1.15], [31, -10, 1.8],
    [26, -19, 1.1], [35, -24, 1.65], [41, -29, 1.65], [7, -8, 1.45], [-10, -13, 1.45]
  ].forEach(([x, z, rotation], index) => addStreetLight(x, z, rotation, index % 4 === 0));

  function addPedestrian(x, z, shirtMaterial, rotation = 0, scale = 1) {
    const person = new THREE.Group();
    person.position.set(x, .6, z);
    person.rotation.y = rotation;
    addMesh(person, new THREE.CapsuleGeometry(.16 * scale, .62 * scale, 5, 9), shirtMaterial, [0, 1.15 * scale, 0]);
    addMesh(person, new THREE.SphereGeometry(.19 * scale, 12, 9), new THREE.MeshStandardMaterial({ color: 0x875b45, roughness: .88 }), [0, 1.77 * scale, 0]);
    [-.1, .1].forEach((side) => addMesh(person, new THREE.CapsuleGeometry(.055 * scale, .48 * scale, 4, 7), materials.dark, [side * scale, .48 * scale, 0], [0, 0, side * .07]));
    world.add(person);
    return person;
  }

  const pedestrians = [
    [-47, 32.8, materials.orange, .7], [-44.5, 33, materials.cream, -.8], [-40.5, 32.4, materials.blue, 1.1],
    [-28.5, 26.8, materials.pink, -.5], [-17.8, 7.2, materials.cream, 2.4], [-3.2, 7.5, materials.orange, 2.8],
    [8.8, 9.4, materials.blue, -1.1], [19.2, 14.1, materials.cream, .4], [30.4, -13.2, materials.lime, 1.7],
    [38.2, -27.6, materials.orange, -.7], [42.2, -26.8, materials.cream, .5]
  ].map(([x, z, material, rotation], index) => ({ person: addPedestrian(x, z, material, rotation, .92 + index % 3 * .04), phase: index * .73 }));

  for (let index = 0; index < 18; index += 1) {
    const x = -45 + index * 5.1;
    addMesh(world, new THREE.CylinderGeometry(.06, .08, 4.2, 6), materials.dark, [x, 2.6, 36], [0, 0, 0], false);
    addMesh(world, new THREE.BoxGeometry(4.7, .08, .12), materials.dark, [x + 2.5, 4.4, 36], [0, 0, 0], false);
  }

  const rail = new THREE.Group();
  rail.position.set(0, 0, 0);
  addMesh(rail, new THREE.BoxGeometry(101, .18, .18), materials.dark, [0, 1.52, 35.55], [0, 0, 0], false);
  addMesh(rail, new THREE.BoxGeometry(101, .18, .18), materials.dark, [0, 1.52, 36.45], [0, 0, 0], false);
  for (let x = -48; x <= 48; x += 2.2) addMesh(rail, new THREE.BoxGeometry(.16, .12, 1.25), materials.concrete, [x, 1.42, 36], [0, 0, 0], false);
  for (let x = -47; x <= 47; x += 7) addMesh(rail, new THREE.BoxGeometry(.55, 2.2, .55), materials.concrete, [x, .55, 36]);
  world.add(rail);

  const station = new THREE.Group();
  station.position.set(-43, .58, 35.1);
  addMesh(station, new THREE.BoxGeometry(13, .32, 3.2), materials.concrete, [0, 1.02, 0]);
  const stationRoof = addMesh(station, new THREE.BoxGeometry(10, .16, 3.8), materials.oxide, [0, 4.25, 0]);
  stationRoof.visible = !touchDevice;
  [-4.2, 0, 4.2].forEach((x) => addMesh(station, new THREE.BoxGeometry(.2, 3.1, .2), materials.dark, [x, 2.65, 0]));
  const stationBoard = makeCanvasSprite(["குரோம்பேட்டை", "CHROMEPET"], "#138a64", [7.4, 1.75]);
  stationBoard.position.set(0, 5.25, -1.2);
  station.add(stationBoard);
  districtSigns.push(stationBoard);
  world.add(station);
  staticColliders.push({ x: -43, z: 35.1, halfX: 6.85, halfZ: 2.15 });
  addCameraBlocker(-43, 35.1, 13.2, 3.5, 4.65);

  const train = new THREE.Group();
  for (let carIndex = 0; carIndex < 3; carIndex += 1) {
    const car = new THREE.Group();
    car.position.x = carIndex * 5.4;
    addMesh(car, new THREE.BoxGeometry(5, 2.2, 2), materials.cream, [0, 2.82, 36]);
    addMesh(car, new THREE.BoxGeometry(5.08, .42, 2.04), materials.lime, [0, 2.03, 36]);
    [-1.55, -.52, .52, 1.55].forEach((x) => addMesh(car, new THREE.BoxGeometry(.7, .58, .04), materials.glass, [x, 3.05, 34.98], [0, 0, 0], false));
    train.add(car);
  }
  world.add(train);

  const flyover = new THREE.Group();
  flyover.position.set(-34, .58, 31);
  flyover.rotation.y = -.55;
  addCameraBlocker(-34, 31, 18.2, 4.35, 4.9, -.55);
  addMesh(flyover, new THREE.BoxGeometry(18, .55, 4.1), materials.concrete, [0, 4.3, 0]);
  addMesh(flyover, new THREE.BoxGeometry(18, .12, 3.1), materials.road, [0, 4.62, 0], [0, 0, 0], false);
  [-6.5, 0, 6.5].forEach((x) => addMesh(flyover, new THREE.BoxGeometry(.7, 4.1, 1.1), materials.concrete, [x, 2.05, 0]));
  world.add(flyover);

  function addTeaStall(x, z, rotation = 0) {
    const stall = new THREE.Group();
    stall.position.set(x, .58, z);
    stall.rotation.y = rotation;
    addMesh(stall, new THREE.BoxGeometry(3, 1.6, 1.7), materials.oxide, [0, .8, 0]);
    addMesh(stall, new THREE.BoxGeometry(3.45, .18, 2.15), materials.yellow, [0, 1.72, 0]);
    addMesh(stall, new THREE.CylinderGeometry(.18, .18, .55, 12), materials.cream, [-.65, 1.92, -.15]);
    addMesh(stall, new THREE.TorusGeometry(.12, .035, 6, 16, Math.PI * 1.55), materials.dark, [-.45, 2.02, -.15], [Math.PI / 2, 0, 0], false);
    world.add(stall);
  }
  addTeaStall(-31, 13, -.4);
  addTeaStall(14, 4, .2);
  addTeaStall(37, -27, -.6);

  function addGpuCrate(x, z, scale = 1, material = materials.dark) {
    const crate = new THREE.Group();
    crate.position.set(x, .58, z);
    addMesh(crate, new THREE.BoxGeometry(1.7 * scale, .95 * scale, 1.35 * scale), material, [0, .5 * scale, 0]);
    for (let fin = -3; fin <= 3; fin += 1) addMesh(crate, new THREE.BoxGeometry(.08 * scale, .78 * scale, 1.46 * scale), materials.orange, [fin * .22 * scale, .55 * scale, 0]);
    world.add(crate);
  }
  [[18, 8, .8], [20, 6, .65], [24, -5, .8], [27, -7, .72], [32, -12, .9], [30, -24, .65]].forEach(([x, z, scale], index) => addGpuCrate(x, z, scale, index % 2 ? materials.blue : materials.dark));

  const trafficCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-42, .58, 29), new THREE.Vector3(-28, .58, 18), new THREE.Vector3(-12, .58, 0),
    new THREE.Vector3(0, .58, 6), new THREE.Vector3(13, .58, 10), new THREE.Vector3(27, .58, 2),
    new THREE.Vector3(31, .58, -8), new THREE.Vector3(35, .58, -24), new THREE.Vector3(10, .58, -8),
    new THREE.Vector3(-14, .58, -13), new THREE.Vector3(-20, .58, 8)
  ], true, "catmullrom", .18);
  const trafficVehicles = [];
  function addTrafficAuto(color, offset, speed) {
    const auto = new THREE.Group();
    addMesh(auto, new THREE.BoxGeometry(1.15, .55, 1.6), color, [0, .58, 0]);
    addMesh(auto, new THREE.BoxGeometry(1.08, .72, .85), materials.yellow, [0, 1.12, .2]);
    addMesh(auto, new THREE.BoxGeometry(.98, .42, .04), materials.glass, [0, 1.2, -.23], [-.08, 0, 0], false);
    [-.52, .52].forEach((x) => addMesh(auto, new THREE.CylinderGeometry(.22, .22, .18, 12), materials.tire, [x, .38, .48], [0, 0, Math.PI / 2]));
    addMesh(auto, new THREE.CylinderGeometry(.22, .22, .18, 12), materials.tire, [0, .38, -.68], [0, 0, Math.PI / 2]);
    world.add(auto);
    trafficVehicles.push({ auto, offset, speed });
  }
  addTrafficAuto(materials.lime, .08, .018);
  addTrafficAuto(materials.oxide, .53, .014);

  function addTrafficCar(color, offset, speed, scale = .78) {
    const car = new THREE.Group();
    addMesh(car, roundedBoxGeometry(1.55 * scale, .42 * scale, 2.65 * scale, .13), color, [0, .64, 0]);
    addMesh(car, roundedBoxGeometry(1.35 * scale, .56 * scale, 1.28 * scale, .11), materials.dark, [0, .98, .12]);
    addMesh(car, new THREE.BoxGeometry(1.18 * scale, .36 * scale, .035), materials.glass, [0, 1.02, -.54 * scale], [-.1, 0, 0], false);
    [-.74, .74].forEach((x) => [-.78, .8].forEach((z) => addMesh(car, new THREE.CylinderGeometry(.25 * scale, .25 * scale, .18 * scale, 16), materials.tire, [x * scale, .5, z * scale], [0, 0, Math.PI / 2])));
    world.add(car);
    trafficVehicles.push({ auto: car, offset, speed });
  }
  addTrafficCar(materials.blue, .22, .016, .82);
  addTrafficCar(materials.cream, .37, .012, .74);
  addTrafficCar(materials.orange, .71, .019, .8);
  addTrafficCar(materials.dark, .86, .013, .76);

  const clouds = [];
  function addCloud(x, y, z, scale) {
    const cloud = new THREE.Group();
    [[0, 0, 0, 1.3], [1.15, .2, .1, .95], [-1.05, .08, .2, 1], [.15, .45, .15, .9]].forEach(([cx, cy, cz, size]) => {
      addMesh(cloud, new THREE.IcosahedronGeometry(size, 1), materials.white, [cx, cy, cz], [0, 0, 0], false);
    });
    cloud.position.set(x, y, z);
    cloud.scale.setScalar(scale);
    scene.add(cloud);
    clouds.push({ cloud, startX: x, speed: .28 + random() * .22 });
  }
  if (!cityBackdrop) {
    addCloud(-25, 20, -35, 1.7);
    addCloud(13, 24, -48, 1.3);
    addCloud(38, 18, -10, 1.8);
    addCloud(-42, 17, 15, 1.15);
  }

  const rampZones = [[-23, 14], [12, -4], [37, -26]];
  rampZones.forEach(([x, z], index) => {
    const ramp = addMesh(world, new THREE.BoxGeometry(3.4, .45, 4.4), index === 1 ? materials.blue : materials.orange, [x, .95, z], [-.17, index * .35, 0]);
    addMesh(ramp, new THREE.BoxGeometry(2.6, .06, .32), materials.cream, [0, .27, -.8], [0, 0, 0], false);
    addMesh(ramp, new THREE.BoxGeometry(2.6, .06, .32), materials.cream, [0, .27, .3], [0, 0, 0], false);
  });

  const missionVisuals = new Map();
  const missionMaterials = {
    sensor: materials.blue, signal: materials.pink, gpu: materials.orange, ring: materials.yellow,
    semantic: materials.purple, crate: materials.oxide, data: materials.cream, manifest: materials.lime,
    credential: materials.yellow, route: materials.blue, cloud: materials.cream, evidence: materials.orange
  };
  missions.forEach((mission) => {
    mission.items.forEach((item) => {
      const group = new THREE.Group();
      group.position.set(item.x, .78, item.z);
      const material = missionMaterials[item.kind] ?? materials.orange;
      const animated = [];
      const aura = addMesh(group, new THREE.TorusGeometry(1.2, .075, 8, 44), new THREE.MeshBasicMaterial({ color: material.color, transparent: true, opacity: .82 }), [0, .15, 0], [Math.PI / 2, 0, 0], false);
      animated.push(aura);
      if (item.kind === "ring") {
        const gate = addMesh(group, new THREE.TorusGeometry(1.4, .16, 10, 48), material, [0, 1.55, 0], [0, 0, 0]);
        addMesh(group, new THREE.BoxGeometry(.18, 3.1, .18), materials.dark, [-1.55, 1.55, 0]);
        addMesh(group, new THREE.BoxGeometry(.18, 3.1, .18), materials.dark, [1.55, 1.55, 0]);
        animated.push(gate);
      } else if (["gpu", "manifest", "crate", "data"].includes(item.kind)) {
        const core = addMesh(group, new THREE.BoxGeometry(1.18, .82, 1.04), material, [0, 1.05, 0], [.12, .2, .05]);
        for (let fin = -2; fin <= 2; fin += 1) addMesh(group, new THREE.BoxGeometry(.07, .7, 1.14), materials.dark, [fin * .2, 1.08, 0]);
        animated.push(core);
      } else if (item.kind === "credential") {
        const key = addMesh(group, new THREE.TorusGeometry(.52, .14, 8, 28), material, [0, 1.25, 0], [Math.PI / 2, 0, 0]);
        addMesh(group, new THREE.BoxGeometry(.25, .25, 1.35), material, [0, 1.25, .85]);
        animated.push(key);
      } else if (item.kind === "cloud") {
        [[0, 1.2, 0, .68], [-.62, 1.1, 0, .48], [.62, 1.12, .05, .5], [.12, 1.62, 0, .48]].forEach(([x, y, z, scale]) => animated.push(addMesh(group, new THREE.IcosahedronGeometry(scale, 1), material, [x, y, z])));
      } else if (item.kind === "evidence") {
        const capsule = addMesh(group, new THREE.CylinderGeometry(.46, .46, 1.35, 10), material, [0, 1.15, 0]);
        addMesh(group, new THREE.SphereGeometry(.46, 10, 7), materials.cream, [0, 1.82, 0]);
        animated.push(capsule);
      } else {
        const orb = addMesh(group, new THREE.IcosahedronGeometry(.72, 1), material, [0, 1.25, 0]);
        const orbit = addMesh(group, new THREE.TorusGeometry(1.08, .06, 8, 42), materials.cream, [0, 1.25, 0], [.55, .2, 0], false);
        animated.push(orb, orbit);
      }
      const label = makeCanvasSprite([`CHAPTER ${mission.number}`, item.label], `#${material.color.getHexString()}`, [5.2, 1.28]);
      label.position.set(0, 3.55, 0);
      group.add(label);
      world.add(group);
      missionVisuals.set(item.id, { group, aura, animated, label, missionId: mission.id, item });
    });
  });

  function entryMaterials(entry) {
    const accent = new THREE.MeshStandardMaterial({ color: entry.color, roughness: .46, metalness: .08, emissive: entry.color, emissiveIntensity: .08 });
    return { accent, cream: materials.cream, dark: materials.dark, blue: materials.blue, glass: materials.glass };
  }

  const landmarkVisuals = new Map();
  entries.forEach((entry) => {
    const group = new THREE.Group();
    group.position.set(entry.x, .62, entry.z);
    const mat = entryMaterials(entry);
    const animated = [];
    const padMaterial = entry.type === "education" ? materials.oxide : entry.type === "project" ? materials.concrete : mat.cream;
    const pad = addMesh(group, new THREE.CylinderGeometry(3.05, 3.35, .18, 16), padMaterial, [0, .09, 0]);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: entry.color, transparent: true, opacity: .46 });
    const ring = addMesh(group, new THREE.TorusGeometry(2.72, .09, 8, 56), ringMaterial, [0, .32, 0], [Math.PI / 2, 0, 0], false);
    const beamMaterial = new THREE.MeshBasicMaterial({ color: entry.color, transparent: true, opacity: .012, depthWrite: false, side: THREE.DoubleSide });
    const beam = addMesh(group, new THREE.CylinderGeometry(1.45, 2.25, 9, 20, 1, true), beamMaterial, [0, 4.5, 0], [0, 0, 0], false);

    if (entry.id === "profile") {
      addMesh(group, new THREE.BoxGeometry(4.7, 2.5, 2.4), materials.oxide, [0, 1.52, .25]);
      addMesh(group, new THREE.BoxGeometry(5.25, .26, 2.9), materials.yellow, [0, 2.9, .25]);
      const core = addMesh(group, new THREE.IcosahedronGeometry(.75, 2), mat.accent, [0, 3.8, -.05]);
      const orbit = addMesh(group, new THREE.TorusGeometry(1.3, .055, 8, 64), materials.dark, [0, 3.8, -.05], [.72, .25, 0]);
      animated.push(core, orbit);
      [-1.5, 0, 1.5].forEach((x) => addMesh(group, new THREE.BoxGeometry(.78, 1.2, .12), materials.glass, [x, 1.45, -1.02]));
    } else if (entry.id === "scania-data") {
      [-1.3, 0, 1.3].forEach((x, index) => {
        addMesh(group, new THREE.CylinderGeometry(.62, .78, 2.3 + index * .65, 10), index === 1 ? mat.accent : mat.blue, [x, 1.45 + index * .32, 0]);
        const disk = addMesh(group, new THREE.TorusGeometry(.75, .08, 6, 32), materials.cream, [x, 2.5 + index * .64, 0], [Math.PI / 2, 0, 0]);
        animated.push(disk);
      });
    } else if (entry.id === "scania-automation") {
      addMesh(group, new THREE.BoxGeometry(4.6, 2.45, 3.4), materials.dark, [0, 1.5, .2]);
      [-1.45, 0, 1.45].forEach((x) => addMesh(group, new THREE.ConeGeometry(1.1, 1.2, 4), mat.accent, [x, 3.24, .2], [0, Math.PI / 4, 0]));
      const gear = addMesh(group, new THREE.TorusGeometry(1.12, .2, 8, 20), materials.orange, [0, 2.05, -1.75]);
      animated.push(gear);
    } else if (entry.id === "ericsson") {
      addMesh(group, new THREE.CylinderGeometry(.18, .5, 5.3, 8), materials.dark, [0, 2.8, 0]);
      [1.8, 2.8, 3.8].forEach((y, index) => {
        const signal = addMesh(group, new THREE.TorusGeometry(.7 + index * .42, .075, 8, 48, Math.PI * 1.55), mat.accent, [0, y, 0], [Math.PI / 2, 0, -.8]);
        animated.push(signal);
      });
      addMesh(group, new THREE.SphereGeometry(.38, 12, 8), materials.orange, [0, 5.55, 0]);
    } else if (entry.id === "agnikul") {
      addMesh(group, new THREE.CylinderGeometry(.82, .9, .35, 12), materials.dark, [0, .52, 0]);
      const rocket = new THREE.Group();
      addMesh(rocket, new THREE.CylinderGeometry(.42, .52, 4.1, 12), materials.cream, [0, 2.45, 0]);
      addMesh(rocket, new THREE.ConeGeometry(.43, 1.35, 12), materials.orange, [0, 5.15, 0]);
      [-1, 1].forEach((side) => addMesh(rocket, new THREE.ConeGeometry(.5, 1.2, 3), materials.blue, [side * .52, .85, 0], [0, 0, side * -.42]));
      group.add(rocket);
      animated.push(rocket);
    } else if (entry.id === "dataset-integrity") {
      [-.95, 0, .95].forEach((x, index) => addMesh(group, new THREE.CylinderGeometry(.72, .82, 2.2 + index * .4, 12), index === 1 ? materials.orange : mat.accent, [x, 1.5 + index * .2, 0]));
      const checksum = addMesh(group, new THREE.BoxGeometry(1.05, 1.05, 1.05), materials.cream, [0, 3.7, 0], [.2, .3, .1]);
      const orbit = addMesh(group, new THREE.TorusGeometry(1.7, .065, 8, 56), materials.dark, [0, 3.7, 0], [.7, .2, 0]);
      animated.push(checksum, orbit);
    } else if (entry.id === "flyte-skypilot") {
      addMesh(group, new THREE.CylinderGeometry(.12, .18, 4.2, 8), materials.dark, [-1.65, 2.2, .5]);
      addMesh(group, new THREE.CylinderGeometry(.12, .18, 4.2, 8), materials.dark, [1.65, 2.2, .5]);
      const aircraft = new THREE.Group();
      addMesh(aircraft, new THREE.BoxGeometry(.48, .36, 3.15), materials.orange, [0, 3.5, 0]);
      addMesh(aircraft, new THREE.BoxGeometry(3.25, .12, .7), materials.cream, [0, 3.5, .15]);
      addMesh(aircraft, new THREE.BoxGeometry(1.25, .12, .45), materials.blue, [0, 3.72, 1.25], [.22, 0, 0]);
      group.add(aircraft);
      animated.push(aircraft);
    } else if (entry.id === "spark-gpu") {
      const chip = addMesh(group, new THREE.BoxGeometry(4.1, 3.15, .62), materials.dark, [0, 2.05, 0]);
      addMesh(group, new THREE.BoxGeometry(2.25, 1.55, .7), mat.accent, [0, 2.05, -.2]);
      for (let index = -3; index <= 3; index += 1) {
        addMesh(group, new THREE.BoxGeometry(.13, .5, .15), materials.orange, [index * .52, .35, 0]);
        addMesh(group, new THREE.BoxGeometry(.13, .5, .15), materials.orange, [index * .52, 3.75, 0]);
      }
      animated.push(chip);
    } else if (entry.id === "credentials") {
      addMesh(group, new THREE.BoxGeometry(4.5, 3.5, 3.2), materials.dark, [0, 2, .25]);
      const door = addMesh(group, new THREE.CylinderGeometry(1.25, 1.25, .3, 20), mat.accent, [0, 2, -1.5], [Math.PI / 2, 0, 0]);
      const lock = addMesh(group, new THREE.TorusGeometry(.46, .14, 8, 30, Math.PI), materials.cream, [0, 2.15, -1.72]);
      addMesh(group, new THREE.BoxGeometry(.55, .78, .28), materials.cream, [0, 1.72, -1.72]);
      animated.push(door, lock);
    } else if (entry.id === "modal-gpu") {
      addMesh(group, new THREE.CylinderGeometry(.75, 1.1, 3.3, 10), materials.blue, [0, 1.9, 0]);
      [[0, 4.2, 0, 1], [-1, 4, .1, .75], [1, 4.05, .2, .8], [.3, 4.65, .1, .7]].forEach(([x, y, z, size]) => addMesh(group, new THREE.IcosahedronGeometry(size, 1), materials.cream, [x, y, z]));
      for (let index = 0; index < 4; index += 1) {
        const cube = addMesh(group, new THREE.BoxGeometry(.38, .38, .38), mat.accent, [Math.sin(index) * .8, 1 + index * .82, -.7]);
        animated.push(cube);
      }
    } else if (entry.id === "experiment-index") {
      [-1.7, 0, 1.7].forEach((x, index) => {
        addMesh(group, new THREE.CylinderGeometry(.55, .72, 1.25 + index * .5, 8), [materials.blue, mat.accent, materials.orange][index], [x, 1 + index * .25, 0]);
      });
      const pipeline = addMesh(group, new THREE.TorusGeometry(2.1, .12, 8, 48, Math.PI), materials.dark, [0, 2.55, 0]);
      animated.push(pipeline);
    } else if (entry.id === "kth") {
      addMesh(group, new THREE.BoxGeometry(5.1, 2.25, 3.4), materials.cream, [0, 1.45, .2]);
      for (let x = -1.7; x <= 1.7; x += .85) addMesh(group, new THREE.CylinderGeometry(.12, .12, 1.8, 8), mat.accent, [x, 1.35, -1.62]);
      addMesh(group, new THREE.ConeGeometry(2.2, 1.25, 4), materials.purple, [0, 3.2, .2], [0, Math.PI / 4, 0]);
    } else if (entry.id === "anna") {
      addMesh(group, new THREE.BoxGeometry(5.2, 2.65, 3.15), materials.cream, [0, 1.52, .2]);
      addMesh(group, new THREE.BoxGeometry(5.65, .22, 3.6), materials.oxide, [0, 2.95, .2]);
      [-1.75, -.88, 0, .88, 1.75].forEach((x) => addMesh(group, new THREE.BoxGeometry(.18, 1.7, .22), materials.oxide, [x, 1.5, -1.48]));
      const antenna = addMesh(group, new THREE.CylinderGeometry(.07, .11, 2.8, 7), materials.dark, [1.85, 4.2, .25]);
      const signal = addMesh(group, new THREE.TorusGeometry(.72, .06, 8, 32, Math.PI), mat.accent, [1.85, 4.55, .25], [0, 0, Math.PI / 2]);
      animated.push(antenna, signal);
    } else if (entry.id === "toolkit") {
      addMesh(group, new THREE.BoxGeometry(4.8, 2.2, 3.6), materials.dark, [0, 1.35, .2]);
      addMesh(group, new THREE.BoxGeometry(5.2, .24, 4), materials.yellow, [0, 2.58, .2]);
      const hub = addMesh(group, new THREE.BoxGeometry(1.6, .72, 1.25), materials.orange, [0, 1.25, -1.72]);
      for (let index = -3; index <= 3; index += 1) addMesh(hub, new THREE.BoxGeometry(.07, .55, 1.34), materials.dark, [index * .19, 0, 0]);
      [-1.5, 1.5].forEach((x) => {
        const sensor = addMesh(group, new THREE.IcosahedronGeometry(.48, 1), x < 0 ? materials.blue : mat.accent, [x, 3.25, 0]);
        animated.push(sensor);
      });
      animated.push(hub);
    } else if (entry.id === "contact") {
      addMesh(group, new THREE.CylinderGeometry(1.15, 1.6, 4.8, 12), materials.cream, [0, 2.55, 0]);
      addMesh(group, new THREE.CylinderGeometry(1.45, 1.45, .72, 12), materials.oxide, [0, 5.25, 0]);
      addMesh(group, new THREE.CylinderGeometry(.95, 1.22, .72, 12), materials.glass, [0, 5.95, 0]);
      const beacon = addMesh(group, new THREE.ConeGeometry(.38, 16, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xffd66b, transparent: true, opacity: .2, depthWrite: false, side: THREE.DoubleSide }), [7.5, 6.1, 0], [0, 0, -Math.PI / 2], false);
      beacon.visible = false;
      animated.push(beacon);
    } else {
      addMesh(group, new THREE.CylinderGeometry(.18, .5, 5.1, 8), materials.dark, [0, 2.75, 0]);
      [2.15, 3.1, 4.05].forEach((y, index) => {
        const signal = addMesh(group, new THREE.TorusGeometry(.8 + index * .48, .075, 8, 48, Math.PI), index === 2 ? materials.orange : mat.accent, [0, y, 0], [0, 0, Math.PI / 2]);
        animated.push(signal);
      });
      addMesh(group, new THREE.SphereGeometry(.34, 12, 8), materials.cream, [0, 5.45, 0]);
    }

    const accentHex = `#${entry.color.toString(16).padStart(6, "0")}`;
    const labelText = entry.label.length > 27 ? `${entry.label.slice(0, 27)}…` : entry.label;
    const label = makeCanvasSprite([`${String(entry.index).padStart(2, "0")} · ${entry.type.toUpperCase()}`, labelText], accentHex);
    label.position.set(0, entry.id === "agnikul" ? 8.3 : 6.6, 0);
    group.add(label);
    world.add(group);
    const blocker = addCameraBlocker(entry.x, entry.z, entry.id === "agnikul" ? 5.8 : 4.8, entry.id === "agnikul" ? 5.8 : 4.8, entry.id === "agnikul" ? 9.2 : 7.2);
    landmarkVisuals.set(entry.id, { group, ring, beam, label, animated, pad, blocker });
  });

  const signalSegments = missions.map((mission, index) => {
    const from = entryById(mission.targetId);
    const to = index < missions.length - 1 ? entryById(missions[index + 1].targetId) : { x: 49, z: -30 };
    const middle = new THREE.Vector3((from.x + to.x) / 2, 1.05 + index * .08, (from.z + to.z) / 2);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(from.x, .82, from.z), middle, new THREE.Vector3(to.x, .82, to.z)
    ]);
    const material = new THREE.MeshStandardMaterial({ color: index % 2 ? 0x2fa66f : 0xef6c35, emissive: index % 2 ? 0x2fa66f : 0xef6c35, emissiveIntensity: .5, transparent: true, opacity: .08 });
    const mesh = addMesh(world, new THREE.TubeGeometry(curve, 36, .085, 7, false), material, [0, 0, 0], [0, 0, 0], false);
    return mesh;
  });

  const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xf45b38, transparent: true, opacity: .46, depthWrite: false });
  const targetBeam = addMesh(world, new THREE.CylinderGeometry(.045, .18, 18, 12, 1, true), targetMaterial, [0, 9, 0], [0, 0, 0], false);
  const targetHalo = addMesh(world, new THREE.TorusGeometry(3.25, .09, 8, 64), targetMaterial, [0, .75, 0], [Math.PI / 2, 0, 0], false);
  const targetOrb = addMesh(world, new THREE.IcosahedronGeometry(.42, 1), materials.orange, [0, 9.4, 0], [0, 0, 0], false);

  const rover = new THREE.Group();
  const suspension = new THREE.Group();
  rover.add(suspension);
  const fallbackTaxi = new THREE.Group();
  suspension.add(fallbackTaxi);
  const taxiYellow = new THREE.MeshPhysicalMaterial({ color: 0xd68b1e, roughness: .38, metalness: .22, clearcoat: .5, clearcoatRoughness: .28 });
  const taxiBlack = new THREE.MeshPhysicalMaterial({ color: 0x171b1b, roughness: .36, metalness: .3, clearcoat: .42 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xb8b7ae, roughness: .24, metalness: .92 });
  const redLight = new THREE.MeshStandardMaterial({ color: 0x9b1715, emissive: 0xff2b18, emissiveIntensity: 1.1, roughness: .4 });
  const warmLight = new THREE.MeshStandardMaterial({ color: 0xffe7b0, emissive: 0xffc56b, emissiveIntensity: 2.6, roughness: .25 });

  const chassis = addMesh(fallbackTaxi, roundedBoxGeometry(1.9, .38, 3.25, .16), taxiBlack, [0, .66, .08]);
  addMesh(fallbackTaxi, roundedBoxGeometry(1.82, .48, 2.98, .18), taxiYellow, [0, .9, .02]);
  addMesh(fallbackTaxi, roundedBoxGeometry(1.76, .28, .92, .12), taxiYellow, [0, 1.13, -1.24], [-.08, 0, 0]);
  addMesh(fallbackTaxi, roundedBoxGeometry(1.78, .23, .82, .11), taxiYellow, [0, 1.12, 1.25], [.04, 0, 0]);
  const cabin = addMesh(fallbackTaxi, roundedBoxGeometry(1.62, .82, 1.66, .15), taxiBlack, [0, 1.49, .18]);
  addMesh(fallbackTaxi, new THREE.BoxGeometry(1.46, .56, .06), materials.glass, [0, 1.5, -.68], [-.12, 0, 0], false);
  addMesh(fallbackTaxi, new THREE.BoxGeometry(1.46, .5, .06), materials.glass, [0, 1.49, 1.02], [.08, Math.PI, 0], false);
  [-.82, .82].forEach((x) => {
    addMesh(fallbackTaxi, new THREE.BoxGeometry(.045, .52, .72), materials.glass, [x, 1.5, .16], [0, 0, 0], false);
    addMesh(fallbackTaxi, new THREE.BoxGeometry(.055, .08, 1.8), chrome, [x * 1.02, 1.18, .18], [0, 0, 0], false);
  });
  addMesh(fallbackTaxi, roundedBoxGeometry(1.66, .12, 1.7, .055), taxiYellow, [0, 1.94, .19]);
  const driver = addMesh(fallbackTaxi, new THREE.SphereGeometry(.19, 14, 10), new THREE.MeshStandardMaterial({ color: 0x714b38, roughness: .9 }), [-.34, 1.67, -.05]);
  addMesh(fallbackTaxi, new THREE.CapsuleGeometry(.17, .38, 5, 8), materials.cream, [-.34, 1.37, -.02]);
  const flagPole = addMesh(fallbackTaxi, new THREE.CylinderGeometry(.018, .018, .72, 6), chrome, [.62, 2.28, .6]);
  addMesh(fallbackTaxi, new THREE.BoxGeometry(.5, .24, .035), materials.oxide, [.37, 2.43, .6]);
  const taxiSign = new THREE.Group();
  addMesh(taxiSign, roundedBoxGeometry(.68, .22, .28, .07, 2), materials.dark, [0, 2.16, .18]);
  addMesh(taxiSign, new THREE.BoxGeometry(.52, .1, .02), warmLight, [0, 2.17, .025], [0, 0, 0], false);
  fallbackTaxi.add(taxiSign);
  [-.96, .96].forEach((x) => {
    addMesh(fallbackTaxi, new THREE.SphereGeometry(.105, 12, 8), taxiBlack, [x, 1.45, -.44]);
    addMesh(fallbackTaxi, new THREE.CylinderGeometry(.024, .024, .23, 6), chrome, [x * .93, 1.36, -.43], [0, 0, x > 0 ? -.65 : .65]);
  });
  addMesh(fallbackTaxi, new THREE.BoxGeometry(1.95, .09, .14), chrome, [0, .58, -1.7]);
  addMesh(fallbackTaxi, new THREE.BoxGeometry(1.95, .09, .14), chrome, [0, .58, 1.7]);
  addMesh(fallbackTaxi, new THREE.BoxGeometry(.75, .22, .025), materials.white, [0, .72, -1.775], [0, 0, 0], false);
  for (let bar = -3; bar <= 3; bar += 1) addMesh(fallbackTaxi, new THREE.BoxGeometry(.035, .26, .035), chrome, [bar * .095, .82, -1.69], [0, 0, 0], false);
  [-.83, .83].forEach((x) => addMesh(fallbackTaxi, new THREE.BoxGeometry(.18, .04, .04), chrome, [x, 1.48, .25], [0, 0, 0], false));
  addMesh(fallbackTaxi, new THREE.CylinderGeometry(.018, .024, .17, 8), chrome, [0, 1.33, -1.5], [0, 0, 0], false);
  const wheels = [];
  const frontWheelPivots = [];
  [[-.96, .55, -1.03, true], [.96, .55, -1.03, true], [-.96, .55, 1.08, false], [.96, .55, 1.08, false]].forEach(([x, y, z, front]) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);
    const wheel = addMesh(pivot, new THREE.CylinderGeometry(.4, .4, .26, 22), materials.tire, [0, 0, 0], [0, 0, Math.PI / 2]);
    addMesh(wheel, new THREE.CylinderGeometry(.21, .21, .275, 16), chrome, [0, 0, 0]);
    addMesh(wheel, new THREE.TorusGeometry(.29, .025, 7, 18), taxiBlack, [0, -.145, 0], [Math.PI / 2, 0, 0]);
    fallbackTaxi.add(pivot);
    wheels.push(wheel);
    if (front) frontWheelPivots.push(pivot);
  });
  [-.58, .58].forEach((x) => {
    addMesh(fallbackTaxi, new THREE.CircleGeometry(.15, 18), warmLight, [x, .91, -1.665], [0, 0, 0], false);
    addMesh(fallbackTaxi, new THREE.BoxGeometry(.24, .16, .035), redLight, [x, .87, 1.67], [0, Math.PI, 0], false);
  });
  const boostTrails = [-.48, .48].map((x) => addMesh(suspension, new THREE.ConeGeometry(.1, .82, 8), new THREE.MeshBasicMaterial({ color: 0xffb05a, transparent: true, opacity: 0 }), [x, .55, 2.05], [Math.PI / 2, 0, 0], false));
  const cargoCrate = new THREE.Group();
  addMesh(cargoCrate, new THREE.BoxGeometry(1.05, .46, .82), materials.orange, [0, 2.31, .46]);
  addMesh(cargoCrate, new THREE.BoxGeometry(1.1, .06, .88), chrome, [0, 2.57, .46]);
  [-.61, .61].forEach((x) => addMesh(cargoCrate, new THREE.BoxGeometry(.045, .16, 1.25), chrome, [x, 2.12, .3]));
  cargoCrate.visible = false;
  suspension.add(cargoCrate);
  world.add(rover);

  const detailedTaxiTopper = new THREE.Group();
  detailedTaxiTopper.visible = false;
  addMesh(detailedTaxiTopper, roundedBoxGeometry(.72, .22, .3, .07, 2), taxiBlack, [0, 1.98, .15]);
  addMesh(detailedTaxiTopper, new THREE.BoxGeometry(.55, .11, .025), warmLight, [0, 1.99, -.015], [0, 0, 0], false);
  suspension.add(detailedTaxiTopper);

  new GLTFLoader().load("assets/models/toy-car.glb", (gltf) => {
    const detailedTaxi = gltf.scene;
    [...detailedTaxi.children].filter((child) => child.isCamera).forEach((cameraNode) => detailedTaxi.remove(cameraNode));
    const fabricNodes = [];
    detailedTaxi.traverse((child) => {
      if (child.name.toLowerCase().includes("fabric") || child.material?.name?.toLowerCase().includes("fabric")) fabricNodes.push(child);
    });
    fabricNodes.forEach((child) => child.parent?.remove(child));
    detailedTaxi.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = !touchDevice;
      child.receiveShadow = !touchDevice;
      child.material = child.material.clone();
      const materialName = child.material.name.toLowerCase();
      if (materialName.includes("glass")) {
        child.material.color.setHex(0x233b40);
        child.material.opacity = .82;
        child.material.transparent = true;
      } else if (materialName.includes("fabric")) {
        child.material.color.setHex(0x171a1a);
        child.material.roughness = .64;
      } else {
        child.material.color.setHex(0xd58a24);
        child.material.map = null;
        child.material.emissiveMap = null;
        child.material.emissive?.setHex(0x000000);
        child.material.roughness = .3;
        child.material.metalness = .22;
        child.material.clearcoat = .65;
        child.material.clearcoatRoughness = .2;
        child.material.needsUpdate = true;
      }
    });
    detailedTaxi.updateMatrixWorld(true);
    let bounds = new THREE.Box3().setFromObject(detailedTaxi);
    let size = bounds.getSize(new THREE.Vector3());
    const scale = 3.65 / Math.max(size.x, size.z);
    detailedTaxi.scale.multiplyScalar(scale);
    if (size.x > size.z) detailedTaxi.rotation.y = -Math.PI / 2;
    detailedTaxi.updateMatrixWorld(true);
    bounds = new THREE.Box3().setFromObject(detailedTaxi);
    const center = bounds.getCenter(new THREE.Vector3());
    detailedTaxi.position.x -= center.x;
    detailedTaxi.position.z -= center.z;
    detailedTaxi.position.y -= bounds.min.y;
    detailedTaxi.rotation.y += Math.PI;
    suspension.add(detailedTaxi);
    fallbackTaxi.visible = false;
    detailedTaxiTopper.visible = true;
  }, undefined, () => {
    fallbackTaxi.visible = true;
  });

  const roverShadow = addMesh(world, new THREE.CircleGeometry(1.35, 32), new THREE.MeshBasicMaterial({ color: 0x1c342e, transparent: true, opacity: .27, depthWrite: false }), [0, .68, 0], [-Math.PI / 2, 0, 0], false);
  const dustPuffs = Array.from({ length: 18 }, () => {
    const puff = addMesh(world, new THREE.IcosahedronGeometry(.18, 1), new THREE.MeshBasicMaterial({ color: 0xe8c992, transparent: true, opacity: 0, depthWrite: false }), [0, -4, 0], [0, 0, 0], false);
    return { mesh: puff, life: 0 };
  });
  let dustIndex = 0;
  let dustTimer = 0;
  let uiTimer = 0;
  let lastRampTime = -4;
  let lastImpactTime = -3;

  function registerImpact(speed) {
    if (Math.abs(speed) < 2.2 || state.elapsed - lastImpactTime < .7) return;
    lastImpactTime = state.elapsed;
    state.condition = Math.max(12, state.condition - Math.min(12, 2.5 + Math.abs(speed) * .72));
  }

  let cameraOrbit = 0;
  let cameraHeight = 5.25;
  let cameraDragging = false;
  let pointerX = 0;
  let pointerY = 0;
  const cameraRaycaster = new THREE.Raycaster();
  canvas.addEventListener("pointerdown", (event) => {
    if (state.mode !== "exploring" || event.button !== 0) return;
    cameraDragging = true;
    pointerX = event.clientX;
    pointerY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!cameraDragging) return;
    cameraOrbit -= (event.clientX - pointerX) * .006;
    state.cameraOrbit = cameraOrbit;
    cameraHeight = THREE.MathUtils.clamp(cameraHeight + (event.clientY - pointerY) * .025, 3.7, 10.5);
    pointerX = event.clientX;
    pointerY = event.clientY;
  });
  const stopCameraDrag = (event) => {
    cameraDragging = false;
    if (event?.pointerId !== undefined) canvas.releasePointerCapture?.(event.pointerId);
  };
  canvas.addEventListener("pointerup", stopCameraDrag);
  canvas.addEventListener("pointercancel", stopCameraDrag);

  function markVisited(id) {
    const visual = landmarkVisuals.get(id);
    if (!visual) return;
    visual.ring.material.color.setHex(0xffffff);
    visual.ring.material.opacity = .4;
    visual.beam.material.opacity = .012;
    visual.label.material.opacity = .72;
  }

  function updateMissionVisuals() {
    const mission = activeMission();
    const nextOrdered = mission?.items.find((item) => !state.missionCollected.has(item.id));
    missionVisuals.forEach((visual) => {
      const active = state.playMode === "story" && !state.storyComplete && !state.chapterQueued && visual.missionId === mission?.id && !state.missionCollected.has(visual.item.id);
      visual.group.visible = Boolean(active && (!mission.ordered || visual.item.id === nextOrdered?.id));
    });
    cargoCrate.visible = state.playMode === "story" && (
      (mission?.id === "sensor-to-trust" && state.missionCollected.has("demand")) ||
      (mission?.id === "leave-evidence" && state.missionCollected.size > 0)
    );
    const profileVisual = landmarkVisuals.get("profile");
    const showProfile = state.playMode === "free" || state.storyComplete || state.missionIndex > 0;
    if (profileVisual) {
      profileVisual.group.visible = showProfile;
      profileVisual.blocker.visible = showProfile;
    }
    signalSegments.forEach((segment, index) => {
      const online = index < state.completedMissions.length;
      segment.material.opacity = online ? .82 : .08;
      segment.material.emissiveIntensity = online ? 1.35 : .25;
    });
    const contactVisual = landmarkVisuals.get("contact");
    contactVisual?.animated.forEach((object) => {
      if (object.geometry?.type === "ConeGeometry") object.visible = state.storyComplete;
    });
  }

  function completeMissionVisual(id) {
    const mission = missions.find((candidate) => candidate.id === id);
    const visual = landmarkVisuals.get(mission?.targetId);
    if (visual) {
      visual.ring.material.opacity = 1;
      visual.beam.material.opacity = .08;
      visual.group.scale.setScalar(1.04);
    }
    updateMissionVisuals();
  }

  function updateTargetVisual() {
    const target = currentObjective();
    if (!target) return;
    [targetBeam, targetHalo, targetOrb].forEach((object) => {
      object.position.x = target.x;
      object.position.z = target.z;
    });
  }

  function resetVisuals() {
    entries.forEach((entry) => {
      const visual = landmarkVisuals.get(entry.id);
      visual.ring.material.color.setHex(entry.color);
      visual.ring.material.opacity = .46;
      visual.beam.material.opacity = .012;
      visual.label.material.opacity = 1;
    });
    rover.position.set(state.player.x, .64, state.player.z);
    rover.rotation.y = -state.player.heading;
    suspension.rotation.set(0, 0, 0);
    cameraOrbit = camera.aspect < .7 || (state.playMode === "story" && state.missionIndex === 0) ? 1.05 : 0;
    state.cameraOrbit = cameraOrbit;
    cameraHeight = 5.25;
    updateMissionVisuals();
    updateTargetVisual();
  }

  function jump(power = 6.9) {
    if (state.mode !== "exploring" || state.player.y > .04) return;
    state.player.verticalVelocity = power;
    state.player.airborne = true;
  }

  function update(dt) {
    state.elapsed += dt;

    if (state.mode === "exploring") {
      const throttle = Number(controls.up) - Number(controls.down);
      const steer = Number(controls.right) - Number(controls.left);
      const boosting = controls.boost && throttle > 0 && state.boost > .5;
      state.boost = THREE.MathUtils.clamp(state.boost + (boosting ? -28 : 10.5) * dt, 0, 100);
      const maxSpeed = boosting ? 13.4 : 8.8;
      state.player.speed += throttle * (throttle >= 0 ? boosting ? 15.5 : 10.2 : 7) * dt;
      if (!throttle) state.player.speed *= Math.exp(-(controls.brake ? 9 : 3.7) * dt);
      if (controls.brake) state.player.speed *= Math.exp(-7.5 * dt);
      state.player.speed = THREE.MathUtils.clamp(state.player.speed, -4.2, maxSpeed);
      const steeringStrength = .25 + Math.min(Math.abs(state.player.speed) / 5.2, 1);
      state.player.heading += steer * 1.78 * steeringStrength * dt * (state.player.speed < -.1 ? -1 : 1);
      const forwardX = Math.sin(state.player.heading);
      const forwardZ = -Math.cos(state.player.heading);
      state.player.x += forwardX * state.player.speed * dt;
      state.player.z += forwardZ * state.player.speed * dt;

      const collision = entries
        .map((entry) => ({ entry, distance: distanceTo(entry) }))
        .filter(({ distance }) => distance < 2.85)
        .sort((left, right) => left.distance - right.distance)[0];
      if (collision) {
        registerImpact(state.player.speed);
        const safeDistance = Math.max(collision.distance, .001);
        const awayX = (state.player.x - collision.entry.x) / safeDistance;
        const awayZ = (state.player.z - collision.entry.z) / safeDistance;
        state.player.x = collision.entry.x + awayX * 2.85;
        state.player.z = collision.entry.z + awayZ * 2.85;
        state.player.speed *= -.2;
      }

      staticColliders.forEach((collider) => {
        const dx = state.player.x - collider.x;
        const dz = state.player.z - collider.z;
        if (Math.abs(dx) >= collider.halfX || Math.abs(dz) >= collider.halfZ) return;
        registerImpact(state.player.speed);
        const pushX = collider.halfX - Math.abs(dx);
        const pushZ = collider.halfZ - Math.abs(dz);
        if (pushX < pushZ) state.player.x = collider.x + Math.sign(dx || 1) * collider.halfX;
        else state.player.z = collider.z + Math.sign(dz || 1) * collider.halfZ;
        state.player.speed *= -.18;
      });

      const clampedX = THREE.MathUtils.clamp(state.player.x, -49, 47);
      const clampedZ = THREE.MathUtils.clamp(state.player.z, -38, 38);
      if (clampedX !== state.player.x || clampedZ !== state.player.z) {
        state.player.x = clampedX;
        state.player.z = clampedZ;
        state.player.speed *= -.24;
      }

      if (state.player.airborne || state.player.verticalVelocity > 0) {
        state.player.verticalVelocity -= 15.2 * dt;
        state.player.y += state.player.verticalVelocity * dt;
        if (state.player.y <= 0) {
          state.player.y = 0;
          state.player.verticalVelocity = 0;
          state.player.airborne = false;
        }
      }

      if (!state.player.airborne && Math.abs(state.player.speed) > 5 && state.elapsed - lastRampTime > 1.6) {
        const onRamp = rampZones.some(([x, z]) => Math.hypot(state.player.x - x, state.player.z - z) < 2.1);
        if (onRamp) {
          lastRampTime = state.elapsed;
          jump(7.8);
        }
      }

      if (state.playMode === "story" && !state.storyComplete) {
        const mission = activeMission();
        const available = mission?.ordered
          ? [mission.items.find((item) => !state.missionCollected.has(item.id))].filter(Boolean)
          : mission?.items.filter((item) => !state.missionCollected.has(item.id)) ?? [];
        const collected = available.find((item) => !ACTIVATION_KINDS.has(item.kind) && pointDistance(item) < (item.kind === "ring" ? 2.45 : 2.7));
        if (collected) collectMissionItem(collected);
        const activatable = available
          .filter((item) => ACTIVATION_KINDS.has(item.kind) && pointDistance(item) < 3.2)
          .sort((left, right) => pointDistance(left) - pointDistance(right))[0] ?? null;
        if (activatable?.id !== state.nearbyItemId) {
          state.nearbyItemId = activatable?.id ?? null;
          updateInterface();
        }
      } else if (state.nearbyItemId) {
        state.nearbyItemId = null;
      }

      const nearest = entries
        .map((entry) => ({ entry, distance: distanceTo(entry) }))
        .filter((candidate) => candidate.distance < 3.7)
        .sort((left, right) => left.distance - right.distance)[0]?.entry ?? null;
      if (nearest?.id !== state.nearbyId) {
        state.nearbyId = nearest?.id ?? null;
        updateInterface();
      }

      uiTimer += dt;
      if (uiTimer > .08) {
        uiTimer = 0;
        updateInterface();
      }

      if (!cameraDragging) cameraOrbit *= Math.exp(-.45 * dt);
      state.cameraOrbit = cameraOrbit;
      const lean = -steer * Math.min(Math.abs(state.player.speed) / 9, 1) * .11;
      suspension.rotation.z += (lean - suspension.rotation.z) * (1 - Math.exp(-8 * dt));
      suspension.rotation.x += ((throttle * -.035) - suspension.rotation.x) * (1 - Math.exp(-7 * dt));
      frontWheelPivots.forEach((pivot) => { pivot.rotation.y = steer * .34; });
      boostTrails.forEach((trail) => {
        trail.material.opacity += ((boosting ? .88 : 0) - trail.material.opacity) * (1 - Math.exp(-12 * dt));
        trail.scale.y = boosting ? 1 + Math.sin(state.elapsed * 34) * .22 : .1;
      });

      dustTimer += dt * Math.abs(state.player.speed);
      if (!state.player.airborne && dustTimer > .38) {
        dustTimer = 0;
        const puff = dustPuffs[dustIndex % dustPuffs.length];
        dustIndex += 1;
        puff.life = 1;
        puff.mesh.position.set(state.player.x - forwardX * .65 + (random() - .5) * .7, .76, state.player.z - forwardZ * .65 + (random() - .5) * .7);
        puff.mesh.scale.setScalar(.55 + random() * .5);
      }
    }

    const driveBob = state.player.airborne ? 0 : Math.sin(state.elapsed * 12) * Math.min(Math.abs(state.player.speed) / 8, 1) * .025;
    rover.position.set(state.player.x, .64 + state.player.y + driveBob, state.player.z);
    rover.rotation.y = -state.player.heading;
    roverShadow.position.set(state.player.x, .68, state.player.z);
    const shadowScale = Math.max(.45, 1 - state.player.y * .08);
    roverShadow.scale.setScalar(shadowScale);
    roverShadow.material.opacity = .27 * shadowScale;
    wheels.forEach((wheel) => { wheel.rotation.x -= state.player.speed * dt * 2.45; });

    dustPuffs.forEach((puff) => {
      if (puff.life <= 0) return;
      puff.life -= dt * 1.55;
      puff.mesh.position.y += dt * .42;
      puff.mesh.scale.multiplyScalar(1 + dt * .9);
      puff.mesh.material.opacity = Math.max(0, puff.life) * .28;
    });

    landmarkVisuals.forEach((visual, id) => {
      const entry = entryById(id);
      const labelDistance = distanceTo(entry);
      const labelFade = THREE.MathUtils.smoothstep(labelDistance, 5.8, 11.5);
      const objective = currentObjective();
      const objectiveLabel = objective?.id === id && ["debrief", "landmark"].includes(objective.objectiveType);
      visual.label.visible = ["loading", "menu"].includes(state.mode) || (state.mode === "exploring" && (objectiveLabel || (labelDistance > 6 && labelDistance < 15)));
      visual.label.material.opacity = labelFade * (state.visited.has(id) ? .72 : 1);
    });
    districtSigns.forEach((sign) => { sign.visible = ["loading", "menu"].includes(state.mode); });
    clouds.forEach(({ cloud }) => { cloud.visible = state.mode !== "complete"; });

    if (!reduceMotion) {
      landmarkVisuals.forEach((visual, id) => {
        visual.animated.forEach((object, index) => {
          object.rotation.y += dt * (.28 + index * .06);
          if (object.geometry?.type === "BoxGeometry") object.position.y += Math.sin(state.elapsed * 1.9 + entries.findIndex((entry) => entry.id === id)) * .0012;
        });
        visual.ring.rotation.z -= dt * .11;
      });
      clouds.forEach(({ cloud, startX, speed }, index) => {
        cloud.position.x = startX + Math.sin(state.elapsed * speed + index) * 8;
      });
      train.position.x = ((state.elapsed * 5.4 + 42) % 125) - 70;
      trafficVehicles.forEach(({ auto, offset, speed }) => {
        const ratio = (state.elapsed * speed + offset) % 1;
        const point = trafficCurve.getPointAt(ratio);
        const tangent = trafficCurve.getTangentAt(ratio);
        auto.position.set(point.x, point.y, point.z);
        auto.rotation.y = Math.atan2(tangent.x, tangent.z);
      });
      missionVisuals.forEach((visual, id) => {
        if (!visual.group.visible) return;
        visual.group.position.y = .78 + Math.sin(state.elapsed * 2.4 + id.length) * .12;
        visual.label.visible = pointDistance(visual.item) > 5.4;
        visual.animated.forEach((object, index) => { object.rotation.y += dt * (.45 + index * .11); });
      });
      water.rotation.z += dt * .004;
      targetHalo.rotation.z += dt * .55;
      targetOrb.rotation.y += dt * 1.4;
      targetOrb.position.y = 9.4 + Math.sin(state.elapsed * 2.1) * .35;
      driver.position.y = 1.67 + Math.sin(state.elapsed * 7) * .012;
      flagPole.rotation.z = Math.sin(state.elapsed * 7 + state.player.speed) * .006;
      pedestrians.forEach(({ person, phase }) => {
        person.position.y = .6 + Math.sin(state.elapsed * 1.8 + phase) * .012;
      });
    }

    if (state.mode === "complete") {
      const endingCamera = new THREE.Vector3(20, 20, -4);
      camera.position.lerp(endingCamera, 1 - Math.exp(-2.4 * dt));
      camera.lookAt(35, 3.8, -28);
      camera.fov += (46 - camera.fov) * (1 - Math.exp(-4 * dt));
    } else if (["loading", "menu"].includes(state.mode)) {
      const menuCamera = new THREE.Vector3(-2 + Math.sin(state.elapsed * .08) * 3.5, 27, 55 + Math.cos(state.elapsed * .08) * 2);
      camera.position.lerp(menuCamera, 1 - Math.exp(-1.65 * dt));
      camera.lookAt(-26, 3.2, 17);
      camera.fov += (47 - camera.fov) * (1 - Math.exp(-4 * dt));
    } else {
      const camHeading = state.player.heading + cameraOrbit;
      const portraitCamera = camera.aspect < .7;
      const distance = (portraitCamera ? 13.2 : 7.9) + Math.min(Math.abs(state.player.speed) * .12, 1.6);
      const desiredCamera = portraitCamera
        ? new THREE.Vector3(state.player.x, 22 + state.player.y * .35, THREE.MathUtils.clamp(state.player.z + 7.5, -34, 34))
        : new THREE.Vector3(
          state.player.x - Math.sin(camHeading) * distance,
          cameraHeight + state.player.y * .35,
          state.player.z + Math.cos(camHeading) * distance
        );
      const forwardX = Math.sin(state.player.heading);
      const forwardZ = -Math.cos(state.player.heading);
      const lookTarget = new THREE.Vector3(state.player.x + forwardX * 2.7, 1.25 + state.player.y * .55, state.player.z + forwardZ * 2.7);
      const cameraVector = desiredCamera.clone().sub(lookTarget);
      const desiredDistance = cameraVector.length();
      cameraVector.normalize();
      cameraRaycaster.set(lookTarget, cameraVector);
      cameraRaycaster.far = desiredDistance;
      const obstruction = portraitCamera ? null : cameraRaycaster.intersectObjects(cameraBlockers, false).find((hit) => hit.distance > .35);
      if (obstruction) {
        if (obstruction.distance < 4.25) {
          desiredCamera.set(
            state.player.x - Math.sin(camHeading) * 4.4,
            (portraitCamera ? 18.4 : 9.4) + state.player.y * .35,
            state.player.z + Math.cos(camHeading) * 4.4
          );
        } else {
          const safeDistance = Math.max(3.6, obstruction.distance - .72);
          desiredCamera.copy(lookTarget).addScaledVector(cameraVector, safeDistance);
          desiredCamera.y = Math.max(desiredCamera.y, 4.4 + state.player.y * .35);
        }
      }
      camera.position.lerp(desiredCamera, 1 - Math.exp(-5.2 * dt));
      camera.lookAt(lookTarget);
      const targetFov = 48 + Math.min(Math.abs(state.player.speed) * .72, 9);
      camera.fov += (targetFov - camera.fov) * (1 - Math.exp(-4 * dt));
    }
    camera.updateProjectionMatrix();
  }

  function render() {
    renderer.render(scene, camera);
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    cameraHeight = camera.aspect < .7 ? 17.2 : Math.min(cameraHeight, 8.5);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("fullscreenchange", resize);

  game = { update, render, resetVisuals, markVisited, updateTargetVisual, updateMissionVisuals, completeMissionVisual, resize, jump };
  resetVisuals();
  state.mode = "menu";
  state.resumeMode = "menu";
  updateInterface();
  if (pendingStart) {
    const requestedMode = pendingMode;
    pendingStart = false;
    requestedMode === "free" ? startFreeRoam() : startGame();
  }

  let lastFrame = performance.now();
  function frame(now) {
    const dt = Math.min((now - lastFrame) / 1000, .05);
    lastFrame = now;
    update(dt);
    if (!document.hidden) render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

buildWorld();

window.advanceTime = (ms) => {
  if (!game) return;
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let index = 0; index < steps; index += 1) game.update(1 / 60);
  game.render();
};

window.render_game_to_text = () => {
  const nearby = entryById(state.nearbyId);
  const target = currentObjective();
  const mission = activeMission();
  const nearest = entries
    .map((entry) => ({ id: entry.id, title: entry.title, type: entry.type, distance: Number(distanceTo(entry).toFixed(2)), visited: state.visited.has(entry.id) }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, 5);
  return JSON.stringify({
    coordinate_system: "Chennai memory map: +x is east toward the Bay of Bengal; -z is south toward the Marina finale. Bounds are x -49..47 and z -38..38.",
    mode: state.mode,
    play_mode: state.playMode,
    player: { x: Number(state.player.x.toFixed(2)), y: Number(state.player.y.toFixed(2)), z: Number(state.player.z.toFixed(2)), heading_degrees: Number((state.player.heading * 180 / Math.PI).toFixed(1)), speed: Number(state.player.speed.toFixed(2)), speed_kmh: Math.round(Math.abs(state.player.speed) * 9), airborne: state.player.airborne, boosting: controls.boost && controls.up && state.boost > .5 },
    vehicle: { condition_percent: Number(state.condition.toFixed(1)), boost_percent: Number(state.boost.toFixed(1)), model: "Chennai systems taxi" },
    camera: { orbit_degrees: Number((state.cameraOrbit * 180 / Math.PI).toFixed(1)) },
    zone: state.zone,
    nearby: nearby ? { id: nearby.id, title: nearby.title, distance: Number(distanceTo(nearby).toFixed(2)), action: "Press Enter to inspect" } : null,
    target: target ? { id: target.id, title: target.title, objective_type: target.objectiveType, x: target.x, z: target.z, distance: Number(pointDistance(target).toFixed(2)) } : null,
    mission: state.playMode === "story" && mission ? {
      id: mission.id,
      chapter: state.missionIndex + 1,
      chapters_total: missions.length,
      title: mission.title,
      location: mission.location,
      collected: [...state.missionCollected],
      required: mission.items.map((item) => item.id),
      ready_for_debrief: missionReady(),
      completed_missions: [...state.completedMissions],
      story_complete: state.storyComplete
    } : null,
    inventory: [...state.inventory],
    selected: state.selectedId,
    visited_count: state.visited.size,
    visited_ids: [...state.visited],
    nearest_landmarks: nearest,
    controls: "WASD/arrows drive; Shift boosts; Space jumps; Enter debriefs/inspects; drag rotates camera; M opens map; R respawns at the current chapter; F fullscreen; Escape closes panels."
  });
};
