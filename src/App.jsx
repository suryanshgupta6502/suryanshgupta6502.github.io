import { Canvas } from '@react-three/fiber'
// import Exp from './Exp copy 2'
import Exp from './Exp'


export default function App() {
    return (
        <Canvas camera={{
            position: [0, 1, 2]
        }} >
            <Exp />
            {/* <Exp /> */}
        </Canvas >
    )
}
