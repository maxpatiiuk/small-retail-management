import React from 'react';
import type { IR, RA } from '../../lib/types';
import {
  deleteDoc,
  onSnapshot,
  QueryDocumentSnapshot,
  type Query,
  addDoc,
  collection,
  updateDoc,
  type UpdateData,
} from 'firebase/firestore';
import { db } from '../../lib/firestore';
import { error } from '../../lib/utils';

// FIXME: remove
const debug = true;

export function useRecords<T extends { readonly id?: string }>(
  query: Query,
): readonly [RA<T> | undefined, (newValue: RA<T>) => Promise<void>] {
  const [records, setRecords] = React.useState<
    RA<QueryDocumentSnapshot> | undefined
  >(undefined);

  const collectionName = useUnsafeCollectionName(query);

  React.useEffect(() => {
    setRecords(undefined);
    debug && console.log('Fetching records');
    return onSnapshot(
      query,
      (snapshot) => (
        setRecords(snapshot.docs), debug && console.log(snapshot.docs)
      ),
      console.error,
    );
  }, [query]);

  return [
    React.useMemo(
      () =>
        records?.map((doc) => ({
          id: doc.id,
          ...(doc.data() as T),
        })),
      [records],
    ),
    React.useCallback(
      async (newData) => {
        if (records === undefined)
          throw new Error("Can't modify records before first fetch");

        // Delete removed
        const newIds = new Set(newData.map((record) => record.id));
        const removedRecords = records.filter(
          (record) => !newIds.has(record.id),
        );
        const removePromises = removedRecords.map((record) =>
          deleteDoc(record.ref),
        );

        // Created added
        const newRecords = newData.filter((record) => record.id === undefined);
        const addPromises = newRecords.map((record) =>
          addDoc(collection(db, collectionName), record),
        );

        // Modify updated
        const preservedRecords = newData.filter(
          (record) => record.id !== undefined,
        );
        const indexedRecords = Object.fromEntries(
          records.map((record) => [record.id, record]),
        );
        const modifiedRecords = preservedRecords.filter(
          (record) =>
            normalize(indexedRecords[record.id]?.data()) !== normalize(record),
        );
        const updatePromises = modifiedRecords.map(({ id, ...record }) =>
          updateDoc(
            indexedRecords[id]?.ref,
            record as UpdateData<Omit<T, 'id'>>,
          ),
        );

        debug &&
          console.log('Updating records', {
            records,
            newRecords,
            newIds,
            removedRecords,
            modifiedRecords,
            preservedRecords,
          });

        return Promise.all([
          ...removePromises,
          ...addPromises,
          ...updatePromises,
        ]).then(() => undefined);
      },
      [records, query, collectionName],
    ),
  ];
}

function useUnsafeCollectionName(query: Query): string {
  return React.useMemo(
    () =>
      getCollectionName(query) ??
      error("Can't resolve collection name from query"),
    [],
  );
}

/*
 * Trying to access private query._query.path.segments[0] without type
 * assertions
 */
function getCollectionName(query: Query): string | undefined {
  if (!('_query' in query)) return undefined;
  const internalQuery = query._query ?? undefined;
  if (typeof internalQuery !== 'object' || !('path' in internalQuery))
    return undefined;
  const path = internalQuery.path ?? undefined;
  if (typeof path !== 'object' || !('segments' in path)) return undefined;
  const segments = path.segments;
  return Array.isArray(segments) &&
    segments.length === 1 &&
    typeof segments[0] === 'string'
    ? segments[0]
    : undefined;
}

const normalize = ({ id: _, ...data }: IR<unknown>) =>
  JSON.stringify(
    Object.entries(data).sort(([left], [right]) => left.localeCompare(right)),
  );
