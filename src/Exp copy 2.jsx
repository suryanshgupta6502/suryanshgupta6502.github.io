import { Box, Edges, OrbitControls, Outlines, RoundedBoxGeometry, Text, useTexture } from '@react-three/drei'
import React, { useRef, useState } from 'react'
import { AdditiveBlending, Box3, Box3Helper, BoxGeometry, DoubleSide, Frustum, Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader, TOUCH, Vector2, Vector3 } from 'three';
import { geometry, three, vector3 } from 'maath'
import { extend, useFrame, useLoader, useThree } from '@react-three/fiber';
import { ChromaticAberration, EffectComposer, Noise, Outline, Scanline, Vignette } from '@react-three/postprocessing';
// import { RoundedPlaneGeometry } from 'maath/dist/declarations/src/geometry';
// imp
import { BlendFunction, Selection } from 'postprocessing'
import img from '/1.jpg'
import img1 from '/2.png'
import { useMemo } from 'react';




// FilmShader.js
const FilmShader = {
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
    return fract(sin(dot(st.xy + uTime, vec2(12.9898,78.233))) * 4375.5453);
    }

    vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
    }


    float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;

        for (int j = 0; j < 15; j++) {
            uv = rotate(uv, 1.);
            sine_acc = rotate(sine_acc, 1.);
            vec2 layer = uv * scale + float(j) + sine_acc - t;
            sine_acc += sin(layer) + 2.4 * p;
            res += (.5 + .5 * cos(layer)) / scale;
            scale *= (1.2);
        }
        return res.x + res.y;
    }


    void main() {
    vec4 color = texture2D(uImage, vUv);

    // Grain: subtle, random noise overlay
    float grain = random(vUv * uTime *1.2) * 0.2; // adjust intensity

    float noise = neuro_shape(vUv, 3., 5.);
    // cout

    gl_FragColor = vec4(color.rgb *noise +(grain),color.a);
    // gl_FragColor = vec4(noise,1.,color.a);

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


const vertexshader = `
    varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
`

const fragmentshader = `

uniform float uTime;
uniform sampler2D uImage;
varying vec2 vUv;

// Simple pseudo-random noise
float random(vec2 st) {
return fract(sin(dot(st.xy , vec2(12.9898,78.233))) * 4375.5453);
// return fract(sin(dot(st.xy + uTime, vec2(12.9898,78.233))) * 4375.5453);

}

vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}


float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;

    for (int j = 0; j < 15; j++) {
        uv = rotate(uv, 1.);
        sine_acc = rotate(sine_acc, 1.);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer) + 2.4 * p;
        res += (.5 + .5 * cos(layer)) / scale;
        scale *= (1.2);
    }
    return res.x + res.y;
}


void main() {
vec4 color = texture2D(uImage, vUv);

// Grain: subtle, random noise overlay
float grain = random(vUv  *1.5) *.3; // adjust intensity

float neuro = neuro_shape(vUv, 3., 5.);


 // Convert RGB to grayscale (luminance method)
  float gray = dot(color.rgb,vec3(0.0,0.0,1.0));
//   float gray = dot(color.rgb, vec3(.299, 0.587, 0.114));

 vec3 mixed = mix(color.rgb, vec3(gray),1.);

 
 // vec3(0.749,0.953,1.)
 // vec3(1,.7,0.1)
 
 // * (neuro+vec3(0.8,0.9,.5))
 
 color.rgb*=mixed;
// gl_FragColor = vec4(color.rgb * (vec3(0.8,0.8,.7)) +(grain) ,color.a);

gl_FragColor = vec4(color.rgb * (neuro+vec3(0.8,0.9,.5)) +(grain),color.a);


}
`



const blur_vertex = `
varying vec2 vuv;

void main() {
  vuv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const blur_fragment = `
// fragment.glsl

uniform sampler2D uImage;
uniform vec2 resolution;
varying vec2 vuv;


void main() {
  vec2 uv = vuv;

  vec4 color = vec4(0.0);

  float blurSize = 1.0 / 100.0;

  for (int x = -2; x <= 2; x++) {
    for (int y = -2; y <= 2; y++) {
      vec2 offset = vec2(float(x), float(y)) * blurSize;
      color += texture2D(uImage, uv + offset);
    }
  }

  color /= 25.0;
//   color += texture2D(uImage, vuv );
  gl_FragColor = color;
}
`




extend({ RoundedPlane: geometry.RoundedPlaneGeometry });

const cardwidth = 1.5
const cardheight = 2
function Plane({ pos, img, heading, discription, link, reff }) {
    // console.log(img);

    const ref = useRef()
    const texture = useTexture(img)
    // console.log(texture);

    // const cardref = useRef()

    const simpleshader = {
        uniforms: {
            uImage: { value: null },
            uTime: { value: 0.0 },
        },
        vertexShader: vertexshader,
        fragmentShader: fragmentshader
    }


    // const blur_shader = {
    //     uniforms: {
    //         uImage: { value: texture }
    //     },
    //     vertexShader: blur_vertex,
    //     fragmentShader: blur_fragment
    // }



    // const texture = new TextureLoader().load(img)

    useFrame((state) => {
        if (ref.current) {
            // console.log(ref.current);

            ref.current.uniforms.uTime.value = state.clock.elapsedTime
            // ref.current.uniforms.uImage.value = texture
        }
    })

    // FilmPass

    const imagepositiony = cardheight * .8

    const image_height = cardheight * .8


    const headingFontSize = 0.3; // or make this a prop/state
    const subtextFontSize = 0.1;
    const lineSpacing = 0.05; // optional gap between lines

    const edgesRef = useRef()


    return (
        <mesh position={pos}

            onPointerOver={(e) => {
                // if (edgesRef.current) edgesRef.current.visible = true
                // e.eventObject.children[0].visible = true
                e.eventObject.children[0].material.linewidth = 0.3
                // console.log(e.eventObject.children[0]);
            }}
            onPointerLeave={(e) => {
                // e.eventObject.children[0].visible = false
                e.eventObject.children[0].material.linewidth = 0
                // console.log(e.eventObject.children[0].visible);
            }}
        >

            <RoundedBoxGeometry args={[cardwidth, cardheight, 0.01]} radius={.02} steps={0} />

            <meshStandardMaterial color="white" />

            <Edges gapSize={.1} lineWidth={0} count={10} ref={edgesRef} name='line' color={"black"} />


            {/* <EffectComposer multisampling={8} autoClear={false}>
                <Outline
                    selection={[ cardref]}
                    edgeStrength={10}
                    visibleEdgeColor="black"
                // hiddenEdgeColor="gray"
                />
            </EffectComposer> */}


            {/* <mesh position={[0, 0, .01]} > */}

            <mesh position-z={.01} position-y={0 + image_height * .08} scale-x={cardwidth * .9}   >
                <planeGeometry args={[1, image_height]} />
                {/* <roundedPlane args={[1, image_height, .02]} /> */}
                <shaderMaterial
                    ref={ref}
                    args={[{ ...simpleshader }]}
                    uniforms-uImage-value={texture}
                    transparent={false}
                />
            </mesh>

            <Text color={"black"} position-z={.01} font='Polaroid Script (Demo_Font).otf' fontStyle='italic' anchorX={"left"} fontSize={.25} position-x={-cardwidth / 2.4} position-y={-cardheight / 2.5} >
                {heading}
                {/* <Text fontSize={.1} anchorX={"left"} position-x={cardwidth / 2.25}>
                    snbdkjgxs
                </Text> */}
            </Text>






            <Text position-z={.01} fontStyle='italic' anchorX={"left"} fontSize={.1} position-x={-cardwidth / 2.25} position-y={-.35} >
                {/* {discription} */}
            </Text>

            <Text color={"white"} strokeWidth={.002} strokeColor={"black"} onClick={(e) => window.open(link, '_blank')} position-z={.01} fontStyle='italic' anchorX={"left"} fontSize={.1} position-x={cardwidth / 2.7} position-y={-.8}>
                ↗
                {/* <meshBasicMaterial  /> */}
            </Text>


            {/* Width, height, radius, smoothness */}
            {/* <roundedPlane attach="geometry" args={[cardwidth, cardheight, 0.05, 6]} /> */}



            {/* <shaderMaterial
                args={[{ ...blur_shader }]}
            // vertexShader={blur_vertex}
            // fragmentShader={blur_fragment}
            // uniforms=
            // uniforms={{ uImage: texture }}
            // uniforms-uImage-value={texture}
            /> */}

        </mesh >
    )
}

export default function Exp() {

    // const temp = [1, 2, 3]
    // const random = Math.random() * 10

    // const poss = new Vector2(0, 0)
    const gap = 2

    // grid view
    // stip view
    // const total = 5

    const arr = [
        ["1.jpg", "flowers", "disp", "https://www.link2.com"],
        ["2.png", "scene", "disp", "https://www.link3.com"],
        ["1.jpg", "flowers", "disp", "https://www.link1.com"],

        ["artistic-scene-inspired-by-art-nouveau-style-with-colorful-depictions.jpg",
            "tiger", "disp", "https://www.link1.com"],
        ["stemp1.vercel.app_ (1).png",
            "scene", "disp", "https://www.link1.com"],
        ["stemp1.vercel.app_ (2).png",
            "scene", "disp", "https://www.link1.com"],
        ["stemp1.vercel.app_.png",
            "scene", "disp", "https://www.link1.com"],




        // ["https://placehold.co/600x400?text=Hello+1", "Title 1", "desc", "#"],
        // ["https://placehold.co/600x400?text=Hello+2", "Title 2", "desc", "#"],
        // ["https://placehold.co/600x400?text=Hello+3", "Title 3", "desc", "#"],
    ]

    // console.log(arr.length);


    const middle = Math.floor(arr.length / 2)


    // console.log(((arr.length - 1) * cardwidth + gap) / 2);

    const cardgroup1 = useRef()
    const cardgroup2 = useRef()
    // const cardgroup3 = useRef()
    // const cardgroup4 = useRef()

    const cardgroups = [cardgroup1, cardgroup2]
    const currentcard = useRef(0)


    // const cardgroups_iny = [cardgroup4, cardgroup3, cardgroup1]

    // const total_width_ofgroup = 14
    const total_width_ofgroup = (cardwidth * (arr.length + 1)) + gap
    const total_height_ofgroup = (cardheight + gap + .5) / 2

    console.log(total_height_ofgroup);

    // const total_width_ofgroup = ((arr.length + 1) * (cardwidth + gap)) 
    // console.log(total_width_ofgroup);

    // ((arr.length - cardheight - gap) * cardwidth + gap) / 2
    let rangex = total_width_ofgroup + 2
    let rangey = total_height_ofgroup * 2


    // const currentcard_inx = useRef(0)
    // const currentcard_iny = useRef(0)


    // console.log(total_width_ofgroup, rangex, total_width_ofgroup / 4);


    // useFrame((e) => {
    //     // console.log(e);



    // })

    const { scene, camera } = useThree()


    const [overflow, setOverflow] = useState(false)

    // const [currentcard, setcurrentcard] = useState(0)

    const [ismoving, setIsmoving] = useState()


    let rangex_negative = 5
    let rangex_positive = 8

    let rangey_positive = 2
    let rangey_negative = 0


    // const worldPosition = new Vector3();

    const box = new Box3()

    return (
        <>

            {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
            {/* <Noise opacity={0.2} blendFunction={BlendFunction.ADD} /> */}
            {/* <Scanline density={.2} blendFunction={BlendFunction.OVERLAY} /> */}

            {/* <EffectComposer>
                <ChromaticAberration
                    offset={[0.001, 0.001]}
                    blendFunction={BlendFunction.NORMAL}
                />
            </EffectComposer> */}



            <axesHelper />
            <ambientLight args={['white', 10]} />
            <OrbitControls
                mouseButtons={{ LEFT: 2, RIGHT: 0 }}
                touches={{ ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_PAN }}
                target={[7, 1, 0]}
                enableRotate={false}
                // enableZoom={false}
                // minDistance={1.4}
                // maxDistance={2.5}
                onChange={(e) => {
                    const current = e.target.target

                    // console.log(box);
                    box.setFromObject(cardgroup1.current)
                    if (box.min.x < current.x && box.max.x > current.x) {
                        currentcard.current = 1
                        box.setFromObject(cardgroup1.current)
                    }
                    if (box.min.y < current.y && box.max.y > current.y) {
                        currentcard.current = 1
                        box.setFromObject(cardgroup1.current)
                    }
                    else {
                        currentcard.current = 0
                        box.setFromObject(cardgroup2.current)
                    }


                    console.log(box);


                    const mesh1 = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: "green" }))
                    // mesh1.position.y = box.min.y
                    mesh1.position.y = rangey_negative
                    const mesh2 = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: "red" }))
                    mesh2.position.y = rangey_positive
                    // mesh2.position.y = box.max.y
                    scene.add(mesh1, mesh2)


                    // console.log(rangex_negative, rangex_positive, current.x, currentcard.current);
                    // console.log(currentcard, box.min.x, box.max.x);


                    if (current.x < rangex_negative) {

                        cardgroups[currentcard.current].current.position.x = (box.min.x - total_width_ofgroup + gap)
                        rangex_positive = rangex_negative
                        rangex_negative = (rangex_negative - (total_width_ofgroup))
                    }

                    else if (current.x > rangex_positive) {
                        cardgroups[currentcard.current].current.position.x = box.max.x
                        rangex_negative = rangex_positive
                        rangex_positive = (rangex_positive + (total_width_ofgroup))
                    }



                    if (current.y > rangey_positive) {
                        cardgroups[currentcard.current].current.position.y = (box.max.y + ((cardheight + (gap / 4))))
                        rangey_negative = rangey_positive
                        rangey_positive = (rangey_positive + (total_height_ofgroup * 2))
                    }

                    else if (current.y < rangey_negative) {
                        cardgroups[currentcard.current].current.position.y = (box.min.y - (total_height_ofgroup + cardheight + (gap / 8)))
                        rangey_positive = rangey_negative
                        rangey_negative = (rangey_negative - (total_height_ofgroup * 2))
                    }


                    // if (box.containsPoint(current)) {
                    //     // const temp = cardgroups[currentcard.current].current.position
                    //     // cardgroups[(currentcard.current + 1) % 2].current.position.copy(temp)


                    // }



                }}

            />


            <group ref={cardgroup1} >
                {
                    arr.map((each, index) =>
                        // console.log(each[0])

                        < Plane key={index}

                            pos={[(index) * (gap) + 1, cardheight / 2 + total_height_ofgroup, 0]}
                            // pos={[(index - middle) * gap, cardheight / 2, 0]}

                            img={each[0]}
                            heading={each[1]}
                            discription={each[2]}
                            link={each[3]}
                        />
                    )
                }
                {/* </group> */}




                {/* <group ref={cardgroup2}  > */}
                {true &&
                    arr.map((each, index) =>
                        // console.log(each[0])

                        < Plane key={index}

                            pos={[(index) * gap, cardheight / 2, 0]}

                            // pos={[(index - middle) * gap, cardheight / 2 + 1, 0]}

                            img={each[0]}
                            heading={each[1]}
                            discription={each[2]}
                            link={each[3]}
                        />
                    )
                }

                {/* </group> */}



                {/* <group ref={cardgroup3} > */}
                {true &&
                    arr.map((each, index) =>
                        // console.log(each[0])

                        < Plane key={index}

                            pos={[(index) * gap - 1, cardheight / 2 - total_height_ofgroup, 0]}
                            // pos={[(index - middle) * gap, cardheight / 2 + 1, 0]}

                            img={each[0]}
                            heading={each[1]}
                            discription={each[2]}
                            link={each[3]}
                        />
                    )
                }

            </group>



            <group ref={cardgroup2} >
                {/* <group ref={cardgroup2} position={[total_width_ofgroup, 0, 0]} > */}
                {
                    arr.map((each, index) =>
                        // console.log(each[0])

                        < Plane key={index}

                            pos={[(index) * (gap) + 1, cardheight / 2 + total_height_ofgroup, 0]}
                            // pos={[(index - middle) * gap, cardheight / 2, 0]}

                            img={each[0]}
                            heading={each[1]}
                            discription={each[2]}
                            link={each[3]}
                        />
                    )
                }
                {/* </group> */}




                {/* <group ref={cardgroup2}  > */}
                {true &&
                    arr.map((each, index) =>
                        // console.log(each[0])

                        < Plane key={index}

                            pos={[(index) * gap, cardheight / 2, 0]}

                            // pos={[(index - middle) * gap, cardheight / 2 + 1, 0]}

                            img={each[0]}
                            heading={each[1]}
                            discription={each[2]}
                            link={each[3]}
                        />
                    )
                }

                {/* </group> */}



                {/* <group ref={cardgroup3} > */}
                {true &&
                    arr.map((each, index) =>
                        // console.log(each[0])

                        < Plane key={index}

                            pos={[(index) * gap - 1, cardheight / 2 - total_height_ofgroup, 0]}
                            // pos={[(index - middle) * gap, cardheight / 2 + 1, 0]}

                            img={each[0]}
                            heading={each[1]}
                            discription={each[2]}
                            link={each[3]}
                        />
                    )
                }

            </group>





            {/* <group ref={cardgroup4} >
                {true &&
                    arr.map((each, index) =>
                        // console.log(each[0])

                        < Plane key={index}

                            pos={[(index * gap) + .2, cardheight / 2 - total_height_ofgroup, 0]}
                            // pos={[(index - middle) * gap, cardheight / 2 + 1, 0]}

                            img={each[0]}
                            heading={each[1]}
                            discription={each[2]}
                            link={each[3]}
                        />
                    )
                }

            </group> */}








            {/* {
                arr.map((each, index) =>
                    // console.log(each[0])

                    < Plane key={index}
                        // reff={cardref}
                        pos={[(index - middle) * gap, cardheight + 1.5, 0]}
                        img={each[0]}
                        heading={each[1]}
                        discription={each[2]}
                        link={each[3]}
                    />
                )
            } */}




        </>
    )
}
