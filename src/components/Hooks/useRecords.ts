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
import { SECOND } from '../Atoms/timeUnits';

type BaseRecord = { readonly id?: string };

export type Changelog<T extends BaseRecord> = {
  readonly removed: RA<T>;
  readonly added: RA<T>;
  readonly updated: RA<{ readonly old: T; readonly new: T }>;
};

export function useRecords<T extends BaseRecord>(
  query: Query,
): readonly [RA<T> | undefined, (newItems: RA<T>) => Promise<Changelog<T>>] {
  const [documents, setDocuments] = React.useState<
    RA<QueryDocumentSnapshot> | undefined
  >(undefined);

  const collectionName = useUnsafeCollectionName(query);

  React.useEffect(() => {
    setDocuments(undefined);
    return onSnapshot(
      query,
      (snapshot) => setDocuments(snapshot.docs),
      console.error,
    );
  }, [query]);

  return [
    React.useMemo(() => documents?.map(documentToData<T>), [documents]),
    React.useCallback(
      async (updatedData) => {
        if (documents === undefined)
          throw new Error("Can't modify documents before first fetch");

        // Delete removed
        const newIds = new Set(updatedData.map(({ id }) => id));
        const removedDocuments = documents.filter(
          (record) => !newIds.has(record.id),
        );
        const removePromises = removedDocuments.map(({ ref }) =>
          deleteDoc(ref),
        );

        // Created added
        const newData = updatedData.filter(({ id }) => id === undefined);
        const addPromises = newData.map(({ id: _, ...data }) =>
          addDoc(collection(db, collectionName), data),
        );

        // Modify updated
        const preservedData = updatedData.filter(({ id }) => id !== undefined);
        const indexedDocuments = Object.fromEntries(
          documents.map((document) => [document.id, document]),
        );
        const modifiedData = preservedData.filter(
          (data) =>
            normalize(indexedDocuments[data.id]?.data()) !== normalize(data),
        );
        const updatePromises = modifiedData.map(({ id, ...record }) =>
          updateDoc(
            indexedDocuments[id]?.ref,
            record as UpdateData<Omit<T, 'id'>>,
          ),
        );

        return Promise.all([
          ...removePromises,
          ...addPromises,
          ...updatePromises,
        ]).then(() => ({
          removed: removedDocuments.map(documentToData<T>),
          added: newData,
          updated: modifiedData.map((record) => ({
            old: documentToData(indexedDocuments[record.id]),
            new: record,
          })),
        }));
      },
      [documents, query, collectionName],
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

const documentToData = <T extends BaseRecord>(
  document: QueryDocumentSnapshot,
): T => ({
  id: document.id,
  ...(Object.fromEntries(
    Object.entries(document.data()).map(([key, value]) => [
      key,
      typeof value === 'object' &&
      value !== null &&
      typeof value.seconds === 'number'
        ? new Date(value.seconds * SECOND)
        : value,
    ]),
  ) as T),
});

const normalize = ({ id: _, ...data }: IR<unknown>) =>
  JSON.stringify(
    Object.entries(data).sort(([left], [right]) => left.localeCompare(right)),
  );
