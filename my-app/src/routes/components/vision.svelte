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
    enabled: false,
  });

  const query = createResourceQuery(
    visionClient, // client
    "captureAllFromCamera", // method
    [
      "camera", //"sealant-ref", // camera name
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

  async function handleButtonClick() {
    console.log("Button clicked!");
    query.current.refetch().then(() => {
      console.log("refreshed");
    });
  }
</script>

{#if query.current.error}
  {query.current.error.message}
{:else}
  {console.log("refreshed")}
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
