import { Canvas } from '@react-three/fiber'
import Test from './Test'
import Exp from './Exp'
import { OrbitControls } from '@react-three/drei'



export default function App() {
    return (


        <Canvas camera={{ position: [0, 1, 2] }} >
            <OrbitControls />
            {/* <Test /> */}
            {/* <Test/> */}
            {/* <Exp /> */}
            {/* <Exp /> */}
        </Canvas >

    )
}
