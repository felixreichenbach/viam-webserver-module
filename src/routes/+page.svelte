<script lang="ts">
  import {
    createResourceClient,
    createResourceMutation,
    createResourceQuery,
  } from "@viamrobotics/svelte-sdk";
  import { VisionClient, Struct } from "@viamrobotics/sdk";
  import type { DialConf } from "@viamrobotics/sdk";
  import Canvas from "$lib/Canvas.svelte";

  interface Props {
    data: {
      dialConfig: Record<string, DialConf>;
      cameraName: string;
      visionName: string;
      thresholds: Record<string, number>;
    };
  }
  let { data: props }: Props = $props();

  let acceptdisabled = $state(true);

  const visionClient = createResourceClient(
    VisionClient,
    () => Object.keys(props.dialConfig)[0],
    () => props.visionName
  );

  const queryOptions = $state({
    refetchInterval: 1000,
    enabled: false,
  });

  const query = createResourceQuery(
    visionClient, // client
    "captureAllFromCamera", // method
    [
      props.cameraName,
      {
        returnImage: true,
        returnClassifications: false,
        returnDetections: true,
        returnObjectPointClouds: false,
      },
    ], // CaptureAllOptions
    () => queryOptions // options
  );

  const mutation = createResourceMutation(
    visionClient, // client
    "doCommand" // method
  );

  const src = $derived(
    query.current.data
      ? URL.createObjectURL(
          new Blob([query.current.data.image!.image], { type: "image/png" })
        )
      : undefined
  );

  let detections = $derived(query.current.data?.detections ?? []);

  const imgUUID = $derived(
    query.current.data?.extra &&
      (query.current.data.extra.toJson() as any)["id"]
  );

  let message: string | undefined = $state(undefined);

  function handleCheckContour() {
    acceptdisabled = true;
    detections = [];
    message = undefined;
    query.current.refetch().then(() => {
      acceptdisabled = false;
    });
  }

  function handleAccept() {
    saveResult();
    detections = [];
    acceptdisabled = true;
  }

  function saveResult() {
    mutation.current.mutate(
      [
        Struct.fromJson({
          command: "save_result",
          result_id: imgUUID as string,
        }),
      ],
      // Optional callback functions as example:
      {
        onSuccess: () => {
          console.log("Upload Image: ", imgUUID);
          message = "Image saved successfully!";
        },
        onError(error, variables, context) {
          console.error("Error saving image:", error);
          message = "Error saving image: " + error.message;
        },
      }
    );
  }
</script>

{#if query.current.error}
  {query.current.error.message}
{:else}
  <div class="grid grid-cols-[1fr_400px] border-0 border-red-500 w-full h-full">
    <div class="flex flex-col border-0 border-amber-300 w-full h-full">
      <Canvas {src} width={880} height={720} {detections} />
    </div>
    <div class="flex flex-col w-[400px] border-0 border-purple-300 ml-auto">
      <div class="flex flex-col items-center justify-center gap-4 h-full">
        <button onclick={handleCheckContour}> Check</button>
        <button
          onclick={handleAccept}
          disabled={acceptdisabled || imgUUID == undefined}>Accept</button
        >
        {#if mutation.current.isSuccess}
          <div class="flex flex-col items-center justify-center gap-4">
            <h1 class="text-3xl font-bold">{message}</h1>
          </div>
        {:else if mutation.current.isError}
          <div class="flex flex-col items-center justify-center gap-4 h-full">
            <h1 class="text-3xl font-bold">{message}</h1>
            <p>{mutation.current.error.message}</p>
          </div>
        {/if}
        {#if detections.length > 0 && imgUUID}
          <div>
            <p>
              Minimum Line Thickness: <br />
              {detections[0].className}
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  @reference "tailwindcss";
  button {
    @apply w-70 h-30 border-2 flex justify-center items-center rounded bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] mt-4;
  }
  button:disabled {
    @apply bg-gray-400 cursor-not-allowed opacity-60 hover:bg-gray-400;
  }
  p {
    @apply text-center font-bold text-2xl mt-4;
  }
</style>
