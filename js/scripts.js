document.documentElement.classList.add("js");

const canvas = document.querySelector("#world");
const gameMenu = document.querySelector("#game-menu");
const gameHud = document.querySelector("#game-hud");
const gameComplete = document.querySelector("#game-complete");
const startButton = document.querySelector("#start-game");
const restartButton = document.querySelector("#restart-game");
const fullscreenButton = document.querySelector("#fullscreen-button");
const touchControls = document.querySelector("#touch-controls");
const gameStatus = document.querySelector("#game-status");
const checkpointCount = document.querySelector("#checkpoint-count");
const checkpointCallout = document.querySelector("#checkpoint-callout");
const calloutIndex = document.querySelector("#callout-index");
const calloutTitle = document.querySelector("#callout-title");
const calloutCopy = document.querySelector("#callout-copy");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const touchDevice = window.matchMedia("(pointer: coarse)").matches;

const checkpointDefinitions = [
  { id: "data", label: "DATA", x: 0, z: 8, title: "DATA CONNECTED", copy: "Portable inputs. Verifiable bytes.", color: 0x7ad7ff },
  { id: "compute", label: "COMPUTE", x: 0, z: 1, title: "COMPUTE ONLINE", copy: "Vectorized paths. GPUs kept busy.", color: 0xc9ff58 },
  { id: "identity", label: "IDENTITY", x: 0, z: -6, title: "IDENTITY VERIFIED", copy: "Short-lived access. No ambient fallback.", color: 0xa993ff },
  { id: "evidence", label: "EVIDENCE", x: 0, z: -13, title: "EVIDENCE SEALED", copy: "Every decision leaves a trace.", color: 0xffca69 }
];

const state = {
  mode: "menu",
  elapsed: 0,
  player: { x: 0, z: 14, heading: 0, speed: 0 },
  checkpoints: checkpointDefinitions.map((checkpoint) => ({ ...checkpoint, collected: false })),
  activeCallout: null,
  calloutUntil: 0,
  completeAt: null
};

const controls = { up: false, down: false, left: false, right: false };
let game = null;
let pendingStart = false;

function updateInterface() {
  const playing = state.mode === "playing";
  gameMenu.hidden = state.mode !== "menu";
  gameHud.hidden = !playing;
  gameComplete.hidden = state.mode !== "complete";
  touchControls.hidden = !playing || !touchDevice;
  checkpointCallout.hidden = !state.activeCallout || state.mode !== "playing";

  const collected = state.checkpoints.filter((checkpoint) => checkpoint.collected).length;
  checkpointCount.textContent = `${collected} / ${state.checkpoints.length}`;
  document.querySelectorAll("[data-checkpoint]").forEach((item) => {
    const checkpoint = state.checkpoints.find((candidate) => candidate.id === item.dataset.checkpoint);
    item.classList.toggle("is-collected", Boolean(checkpoint?.collected));
  });

  if (state.activeCallout) {
    const index = state.checkpoints.findIndex((checkpoint) => checkpoint.id === state.activeCallout.id) + 1;
    calloutIndex.textContent = String(index).padStart(2, "0");
    calloutTitle.textContent = state.activeCallout.title;
    calloutCopy.textContent = state.activeCallout.copy;
  }

  if (state.mode === "menu") gameStatus.textContent = "System waiting for pilot";
  if (state.mode === "playing") gameStatus.textContent = `${collected} of ${state.checkpoints.length} layers connected`;
  if (state.mode === "complete") gameStatus.textContent = "System online";
}

function resetState(startImmediately = false) {
  state.mode = startImmediately ? "playing" : "menu";
  state.elapsed = 0;
  state.player.x = 0;
  state.player.z = 14;
  state.player.heading = 0;
  state.player.speed = 0;
  state.activeCallout = null;
  state.calloutUntil = 0;
  state.completeAt = null;
  state.checkpoints.forEach((checkpoint) => { checkpoint.collected = false; });
  Object.keys(controls).forEach((key) => { controls[key] = false; });
  game?.resetVisuals();
  updateInterface();
  if (startImmediately) canvas.focus({ preventScroll: true });
}

function startGame() {
  if (!game) {
    pendingStart = true;
    gameStatus.textContent = "Loading system world";
    return;
  }
  resetState(true);
}

function completeGame() {
  state.mode = "complete";
  state.player.speed = 0;
  state.activeCallout = null;
  state.completeAt = null;
  updateInterface();
}

function setControl(name, active) {
  if (name in controls) controls[name] = active;
}

const controlKeys = {
  ArrowUp: "up", KeyW: "up",
  ArrowDown: "down", KeyS: "down",
  ArrowLeft: "left", KeyA: "left",
  ArrowRight: "right", KeyD: "right"
};

