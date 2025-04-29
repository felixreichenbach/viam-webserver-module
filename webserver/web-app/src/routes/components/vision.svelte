<script lang="ts">
  import {
    createResourceClient,
    createResourceQuery,
    useConnectionStatus,
  } from "$lib";
  import { Struct, VisionClient } from "@viamrobotics/sdk";
  import Metrics from "./metrics.svelte";

  interface Props {
    partID: string;
    name: string;
    cameraName: string;
  }

  let { partID, name: name, cameraName }: Props = $props();

  const visionClient = createResourceClient(
    VisionClient,
    () => partID,
    () => name
  );

  const status = useConnectionStatus(() => partID);
  $inspect(status.current);

  const queryOptions = $state({
    refetchInterval: 1000,
    enabled: false,
  });

  const query = createResourceQuery(
    visionClient, // client
    "captureAllFromCamera", // method
    [
      cameraName,
      {
        returnImage: true,
        returnClassifications: false,
        returnDetections: true,
        returnObjectPointClouds: false,
      },
    ], // CaptureAllOptions
    () => queryOptions // options
  );

  const src = $derived(
    query.current.data
      ? URL.createObjectURL(
          new Blob([query.current.data.image!.image], { type: "image/png" })
        )
      : undefined
  );

  let extra = $derived(
    query.current.data?.extra ? query.current.data.extra.clone() : new Struct()
  );

  function handleCheckContour() {
    query.current.refetch().then((result) => {
      console.log("contour refreshed");
    });
  }

  function handleAccept() {
    console.log("Button Accept: To be implemented");
  }
</script>

<!-- Main Content Area -->
{#if status.current === "disconnected"}
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold">Disconnected</h1>
    <p class="text-lg">Please connect to the robot.</p>
  </div>
{:else if status.current === "connecting"}
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold">Connecting...</h1>
  </div>
{:else if status.current === "connected"}
  {#if !query.current.error}
    <div class="flex border-0 border-red-500 overflow-auto">
      <div class="border-0">
        <!--column left -->
        <img
          {src}
          alt=""
          class="object-scale-down max-w-full max-h-full w-full h-auto"
        />
      </div>
      <div class="flex-col border-0 p-4 w-1/3">
        <!--column right -->
        <div class="flex flex-nowrap border-0 items-center justify-between">
          <h1 class="text-2xl font-bold mt-12 mb-10 mx-auto">Sealant Check</h1>
          <button
            class="bg-blue-200 hover:bg-blue-500 text-xl text-white py-[10px] px-[10px] rounded ml-auto self-center"
            onclick={() => location.reload()}
          >
            Reload
          </button>
        </div>
        <div
          class="flex flex-col border-0 border-purple-500 items-center justify-center min-h-[100px]"
        >
          <button
            class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] mb-10 rounded"
            onclick={handleCheckContour}>Check</button
          >
          <div class="flex-grow"></div>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] mb-10 rounded"
            onclick={handleAccept}>Accept</button
          >
        </div>
        <div
          class="flex flex-col border-0 border-purple-500 items-center justify-center"
        >
          <!--column right row 2 -->
          <Metrics data={extra} />
        </div>
      </div>
    </div>
  {:else}
    {query.current.error.message}
  {/if}
{/if}
