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
  player: { x: 0, z: 31, heading: 0, speed: 0 },
  visited: new Set(),
  targetId: "profile",
  nearbyId: null,
  selectedId: null,
  zone: "Arrival plaza"
};

const controls = { up: false, down: false, left: false, right: false };
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
  const groups = [
    ["Start here", ["profile"]],
    ["Experience", entries.filter((entry) => entry.type === "experience").map((entry) => entry.id)],
    ["Projects", entries.filter((entry) => entry.type === "project").map((entry) => entry.id)],
    ["Education", entries.filter((entry) => entry.type === "education").map((entry) => entry.id)],
    ["More", entries.filter((entry) => ["toolkit", "contact"].includes(entry.type)).map((entry) => entry.id)]
  ];
  groups.forEach(([label, ids]) => {
    const group = document.createElement("section");
    group.className = "map-group";
    const heading = document.createElement("h3");
    heading.textContent = label;
    group.append(heading);
    ids.forEach((id) => {
      const entry = entryById(id);
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.destination = id;
      const dot = document.createElement("i");
      const title = document.createElement("span");
      title.textContent = entry.title;
      const distance = document.createElement("small");
      distance.textContent = "SET ROUTE";
      button.append(dot, title, distance);
      button.addEventListener("click", () => {
        state.targetId = id;
        closeMap();
        updateInterface();
        game?.updateTargetVisual();
      });
      group.append(button);
    });
    mapGrid.append(group);
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
    button.querySelector("small").textContent = state.visited.has(id) ? "VISITED" : state.targetId === id ? "TARGET" : "SET ROUTE";
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
  state.player.z = 31;
  state.player.heading = 0;
  state.player.speed = 0;
  state.visited.clear();
  state.targetId = "profile";
  state.nearbyId = null;
  state.selectedId = null;
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
  ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right"
};

window.addEventListener("keydown", (event) => {
  if (event.code in controlKeys) {
    event.preventDefault();
    setControl(controlKeys[event.code], true);
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;
  renderer.setClearColor(0x06110c, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06110c, .0145);
  const camera = new THREE.PerspectiveCamera(49, 1, .1, 180);
  camera.position.set(28, 28, 40);

  scene.add(new THREE.HemisphereLight(0xc7efff, 0x09160f, 2.9));
  const sun = new THREE.DirectionalLight(0xe4ffd4, 4.2);
  sun.position.set(-18, 28, 16);
  scene.add(sun);
  const fill = new THREE.PointLight(0x58cfff, 38, 55);
  fill.position.set(22, 11, 5);
  scene.add(fill);
  const westFill = new THREE.PointLight(0x9b8cff, 28, 50);
  westFill.position.set(-24, 9, -8);
  scene.add(westFill);

  const world = new THREE.Group();
  scene.add(world);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(78, 92),
    new THREE.MeshStandardMaterial({ color: 0x0a2016, roughness: .94, metalness: .1 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -.05, -3);
  world.add(floor);

  const grid = new THREE.GridHelper(92, 46, 0x3a775b, 0x173b2a);
  grid.position.set(0, .01, -3);
  grid.material.transparent = true;
  grid.material.opacity = .42;
  world.add(grid);

  function addRoad(x, z, width, depth) {
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshStandardMaterial({ color: 0x08120e, roughness: .88, metalness: .18 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, .025, z);
    world.add(road);
  }
  addRoad(0, -3, 7.5, 82);
  [22, 14, 3, -9, -20, -31].forEach((z) => addRoad(0, z, 64, 5.4));

  const dashMaterial = new THREE.MeshBasicMaterial({ color: 0xc9ff58, transparent: true, opacity: .36 });
  for (let z = -41; z <= 36; z += 2.4) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(.06, .9), dashMaterial);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, .045, z);
    world.add(dash);
  }
  [22, 14, 3, -9, -20, -31].forEach((z) => {
    for (let x = -29; x <= 29; x += 2.6) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(.9, .06), dashMaterial);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, .045, z);
      world.add(dash);
    }
  });

  const districtPatches = [
    [-20, -4, 26, 55, 0x0a2630], [22, -3, 27, 55, 0x18290c], [0, -32, 29, 17, 0x201a35]
  ];
  districtPatches.forEach(([x, z, width, depth, color]) => {
    const patch = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .26 }));
    patch.rotation.x = -Math.PI / 2;
    patch.position.set(x, .012, z);
    world.add(patch);
  });

  const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x10291d, emissive: 0x05110c, metalness: .38, roughness: .58 });
  const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x86ddbd, transparent: true, opacity: .46 });
  const decorativeBuildings = [
    [-34, 29, 3], [-28, 25, 6], [-33, 17, 8], [-29, 9, 4], [-34, 0, 7], [-30, -8, 5], [-34, -17, 9], [-28, -27, 5],
    [34, 30, 7], [29, 25, 4], [34, 10, 8], [30, -1, 6], [34, -10, 4], [31, -29, 7], [25, -36, 5],
    [-22, 34, 5], [-11, 34, 3], [12, 34, 4], [23, 34, 6]
  ];
  decorativeBuildings.forEach(([x, z, height], index) => {
    const building = new THREE.Mesh(new THREE.BoxGeometry(2.1, height, 2.1), buildingMaterial);
    building.position.set(x, height / 2, z);
    world.add(building);
    for (let y = .75; y < height; y += .85) {
      const windowLine = new THREE.Mesh(new THREE.BoxGeometry(1.15, .045, .02), windowMaterial);
      windowLine.position.set(x, y, z + 1.065);
      windowLine.material = windowMaterial.clone();
      windowLine.material.opacity = index % 3 === 0 ? .65 : .32;
      world.add(windowLine);
    }
  });

  function makeLabel(entry) {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 1024;
    labelCanvas.height = 256;
    const context = labelCanvas.getContext("2d");
    const hex = `#${entry.color.toString(16).padStart(6, "0")}`;
    context.fillStyle = "rgba(2, 9, 6, .88)";
    context.fillRect(18, 24, 988, 208);
    context.strokeStyle = hex;
    context.lineWidth = 3;
    context.strokeRect(18, 24, 988, 208);
    context.fillStyle = hex;
    context.font = "500 32px monospace";
    context.fillText(`${String(entry.index).padStart(2, "0")}  ${entry.type.toUpperCase()}`, 58, 82);
    context.fillStyle = "#f3f7ef";
    context.font = "500 50px sans-serif";
    const title = entry.label.length > 27 ? `${entry.label.slice(0, 27)}…` : entry.label;
    context.fillText(title, 58, 164);
    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
    sprite.scale.set(8.2, 2.05, 1);
    return sprite;
  }

  function basicMaterials(entry) {
    return {
      solid: new THREE.MeshStandardMaterial({ color: entry.color, emissive: entry.color, emissiveIntensity: .55, metalness: .48, roughness: .25 }),
      glow: new THREE.MeshBasicMaterial({ color: entry.color, transparent: true, opacity: .72 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x0a1d14, emissive: entry.color, emissiveIntensity: .12, metalness: .56, roughness: .36 })
    };
  }

  const landmarkVisuals = new Map();
  entries.forEach((entry) => {
    const group = new THREE.Group();
    group.position.set(entry.x, 0, entry.z);
    const materials = basicMaterials(entry);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.25, .055, 10, 96), materials.glow);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .06;
    group.add(ring);

    const beamMaterial = new THREE.MeshBasicMaterial({ color: entry.color, transparent: true, opacity: .055, depthWrite: false, side: THREE.DoubleSide });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(.8, 1.65, 8, 24, 1, true), beamMaterial);
    beam.position.y = 4;
    group.add(beam);

    const animated = [];
    if (entry.type === "profile") {
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 2), materials.solid);
      core.position.y = 2;
      group.add(core);
      const orbit = new THREE.Mesh(new THREE.TorusGeometry(2.1, .04, 8, 96), materials.glow);
      orbit.position.y = 2;
      orbit.rotation.set(.8, .25, .2);
      group.add(orbit);
      animated.push(core, orbit);
    } else if (entry.type === "experience") {
      [0, 1, 2].forEach((column) => {
        const height = 2.2 + ((entry.index + column) % 3) * .75;
        const tower = new THREE.Mesh(new THREE.BoxGeometry(.95, height, .95), column === 1 ? materials.solid : materials.dark);
        tower.position.set((column - 1) * 1.05, height / 2, column === 1 ? -.2 : .25);
        group.add(tower);
      });
      const crown = new THREE.Mesh(new THREE.OctahedronGeometry(.48, 0), materials.solid);
      crown.position.y = 4.25;
      group.add(crown);
      animated.push(crown);
    } else if (entry.type === "project") {
      const portal = new THREE.Mesh(new THREE.TorusGeometry(1.55, .12, 14, 96), materials.glow);
      portal.position.y = 2;
      group.add(portal);
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(.58, 1), materials.solid);
      core.position.y = 2;
      group.add(core);
      [-1.75, 1.75].forEach((x) => {
        const pylon = new THREE.Mesh(new THREE.BoxGeometry(.42, 2.8, .62), materials.dark);
        pylon.position.set(x, 1.4, .2);
        group.add(pylon);
      });
      animated.push(portal, core);
    } else if (entry.type === "education") {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, .65, 6), materials.dark);
      base.position.y = .35;
      group.add(base);
      const monument = new THREE.Mesh(new THREE.ConeGeometry(1.35, 3.6, 5), materials.solid);
      monument.position.y = 2.35;
      group.add(monument);
      animated.push(monument);
    } else if (entry.type === "toolkit") {
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(.85, 1.2, 1.25, 12), materials.solid);
      hub.position.y = .7;
      group.add(hub);
      for (let index = 0; index < 6; index += 1) {
        const angle = index / 6 * Math.PI * 2;
        const node = new THREE.Mesh(new THREE.BoxGeometry(.55, .55, .55), materials.dark);
        node.position.set(Math.cos(angle) * 1.85, 1.1, Math.sin(angle) * 1.85);
        group.add(node);
        animated.push(node);
      }
    } else {
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(.18, .48, 4.8, 8), materials.dark);
      mast.position.y = 2.4;
      group.add(mast);
      [1.4, 2.2, 3].forEach((y, index) => {
        const signal = new THREE.Mesh(new THREE.TorusGeometry(.8 + index * .36, .035, 8, 64, Math.PI), materials.glow);
        signal.position.y = y;
        signal.rotation.z = Math.PI / 2;
        group.add(signal);
        animated.push(signal);
      });
    }

    const label = makeLabel(entry);
    label.position.set(0, entry.type === "experience" ? 5.2 : 4.9, 0);
    group.add(label);
    world.add(group);
    landmarkVisuals.set(entry.id, { group, ring, beam, label, animated, materials });
  });

  const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xc9ff58, transparent: true, opacity: .22, depthWrite: false });
  const targetBeam = new THREE.Mesh(new THREE.CylinderGeometry(.05, .38, 13, 16, 1, true), targetMaterial);
  targetBeam.position.y = 6.5;
  world.add(targetBeam);
  const targetHalo = new THREE.Mesh(new THREE.TorusGeometry(2.65, .035, 8, 96), targetMaterial);
  targetHalo.rotation.x = Math.PI / 2;
  targetHalo.position.y = .09;
  world.add(targetHalo);

  const rover = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.35, .4, 1.9), new THREE.MeshStandardMaterial({ color: 0xe8f5ec, metalness: .68, roughness: .22 }));
  body.position.y = .55;
  rover.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(.88, .46, .8), new THREE.MeshPhysicalMaterial({ color: 0x71d7ff, emissive: 0x0b3740, emissiveIntensity: 1.5, metalness: .15, roughness: .16, transparent: true, opacity: .88 }));
  cabin.position.set(0, .93, .06);
  rover.add(cabin);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(.38, .72, 3), new THREE.MeshBasicMaterial({ color: 0xc9ff58 }));
  nose.rotation.x = -Math.PI / 2;
  nose.position.set(0, .6, -1.2);
  rover.add(nose);
  const wheels = [];
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x101713, roughness: .82 });
  [[-.75, .37, -.61], [.75, .37, -.61], [-.75, .37, .61], [.75, .37, .61]].forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .19, 20), wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    wheels.push(wheel);
    rover.add(wheel);
  });
  const roverLight = new THREE.PointLight(0xc9ff58, 10, 5.5);
  roverLight.position.set(0, .55, -1.1);
  rover.add(roverLight);
  world.add(rover);

  const roverShadow = new THREE.Mesh(new THREE.CircleGeometry(1.18, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .34, depthWrite: false }));
  roverShadow.rotation.x = -Math.PI / 2;
  roverShadow.position.y = .018;
  world.add(roverShadow);

  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(520 * 3);
  for (let index = 0; index < particlePositions.length; index += 3) {
    particlePositions[index] = (Math.random() - .5) * 82;
    particlePositions[index + 1] = Math.random() * 15 + .4;
    particlePositions[index + 2] = (Math.random() - .5) * 96 - 3;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0xa2f0c6, size: .028, transparent: true, opacity: .55 }));
  scene.add(particles);

  function markVisited(id) {
    const visual = landmarkVisuals.get(id);
    if (!visual) return;
    visual.ring.material.color.setHex(0xf3f7ef);
    visual.ring.material.opacity = .32;
    visual.beam.material.opacity = .018;
    visual.label.material.opacity = .62;
  }

  function updateTargetVisual() {
    const target = entryById(state.targetId);
    if (!target) return;
    targetBeam.position.x = target.x;
    targetBeam.position.z = target.z;
    targetHalo.position.x = target.x;
    targetHalo.position.z = target.z;
  }

  function resetVisuals() {
    entries.forEach((entry) => {
      const visual = landmarkVisuals.get(entry.id);
      visual.ring.material.color.setHex(entry.color);
      visual.ring.material.opacity = .72;
      visual.beam.material.opacity = .055;
      visual.label.material.opacity = 1;
    });
    rover.position.set(0, 0, 31);
    rover.rotation.y = 0;
    updateTargetVisual();
  }

  function update(dt) {
    state.elapsed += dt;

    if (state.mode === "exploring") {
      const throttle = Number(controls.up) - Number(controls.down);
      const steer = Number(controls.right) - Number(controls.left);
      state.player.speed += throttle * (throttle >= 0 ? 9.2 : 6.6) * dt;
      if (!throttle) state.player.speed *= Math.exp(-4.1 * dt);
      state.player.speed = THREE.MathUtils.clamp(state.player.speed, -3.8, 8.2);
      const steeringStrength = .28 + Math.min(Math.abs(state.player.speed) / 5.5, 1);
      state.player.heading += steer * 1.72 * steeringStrength * dt * (state.player.speed < -.1 ? -1 : 1);
      const forwardX = Math.sin(state.player.heading);
      const forwardZ = -Math.cos(state.player.heading);
      state.player.x += forwardX * state.player.speed * dt;
      state.player.z += forwardZ * state.player.speed * dt;

      const clampedX = THREE.MathUtils.clamp(state.player.x, -36.5, 36.5);
      const clampedZ = THREE.MathUtils.clamp(state.player.z, -43, 39);
      if (clampedX !== state.player.x || clampedZ !== state.player.z) state.player.speed *= -.22;
      state.player.x = clampedX;
      state.player.z = clampedZ;

      const nearest = entries
        .map((entry) => ({ entry, distance: distanceTo(entry) }))
        .filter((candidate) => candidate.distance < 3.35)
        .sort((left, right) => left.distance - right.distance)[0]?.entry ?? null;
      if (nearest?.id !== state.nearbyId) {
        state.nearbyId = nearest?.id ?? null;
        updateInterface();
      }
      updateInterface();
    }

    rover.position.set(state.player.x, Math.sin(state.elapsed * 4.2) * .018, state.player.z);
    rover.rotation.y = -state.player.heading;
    roverShadow.position.set(state.player.x, .018, state.player.z);
    wheels.forEach((wheel) => { wheel.rotation.x -= state.player.speed * dt * 2.5; });

    landmarkVisuals.forEach((visual, id) => {
      if (reduceMotion) return;
      visual.animated.forEach((object, index) => {
        object.rotation.y += dt * (.22 + index * .05);
        if (object.geometry?.type === "OctahedronGeometry") object.position.y += Math.sin(state.elapsed * 1.6 + entries.findIndex((entry) => entry.id === id)) * .0015;
      });
      visual.ring.rotation.z -= dt * .06;
    });
    if (!reduceMotion) {
      particles.rotation.y += dt * .0025;
      targetHalo.rotation.z += dt * .32;
      targetMaterial.opacity = .18 + Math.sin(state.elapsed * 2.1) * .08;
    }

    if (["loading", "menu"].includes(state.mode)) {
      const menuCamera = new THREE.Vector3(28, 26, 40);
      camera.position.lerp(menuCamera, 1 - Math.exp(-1.8 * dt));
      camera.lookAt(2, 1.5, -2);
    } else {
      const forwardX = Math.sin(state.player.heading);
      const forwardZ = -Math.cos(state.player.heading);
      const desiredCamera = new THREE.Vector3(state.player.x - forwardX * 9 + 5.2, 7.4, state.player.z - forwardZ * 9 + 5.2);
      camera.position.lerp(desiredCamera, 1 - Math.exp(-3.4 * dt));
      camera.lookAt(state.player.x + forwardX * 2.3, .8, state.player.z + forwardZ * 2.3);
    }
  }

  function render() {
    renderer.render(scene, camera);
  }

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    camera.fov = camera.aspect < .7 ? 55 : 49;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("fullscreenchange", resize);

  game = { update, render, resetVisuals, markVisited, updateTargetVisual, resize };
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
    player: { x: Number(state.player.x.toFixed(2)), z: Number(state.player.z.toFixed(2)), heading_degrees: Number((state.player.heading * 180 / Math.PI).toFixed(1)), speed: Number(state.player.speed.toFixed(2)) },
    zone: state.zone,
    nearby: nearby ? { id: nearby.id, title: nearby.title, distance: Number(distanceTo(nearby).toFixed(2)), action: "Press Enter to inspect" } : null,
    target: target ? { id: target.id, title: target.title, distance: Number(distanceTo(target).toFixed(2)) } : null,
    selected: state.selectedId,
    visited_count: state.visited.size,
    visited_ids: [...state.visited],
    nearest_landmarks: nearest,
    controls: "WASD/arrows drive; Enter inspects; M opens map; R resets; F fullscreen; Escape closes panels."
  });
};