window.addEventListener("keydown", (event) => {
  if (event.code in controlKeys) {
    event.preventDefault();
    setControl(controlKeys[event.code], true);
  }
  if (event.code === "Enter" && state.mode === "menu") startGame();
  if (event.code === "KeyR" && state.mode !== "menu") resetState(true);
  if (event.code === "KeyF") toggleFullscreen();
  if (event.code === "Escape" && document.fullscreenElement) document.exitFullscreen?.();
});

window.addEventListener("keyup", (event) => {
  if (event.code in controlKeys) {
    event.preventDefault();
    setControl(controlKeys[event.code], false);
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
    setControl(name, false);
    button.classList.remove("is-active");
  };
  button.addEventListener("pointerdown", activate);
  button.addEventListener("pointerup", deactivate);
  button.addEventListener("pointercancel", deactivate);
  button.addEventListener("pointerleave", deactivate);
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.querySelector(".game-hero")?.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", () => resetState(true));
fullscreenButton.addEventListener("click", toggleFullscreen);

async function buildGame() {
  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (error) {
    document.documentElement.classList.add("no-webgl");
    gameStatus.textContent = "3D unavailable — the portfolio is still below";
    startButton.disabled = true;
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.setClearColor(0x030806, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030806, 0.028);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
  camera.position.set(7, 7.5, 20);

  scene.add(new THREE.HemisphereLight(0xbbeeff, 0x07100c, 2.2));
  const keyLight = new THREE.DirectionalLight(0xc9ffb0, 3.2);
  keyLight.position.set(-8, 12, 8);
  scene.add(keyLight);
  const blueLight = new THREE.PointLight(0x57cfff, 20, 22);
  blueLight.position.set(6, 5, 2);
  scene.add(blueLight);

  const world = new THREE.Group();
  scene.add(world);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 42),
    new THREE.MeshStandardMaterial({ color: 0x091a12, roughness: .96, metalness: .08 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -.03, 0);
  world.add(floor);

  const grid = new THREE.GridHelper(42, 42, 0x315c49, 0x162a21);
  grid.position.y = .01;
  grid.material.transparent = true;
  grid.material.opacity = .48;
  world.add(grid);

  const routePoints = [new THREE.Vector3(0, .04, 15.5), ...checkpointDefinitions.map((checkpoint) => new THREE.Vector3(checkpoint.x, .04, checkpoint.z)), new THREE.Vector3(0, .04, -16)];
  const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
  const route = new THREE.Line(routeGeometry, new THREE.LineDashedMaterial({ color: 0xc9ff58, dashSize: .35, gapSize: .32, transparent: true, opacity: .55 }));
  route.computeLineDistances();
  world.add(route);

  const laneMaterial = new THREE.MeshBasicMaterial({ color: 0x173426, transparent: true, opacity: .72 });
  [-2.15, 2.15].forEach((x) => {
    const lane = new THREE.Mesh(new THREE.PlaneGeometry(.04, 36), laneMaterial);
    lane.rotation.x = -Math.PI / 2;
    lane.position.set(x, .025, -.5);
    world.add(lane);
  });

  const structureMaterial = new THREE.MeshStandardMaterial({ color: 0x0d261b, emissive: 0x06150f, metalness: .5, roughness: .58 });
  const beaconMaterial = new THREE.MeshBasicMaterial({ color: 0x7ad7ff });
  const structures = [
    [-6.8, 12, 1.8], [6.4, 10.2, 2.7], [-7.5, 6.2, 3.8], [7.2, 4.4, 1.5],
    [-6.2, .5, 2.4], [6.7, -1.5, 3.2], [-7.4, -5.5, 1.7], [7.5, -7.3, 2.5],
    [-6.5, -12, 3.5], [6.3, -14, 2.1]
  ];
  structures.forEach(([x, z, height], index) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(1.35, height, 1.35), structureMaterial);
    tower.position.set(x, height / 2, z);
    world.add(tower);
    for (let row = .55; row < height; row += .62) {
      const light = new THREE.Mesh(new THREE.BoxGeometry(.72, .035, .018), beaconMaterial);
      light.position.set(x, row, z + .69);
      light.material = beaconMaterial.clone();
      light.material.opacity = index % 2 ? .28 : .5;
      light.material.transparent = true;
      world.add(light);
    }
  });

  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(260 * 3);
  for (let i = 0; i < particlePositions.length; i += 3) {
    particlePositions[i] = (Math.random() - .5) * 36;
    particlePositions[i + 1] = Math.random() * 10 + .3;
    particlePositions[i + 2] = (Math.random() - .5) * 46;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x8ceec0, size: .025, transparent: true, opacity: .48 }));
  scene.add(particles);

  function labelSprite(text, color) {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 512;
    labelCanvas.height = 128;
    const context = labelCanvas.getContext("2d");
    context.clearRect(0, 0, 512, 128);
    context.fillStyle = "rgba(3, 8, 6, .82)";
    context.fillRect(20, 24, 472, 80);
    context.strokeStyle = `#${color.toString(16).padStart(6, "0")}`;
    context.lineWidth = 2;
    context.strokeRect(20, 24, 472, 80);
    context.fillStyle = "#f4f7ef";
    context.font = "500 34px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 66);
    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
    sprite.scale.set(4.5, 1.12, 1);
    return sprite;
  }

  const checkpointGroups = state.checkpoints.map((checkpoint, index) => {
    const group = new THREE.Group();
    group.position.set(checkpoint.x, 0, checkpoint.z);
    const beamMaterial = new THREE.MeshBasicMaterial({ color: checkpoint.color, transparent: true, opacity: .11, depthWrite: false });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(.7, 1.1, 4.8, 24, 1, true), beamMaterial);
    beam.position.y = 2.4;
    group.add(beam);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: checkpoint.color, transparent: true, opacity: .78 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.35, .045, 10, 96), ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .07;
    group.add(ring);
    const orbMaterial = new THREE.MeshStandardMaterial({ color: checkpoint.color, emissive: checkpoint.color, emissiveIntensity: 2.4, roughness: .25 });
    const orb = new THREE.Mesh(new THREE.OctahedronGeometry(.38, 1), orbMaterial);
    orb.position.y = 1.1;
    group.add(orb);
    const label = labelSprite(`${String(index + 1).padStart(2, "0")}  ${checkpoint.label}`, checkpoint.color);
    label.position.set(0, 2.5, 0);
    group.add(label);
    world.add(group);
    return { group, ring, orb, beam, label, ringMaterial, orbMaterial, beamMaterial };
  });

  const rover = new THREE.Group();
  const roverBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, .38, 1.8),
    new THREE.MeshStandardMaterial({ color: 0xdaf7e6, metalness: .7, roughness: .22 })
  );
  roverBody.position.y = .52;
  rover.add(roverBody);
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(.84, .42, .78),
    new THREE.MeshPhysicalMaterial({ color: 0x7ad7ff, emissive: 0x0b2b31, emissiveIntensity: 1.4, metalness: .15, roughness: .18, transparent: true, opacity: .86 })
  );
  cabin.position.set(0, .89, .08);
  rover.add(cabin);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(.35, .7, 3), new THREE.MeshBasicMaterial({ color: 0xc9ff58 }));
  nose.rotation.x = -Math.PI / 2;
  nose.position.set(0, .57, -1.13);
  rover.add(nose);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x111a16, roughness: .8 });
  const wheels = [];
  [[-.7, .36, -.57], [.7, .36, -.57], [-.7, .36, .57], [.7, .36, .57]].forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.28, .28, .18, 20), wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    wheels.push(wheel);
    rover.add(wheel);
  });
  const roverGlow = new THREE.PointLight(0xc9ff58, 6, 4);
  roverGlow.position.set(0, .45, -.9);
  rover.add(roverGlow);
  rover.position.set(state.player.x, 0, state.player.z);
  world.add(rover);

  const roverShadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.1, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .32, depthWrite: false })
  );
  roverShadow.rotation.x = -Math.PI / 2;
  roverShadow.position.y = .015;
  world.add(roverShadow);

  function resetVisuals() {
    checkpointGroups.forEach((visual, index) => {
      const definition = state.checkpoints[index];
      visual.ringMaterial.color.setHex(definition.color);
      visual.ringMaterial.opacity = .78;
      visual.orbMaterial.color.setHex(definition.color);
      visual.orbMaterial.emissive.setHex(definition.color);
      visual.orbMaterial.emissiveIntensity = 2.4;
      visual.beamMaterial.opacity = .11;
      visual.orb.scale.setScalar(1);
      visual.label.material.opacity = 1;
    });
    rover.position.set(0, 0, 14);
    rover.rotation.y = 0;
  }

  function collectCheckpoint(index) {
    const checkpoint = state.checkpoints[index];
    if (checkpoint.collected) return;
    checkpoint.collected = true;
    state.activeCallout = checkpoint;
    state.calloutUntil = state.elapsed + 2.2;
    const visual = checkpointGroups[index];
    visual.ringMaterial.color.setHex(0xc9ff58);
    visual.ringMaterial.opacity = .24;
    visual.orbMaterial.color.setHex(0xc9ff58);
    visual.orbMaterial.emissive.setHex(0xc9ff58);
    visual.orbMaterial.emissiveIntensity = .55;
    visual.beamMaterial.opacity = .025;
    visual.orb.scale.setScalar(.62);
    visual.label.material.opacity = .45;
    updateInterface();
    if (state.checkpoints.every((candidate) => candidate.collected)) {
      state.completeAt = state.elapsed + .65;
    }
  }

  function update(dt) {
    state.elapsed += dt;

    if (state.mode === "playing") {
      const throttle = Number(controls.up) - Number(controls.down);
      const steer = Number(controls.right) - Number(controls.left);
      const acceleration = throttle >= 0 ? 8.4 : 6.2;
      state.player.speed += throttle * acceleration * dt;
      if (!throttle) state.player.speed *= Math.exp(-4.2 * dt);
      state.player.speed = THREE.MathUtils.clamp(state.player.speed, -3.4, 7.1);

      const steeringStrength = .32 + Math.min(Math.abs(state.player.speed) / 5, 1);
      state.player.heading += steer * 1.75 * steeringStrength * dt * (state.player.speed < -.1 ? -1 : 1);
      const forwardX = Math.sin(state.player.heading);
      const forwardZ = -Math.cos(state.player.heading);
      state.player.x += forwardX * state.player.speed * dt;
      state.player.z += forwardZ * state.player.speed * dt;

      const clampedX = THREE.MathUtils.clamp(state.player.x, -14.2, 14.2);
      const clampedZ = THREE.MathUtils.clamp(state.player.z, -18.5, 18.5);
      if (clampedX !== state.player.x || clampedZ !== state.player.z) state.player.speed *= -.18;
      state.player.x = clampedX;
      state.player.z = clampedZ;

      state.checkpoints.forEach((checkpoint, index) => {
        if (checkpoint.collected) return;
        const distance = Math.hypot(state.player.x - checkpoint.x, state.player.z - checkpoint.z);
        if (distance < 1.55) collectCheckpoint(index);
      });

      if (state.activeCallout && state.elapsed > state.calloutUntil) {
        state.activeCallout = null;
        updateInterface();
      }
      if (state.completeAt !== null && state.elapsed >= state.completeAt) completeGame();
    }

    rover.position.set(state.player.x, Math.sin(state.elapsed * 4) * .018, state.player.z);
    rover.rotation.y = -state.player.heading;
    roverShadow.position.set(state.player.x, .015, state.player.z);
    wheels.forEach((wheel) => { wheel.rotation.x -= state.player.speed * dt * 2.4; });

    checkpointGroups.forEach((visual, index) => {
      if (!reduceMotion) {
        visual.orb.rotation.y += dt * (1.1 + index * .16);
        visual.orb.position.y = 1.1 + Math.sin(state.elapsed * 1.7 + index) * .11;
        visual.ring.rotation.z -= dt * .12;
      }
    });
    if (!reduceMotion) particles.rotation.y += dt * .004;

    const forwardX = Math.sin(state.player.heading);
    const forwardZ = -Math.cos(state.player.heading);
    const desiredCamera = new THREE.Vector3(
      state.player.x - forwardX * 7.2 + 4.2,
      6.3,
      state.player.z - forwardZ * 7.2 + 4.2
    );
    const cameraEase = 1 - Math.exp(-3.5 * dt);
    camera.position.lerp(desiredCamera, cameraEase);
    camera.lookAt(state.player.x + forwardX * 2.1, .7, state.player.z + forwardZ * 2.1);
  }

  function render() {
    renderer.render(scene, camera);
  }

  function resize() {
    const rect = document.querySelector(".game-hero").getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.fov = 48;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("fullscreenchange", resize);

  game = { update, render, resetVisuals, resize };
  resetVisuals();
  render();
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

  if (pendingStart) startGame();
}

