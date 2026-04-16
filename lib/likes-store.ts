type GlobalLikes = typeof globalThis & {
  __likesStore?: Map<string, Set<string>>;
};

function likesStore() {
  const globalStore = globalThis as GlobalLikes;
  if (!globalStore.__likesStore) {
    globalStore.__likesStore = new Map<string, Set<string>>();
  }
  return globalStore.__likesStore;
}

export function addLike(postId: string, actorKey: string) {
  const store = likesStore();
  const actors = store.get(postId) ?? new Set<string>();
  const alreadyLiked = actors.has(actorKey);
  if (!alreadyLiked) {
    actors.add(actorKey);
  }
  store.set(postId, actors);
  return { alreadyLiked };
}

export function hasActorLiked(postId: string, actorKey: string) {
  const actors = likesStore().get(postId);
  return actors?.has(actorKey) ?? false;
}
