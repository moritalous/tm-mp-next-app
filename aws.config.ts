export const twinmaker_config = {
  twinmaker_workspace_id: process.env.NEXT_PUBLIC_TM_WORKSPACE_ID ?? '',
  twinmaker_scene_id: process.env.NEXT_PUBLIC_TM_SCENE_ID ?? '',
  twinmaker_viewport_duration: '2h',
  twinmaker_region: process.env.NEXT_PUBLIC_AWS_DEFAULT_REGION ?? '',
}

export const aws_credentials = {
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? '',
}
