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

  // Setup a geometry
  const earthGeometry = new THREE.SphereGeometry(1, 70, 40);
  const earthTexture = new THREE.TextureLoader().load('images/earth.jpg')
  // Setup a material
  const earthMaterial = new THREE.MeshBasicMaterial({
    map:earthTexture,
  });
  const moonGeometry = new THREE.SphereGeometry(1, 70, 40);
  const moonTexture = new THREE.TextureLoader().load('images/moon.jpg')
  // Setup a material
  const moonMaterial = new THREE.MeshBasicMaterial({
    map:moonTexture,
  });
  // Setup a mesh with geometry + material
  const earthmesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthmesh.scale.setScalar(1.2);
  const moonmesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonmesh.scale.setScalar(0.4);
  moonmesh.position.set(1.2,1.2,0)
  scene.add(earthmesh,moonmesh);

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
