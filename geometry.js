// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  const geometry = new THREE.BufferGeometry();

  // Here are the 'base' vertices of a normalized triangle
  const baseTriangle = [
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(0.5, 0.5, 0),
    new THREE.Vector3(-0.5, -0.5, 0),
  ];

  // A set of different colors we can choose from
  const hexColors = ['#fe765a', '#ffb468', '#4b588f', '#faf1e0'];

  const positions = [];
  const colors = [];
  const particles = 150;

  for (let i = 0; i < particles; i++) {
    // Clone the verts, let's do some adjustments
    let vertices = baseTriangle.map(p => p.clone());

    // vertices *= triangleScale
    const triangleScale = Math.random()*1.1;
    vertices = vertices.map(p => p.multiplyScalar(triangleScale));

    // Get a random offset within -1..1 box
    const offset = new THREE.Vector3(
      Math.random() * 3 - 1,
      Math.random() * 3 - 1,
      Math.random() * 3 - 1
    );
    vertices = vertices.map(p => p.add(offset));

    // apply a random Euler xyz rotation
    const randomRotation = new THREE.Euler(
      (Math.random() * 3 - 1) * Math.PI * 2,
      (Math.random() * 3 - 1) * Math.PI * 2,
      (Math.random() * 3 - 1) * Math.PI * 2
    );
    vertices = vertices.map(p => p.applyEuler(randomRotation));

    // And now turn this into an array of arrays
    vertices = vertices.map(p => p.toArray());

    // And lastly 'flatten' it so its just a list of xyz numbers
    vertices = vertices.flat();

    // Concat those into the final array of positions
    positions.push(...vertices);

    // And give this face (3 vertices) a color
    const hex = hexColors[Math.floor(Math.random() * hexColors.length)];
    const color = new THREE.Color(hex);
    for (let c = 0; c < 3; c++) {
      colors.push(color.r, color.g, color.b);
    }
  }

  const positionAttribute = new THREE.BufferAttribute(
    new Float32Array(positions),
    3
  );
  geometry.addAttribute("position", positionAttribute);

  const colorAttribute = new THREE.BufferAttribute(new Float32Array(colors), 3);
  geometry.addAttribute("color", colorAttribute);

  // Enable vertex colors on the material
  const material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide
  });

  // Create a mesh
  const mesh = new THREE.Mesh(geometry, material);

  mesh.scale.setScalar(0.85);
  scene.add(mesh);
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
    mesh.rotation.x=time*0.2;
    mesh.rotation.y=time*0.3;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
