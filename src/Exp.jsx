import { OrbitControls, RoundedBoxGeometry, Text, useTexture } from '@react-three/drei'
import React, { useRef } from 'react'
import { DoubleSide, Vector2 } from 'three';
import { geometry, three } from 'maath'
import { extend, useFrame } from '@react-three/fiber';
import { ChromaticAberration, EffectComposer, Noise, Scanline, Vignette } from '@react-three/postprocessing';
// import { RoundedPlaneGeometry } from 'maath/dist/declarations/src/geometry';
// imp
import { BlendFunction } from 'postprocessing'

// FilmShader.js
export const FilmShader = {
    uniforms: {
        uImage: { value: null },
        uTime: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `


    uniform float uTime;
    uniform sampler2D uImage;
    varying vec2 vUv;

    // Simple pseudo-random noise
    float random(vec2 st) {
    return fract(sin(dot(st.xy + uTime, vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
    vec4 color = texture2D(uImage, vUv);

    // Grain: subtle, random noise overlay
    float grain = random(vUv * uTime * 30.0) * 0.3; // adjust intensity

    gl_FragColor = vec4(color.rgb + grain, color.a);
    }




    `,

    //     fragmentShader: `
    //       varying vec2 vUv;
    //       uniform sampler2D uTexture;
    //       uniform float uTime;

    //       // Simple random noise

    //     //   float rand(vec2 co){
    //     //     return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
    //     //   }

    //       float random(vec2 st) {
    //         return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
    //         }

    //         // A hash function to make pseudo-random values


    //         float hash(float x) {
    //     return fract(sin(x) * 43758.5453);
    //     }

    //     // Wiggly distorted lines with randomness
    //     float organicScratch(vec2 uv, float time) {
    //         float x = uv.x * 1.0;

    //         // Add sine-wave distortion
    //         float wiggle = sin(uv.y * 1.0 + time * 5.0 + hash(floor(x))) * 0.1;

    //         // Apply time-based scroll & randomness per column
    //         float col = fract(x + time * 1.0 + wiggle + hash(floor(x)));

    //         // Makes some lines show up only sometimes
    //         float onOff = step(0.8, hash(floor(x + time)));

    //         // Thicker noisy line
    //         float line = smoothstep(0.01, 0.02, abs(col - 0.5 ));

    //         return line * onOff ;
    //     }

    //     float rand(vec2 co){
    //         return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    //     }

    //     vec4 grain(vec4 fragColor, vec2 uv){
    //         vec4 color = fragColor;
    //         float diff = (rand(uv) - 0.0) * .1;
    //         color.r += diff;
    //         color.g += diff;
    //         color.b += diff;
    //         return color;
    //     }


    //       void main() {




    //         // vec4 color = texture2D(uTexture, vUv);

    //         // // Faded film effect: reduce contrast, add tint
    //         // color.rgb = mix(vec3(0.9, 0.8, 0.6), color.rgb, 0.7);

    //         // // Grain
    //         // float noise = rand(vUv + uTime);
    //         // color.rgb += noise * 0.5;

    //         // // Vignette
    //         // // float dist = distance(vUv, vec2(0.5));
    //         // // color.rgb *= smoothstep(0.8, 0.4, dist);

    //         // gl_FragColor = color;



    //     //     vec4 color = texture2D(uTexture, vUv);

    //     //   // Faded old-film tint
    //     //   color.rgb = mix(color.rgb, vec3(0.9, 0.85, 0.65), 0.3);

    //     //   // Grain flicker
    //     //   float grain = rand(vUv * uTime * 10.0) * 0.08;
    //     //   color.rgb += grain;

    //     //   // Vignette
    //     //   float dist = distance(vUv, vec2(0.5));
    //     //   float vignette = smoothstep(0.8, 0.4, dist);
    //     // //   color.rgb *= vignette;

    //     //   // Horizontal scanlines
    //     //   float scanline = sin(vUv.y * 800.0 + uTime * 20.0) * 0.02;
    //     //   color.rgb -= scanline;

    //     //   // Flicker pulse
    //     //   float flicker = 0.05 * sin(uTime * 5.0);
    //     // //   color.rgb += flicker;

    //     //   gl_FragColor = color;



    //     // vec4 texColor = texture2D(uTexture, vUv);

    //     //   // Warm yellow/sepia tint mix
    //     //   vec3 sepia = vec3(1.1, 1.0, 0.8); // slightly yellowish
    //     //   texColor.rgb = mix(texColor.rgb, sepia, 0.4);

    //     //   // Film grain
    //     //   float grain = rand(vUv * uTime * 10.0) * 0.2;
    //     //   texColor.rgb += grain;

    //     //   // Vignette (dark + slightly colored edges)
    //     //   float dist = distance(vUv, vec2(0.5));
    //     //   float vignette = smoothstep(0.8, 0.4, dist);
    //     //   vec3 edgeColor = vec3(0.25, 0.20, 0.10); // dark yellowish brown
    //     // //   texColor.rgb = mix(edgeColor, texColor.rgb, vignette);

    //     //   // Scanlines
    //     //   float scanline = sin(vUv.y * 800.0 + uTime * 20.0) * 0.015;
    //     // //   texColor.rgb -= scanline;

    //     //   // Warm flicker pulse
    //     // //   float flicker = 0.03 * sin(uTime * 3.0);
    //     // //   texColor.rgb += vec3(flicker, flicker * 0.8, flicker * 0.5);

    //     //   gl_FragColor = texColor;




    //     // vec4 color = texture2D(uTexture, vUv);

    //     //   // --- Classic Yellow Film Effect ---

    //     //   // Gently warm up the tones
    //     //   color.rgb = mix(color.rgb, vec3(1.0, 0.95, 0.75), 0.25);

    //     //   // Slight lift in shadows for faded blacks
    //     //   color.rgb = color.rgb * 0.9 + 0.05;

    //     //   // Subtle contrast reduction (like photo paper aging)
    //     //   color.rgb = mix(vec3(0.5), color.rgb, 0.85);

    //     //   gl_FragColor = color;





    //     // vec4 c = texture2D(uTexture, vUv);

    //     //   // --- Yellow Film Blend ---
    //     //   vec3 yellow = vec3(1.2, 1.05, 0.7);
    //     //   c.rgb = mix(c.rgb, yellow, 0.5);

    //     //   // --- Faded Blacks & Soft Contrast ---
    //     //   c.rgb = pow(c.rgb, vec3(1.1,1.05,0.95));
    //     //   c.rgb = c.rgb * 0.9 + vec3(0.5);

    //     //   // --- Grain Texture Overlay ---
    //     //   float grain = (rand(vUv * uTime * 5.0) - 0.5) * 0.05;
    //     //   c.rgb += grain;

    //     //   gl_FragColor = c;




    // //     float noise = random(vUv * uTime * 5.0);

    // //   // flickering horizontal noise
    // //   float flicker = step(0.98, fract(sin(uTime * 20.0) * 43758.5453));

    // //   // vertical line
    // //   float line = smoothstep(0.49, 0.5, abs(fract(vUv.x * 10.0 + uTime * 2.0) - 0.5));

    // //   float finalNoise = noise  + line * 0.4;
    // //   finalNoise *= flicker;

    // //   gl_FragColor = vec4(vec3(1.0, 1.0, 0.5) * finalNoise, finalNoise);





    // //     vec4 imgColor = texture2D(uTexture, vUv);

    // //   // Add grain
    // //   float grain = random(vUv * uTime * 10.0);

    // //   // Flicker effect
    // //   float flicker = step(0.95, fract(sin(uTime * 1.0) * 10.0));

    // //   // Vertical scratch lines
    // //   float line = smoothstep(0.49, 0.5, abs(fract(vUv.x * 10.0 + uTime * 2.0) - 0.5));

    // //   // Yellow flicker overlay
    // //   vec3 yellowTint = vec3(1.0, 1.0, 0.5);
    // //   float overlay = (grain * 0.1 + line * 0.4) * flicker;

    // //   vec3 finalColor = imgColor.rgb + yellowTint * overlay;

    // //   gl_FragColor = vec4(finalColor, imgColor.a);






    // //   float grain = random(vUv * uTime * 10.0);
    // //   float flicker = step(0.95, fract(sin(uTime * 10.0) * 43758.2345));
    // //   float scratch = organicScratch(vUv, uTime);

    // //   float overlay = (grain * 0.2 + scratch * 0.5) * flicker;

    // //   vec3 yellowTint = vec3(1.0, 1.0, 0.5);
    // //   vec3 finalColor = imgColor.rgb + yellowTint * overlay;

    // //   gl_FragColor = vec4(finalColor, imgColor.a);

    //     // vec4 imgColor = texture2D(uTexture, vUv);

    //     vec2 uv = gl_FragCoord.xy/1.0;
    //     vec4 texel = texture(uTexture, uv);
    //     outColor = texel;

    //     vec4 grain = grain(outColor, uv);
    //     outColor = mix(outColor, grain, u_fx);

    //       }
    //     `
}


extend({ RoundedPlane: geometry.RoundedPlaneGeometry });

const cardwidth = 1.5
const cardheight = 2
function Plane({ pos, heading, discription, link }) {
    console.log(pos);

    const ref = useRef()
    const texture = useTexture("360_F_553606361_AHWIaGoihgwuWEq8tjmYi6uTbapED60o.jpg")

    useFrame((state) => {
        if (ref.current) {
            // console.log(ref.current);

            ref.current.uniforms.uTime.value = state.clock.elapsedTime
        }
    })

    // FilmPass

    const imagepositiony = cardheight * .8

    const image_height = cardheight * .8

    return (
        <mesh position={pos}>
            {/* <mesh position={[0, 0, .01]} > */}

            <mesh position-z={.01} position-y={0 + image_height * .08} scale-x={cardwidth * .9}   >
                <planeGeometry args={[1, image_height]} />
                {/* <roundedPlane args={[1, image_height, .02]} /> */}
                <shaderMaterial
                    ref={ref}
                    args={[{ ...FilmShader }]}
                    uniforms-uImage-value={texture}
                    transparent={false}
                />
            </mesh>

            <Text position-z={.01} fontStyle='italic' tran anchorX={"left"} fontSize={.2} position-x={-cardwidth / 2.25} position-y={-.15} >
                {heading}
            </Text>

            <Text position-z={.01} fontStyle='italic' anchorX={"left"} fontSize={.1} position-x={-cardwidth / 2.25} position-y={-.35} >
                {discription}
            </Text>

            <Text onClick={(e) => window.open(link, '_blank')} position-z={.01} fontStyle='italic' anchorX={"left"} fontSize={.1} position-x={-cardwidth / 2.3} position-y={-.85}>
                ↗
            </Text>


            {/* Width, height, radius, smoothness */}
            <roundedPlane attach="geometry" args={[cardwidth, cardheight, 0.05, 6]} />

            {/* <meshStandardMaterial color="hotpink" /> */}
            <meshBasicMaterial color="hotpink" side={DoubleSide} />
            {/* <meshNormalMaterial side={DoubleSide} /> */}
        </mesh >
    )
}

export default function Exp() {

    // const temp = [1, 2, 3]
    // const random = Math.random() * 10

    // const poss = new Vector2(0, 0)
    const gap = 4

    // grid view
    // stip view
    // const total = 5

    const arr = [
        ["11", "disp", "https://www.link1.com"],
        ["21", "disp", "https://www.link2.com"],
        ["31", "disp", "https://www.link3.com"],
    ]

    const middle = Math.floor(arr.length / 2)

    // Array.from({ length: total })

    return (
        <>
            {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
            {/* <EffectComposer>
                <Noise opacity={0.2} blendFunction={BlendFunction.ADD} />
                <Scanline density={1.25} blendFunction={BlendFunction.OVERLAY} />
                <ChromaticAberration
                    offset={[0.003, 0.003]}
                    blendFunction={BlendFunction.NORMAL}
                />
            </EffectComposer> */}

            <axesHelper />
            <ambientLight args={['white', 10]} />
            <OrbitControls />
            {
                // Array.from({ length: 5 }).map((each, index) => <Plane key={index} pos={[index * 2, 0, 0]} />)

            }

            {
                arr.map((each, index) =>
                    // console.log(each[0])

                    < Plane key={index}
                        pos={[(index - middle) * gap, cardheight / 2, 0]}
                        heading={each[0]}
                        discription={each[1]}
                        link={each[2]}
                    />
                )
            }




        </>
    )
}
