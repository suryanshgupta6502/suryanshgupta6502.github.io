import { Canvas } from '@react-three/fiber'
import React from 'react'

export default function App() {
  return (
    <Canvas>
        <mesh>
            <boxGeometry/>
            <meshNormalMaterial/>
        </mesh>
    </Canvas>
  )
}
