import {
  createQueries,
  queryOptions,
  type QueryObserverResult,
} from '@tanstack/svelte-query';
import type { ResourceName } from '@viamrobotics/sdk';
import { getContext, setContext } from 'svelte';
import { fromStore, toStore } from 'svelte/store';
import { useRobotClients } from './robot-clients.svelte';
import type { PartID } from '../part';
import { useMachineStatuses } from './machine-status.svelte';

const key = Symbol('resources-context');

type Query = QueryObserverResult<ResourceName[], Error>;

interface QueryContext {
  current: ResourceName[];
  error: Error | undefined;
  fetching: boolean;
  refetch: () => Promise<Query> | Promise<void>;
}

interface Context {
  current: Record<PartID, Query | undefined>;
}

export const provideResourceNamesContext = () => {
  const machineStatuses = useMachineStatuses();
  const clients = useRobotClients();

  const options = $derived(
    Object.entries(clients.current).map(([partID, client]) => {
      const revision =
        machineStatuses.current[partID]?.data?.config?.revision ?? '';

      return queryOptions({
        enabled: client !== undefined,
        queryKey: ['partID', partID, 'robotClient', 'resourceNames', revision],
        queryFn: async () => {
          if (!client) {
            throw new Error('No client');
          }
          return client.resourceNames();
        },
      });
    })
  );

  const queries = fromStore(
    createQueries({
      queries: toStore(() => options),
      combine: (results) => {
        const partIDs = Object.keys(clients.current);
        return Object.fromEntries(
          results.map((result, index) => [partIDs[index], result])
        );
      },
    })
  );

  setContext<Context>(key, {
    get current() {
      return queries.current;
    },
  });
};

export const useResourceNames = (
  partID: () => PartID,
  subtype?: string | (() => string)
): QueryContext => {
  const context = getContext<Context>(key);
  const query = $derived(context.current[partID()]);
  const data = $derived(query?.data ?? []);
  const resourceSubtype = $derived(
    typeof subtype === 'function' ? subtype() : subtype
  );
  const filtered = $derived(
    subtype ? data.filter((value) => value.subtype === resourceSubtype) : data
  );
  const error = $derived(query?.error ?? undefined);
  const fetching = $derived(query?.isFetching ?? true);

  return {
    get current() {
      return filtered;
    },
    get error() {
      return error;
    },
    get fetching() {
      return fetching;
    },
    refetch() {
      return query?.refetch() ?? Promise.resolve();
    },
  };
};
