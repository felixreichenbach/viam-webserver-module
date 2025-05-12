<script lang="ts">
  export let handleCheckContour: () => void;
  export let handleAccept: () => void;
</script>

<button
  class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] mb-20 rounded"
  onclick={handleCheckContour}>Refresh</button
>

<button
  class="bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-[50px] px-[100px] rounded"
  onclick={handleAccept}>Accept</button
>
