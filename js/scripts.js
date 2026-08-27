document.documentElement.classList.add("js");

const canvas = document.querySelector("#world");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-game");
const openIntroButton = document.querySelector("#open-intro");
const gameHud = document.querySelector("#game-hud");
const currentZone = document.querySelector("#current-zone");
const targetTitle = document.querySelector("#target-title");
const targetDistance = document.querySelector("#target-distance");
const navArrow = document.querySelector("#nav-arrow");
const visitedCount = document.querySelector("#visited-count");
const speedReadout = document.querySelector("#speed-readout");
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
    id: "profile", type: "profile", label: "ABOUT ADITHYA", title: "Adithya U R", org: "ML systems engineer · Stockholm", period: "NOW", x: 0, z: 21,
    lead: "I make machine learning work outside the notebook.",
    copy: ["I design the path from raw data to reliable compute—and make every run reproducible, governed, and explainable.", "My sweet spot is where large-scale data processing, GPU workloads, workload identity, and platform engineering meet."],
    tags: ["ML systems", "Data platforms", "GPU infrastructure", "MLOps"],
    href: "https://github.com/adithyaur99", linkLabel: "GitHub", secondaryHref: "https://www.linkedin.com/in/adithya-u-r-79586612b/", secondaryLabel: "LinkedIn"
  },
  {
    id: "scania-data", type: "experience", label: "SCANIA / DATA", title: "Data Engineer", org: "Scania", period: "OCT 2023 — PRESENT", x: -17, z: 13,
    lead: "Building governed data paths for high-volume, multimodal sensor information.",
    copy: ["I work across ingestion, processing, transformation, quality, security, and reliable access for autonomous-vehicle analytics and downstream AI workflows.", "The recurring challenge is turning raw camera, LiDAR, RADAR, and log outputs into trustworthy inputs for people, models, and simulation."],
    tags: ["PySpark", "Databricks", "AWS", "Data governance"]
  },
  {
    id: "scania-automation", type: "experience", label: "SCANIA / AUTOMATION", title: "Automation Specialist", org: "Scania", period: "AUG 2022 — SEP 2023", x: -24, z: 2,
    lead: "Turning operational problems into cloud applications and automation.",
    copy: ["I translated business needs into data-intensive tools that connected changing demand, suppliers, and production decisions in real time.", "The work combined software, automation, and applied AI to shorten feedback loops and support faster decisions."],
    tags: ["Cloud applications", "Automation", "Applied AI", "APIs"]
  },
  {
    id: "ericsson", type: "experience", label: "ERICSSON / ML", title: "ML Engineering Intern", org: "Ericsson", period: "JUN 2021 — OCT 2021", x: -22, z: -10,
    lead: "Semantic support-ticket retrieval with Sentence-BERT and retrieval-augmented generation.",
    copy: ["I built and compared approaches for finding similar historical tickets, then deployed the strongest model through an end-to-end MLOps path.", "The project connected model quality to an actual retrieval workflow rather than stopping at an offline notebook."],
    tags: ["Sentence-BERT", "RAG", "NLP", "Model deployment"]
  },
  {
    id: "agnikul", type: "experience", label: "AGNIKUL / SYSTEMS", title: "Software Engineer", org: "Agnikul Cosmos", period: "MAR 2020 — AUG 2020", x: -15, z: -22,
    lead: "From orbital trajectories to real-time Linux for small launch vehicles.",
    copy: ["I worked across trajectory optimization, payload tooling, and real-time software architecture.", "That systems foundation still shapes how I reason about latency, constraints, failure modes, and interfaces in modern ML platforms."],
    tags: ["C++", "Linux", "Optimization", "Real-time systems"]
  },
  {
    id: "dataset-integrity", type: "project", label: "DVC / DATA INTEGRITY", title: "Portable Dataset Integrity", org: "Open-source experiment", period: "2026", x: 16, z: 14,
    lead: "DVC reproduces the pipeline. A portable manifest proves every byte.",
    copy: ["The experiment separates development-time reproducibility from runtime verification.", "It combines deterministic fixtures, SHA-256 digests, atomic publication, completion markers, idempotency, and corruption detection without requiring cloud access or private data."],
    tags: ["DVC", "Python", "SHA-256", "Data contracts"],
    href: "https://github.com/adithyaur99/portable-dataset-integrity", linkLabel: "Open source"
  },
  {
    id: "flyte-skypilot", type: "project", label: "FLYTE × SKYPILOT", title: "Flyte × SkyPilot Fallback", org: "Open-source experiment", period: "2026", x: 24, z: 4,
    lead: "Regional GPU fallback that explains why every candidate succeeded or failed.",
    copy: ["Capacity and transient failures can retry. Policy and authentication failures stop the launch instead of silently widening access.", "The result is a deterministic SkyPilot-shaped launch plan with Flyte-style orchestration evidence and synthetic infrastructure inputs."],
    tags: ["Flyte", "SkyPilot", "GPU scheduling", "Failure policy"],
    href: "https://github.com/adithyaur99/flyte-skypilot-fallback", linkLabel: "Open source"
  },
  {
    id: "spark-gpu", type: "project", label: "SPARK / GPU", title: "Spark GPU Feed", org: "Open-source experiment", period: "2026", x: 23, z: -8,
    lead: "A deterministic model of whether Spark can keep a GPU fed.",
    copy: ["Partition count, model initialization, row calls, and vectorized batches become explicit variables instead of hidden benchmark assumptions.", "The simulator estimates throughput and utilization while rejecting impossible parameter combinations and overstated claims."],
    tags: ["Spark", "GPU", "Vectorization", "Throughput"],
    href: "https://github.com/adithyaur99/spark-gpu-feed", linkLabel: "Open source"
  },
  {
    id: "credentials", type: "project", label: "IDENTITY / ACCESS", title: "Credential Isolation", org: "Open-source experiment", period: "2026", x: 17, z: -19,
    lead: "Short-lived, path-scoped credentials with no ambient fallback.",
    copy: ["The experiment verifies allowed reads, denied reads, expiry, refresh, and strict isolation from environment credentials, instance metadata, and shared profiles.", "Positive tests show intended access works; negative tests prove the boundary holds."],
    tags: ["Workload identity", "Least privilege", "Refresh", "Negative tests"],
    href: "https://github.com/adithyaur99/credential-isolation", linkLabel: "Open source"
  },
  {
    id: "modal-gpu", type: "project", label: "MODAL / GPU DATA", title: "Modal GPU Data Path", org: "Open-source experiment", period: "2026", x: 29, z: 16,
    lead: "A portable data contract crossing into serverless GPU execution.",
    copy: ["This experiment makes the handoff between published data and an on-demand GPU runtime explicit: validate inputs, prepare the launch, preserve evidence, and keep cloud-specific behavior behind a narrow adapter.", "Synthetic fixtures keep the whole path independently runnable."],
    tags: ["Modal", "Serverless GPU", "Data path", "Run evidence"],
    href: "https://github.com/adithyaur99/modal-gpu-data-path", linkLabel: "Open source"
  },
  {
    id: "experiment-index", type: "project", label: "25 EXPERIMENTS", title: "MLOps Experiments", org: "Open-source collection", period: "2026", x: 28, z: -20,
    lead: "Twenty-five small systems answering concrete MLOps questions.",
    copy: ["The collection spans portable data, GPU execution, orchestration, scheduling, workload identity, evaluation, lineage, observability, and cost-aware placement.", "Every experiment has synthetic fixtures, an independent history, tests, limitations, an MIT license, and a clean-room statement."],
    tags: ["MLOps", "AWS", "Evaluation", "Open source"],
    href: "https://github.com/adithyaur99/mlops-experiments", linkLabel: "Explore all 25"
  },
  {
    id: "kth", type: "education", label: "KTH / AUTONOMOUS", title: "MSc Autonomous Systems", org: "KTH Royal Institute of Technology", period: "AUG 2020 — AUG 2022", x: -3, z: -27,
    lead: "Autonomous systems, perception, robotics, and the software around them.",
    copy: ["My master’s work focused on single-stage image segmentation for autonomous heavy-duty vehicles.", "The programme connected algorithms to real sensors, embedded constraints, and complete autonomous-system architectures."],
    tags: ["Computer vision", "Autonomous systems", "Segmentation", "Robotics"]
  },
  {
    id: "anna", type: "education", label: "ANNA / ENGINEERING", title: "BE Electronics & Communication", org: "Anna University", period: "AUG 2016 — AUG 2020", x: -11, z: -34,
    lead: "The hardware-and-systems foundation behind my software work.",
    copy: ["Electronics, communication systems, embedded programming, and signal processing formed the base for my move into autonomous systems and ML engineering.", "My bachelor thesis explored deep-learning-based self-driving systems with TensorFlow and Nvidia Jetson."],
    tags: ["Embedded systems", "Signal processing", "TensorFlow", "Nvidia Jetson"]
  },
  {
    id: "toolkit", type: "toolkit", label: "TOOLKIT / SYSTEMS", title: "From Sensor to System", org: "Selected toolkit", period: "CURRENT", x: 10, z: -31,
    lead: "Tools matter most when their boundaries are clear.",
    copy: ["Data: Python, SQL, PySpark, Spark, Databricks, DVC. ML and GPU: PyTorch, TensorFlow, OpenCV, TensorRT, MLflow.", "Platform: AWS, Terraform, Docker, Flyte, SkyPilot, Modal. Systems: C, C++, Shell, Linux, APIs, and CI/CD."],
    tags: ["Python", "Databricks", "AWS", "PyTorch", "Terraform", "Flyte"]
  },
  {
    id: "contact", type: "contact", label: "CONTACT / SIGNAL", title: "Let’s Build Something", org: "Adithya U R", period: "OPEN CHANNEL", x: 1, z: -38,
    lead: "If the problem lives between data, compute, identity, and evidence, I want to hear it.",
    copy: ["I’m based in Stockholm and interested in ambitious ML systems, data platform, and infrastructure work.", "Send me an email, browse the code, or continue the conversation on LinkedIn."],
    tags: ["Stockholm", "ML systems", "Data engineering", "Platform engineering"],
    href: "mailto:adithyaur1999@gmail.com", linkLabel: "Email me", secondaryHref: "https://www.linkedin.com/in/adithya-u-r-79586612b/", secondaryLabel: "LinkedIn"
  }
].map((entry, index) => ({ ...entry, index: index + 1, color: TYPE_COLORS[entry.type] }));

