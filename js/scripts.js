document.documentElement.classList.add("js");

const canvas = document.querySelector("#world");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function buildWorld() {
  if (!canvas) return;

  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (error) {
    document.documentElement.classList.add("no-webgl");
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7.6);

  const rig = new THREE.Group();
  rig.position.set(1.85, 0.05, 0);
  scene.add(rig);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.28, 4),
    new THREE.MeshPhysicalMaterial({
      color: 0x7ad7ff,
      emissive: 0x071d19,
      emissiveIntensity: 1.2,
      metalness: 0.12,
      roughness: 0.18,
      transmission: 0.25,
      thickness: 1.5,
      transparent: true,
      opacity: 0.82
    })
  );
  core.scale.set(1, 1.08, 1);
  rig.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.34, 2),
    new THREE.MeshBasicMaterial({ color: 0xc9ff58, wireframe: true, transparent: true, opacity: 0.2 })
  );
  rig.add(wire);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc9ff58, transparent: true, opacity: 0.4 });
  const blueRingMaterial = new THREE.MeshBasicMaterial({ color: 0x7ad7ff, transparent: true, opacity: 0.2 });
  [
    [2.05, 0.012, 0.25, 0.18, ringMaterial],
    [2.55, 0.009, -0.7, 0.5, blueRingMaterial],
    [1.72, 0.008, 1.05, -0.2, blueRingMaterial]
  ].forEach(([radius, tube, x, y, material]) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 180), material);
    ring.rotation.set(x, y, x * 0.6);
    rig.add(ring);
  });

  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xc9ff58 });
  [[2.1, .45, .2], [-1.25, 1.75, -.4], [.8, -2.05, .3]].forEach((position, index) => {
    const node = new THREE.Mesh(new THREE.SphereGeometry(index === 0 ? .07 : .045, 16, 16), nodeMaterial);
    node.position.set(...position);
    rig.add(node);
  });

  const starsGeometry = new THREE.BufferGeometry();
  const stars = new Float32Array(360 * 3);
  for (let i = 0; i < stars.length; i += 3) {
    stars[i] = (Math.random() - 0.5) * 13;
    stars[i + 1] = (Math.random() - 0.5) * 8;
    stars[i + 2] = (Math.random() - 0.5) * 7 - 1;
  }
  starsGeometry.setAttribute("position", new THREE.BufferAttribute(stars, 3));
  const points = new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xc9ffdb, size: .012, transparent: true, opacity: .55 }));
  scene.add(points);

  const key = new THREE.PointLight(0xc9ff58, 28, 12);
  key.position.set(3, 2.5, 4);
  scene.add(key);
  const fill = new THREE.PointLight(0x56bfff, 18, 12);
  fill.position.set(-3, -1, 4);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xe7fff2, .45));

  const pointer = { x: 0, y: 0 };
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX / window.innerWidth - .5;
    pointer.y = event.clientY / window.innerHeight - .5;
  }, { passive: true });

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    rig.position.x = width < 760 ? .7 : 1.85;
    rig.position.y = width < 760 ? -1.7 : .05;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const clock = new THREE.Clock();
  function frame() {
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      rig.rotation.y += (pointer.x * .45 + t * .055 - rig.rotation.y) * .018;
      rig.rotation.x += (-pointer.y * .24 + Math.sin(t * .35) * .05 - rig.rotation.x) * .02;
      wire.rotation.y = -t * .08;
      wire.rotation.z = t * .035;
      points.rotation.y = t * .006;
      const scroll = window.scrollY / Math.max(window.innerHeight, 1);
      rig.position.y += ((window.innerWidth < 760 ? -1.7 : .05) - scroll * .55 - rig.position.y) * .045;
    }
    if (!document.hidden) renderer.render(scene, camera);
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  frame();
}

buildWorld();

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
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
