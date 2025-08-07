const planeSize = 2; // Example size
const portfolioPlanes = [];

const textures = [
    'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg'
];

textures.forEach((src, index) => {
    const texture = new THREE.TextureLoader().load(src);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    portfolioPlanes.push(material); // store material for reuse
});



function createTile(x, z) {
    const index = Math.abs((x * 31 + z * 17)) % portfolioPlanes.length;
    const material = portfolioPlanes[index];
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x * planeSize, 0, z * planeSize);
    return mesh;
}




const visibleTiles = new Map(); // key: "x,z" -> mesh
const range = 2; // Tiles around current tile (creates a 5x5 grid)
let currentTileCoord = { x: 0, z: 0 };

function getTileCoord(pos) {
    return {
        x: Math.floor(pos.x / planeSize),
        z: Math.floor(pos.z / planeSize)
    };
}

function updateTiles() {
    const newCoord = getTileCoord(camera.position);

    if (newCoord.x !== currentTileCoord.x || newCoord.z !== currentTileCoord.z) {
        currentTileCoord = newCoord;
        const newVisible = new Map();

        for (let dx = -range; dx <= range; dx++) {
            for (let dz = -range; dz <= range; dz++) {
                const x = currentTileCoord.x + dx;
                const z = currentTileCoord.z + dz;
                const key = `${x},${z}`;

                if (visibleTiles.has(key)) {
                    newVisible.set(key, visibleTiles.get(key));
                } else {
                    const tile = createTile(x, z);
                    scene.add(tile);
                    newVisible.set(key, tile);
                }
            }
        }

        // Remove old tiles
        for (const [key, mesh] of visibleTiles) {
            if (!newVisible.has(key)) {
                scene.remove(mesh);
                mesh.geometry.dispose();
                // Reuse materials, don't dispose
            }
        }

        visibleTiles.clear();
        for (const [key, mesh] of newVisible) {
            visibleTiles.set(key, mesh);
        }
    }
}




function animate() {
    requestAnimationFrame(animate);
    updateTiles();
    controls.update(); // if you're using OrbitControls
    renderer.render(scene, camera);
}
animate();
