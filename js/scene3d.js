/**
 * NILAYAA INTERIORS — SINGLE 3D CONFIGURATOR
 * Only ONE Three.js renderer — on the gallery panel 1 (Living Room)
 * Activated only when user clicks "Enter 3D Mode" — zero WebGL until then.
 */

class NilayaaConfigurator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.clock = new THREE.Clock();
    this.isXRay = false;
    this.noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.rotY = 0;

    this._init();
  }

  _makeCanvasTex(w, h, drawFn) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    drawFn(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  _init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.canvas.clientWidth || 800, this.canvas.clientHeight || 600);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x08080d);
    this.scene.fog = new THREE.FogExp2(0x08080d, 0.03);

    // Camera
    const w = this.canvas.clientWidth || 800;
    const h = this.canvas.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 80);
    this.camera.position.set(6, 4, 7);

    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 14;
    this.controls.enablePan = false;
    this.controls.target.set(0, 1.2, 0);

    // Build materials
    this._buildMaterials();

    // Lighting
    this._buildLighting();

    // Build Living Room
    this._buildLivingRoom();

    // Resize observer
    const ro = new ResizeObserver(() => {
      const w2 = this.canvas.clientWidth;
      const h2 = this.canvas.clientHeight;
      if (w2 && h2) {
        this.renderer.setSize(w2, h2, false);
        this.camera.aspect = w2 / h2;
        this.camera.updateProjectionMatrix();
      }
    });
    ro.observe(this.canvas.parentElement || this.canvas);

    // Start render loop
    this._animate();
  }

  _buildMaterials() {
    // Marble texture
    const marbTex = this._makeCanvasTex(1024, 1024, (ctx, W, H) => {
      ctx.fillStyle = '#f4f0e4'; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 140; i++) {
        ctx.fillStyle = `rgba(208,196,172,${Math.random() * 0.2})`; ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * H, 40 + Math.random() * 80, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 9; i++) {
        ctx.strokeStyle = `rgba(190,155,60,${0.25 + Math.random() * 0.25})`; ctx.lineWidth = 2 + Math.random() * 3;
        ctx.beginPath(); let x = Math.random() * W, y = 0; ctx.moveTo(x, y);
        while (y < H) { x += (Math.random() - 0.48) * 55; y += 18 + Math.random() * 28; ctx.lineTo(x, y); }
        ctx.stroke();
      }
    });
    marbTex.repeat.set(2, 2);

    // Fluted panel
    const flutTex = this._makeCanvasTex(512, 512, (ctx, W, H) => {
      ctx.fillStyle = '#18100a'; ctx.fillRect(0, 0, W, H);
      const sw = 14;
      for (let x = 0; x < W; x += sw) {
        const g = ctx.createLinearGradient(x, 0, x + sw, 0);
        g.addColorStop(0, '#46301e'); g.addColorStop(0.5, '#644430'); g.addColorStop(1, '#28180a');
        ctx.fillStyle = g; ctx.fillRect(x + 2, 0, sw - 4, H);
      }
    });
    flutTex.repeat.set(4, 1);

    // Wall plaster
    const wallTex = this._makeCanvasTex(512, 512, (ctx, W, H) => {
      ctx.fillStyle = '#1c1c26'; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 320; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`; ctx.beginPath();
        ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 16, 0, Math.PI * 2); ctx.fill();
      }
    });
    wallTex.repeat.set(3, 3);

    this.mats = {
      marble:  new THREE.MeshStandardMaterial({ map: marbTex, roughness: 0.1, metalness: 0.04 }),
      fluted:  new THREE.MeshStandardMaterial({ map: flutTex, roughness: 0.46, metalness: 0.03 }),
      wall:    new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.88 }),
      brass:   new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.18, metalness: 0.92 }),
      boucle:  new THREE.MeshStandardMaterial({ color: 0xe3e0d8, roughness: 0.92 }),
      leather: new THREE.MeshStandardMaterial({ color: 0x7a3e20, roughness: 0.58 }),
      ink:     new THREE.MeshStandardMaterial({ color: 0x0d0d16, roughness: 0.88 }),
      glow:    new THREE.MeshStandardMaterial({ color: 0xffe08a, emissive: 0xc9a84c, emissiveIntensity: 2.2 }),
      wire:    new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.45 }),
    };
  }

  _buildLighting() {
    this.scene.add(new THREE.AmbientLight(0xfff5e8, 0.55));

    this.sun = new THREE.DirectionalLight(0xffeedd, 2.0);
    this.sun.position.set(6, 10, 6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 0.5; this.sun.shadow.camera.far = 30;
    this.sun.shadow.camera.left = -9; this.sun.shadow.camera.right = 9;
    this.sun.shadow.camera.top = 9; this.sun.shadow.camera.bottom = -9;
    this.sun.shadow.bias = -0.0004;
    this.scene.add(this.sun);

    this.scene.add(new THREE.DirectionalLight(0x7590b8, 0.38)).position.set(-5, 4, -4);

    this.cove = new THREE.PointLight(0xc9a84c, 1.8, 14, 1.8);
    this.cove.position.set(0, 3.9, -3.5);
    this.scene.add(this.cove);

    const spot = new THREE.SpotLight(0xffdf99, 2.5, 10, Math.PI / 4, 0.5, 1.2);
    spot.position.set(0, 3.5, 0.5);
    spot.castShadow = true;
    this.scene.add(spot);
  }

  _buildLivingRoom() {
    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), this.mats.marble);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    this.scene.add(floor);

    // Ceiling
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), this.mats.ink);
    ceil.rotation.x = Math.PI / 2; ceil.position.y = 4.4;
    this.scene.add(ceil);

    // Back wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(14, 4.4, 0.18), this.mats.wall);
    backWall.position.set(0, 2.2, -5.2); backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.18, 4.4, 12), this.mats.wall);
    leftWall.position.set(-6.5, 2.2, 0); leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Fluted feature wall panel
    const panel = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.0, 0.1), this.mats.fluted);
    panel.position.set(0, 2.0, -5.08); panel.receiveShadow = true;
    this.scene.add(panel);

    // LED cove strip
    const led = new THREE.Mesh(new THREE.BoxGeometry(7.3, 0.05, 0.07), this.mats.glow);
    led.position.set(0, 4.08, -5.05);
    this.scene.add(led);
    this.scene.add(new THREE.PointLight(0xc9a84c, 1.4, 8, 2)).position.set(0, 3.9, -4.8);

    // Sectional sofa
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.22, 1.4), this.mats.brass);
    sofaBase.position.set(-0.4, 0.11, 0.7); sofaBase.castShadow = true;
    this.scene.add(sofaBase);

    const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.5, 1.32), this.mats.boucle);
    sofaSeat.position.set(-0.4, 0.46, 0.7); sofaSeat.castShadow = true;
    this.scene.add(sofaSeat);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.62, 0.34), this.mats.boucle);
    sofaBack.position.set(-0.4, 0.85, -0.15); sofaBack.castShadow = true;
    this.scene.add(sofaBack);

    // Chaise longue
    const chaise = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 1.95), this.mats.boucle);
    chaise.position.set(-1.85, 0.46, 1.7); chaise.castShadow = true;
    this.scene.add(chaise);

    // Marble coffee table — round
    const tTop = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.1, 52), this.mats.marble);
    tTop.position.set(0.6, 0.42, 2.1); tTop.castShadow = true;
    this.scene.add(tTop);

    const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.72, 0.36, 40), this.mats.brass);
    tBase.position.set(0.6, 0.18, 2.1); tBase.castShadow = true;
    this.scene.add(tBase);

    // Chandelier rings
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.028, 18, 80), this.mats.glow);
    r1.rotation.x = Math.PI / 2; r1.position.set(0, 3.42, 0.5);
    this.scene.add(r1);

    const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.02, 16, 64), this.mats.brass);
    r2.rotation.x = Math.PI / 2 + 0.2; r2.position.set(0, 3.4, 0.5);
    this.scene.add(r2);

    // Decorative vase
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.07, 0.65, 28), this.mats.brass);
    vase.position.set(2.2, 0.33, -4.55); vase.castShadow = true;
    this.scene.add(vase);

    // Floor lamp
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.0, 12), this.mats.brass);
    pole.position.set(-5.2, 1.0, 2.8);
    this.scene.add(pole);

    const lampHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), this.mats.glow);
    lampHead.position.set(-5.2, 2.0, 2.8);
    this.scene.add(lampHead);
    this.scene.add(new THREE.PointLight(0xffeedd, 2.2, 6, 2)).position.set(-5.2, 2.0, 2.8);

    // Store all meshes for xray toggle
    this._roomMeshes = [];
    this.scene.traverse(child => {
      if (child.isMesh) this._roomMeshes.push(child);
    });
  }

  setLighting(mode) {
    const presets = {
      day:    { sunInt: 2.0, sunColor: 0xffeedd, coveInt: 1.8, bg: 0x08080d, ambInt: 0.55 },
      sunset: { sunInt: 2.6, sunColor: 0xff7a1a, coveInt: 2.4, bg: 0x1a0806, ambInt: 0.38 },
      night:  { sunInt: 0.05, sunColor: 0x2030ff, coveInt: 3.6, bg: 0x020208, ambInt: 0.18 },
    };
    const p = presets[mode]; if (!p) return;

    if (typeof gsap !== 'undefined') {
      gsap.to(this.sun, { intensity: p.sunInt, duration: 1.2 });
      gsap.to(this.sun.color, { r: ((p.sunColor >> 16) & 0xff) / 255, g: ((p.sunColor >> 8) & 0xff) / 255, b: (p.sunColor & 0xff) / 255, duration: 1.2 });
      gsap.to(this.cove, { intensity: p.coveInt, duration: 1.2 });
      gsap.to(this.scene.background, { r: ((p.bg >> 16) & 0xff) / 255, g: ((p.bg >> 8) & 0xff) / 255, b: (p.bg & 0xff) / 255, duration: 1.2 });
    } else {
      this.sun.intensity = p.sunInt;
    }
  }

  toggleXRay(on) {
    this.isXRay = on;
    this._roomMeshes.forEach(mesh => {
      if (on) {
        if (!mesh.userData._orig) mesh.userData._orig = mesh.material;
        mesh.material = this.mats.wire;
      } else {
        if (mesh.userData._orig) mesh.material = mesh.userData._orig;
      }
    });
    this.scene.background = new THREE.Color(on ? 0x020a14 : 0x08080d);
    this.scene.fog.color = new THREE.Color(on ? 0x020a14 : 0x08080d);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    if (!this.noMotion) {
      this.rotY += 0.003;
      // Gentle auto-orbit while not interacted with
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

window.NilayaaConfigurator = NilayaaConfigurator;
