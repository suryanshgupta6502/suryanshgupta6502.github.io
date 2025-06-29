import { Canvas } from '@react-three/fiber'
import Exp from './Exp'


export default function App() {
    return (
        <Canvas  camera={{
            position: [7, 1, 2]
        }} >
            <Exp />
        </Canvas >
    )
}
