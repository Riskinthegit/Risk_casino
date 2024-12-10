import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas#webgl')

// Scene
const scene = new THREE.Scene()

const gltfloader = new GLTFLoader()
gltfloader.load('/data/Tragamodenad3D.gltf',
(gltf) =>
{
    console.log(gltf)
    var group = new THREE.Group()

    for(const child of gltf.scene.children)
{
    group.add(child)
}
scene.add(group)
group.scale.setScalar(.01)
}
 

)

function manualChunks(id, { getModuleInfo }) {
	const match = /.*\.strings\.(\w+)\.js/.exec(id);
	if (match) {
		const language = match[1]; // e.g. "en"
		const dependentEntryPoints = [];

		// we use a Set here so we handle each module at most once. This
		// prevents infinite loops in case of circular dependencies
		const idsToHandle = new Set(getModuleInfo(id).dynamicImporters);

		for (const moduleId of idsToHandle) {
			const { isEntry, dynamicImporters, importers } =
				getModuleInfo(moduleId);
			if (isEntry || dynamicImporters.length > 0)
				dependentEntryPoints.push(moduleId);

			// The Set iterator is intelligent enough to iterate over
			// elements that are added during iteration
			for (const importerId of importers) idsToHandle.add(importerId);
		}

		// If there is a unique entry, we put it into a chunk based on the
		// entry name
		if (dependentEntryPoints.length === 1) {
			return `${
				dependentEntryPoints[0].split('/').slice(-1)[0].split('.')[0]
			}.strings.${language}`;
		}
		// For multiple entries, we put it into a "shared" chunk
		if (dependentEntryPoints.length > 1) {
			return `shared.strings.${language}`;
		}
	}
}
// /**
//  * Floor
//  */
// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: 'background.jpg',
//         // metalness: 0,
//         // roughness: 0.5
//     })
// )






// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update window.camera
    window.camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

  // Crear un plano para la imagen de fondo
  const loader = new THREE.TextureLoader();
  loader.load(
    '/static/data/background.png', // Reemplaza con la ruta de tu imagen PNG
    function(texture) {
      scene.background = texture; // Asignar la textura como fondo
    },
    undefined,
    function(err) {
      console.error('Error al cargar la textura:', err);
    }
  );

/**
 * window.Camera
 */
// Base window.camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
window.camera = camera
console.log(window.camera)
console.log(camera)
window.camera.position.set(0, 0.375, .45)
scene.add(window.camera)


// Controls
// const controls = new OrbitControls(window.camera, canvas)
// controls.target.set(0, 0.75, 0)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    // controls.update()
// console.log(window.camera)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()