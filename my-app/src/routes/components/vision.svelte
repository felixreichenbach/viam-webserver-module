<script lang="ts">
  import { createResourceClient, createResourceQuery } from "$lib";
  import { VisionClient } from "@viamrobotics/sdk";

  interface Props {
    partID: string;
    name: string;
  }

  let { partID, name }: Props = $props();

  const visionClient = createResourceClient(
    VisionClient,
    () => partID,
    () => name
  );

  const queryOptions = $state({
    refetchInterval: 1000,
  });
  const query = createResourceQuery(
    visionClient, // client
    "captureAllFromCamera", // method
    [
      "sealant-ref", // camera
      {
        returnImage: true,
        returnClassifications: true,
        returnDetections: true,
        returnObjectPointClouds: true,
      },
    ], // CaptureAllOptions
    queryOptions // options
  );

  const src = $derived(
    query.current.data
      ? URL.createObjectURL(
          new Blob([query.current.data.image!.image], { type: "image/png" })
        )
      : undefined
  );

  function handleButtonClick() {
    console.log("Button clicked!");
  }
</script>

{#if query.current.error}
  {query.current.error.message}
{:else}
  <div class="flex flex-row gap-20 m-4">
    <div class="basis-400"><img {src} alt="" width="700" /></div>
    <div class="basis-1/3">
      <div class="flex flex-col items-center justify-center gap-4 h-full">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] mb-20 rounded"
          onclick={handleButtonClick}>Refresh</button
        >

        <button
          class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] rounded"
          onclick={handleButtonClick}>Accept</button
        >
      </div>
    </div>
  </div>
{/if}
