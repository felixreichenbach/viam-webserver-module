<script lang="ts">
  import type { DialConf } from "@viamrobotics/sdk";
  import Vision from "../lib/vision.svelte";

  interface Props {
    data: {
      dialConfig: Record<string, DialConf>;
      cameraName: string;
      visionName: string;
    };
  }

  let { data }: Props = $props();
</script>

<Vision
  partID={Object.keys(data.dialConfig)[0]}
  name={data.visionName}
  cameraName={data.cameraName}
/>
