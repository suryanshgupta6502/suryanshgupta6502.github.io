import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, useEffect } from 'react'

const PLANE_SIZE = 2
const TILE_RANGE = 2 // How many tiles around the camera to render
const IMAGE_PATHS = [
    '1.jpg',
    '2.jpg',
    '1.jpg',
    '2.jpg',
    '1.jpg'

]
// // function InfinitePlane() {
// const { camera, scene } = useThree();
// const [materials, setMaterials] = useState([]);
// const tilesRef = useRef(new Map());
// const currentTileCoord = useRef({ x: 0, z: 0 });

// const textures = useTexture(IMAGE_PATHS);

// useEffect(() => {
//     if (textures.length !== IMAGE_PATHS.length) return;
//     const mats = textures.map(tex => new THREE.MeshBasicMaterial({
//         map: tex,
//         side: THREE.DoubleSide,
//         // toneMapped: false
//     }));
//     setMaterials(mats);
// }, [textures]);

// const getMaterial = (x, z) => {
//     if (materials.length === 0) return new THREE.MeshBasicMaterial({ color: 'gray' });
//     const index = Math.abs((x * 31 + z * 17)) % materials.length;
//     return materials[index];
// };

// const getTileKey = (x, z) => `${x},${z}`;

// const createTile = (x, z) => {
//     const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
//     const mesh = new THREE.Mesh(geometry, getMaterial(x, z));
//     mesh.rotation.x = -Math.PI / 2;
//     mesh.position.set(x * PLANE_SIZE, 0, z * PLANE_SIZE);
//     return mesh;
// };

// useFrame(() => {
//     if (materials.length !== IMAGE_PATHS.length) return;

//     const camX = Math.floor(camera.position.x / PLANE_SIZE);
//     const camZ = Math.floor(camera.position.z / PLANE_SIZE);

//     if (camX !== currentTileCoord.current.x || camZ !== currentTileCoord.current.z) {
//         currentTileCoord.current = { x: camX, z: camZ };
//         const newTiles = new Map();

//         for (let dx = -TILE_RANGE; dx <= TILE_RANGE; dx++) {
//             for (let dz = -TILE_RANGE; dz <= TILE_RANGE; dz++) {
//                 const tx = camX + dx;
//                 const tz = camZ + dz;
//                 const key = getTileKey(tx, tz);

//                 if (tilesRef.current.has(key)) {
//                     newTiles.set(key, tilesRef.current.get(key));
//                 } else {
//                     const tile = createTile(tx, tz);
//                     scene.add(tile);
//                     newTiles.set(key, tile);
//                 }
//             }
//         }

//         for (const [key, tile] of tilesRef.current) {
//             if (!newTiles.has(key)) {
//                 scene.remove(tile);
//                 tile.geometry.dispose();
//             }
//         }

//         tilesRef.current = newTiles;
//     }
// });

// return null;
// }




export default function Test() {




    const { camera, scene } = useThree();
    const [materials, setMaterials] = useState([]);
    const tilesRef = useRef(new Map());
    const currentTileCoord = useRef({ x: 0, z: 0 });

    const textures = useTexture("1.jpg");

    useEffect(() => {
        if (textures.length !== IMAGE_PATHS.length) return;
        const mats = textures.map(tex => new THREE.MeshBasicMaterial({
            map: tex,
            side: THREE.DoubleSide,
            // toneMapped: false
        }));
        setMaterials(mats);
    }, [textures]);

    const getMaterial = (x, z) => {
        // if (materials.length === 0) return
        new THREE.MeshBasicMaterial({ color: 'gray' });
        const index = Math.abs((x * 31 + z * 17)) % materials.length;
        return materials[index];
    };

    const getTileKey = (x, z) => `${x},${z}`;

    const createTile = (x, z) => {
        const geometry = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
        const mesh = new THREE.Mesh(geometry, getMaterial(x, z));
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(x * PLANE_SIZE, 0, z * PLANE_SIZE);
        return mesh;
    };

    useFrame(() => {
        // if (materials.length !== IMAGE_PATHS.length) return;

        const camX = Math.floor(camera.position.x / PLANE_SIZE);
        const camZ = Math.floor(camera.position.z / PLANE_SIZE);

        if (camX !== currentTileCoord.current.x || camZ !== currentTileCoord.current.z) {
            currentTileCoord.current = { x: camX, z: camZ };
            const newTiles = new Map();

            for (let dx = -TILE_RANGE; dx <= TILE_RANGE; dx++) {
                for (let dz = -TILE_RANGE; dz <= TILE_RANGE; dz++) {
                    const tx = camX + dx;
                    const tz = camZ + dz;
                    const key = getTileKey(tx, tz);

                    if (tilesRef.current.has(key)) {
                        newTiles.set(key, tilesRef.current.get(key));
                    } else {
                        const tile = createTile(tx, tz);
                        console.log(tile);
                        scene.add(tile);
                        newTiles.set(key, tile);
                    }
                }
            }

            for (const [key, tile] of tilesRef.current) {
                if (!newTiles.has(key)) {
                    scene.remove(tile);
                    tile.geometry.dispose();
                }
            }

            tilesRef.current = newTiles;
        }
    });






    return (
        <>

            {/* <InfinitePlane /> */}
        </>
    )
}
