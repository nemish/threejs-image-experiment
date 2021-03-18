import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshPhongMaterial,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  TextureLoader,
  WebGLRenderer,
  RepeatWrapping,
  Vector3,
  Quaternion,
} from "three";

import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const rotateX = 0.5;
const rotateY = 0.5;
const rotateZ = 0.5;

function updateGroupGeometry(mesh, geometry) {
  mesh.children[0].geometry.dispose();
  mesh.children[0].geometry = geometry;
}

const guis = {
  PlaneGeometry: function (mesh) {
    const data = {
      width: 10,
      height: 10,
      widthSegments: 1,
      heightSegments: 1,
    };

    function generateGeometry() {
      updateGroupGeometry(
        mesh,
        new PlaneGeometry(
          data.width,
          data.height,
          data.widthSegments,
          data.heightSegments
        )
      );
    }

    // const folder = gui.addFolder("THREE.PlaneGeometry");

    // folder.add(data, "width", 1, 30).onChange(generateGeometry);
    // folder.add(data, "height", 1, 30).onChange(generateGeometry);
    // folder.add(data, "widthSegments", 1, 30).step(1).onChange(generateGeometry);
    // folder
    //   .add(data, "heightSegments", 1, 30)
    //   .step(1)
    //   .onChange(generateGeometry);

    generateGeometry();
  },
  FloorGeometry: function (mesh) {
    const data = {
      width: 400,
      height: 400,
    };

    function generateGeometry() {
      updateGroupGeometry(mesh, new PlaneGeometry(data.width, data.height));
    }

    generateGeometry();
  },
};

const gui = new GUI();

const scene = new Scene();
scene.background = new Color(0x444444);

const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.z = 30;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxPolarAngle = Math.PI / 2;
orbit.maxDistance = 50;
// orbit.maxAzimuthAngle = 0;

const lights = [];
lights[0] = new PointLight(0xffffff, 3, 0);
lights[1] = new PointLight(0xffffff, 3, 0);
lights[2] = new PointLight(0xffffff, 3, 0);

lights[0].position.set(0, 100, 0);
lights[1].position.set(100, 100, 100);
lights[2].position.set(-100, -100, -100);

scene.add(lights[0]);
scene.add(lights[1]);
scene.add(lights[2]);

const group = new Group();
const groupBack = new Group();
const groupFloor = new Group();

let pictureLoaded = false;
let floorLoaded = false;

const onLoad = () => {
  pictureLoaded = true;
  bootstrap();
};

const onLoadFloor = () => {
  floorLoaded = true;
  bootstrap();
};

const bootstrap = () => {
  if (pictureLoaded && floorLoaded) {
    setTimeout(() => {
      document.getElementById("root").appendChild(renderer.domElement);
      render();
    }, 500);
  }
};

const pictureTexture = new TextureLoader().load("/dicaprio.jpg", onLoad);
const floorTexture = new TextureLoader().load("/floor.jpg", onLoadFloor);
floorTexture.wrapS = RepeatWrapping;
floorTexture.wrapT = RepeatWrapping;
floorTexture.repeat.set(20, 20);

const pictureMaterial = new MeshPhongMaterial({
  map: pictureTexture,
  // side: DoubleSide,
  flatShading: true,
});

const pictureBack = new MeshBasicMaterial({
  color: 0x156289,
  side: DoubleSide,
  flatShading: true,
});

const floorMaterial = new MeshBasicMaterial({
  map: floorTexture,
  side: DoubleSide,
});

group.add(new Mesh(new BufferGeometry(), pictureMaterial));
groupBack.add(new Mesh(new BufferGeometry(), pictureBack));
groupBack.position.set(0, 0, -0.05);
groupFloor.add(new Mesh(new BufferGeometry(), floorMaterial));
groupFloor.position.set(0, -10, 4);
groupFloor.rotation.x = Math.PI / 2;

const rotatePicture = ({ rotateX, rotateY, rotateZ }) => {
  group.rotateX(-rotateX);
  group.rotateY(-rotateY);
  group.rotateZ(-rotateZ);
  groupBack.rotateX(-rotateX);
  groupBack.rotateY(-rotateY);
  groupBack.rotateZ(-rotateZ);
};

rotatePicture({ rotateX, rotateY, rotateZ });

guis.PlaneGeometry(group);
guis.PlaneGeometry(groupBack);
guis.FloorGeometry(groupFloor);

scene.add(group);
scene.add(groupBack);
scene.add(groupFloor);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);
