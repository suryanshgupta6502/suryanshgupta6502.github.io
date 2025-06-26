import { Canvas } from '@react-three/fiber'
import Exp from './Exp'
import { Outlines } from '@react-three/drei'

export default function App() {
  return (
    <Canvas camera={{
      position: [0, 1, 2]
    }}>
      <Exp />
    </Canvas >
  )
}