buildGame();

window.advanceTime = (ms) => {
  if (!game) return;
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let index = 0; index < steps; index += 1) game.update(1 / 60);
  game.render();
};

window.render_game_to_text = () => {
  const collected = state.checkpoints.filter((checkpoint) => checkpoint.collected).length;
  return JSON.stringify({
    coordinate_system: "World plane: +x is right/east; -z is forward/north. Distances are world units.",
    mode: state.mode,
    player: {
      x: Number(state.player.x.toFixed(2)),
      z: Number(state.player.z.toFixed(2)),
      heading_degrees: Number((state.player.heading * 180 / Math.PI).toFixed(1)),
      speed: Number(state.player.speed.toFixed(2))
    },
    checkpoints: state.checkpoints.map((checkpoint) => ({
      id: checkpoint.id,
      x: checkpoint.x,
      z: checkpoint.z,
      collected: checkpoint.collected,
      distance: Number(Math.hypot(state.player.x - checkpoint.x, state.player.z - checkpoint.z).toFixed(2))
    })),
    collected_count: collected,
    active_callout: state.activeCallout?.id ?? null,
    completion_pending: state.completeAt !== null,
    goal: "Collect all four checkpoints to bring the ML system online.",
    controls: "Enter/start button starts. WASD or arrows drive. R restarts. F toggles fullscreen."
  });
};

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: .08 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `rotateX(${-y * 3.5}deg) rotateY(${x * 4.5}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
