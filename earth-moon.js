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

  // Earth
  const earthGeometry = new THREE.SphereGeometry(1, 70, 40);
  const earthTexture = new THREE.TextureLoader().load('images/earth.jpg');
  const earthMaterial = new THREE.MeshStandardMaterial({
    map:earthTexture,
  });
  const earthmesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthmesh.scale.setScalar(1);
  earthmesh.rotation.z=-0.4;

  //Moon
  const moonGroup= new THREE.Group();
  const moonGeometry = new THREE.SphereGeometry(1, 70, 40);
  const moonTexture = new THREE.TextureLoader().load('images/moon.jpg')
  const moonMaterial = new THREE.MeshStandardMaterial({
    map:moonTexture,
  });
  const moonmesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonmesh.scale.setScalar(0.25);
  moonmesh.position.set(1.2,1.2,0);
  moonGroup.add(moonmesh);
  
  scene.add(earthmesh,moonGroup);

  //Create light
  const light = new THREE.DirectionalLight('white',1.4);
  light.position.set(5,0,4);
  scene.add(light);
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
      earthmesh.rotation.y=time*0.4;
      moonmesh.rotation.y=time*0.28;
      moonGroup.rotation.y=time*(-0.8);
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
