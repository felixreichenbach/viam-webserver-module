<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import * as VIAM from "@viamrobotics/sdk";

  let apiKeyId = import.meta.env.VITE_API_KEY_ID;
  let apiKey = import.meta.env.VITE_API_KEY;
  const host = import.meta.env.VITE_HOST;
  const localhost = import.meta.env.VITE_LOCAL_HOST;
  let errorMessage = writable("");
  let machine: VIAM.RobotClient | undefined = undefined;

  const handleLogin = async () => {
    const dialConf: VIAM.DialConf = {
      host,
      credentials: {
        type: "api-key",
        payload: apiKey,
        authEntity: apiKeyId,
      },
      signalingAddress: "https://app.viam.com:443",
    };

    /*
    const directDialConf: VIAM.DialConf = {
      host: localhost,
      credentials: {
        type: "api-key",
        payload: apiKey,
        authEntity: apiKeyId,
      },
    };
    console.log(directDialConf);
    */

    try {
      const machine = await VIAM.createRobotClient(dialConf);
      console.log("Machine connected", await machine.getCloudMetadata());
    } catch (error) {
      errorMessage.set("An unknown error occurred");
    }
  };

  onMount(() => {
    // Any initialization logic can go here
  });
</script>

<main>
  <h1>Login</h1>
  <form on:submit|preventDefault={handleLogin}>
    <div>
      <label for="username">Username:</label>
      <input type="text" id="username" bind:value={apiKeyId} required />
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" bind:value={apiKey} required />
    </div>
    <button type="submit">Login</button>
  </form>
  {#if $errorMessage}
    <p style="color: red;">{$errorMessage}</p>
  {/if}
</main>

<style>
  main {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  div {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    padding: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>
