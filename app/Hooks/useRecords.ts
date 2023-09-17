import React from 'react';
import type { RA } from '../lib/types';
import {
  deleteDoc,
  onSnapshot,
  QueryDocumentSnapshot,
  type Query,
  addDoc,
  collection,
} from 'firebase/firestore';
import { db } from '../lib/firestore';

// FIXME: remove
const debug = true;

export function useRecords<T extends { readonly id?: string }>(
  query: Query,
): readonly [RA<T> | undefined, (newValue: RA<T>) => Promise<void>] {
  const [records, setRecords] = React.useState<
    RA<QueryDocumentSnapshot> | undefined
  >(undefined);

  if (!('path' in query) || typeof query.path !== 'string')
    throw new Error("Can't resolve path from query");

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
          addDoc(collection(db, query.path as string), record),
        );

        // Modify updated
        const modifiedRecords = newData.filter(
          (record) => record.id !== undefined,
        );
        const indexedRecords = Object.fromEntries(
          records.map((record) => [record.id, record]),
        );
        const updatePromises = modifiedRecords.map(
          (record) => indexedRecords[record.id]?.ref.update(record),
        );

        debug &&
          console.log('Updating records', {
            records,
            newRecords,
            newIds,
            removedRecords,
            modifiedRecords,
          });

        return Promise.all([
          ...removePromises,
          ...addPromises,
          ...updatePromises,
        ]).then(() => undefined);
      },
      [records, query],
    ),
  ];
}