const state = {
  mode: "loading",
  resumeMode: "menu",
  elapsed: 0,
  player: { x: 0, y: 0, z: 31, heading: 0, speed: 0, verticalVelocity: 0, airborne: false },
  visited: new Set(),
  targetId: "profile",
  nearbyId: null,
  selectedId: null,
  zone: "Arrival plaza",
  cameraOrbit: 0
};

const controls = { up: false, down: false, left: false, right: false, boost: false, brake: false };
let game = null;
let pendingStart = false;

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
  if (state.player.z > 18) return "Arrival plaza";
  if (state.player.x < -8) return "Experience boulevard";
  if (state.player.x > 11 && state.player.z > -25) return "Open-source district";
  if (state.player.z < -24 && state.player.x < 5) return "Education quarter";
  if (state.player.z < -24) return "Systems gardens";
  return "Central interchange";
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
  [["EXPERIENCE", "west"], ["OPEN SOURCE", "east"], ["EDUCATION + MORE", "south"]].forEach(([label, zone]) => {
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
    button.style.setProperty("--map-x", `${((entry.x + 40) / 80) * 100}%`);
    button.style.setProperty("--map-y", `${((40 - entry.z) / 84) * 100}%`);
    button.setAttribute("aria-label", `Set route to ${entry.title}`);
    const dot = document.createElement("i");
    const number = document.createElement("span");
    number.textContent = String(entry.index).padStart(2, "0");
    const title = document.createElement("small");
    title.textContent = entry.title;
    button.append(dot, number, title);
    button.addEventListener("click", () => {
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

function updateInterface() {
  const exploring = state.mode === "exploring";
  startScreen.hidden = !["loading", "menu"].includes(state.mode);
  gameHud.hidden = !exploring;
  gameToolbar.hidden = !exploring;
  worldLegend.hidden = !exploring;
  touchControls.hidden = !exploring || !touchDevice;
  detailPanel.hidden = state.mode !== "reading";
  mapPanel.hidden = state.mode !== "map";

  const nearby = entryById(state.nearbyId);
  interactionPrompt.hidden = !exploring || !nearby || touchDevice;
  touchInspect.hidden = !exploring || !nearby || !touchDevice;
  if (nearby) interactionTitle.textContent = nearby.title;

  state.zone = getZone();
  currentZone.textContent = state.zone;
  visitedCount.textContent = `${state.visited.size} / ${entries.length}`;
  speedReadout.textContent = `${Math.round(Math.abs(state.player.speed) * 9)} KM/H`;

  const target = entryById(state.targetId) ?? nearestUnvisited();
  if (target) {
    targetTitle.textContent = target.title;
    targetDistance.textContent = `${Math.round(distanceTo(target))} m`;
    const targetAngle = Math.atan2(target.x - state.player.x, -(target.z - state.player.z));
    const relativeAngle = targetAngle - state.player.heading;
    navArrow.style.transform = `rotate(${relativeAngle}rad)`;
  }

  if (state.mode === "loading") gameStatus.textContent = "Building portfolio world";
  if (state.mode === "menu") gameStatus.textContent = "World ready";
  if (state.mode === "exploring") gameStatus.textContent = nearby ? "Landmark in range" : "Drive toward a landmark";
  if (state.mode === "reading") gameStatus.textContent = "Reading landmark";
  if (state.mode === "map") gameStatus.textContent = "Choosing route";
  updateMapButtons();
}

function startGame() {
  if (!game) {
    pendingStart = true;
    gameStatus.textContent = "World still loading";
    return;
  }
  state.mode = "exploring";
  state.resumeMode = "exploring";
  updateInterface();
  canvas.focus({ preventScroll: true });
}

function resetGame() {
  state.mode = "exploring";
  state.resumeMode = "exploring";
  state.elapsed = 0;
  state.player.x = 0;
  state.player.y = 0;
  state.player.z = 31;
  state.player.heading = 0;
  state.player.speed = 0;
  state.player.verticalVelocity = 0;
  state.player.airborne = false;
  state.visited.clear();
  state.targetId = "profile";
  state.nearbyId = null;
  state.selectedId = null;
  state.cameraOrbit = 0;
  Object.keys(controls).forEach((key) => { controls[key] = false; });
  game?.resetVisuals();
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
  if (state.targetId === id) state.targetId = nearestUnvisited()?.id ?? id;
  game?.markVisited(id);
  game?.updateTargetVisual();
  updateInterface();
  detailPanel.focus({ preventScroll: true });
}

function openNearby() {
  if (state.mode === "exploring" && state.nearbyId) openEntry(state.nearbyId);
}

function closeDetail() {
  if (state.mode !== "reading") return;
  state.mode = state.resumeMode;
  state.selectedId = null;
  updateInterface();
  if (state.mode === "exploring") canvas.focus({ preventScroll: true });
  else startButton.focus({ preventScroll: true });
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

window.addEventListener("keydown", (event) => {
  if (event.code in controlKeys) {
    event.preventDefault();
    setControl(controlKeys[event.code], true);
  }
  if (event.code === "Space" && state.mode === "exploring" && !event.repeat) {
    event.preventDefault();
    game?.jump();
  }
  if (event.code === "Enter" && ["loading", "menu"].includes(state.mode)) startGame();
  else if (event.code === "Enter" && state.mode === "exploring" && state.nearbyId) openNearby();
  else if (event.code === "Enter" && state.mode === "reading") closeDetail();
  else if (event.code === "Enter" && state.mode === "map") closeMap();
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

startButton.addEventListener("click", startGame);
openIntroButton.addEventListener("click", () => openEntry("profile", "menu"));
closeDetailButton.addEventListener("click", closeDetail);
mapButton.addEventListener("click", openMap);
closeMapButton.addEventListener("click", closeMap);
restartButton.addEventListener("click", resetGame);
fullscreenButton.addEventListener("click", toggleFullscreen);
touchInspect.addEventListener("click", openNearby);
buildMap();
updateInterface();

async function buildWorld() {
  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (error) {
    gameStatus.textContent = "3D could not load — use Skip the game";
    startButton.disabled = true;
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, touchDevice ? 1.15 : 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = !touchDevice;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = 16;
  skyCanvas.height = 512;
  const skyContext = skyCanvas.getContext("2d");
  const skyGradient = skyContext.createLinearGradient(0, 0, 0, 512);
  skyGradient.addColorStop(0, "#6fb8df");
  skyGradient.addColorStop(.55, "#cbe6dc");
  skyGradient.addColorStop(1, "#ffe4b8");
  skyContext.fillStyle = skyGradient;
  skyContext.fillRect(0, 0, 16, 512);
  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  skyTexture.colorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = skyTexture;
  scene.fog = new THREE.Fog(0xc5ded1, 58, 142);
  const camera = new THREE.PerspectiveCamera(48, 1, .1, 190);
  camera.position.set(32, 24, 42);

  scene.add(new THREE.HemisphereLight(0xf4fbff, 0x557046, 2.15));
  const sun = new THREE.DirectionalLight(0xfff2cf, 4.6);
  sun.position.set(-32, 42, 28);
  sun.castShadow = !touchDevice;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -58;
  sun.shadow.camera.right = 58;
  sun.shadow.camera.top = 58;
  sun.shadow.camera.bottom = -58;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 115;
  scene.add(sun);
  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(5.8, 20, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff1b8, fog: false })
  );
  sunDisc.position.set(-58, 44, -86);
  scene.add(sunDisc);

  const world = new THREE.Group();
  scene.add(world);

  const materials = {
    water: new THREE.MeshPhysicalMaterial({ color: 0x68bfc9, roughness: .2, metalness: .08, transparent: true, opacity: .9 }),
    sand: new THREE.MeshStandardMaterial({ color: 0xe8bd73, roughness: .96 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x76a853, roughness: .96 }),
    grassDark: new THREE.MeshStandardMaterial({ color: 0x4f7d49, roughness: .98 }),
    road: new THREE.MeshStandardMaterial({ color: 0x2b3538, roughness: .86 }),
    roadLine: new THREE.MeshBasicMaterial({ color: 0xffe6a7 }),
    cream: new THREE.MeshStandardMaterial({ color: 0xfff2d4, roughness: .72 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x182c34, roughness: .68, metalness: .12 }),
    orange: new THREE.MeshStandardMaterial({ color: 0xf07b4a, roughness: .58 }),
    blue: new THREE.MeshStandardMaterial({ color: 0x4fa8c7, roughness: .45, metalness: .12 }),
    purple: new THREE.MeshStandardMaterial({ color: 0x8d79c6, roughness: .62 }),
    lime: new THREE.MeshStandardMaterial({ color: 0xa9d95c, roughness: .54 }),
    pink: new THREE.MeshStandardMaterial({ color: 0xe78683, roughness: .6 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x9bd6df, roughness: .12, transmission: .18, transparent: true, opacity: .8 }),
    tire: new THREE.MeshStandardMaterial({ color: 0x172024, roughness: .9 }),
    white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .82 })
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

  const water = addMesh(world, new THREE.CircleGeometry(110, 72), materials.water, [0, -1.28, 0], [-Math.PI / 2, 0, 0], false);
  water.material.side = THREE.DoubleSide;
  addMesh(world, new THREE.CylinderGeometry(52, 55, 1.5, 64), materials.sand, [0, -.72, 0]);
  addMesh(world, new THREE.CylinderGeometry(49.5, 52, 1.2, 64), materials.grass, [0, -.08, 0]);
  addMesh(world, new THREE.CircleGeometry(46.5, 64), materials.grassDark, [0, .535, 0], [-Math.PI / 2, 0, 0]);

  const districtPatches = [
    [-20, -3, 22, 49, 0x5b958d], [21, -3, 23, 49, 0x91b959], [0, -33, 30, 15, 0x8e7fba]
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
    return curve;
  }

  addRoad([[0, 43], [-1, 31], [1, 20], [-1, 7], [1, -8], [-1, -23], [0, -44]], 5.6);
  addRoad([[0, 23], [-10, 20], [-18, 13], [-24, 2], [-22, -10], [-15, -22], [0, -24]], 4.7);
  addRoad([[0, 20], [10, 17], [17, 14], [24, 4], [21, -7], [28, -18], [18, -23], [0, -20]], 4.7);
  addRoad([[0, -20], [-12, -28], [-18, -34], [-4, -35], [8, -34], [18, -32], [0, -42]], 4.6);

  [[0, 22], [0, -20], [0, -36]].forEach(([x, z]) => addMesh(world, new THREE.CylinderGeometry(4.2, 4.2, .09, 32), materials.road, [x, .62, z], [0, 0, 0], false));

  function makeCanvasSprite(lines, accent = "#f07b4a", scale = [8.2, 2.1]) {
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

  function makeDistrictSign(title, subtitle, x, z, color) {
    const sign = makeCanvasSprite([subtitle, title], color, [7.8, 1.95]);
    sign.position.set(x, 5.8, z);
    world.add(sign);
    [-3.6, 3.6].forEach((offset) => addMesh(world, new THREE.CylinderGeometry(.08, .11, 4.5, 8), materials.dark, [x + offset, 2.7, z]));
  }
  makeDistrictSign("EXPERIENCE VALLEY", "WEST LOOP", -12, 26, "#4fa8c7");
  makeDistrictSign("OPEN-SOURCE RIDGE", "EAST LOOP", 13, 25, "#f07b4a");
  makeDistrictSign("SYSTEMS GARDENS", "SOUTH LOOP", 0, -27, "#8d79c6");

  let randomSeed = 93017;
  function random() {
    randomSeed = (randomSeed * 16807) % 2147483647;
    return (randomSeed - 1) / 2147483646;
  }

  function addTree(x, z, scale = 1) {
    const tree = new THREE.Group();
    tree.position.set(x, .58, z);
    addMesh(tree, new THREE.CylinderGeometry(.13 * scale, .2 * scale, 1.1 * scale, 7), new THREE.MeshStandardMaterial({ color: 0x83583b, roughness: .96 }), [0, .55 * scale, 0]);
    addMesh(tree, new THREE.IcosahedronGeometry(.78 * scale, 1), random() > .45 ? materials.grass : materials.lime, [0, 1.45 * scale, 0]);
    addMesh(tree, new THREE.IcosahedronGeometry(.58 * scale, 1), materials.grassDark, [.25 * scale, 1.75 * scale, -.08], [0, 0, 0], false);
    world.add(tree);
  }

  for (let index = 0; index < 74; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 31 + random() * 15;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (entries.every((entry) => Math.hypot(entry.x - x, entry.z - z) > 5.5)) addTree(x, z, .72 + random() * .68);
  }

  for (let index = 0; index < 30; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 43 + random() * 10;
    const height = 4 + random() * 8;
    const rock = addMesh(world, new THREE.ConeGeometry(2.6 + random() * 2.4, height, 5), random() > .5 ? materials.sand : materials.purple, [Math.cos(angle) * radius, height / 2 - .1, Math.sin(angle) * radius], [0, random() * Math.PI, 0]);
    rock.scale.x = .7 + random() * .7;
  }

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
  addCloud(-25, 20, -35, 1.7);
  addCloud(13, 24, -48, 1.3);
  addCloud(38, 18, -10, 1.8);
  addCloud(-42, 17, 15, 1.15);

  const rampZones = [[7.5, 8], [-8, -17], [17, -27]];
  rampZones.forEach(([x, z], index) => {
    const ramp = addMesh(world, new THREE.BoxGeometry(3.4, .45, 4.4), index === 1 ? materials.blue : materials.orange, [x, .95, z], [-.17, index * .35, 0]);
    addMesh(ramp, new THREE.BoxGeometry(2.6, .06, .32), materials.cream, [0, .27, -.8], [0, 0, 0], false);
    addMesh(ramp, new THREE.BoxGeometry(2.6, .06, .32), materials.cream, [0, .27, .3], [0, 0, 0], false);
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
    const pad = addMesh(group, new THREE.CylinderGeometry(3.05, 3.35, .28, 16), mat.cream, [0, .14, 0]);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: entry.color, transparent: true, opacity: .9 });
    const ring = addMesh(group, new THREE.TorusGeometry(2.72, .09, 8, 56), ringMaterial, [0, .32, 0], [Math.PI / 2, 0, 0], false);
    const beamMaterial = new THREE.MeshBasicMaterial({ color: entry.color, transparent: true, opacity: .045, depthWrite: false, side: THREE.DoubleSide });
    const beam = addMesh(group, new THREE.CylinderGeometry(1.45, 2.25, 9, 20, 1, true), beamMaterial, [0, 4.5, 0], [0, 0, 0], false);

    if (entry.id === "profile") {
      addMesh(group, new THREE.BoxGeometry(4.6, 2.2, 3.4), mat.cream, [0, 1.42, .25]);
      addMesh(group, new THREE.ConeGeometry(3.25, 1.55, 4), materials.orange, [0, 3.18, .25], [0, Math.PI / 4, 0]);
      const core = addMesh(group, new THREE.IcosahedronGeometry(.75, 2), mat.accent, [0, 3.45, -.05]);
      const orbit = addMesh(group, new THREE.TorusGeometry(1.3, .055, 8, 64), materials.dark, [0, 3.45, -.05], [.72, .25, 0]);
      animated.push(core, orbit);
      [-1.5, 1.5].forEach((x) => addMesh(group, new THREE.BoxGeometry(.78, 1.2, .12), materials.glass, [x, 1.45, -1.48]));
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
    } else if (entry.id === "credential-isolation") {
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
    } else if (entry.id === "mlops") {
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
      const leftPage = addMesh(group, new THREE.BoxGeometry(2.5, .24, 3.2), materials.cream, [-1.1, 1.1, 0], [0, 0, -.25]);
      const rightPage = addMesh(group, new THREE.BoxGeometry(2.5, .24, 3.2), materials.cream, [1.1, 1.1, 0], [0, 0, .25]);
      addMesh(group, new THREE.CylinderGeometry(.18, .18, 4.2, 8), mat.accent, [0, 1.18, 0], [Math.PI / 2, 0, 0]);
      animated.push(leftPage, rightPage);
    } else if (entry.id === "toolkit") {
      const hub = addMesh(group, new THREE.IcosahedronGeometry(1.25, 1), materials.orange, [0, 2.2, 0]);
      for (let index = 0; index < 8; index += 1) {
        const angle = index / 8 * Math.PI * 2;
        const node = addMesh(group, new THREE.BoxGeometry(.58, .58, .58), index % 2 ? materials.blue : mat.accent, [Math.cos(angle) * 2.25, 2.2 + Math.sin(index) * .35, Math.sin(angle) * 2.25]);
        animated.push(node);
      }
      animated.push(hub);
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
    landmarkVisuals.set(entry.id, { group, ring, beam, label, animated, pad });
  });

  const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xf45b38, transparent: true, opacity: .46, depthWrite: false });
  const targetBeam = addMesh(world, new THREE.CylinderGeometry(.045, .18, 18, 12, 1, true), targetMaterial, [0, 9, 0], [0, 0, 0], false);
  const targetHalo = addMesh(world, new THREE.TorusGeometry(3.25, .09, 8, 64), targetMaterial, [0, .75, 0], [Math.PI / 2, 0, 0], false);
  const targetOrb = addMesh(world, new THREE.IcosahedronGeometry(.42, 1), materials.orange, [0, 9.4, 0], [0, 0, 0], false);

  const rover = new THREE.Group();
  const suspension = new THREE.Group();
  rover.add(suspension);
  const chassis = addMesh(suspension, new THREE.BoxGeometry(1.65, .42, 2.5), materials.orange, [0, .68, 0]);
  addMesh(suspension, new THREE.BoxGeometry(1.78, .18, .38), materials.dark, [0, .55, -1.35]);
  addMesh(suspension, new THREE.BoxGeometry(1.78, .18, .32), materials.dark, [0, .55, 1.3]);
  const cabin = addMesh(suspension, new THREE.BoxGeometry(1.2, .72, 1.15), materials.cream, [0, 1.18, .15]);
  addMesh(suspension, new THREE.BoxGeometry(1.05, .5, .04), materials.glass, [0, 1.23, -.445], [-.12, 0, 0], false);
  addMesh(suspension, new THREE.BoxGeometry(1.13, .14, 1.2), materials.dark, [0, 1.62, .16]);
  const driver = addMesh(suspension, new THREE.SphereGeometry(.23, 12, 8), materials.dark, [0, 1.72, .18]);
  const flagPole = addMesh(suspension, new THREE.CylinderGeometry(.025, .025, 1.25, 6), materials.dark, [.68, 1.7, .7]);
  addMesh(suspension, new THREE.BoxGeometry(.58, .32, .035), materials.lime, [.4, 2.12, .7]);
  const wheels = [];
  const frontWheelPivots = [];
  [[-.96, .48, -.78, true], [.96, .48, -.78, true], [-.96, .48, .82, false], [.96, .48, .82, false]].forEach(([x, y, z, front]) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);
    const wheel = addMesh(pivot, new THREE.CylinderGeometry(.43, .43, .3, 18), materials.tire, [0, 0, 0], [0, 0, Math.PI / 2]);
    addMesh(wheel, new THREE.CylinderGeometry(.2, .2, .315, 12), materials.cream, [0, 0, 0]);
    suspension.add(pivot);
    wheels.push(wheel);
    if (front) frontWheelPivots.push(pivot);
  });
  [-.55, .55].forEach((x) => {
    addMesh(suspension, new THREE.CircleGeometry(.13, 16), new THREE.MeshBasicMaterial({ color: 0xfff3af }), [x, .78, -1.365], [0, 0, 0], false);
    addMesh(suspension, new THREE.CircleGeometry(.12, 16), new THREE.MeshBasicMaterial({ color: 0xe94f4f }), [x, .75, 1.47], [0, Math.PI, 0], false);
  });
  const boostTrails = [-.42, .42].map((x) => addMesh(suspension, new THREE.ConeGeometry(.13, 1.2, 8), new THREE.MeshBasicMaterial({ color: 0x7bdff2, transparent: true, opacity: 0 }), [x, .62, 1.8], [Math.PI / 2, 0, 0], false));
  world.add(rover);

  const roverShadow = addMesh(world, new THREE.CircleGeometry(1.35, 32), new THREE.MeshBasicMaterial({ color: 0x1c342e, transparent: true, opacity: .27, depthWrite: false }), [0, .68, 0], [-Math.PI / 2, 0, 0], false);
  const dustPuffs = Array.from({ length: 18 }, () => {
    const puff = addMesh(world, new THREE.IcosahedronGeometry(.18, 1), new THREE.MeshBasicMaterial({ color: 0xe8c992, transparent: true, opacity: 0, depthWrite: false }), [0, -4, 0], [0, 0, 0], false);
    return { mesh: puff, life: 0 };
  });
  let dustIndex = 0;
  let dustTimer = 0;
  let uiTimer = 0;
  let lastRampTime = -4;

  let cameraOrbit = 0;
  let cameraHeight = 7.2;
  let cameraDragging = false;
  let pointerX = 0;
  let pointerY = 0;
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
    cameraHeight = THREE.MathUtils.clamp(cameraHeight + (event.clientY - pointerY) * .025, 4.5, 11.5);
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

  function updateTargetVisual() {
    const target = entryById(state.targetId);
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
      visual.ring.material.opacity = .9;
      visual.beam.material.opacity = .045;
      visual.label.material.opacity = 1;
    });
    rover.position.set(0, .64, 31);
    rover.rotation.y = 0;
    suspension.rotation.set(0, 0, 0);
    cameraOrbit = 0;
    state.cameraOrbit = 0;
    cameraHeight = 7.2;
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
      const boosting = controls.boost && throttle > 0;
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
        .filter(({ distance }) => distance < 3.15)
        .sort((left, right) => left.distance - right.distance)[0];
      if (collision) {
        const safeDistance = Math.max(collision.distance, .001);
        const awayX = (state.player.x - collision.entry.x) / safeDistance;
        const awayZ = (state.player.z - collision.entry.z) / safeDistance;
        state.player.x = collision.entry.x + awayX * 3.15;
        state.player.z = collision.entry.z + awayZ * 3.15;
        state.player.speed *= -.2;
      }

      const islandX = state.player.x;
      const islandZ = state.player.z;
      const radius = Math.hypot(islandX, islandZ);
      if (radius > 47.2) {
        state.player.x = islandX / radius * 47.2;
        state.player.z = islandZ / radius * 47.2;
        state.player.speed *= -.28;
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
      visual.label.visible = ["loading", "menu"].includes(state.mode) || state.targetId === id || labelDistance < 18;
      visual.label.material.opacity = labelFade * (state.visited.has(id) ? .72 : 1);
    });

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
      water.rotation.z += dt * .004;
      targetHalo.rotation.z += dt * .55;
      targetOrb.rotation.y += dt * 1.4;
      targetOrb.position.y = 9.4 + Math.sin(state.elapsed * 2.1) * .35;
      driver.position.y = 1.72 + Math.sin(state.elapsed * 7) * .015;
      flagPole.rotation.z = Math.sin(state.elapsed * 7 + state.player.speed) * .006;
    }

    if (["loading", "menu"].includes(state.mode)) {
      const angle = state.elapsed * .045 + .58;
      const menuCamera = new THREE.Vector3(Math.cos(angle) * 42, 27, Math.sin(angle) * 42 + 7);
      camera.position.lerp(menuCamera, 1 - Math.exp(-1.65 * dt));
      camera.lookAt(2, 2.8, -4);
      camera.fov += (47 - camera.fov) * (1 - Math.exp(-4 * dt));
    } else {
      const camHeading = state.player.heading + cameraOrbit;
      const distance = 10.5 + Math.min(Math.abs(state.player.speed) * .12, 1.6);
      const desiredCamera = new THREE.Vector3(
        state.player.x - Math.sin(camHeading) * distance,
        cameraHeight + state.player.y * .35,
        state.player.z + Math.cos(camHeading) * distance
      );
      camera.position.lerp(desiredCamera, 1 - Math.exp(-4.1 * dt));
      const forwardX = Math.sin(state.player.heading);
      const forwardZ = -Math.cos(state.player.heading);
      camera.lookAt(state.player.x + forwardX * 2.7, 1.25 + state.player.y * .55, state.player.z + forwardZ * 2.7);
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
    cameraHeight = camera.aspect < .7 ? 8.8 : Math.min(cameraHeight, 9);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("fullscreenchange", resize);

  game = { update, render, resetVisuals, markVisited, updateTargetVisual, resize, jump };
  resetVisuals();
  state.mode = pendingStart ? "exploring" : "menu";
  state.resumeMode = state.mode;
  updateInterface();

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
  const target = entryById(state.targetId);
  const nearest = entries
    .map((entry) => ({ id: entry.id, title: entry.title, type: entry.type, distance: Number(distanceTo(entry).toFixed(2)), visited: state.visited.has(entry.id) }))
    .sort((left, right) => left.distance - right.distance)
    .slice(0, 5);
  return JSON.stringify({
    coordinate_system: "World plane: +x is east/right; -z is north/forward. Distances are world units.",
    mode: state.mode,
    player: { x: Number(state.player.x.toFixed(2)), y: Number(state.player.y.toFixed(2)), z: Number(state.player.z.toFixed(2)), heading_degrees: Number((state.player.heading * 180 / Math.PI).toFixed(1)), speed: Number(state.player.speed.toFixed(2)), airborne: state.player.airborne, boosting: controls.boost && controls.up },
    camera: { orbit_degrees: Number((state.cameraOrbit * 180 / Math.PI).toFixed(1)) },
    zone: state.zone,
    nearby: nearby ? { id: nearby.id, title: nearby.title, distance: Number(distanceTo(nearby).toFixed(2)), action: "Press Enter to inspect" } : null,
    target: target ? { id: target.id, title: target.title, distance: Number(distanceTo(target).toFixed(2)) } : null,
    selected: state.selectedId,
    visited_count: state.visited.size,
    visited_ids: [...state.visited],
    nearest_landmarks: nearest,
    controls: "WASD/arrows drive; Shift boosts; Space jumps; Enter inspects; drag rotates camera; M opens map; R respawns; F fullscreen; Escape closes panels."
  });
};
