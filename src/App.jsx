import { Canvas } from '@react-three/fiber'
import Exp from './Exp'


export default function App() {
    return (
        <Canvas  camera={{
            position: [5, 1, 8]
        }} >
            <Exp />
        </Canvas >
    )
}
