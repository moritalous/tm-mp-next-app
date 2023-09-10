'use client'
import { useEffect, useRef, useState } from "react"

import { MpSdk } from "@/types/types"

const MatterportComponent = () => {

  const [timer, setTimer] = useState(0)
  const [mpSdk, setMpSdk] = useState<MpSdk>()

  // SDKの取得（時間がかかる）
  useEffect(() => {

    const id = setInterval(() => {
      const matterportViewer = document.querySelector<MatterportViewer>('matterport-viewer')
      if (matterportViewer) {
        matterportViewer.playingPromise
          .then((sdk) => {
            console.log(sdk)
            setMpSdk(sdk)
          })
          .catch((e) => console.error(e))
          .finally(() => { })
        clearInterval(id)
      } else {
        setTimer(t => t + 1)
      }
    }, 1000)

    return () => clearInterval(id);

  }, [])

  const [gltfComponent, setGltfComponent] = useState<MpSdk.Scene.IComponent>()
  const [x, setX] = useState(0.5)
  const [y, setY] = useState(2.5)
  const [z, setZ] = useState(0.0)
  const [isChecked, setChecked] = useState(false)

  useEffect(() => {
    if (gltfComponent && gltfComponent.inputs) {
      gltfComponent.inputs.localPosition = {
        x: x, y: y, z: z
      }

      gltfComponent.inputs.url = isChecked
        ? 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Flamingo.glb'
        : 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Parrot.glb'
    }
  }, [x, y, z, isChecked])

  const reqIdRef = useRef<number>(0)
  const [moveCounter, setMoveCounter] = useState(-1)

  const move = () => {
    setZ(z + 0.02)
  }

  function startMove() {
    setMoveCounter(0)
  }

  useEffect(() => {
    if (0 <= moveCounter && moveCounter <= 5000) {
      reqIdRef.current = requestAnimationFrame(move)
      setMoveCounter(moveCounter + 1)
      if (moveCounter > 1000) {
        setChecked(true)
      } else {
        setChecked(false)
      }
    } else {
      cancelAnimationFrame(reqIdRef.current)
    }
  }, [moveCounter, x, y, z])

  function add() {
    if (mpSdk) {
      mpSdk.Scene.createObjects(1)
        .then(([sceneObject]) => {
          // add a scene node for the fbx model
          const gltfNode = sceneObject.addNode();

          // adjust the position of the scene node
          gltfNode.position.set(0, -0.68, 0);

          // add the gltf loader component that loads a parrot model. Adjust the model's scale to make it fit inside the model.
          const gltfComponent = gltfNode.addComponent('mp.gltfLoader', {
            url: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/Parrot.glb',
            localScale: {
              x: 0.03,
              y: 0.03,
              z: 0.03,
            },
            localPosition: {
              x: 0.5,
              y: 2.5,
              z: 0
            }
          });
          setGltfComponent(gltfComponent)

          // Add a path id 'gltfUrl' to the gltf component url property (not used in the this example).
          sceneObject.addInputPath(gltfComponent, 'url', 'gltfUrl');

          // add another scene node to contain the light objects.
          const lightsNode = sceneObject.addNode();

          // Add directional and ambient lights
          const directionalLightComponet = lightsNode.addComponent('mp.directionalLight', {
            color: { r: 0.7, g: 0.7, b: 0.7 },
          });
          lightsNode.addComponent('mp.ambientLight', {
            intensity: 0.5,
            color: { r: 1.0, g: 1.0, b: 1.0 },
          });

          // Add a path id 'ambientIntensity' to the intensity property of the directional light component.
          // The path will be used to set the value later.
          const ambientIntensityPath = sceneObject.addInputPath(directionalLightComponet, 'intensity', 'ambientIntensity');

          const ControlNode = sceneObject.addNode();
          const myControl = ControlNode.addComponent('mp.transformControls', {
            visible: true,
            mode: 'translate',
            selection: gltfNode,
          });

          // Start the scene object and its nodes.
          sceneObject.start();
        }
        )
    }

  }

  return (
    <>
      <div style={{ position: 'absolute', left: '1290px' }}>
        <button onClick={add}>追加</button>
        <br></br>
        X: <input type='number' step={0.1} value={x} onChange={(e) => setX((Number)(e.target.value))}></input>
        <br></br>
        Y: <input type='number' step={0.1} value={y} onChange={(e) => setY((Number)(e.target.value))}></input>
        <br></br>
        Z: <input type='number' step={0.1} value={z} onChange={(e) => setZ((Number)(e.target.value))}></input>
        <br></br>
        切り替え <input type='checkbox' checked={isChecked} onChange={(e) => setChecked(e.target.checked)}></input>
        <br></br>
        <button onClick={startMove}>移動開始</button>
      </div>
    </>
  )
}

export default MatterportComponent
