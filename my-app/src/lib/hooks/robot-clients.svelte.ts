import {
  type Client,
  createRobotClient,
  type DialConf,
  MachineConnectionEvent,
  type RobotClient,
} from "@viamrobotics/sdk";
import { getContext, setContext } from "svelte";
import { useQueryClient } from "@tanstack/svelte-query";
import type { PartID } from "../part";
import { comparePartIds, isJsonEqual } from "../compare";

const clientKey = Symbol("clients-context");
const connectionKey = Symbol("connection-status-context");
const dialKey = Symbol("dial-configs-context");

interface ClientContext {
  current: Record<PartID, Client | undefined>;
}

interface ConnectionStatusContext {
  current: Record<PartID, MachineConnectionEvent>;
}

interface DialConfigsContext {
  current: Record<PartID, DialConf>;
}

export const provideRobotClientsContext = (
  dialConfigs: () => Record<PartID, DialConf>
) => {
  const queryClient = useQueryClient();
  const clients = $state<Record<PartID, Client | undefined>>({});
  const connectionStatus = $state<Record<PartID, MachineConnectionEvent>>({});

  let lastConfigs: Record<PartID, DialConf | undefined> = {};

  const disconnect = async (partID: PartID, config?: DialConf) => {
    // If currently making the initial connection, abort it.
    if (config?.reconnectAbortSignal !== undefined) {
      config.reconnectAbortSignal.abort = true;
    }

    const client = clients[partID];

    if (!client) {
      return;
    }

    connectionStatus[partID] = MachineConnectionEvent.DISCONNECTING;

    await Promise.all([
      client?.disconnect(),
      queryClient.cancelQueries({ queryKey: ["partID", partID] }),
    ]);

    client.listeners["connectionstatechange"]?.clear();
    clients[partID] = undefined;
    connectionStatus[partID] = MachineConnectionEvent.DISCONNECTED;
  };

  const connect = async (partID: PartID, config: DialConf) => {
    connectionStatus[partID] ??= MachineConnectionEvent.DISCONNECTED;

    try {
      await disconnect(partID, config);

      connectionStatus[partID] = MachineConnectionEvent.CONNECTING;

      // Reset the abort signal if it exists
      if (config.reconnectAbortSignal !== undefined) {
        config.reconnectAbortSignal = {
          abort: false,
        };
      }

      const client = await createRobotClient(config);
      (client as RobotClient & { partID: string }).partID = partID;
      client.on("connectionstatechange", (event) => {
        connectionStatus[partID] = (
          event as { eventType: MachineConnectionEvent }
        ).eventType;
      });

      clients[partID] = client;
      connectionStatus[partID] = MachineConnectionEvent.CONNECTED;
    } catch (error) {
      console.error(error);
      connectionStatus[partID] = MachineConnectionEvent.DISCONNECTED;
    }
  };

  $effect.pre(() => {
    const configs = dialConfigs();

    const { added, removed, unchanged } = comparePartIds(
      Object.keys(configs),
      Object.keys(lastConfigs)
    );

    for (const partID of added) {
      const config = configs[partID];
      if (config) {
        connect(partID, config);
      }
    }

    for (const partID of removed) {
      disconnect(partID, lastConfigs[partID]);
    }

    for (const partID of unchanged) {
      const config = configs[partID];
      const lastConfig = lastConfigs[partID];
      if (config && lastConfig && !isJsonEqual(lastConfig, config)) {
        connect(partID, config);
      }
    }

    lastConfigs = configs;

    return () => {
      for (const partID of Object.keys(configs)) {
        clients[partID]?.disconnect();
      }
    };
  });

  setContext<ClientContext>(clientKey, {
    get current() {
      return clients;
    },
  });

  setContext<ConnectionStatusContext>(connectionKey, {
    get current() {
      return connectionStatus;
    },
  });

  setContext<DialConfigsContext>(dialKey, {
    get current() {
      return dialConfigs();
    },
  });
};

export const useRobotClients = (): ClientContext => {
  return getContext<ClientContext>(clientKey);
};

export const useDialConfigs = (): DialConfigsContext => {
  return getContext<DialConfigsContext>(dialKey);
};

export const useConnectionStatus = (partID: () => PartID) => {
  const context = getContext<ConnectionStatusContext>(connectionKey);
  const status = $derived(context.current[partID()]);
  return {
    get current() {
      return status;
    },
  };
};

export const useRobotClient = (partID: () => PartID) => {
  const context = getContext<ClientContext>(clientKey);
  const client = $derived(context.current[partID()]);
  return {
    get current() {
      return client;
    },
  };
};
