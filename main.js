import * as THREE from 'three';
const loader = new GLTFLoader();
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, controls, scene, renderer, lr, gui;

const layers = {
	"Toggle Name": function() {
		camera.layers.toggle(0);
	},
	"Toggle Mass": function() {
		camera.layers.toggle(1);
	},
	"Enable All": function() {
		camera.layers.enableAll();
	},
	"Disable All": function() {
		camera.layers.disableAll();
	}
}

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
    camera.aspect = window.innerWidth / window.innerHeight;
	//camera.updateProjectionMatrix();
    camera.position.set(5, 0, 0); // important
	camera.layers.enableAll();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdeadbeef);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight2.position.set(- 1, - 1, - 1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.layers.enableAll();
	scene.add(axesHelper);

    loader.load(
        './damaged-helmet/DamagedHelmet.gltf',
        function(gltf) {

			console.log(gltf);

            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

			let mash = gltf.scene.children[0];

			const text = document.createElement("div");
			text.textContent = "LABEL";
			const label = new CSS2DObject(text);
			label.position.copy(mash.position);
			//label.center.set(0, 0);
			mash.add(label);

			mash.layers.enableAll();
			label.layers.set(1);

        },
        // called while loading is progressing
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // called when loading has errors
        function(error) {
            console.log('An error happened', error);

        }
    );


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

	lr = new CSS2DRenderer();
	lr.setSize(window.innerWidth, window.innerHeight);
	lr.domElement.style.position = 'absolute';
	lr.domElement.style.top = '0px';
	lr.domElement.style.pointerEvents = "none";
	document.body.appendChild( lr.domElement );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.screenSpacePanning = true;
    controls.minDistance = 2;
    controls.maxDistance = 20;

    window.addEventListener('resize', onWindowResize);

	initGUI();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight; // TODO
    //camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth/2, window.innerHeight/2);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
	lr.render(scene, camera);
}

function initGUI() {
	gui = new GUI();
	gui.title("camera layers");
	gui.add(layers, "Toggle Name");
	gui.add(layers, "Toggle Mass");
	gui.add(layers, "Enable All");
	gui.add(layers, "Disable All");

	gui.open();
}
