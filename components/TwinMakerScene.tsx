'use client'
import { useEffect, useMemo, useState } from 'react';

import { TimeSeriesDataQuery } from "@iot-app-kit/core";
import { SceneViewer } from '@iot-app-kit/scene-composer';
import { TwinMakerQuery, initialize } from '@iot-app-kit/source-iottwinmaker';
import { S3SceneLoader } from '@iot-app-kit/source-iottwinmaker/dist/es/scene-module/S3SceneLoader';
import { SceneMetadataModule } from '@iot-app-kit/source-iottwinmaker/dist/es/scene-module/SceneMetadataModule';
import { aws_credentials, twinmaker_config } from '@/aws.config';


interface twinMakerDataProps {
  query: { timeSeriesData: (query: TwinMakerQuery) => TimeSeriesDataQuery }
  s3SceneLoader: (sceneId: string) => S3SceneLoader
  sceneMetadataModule: (sceneId: string) => SceneMetadataModule
}

const workspaceId = twinmaker_config.twinmaker_workspace_id
const sceneId = twinmaker_config.twinmaker_scene_id

const TwinMakerScene = () => {

  const [mounted, setmounted] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const mpSdk = await document.querySelector<any>('matterport-viewer')?.playingPromise
        setmounted(true)
      } catch (e) {
        console.log(e)
      }
    }
    load()
  }, [])

  const twinMakerData: twinMakerDataProps | null = useMemo(() => {
    return initialize(workspaceId, {
      awsRegion: twinmaker_config.twinmaker_region,
      awsCredentials: aws_credentials
    })
  }, [mounted])


  return (
    <>
      {twinMakerData && mounted ? (
        <SceneViewer
          sceneLoader={twinMakerData.s3SceneLoader(sceneId)}
          sceneMetadataModule={twinMakerData.sceneMetadataModule(sceneId)}
          viewport={{ duration: '2h' }}
          externalLibraryConfig={{ matterport: { assetBase: '/matterport' } }}
        ></SceneViewer>
      ) : <></>}
    </>
  )
}

export default TwinMakerScene
