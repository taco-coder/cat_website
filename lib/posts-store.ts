import type { CatPost } from "@/lib/types";

const seedPosts: CatPost[] = [
  {
    id: "post_1",
    imageUrl:
      "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80",
    caption: "Morning zoomies complete. Time for a well-earned sunbeam nap.",
    createdAt: "2026-04-15T16:30:00.000Z",
    heartCount: 32,
  },
  {
    id: "post_2",
    imageUrl:
      "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80",
    caption: "When the treat bag rustles, I materialize instantly.",
    createdAt: "2026-04-14T14:15:00.000Z",
    heartCount: 41,
  },
  {
    id: "post_3",
    imageUrl:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80",
    caption: "Security sweep of the windowsill is underway.",
    createdAt: "2026-04-13T12:20:00.000Z",
    heartCount: 27,
  },
  {
    id: "post_4",
    imageUrl:
      "https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=1200&q=80",
    caption: "Supervising work calls is my full-time job.",
    createdAt: "2026-04-12T09:10:00.000Z",
    heartCount: 18,
  },
  {
    id: "post_5",
    imageUrl:
      "https://images.unsplash.com/photo-1574144113084-b6f450cc5e0c?auto=format&fit=crop&w=1200&q=80",
    caption: "Tiny paws, huge opinions.",
    createdAt: "2026-04-11T08:40:00.000Z",
    heartCount: 55,
  },
  {
    id: "post_6",
    imageUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    caption: "Golden hour portraits before dinner.",
    createdAt: "2026-04-10T18:05:00.000Z",
    heartCount: 49,
  },
];

const globalForPostStore = globalThis as typeof globalThis & {
  __postStore?: CatPost[];
};

function getStore() {
  if (!globalForPostStore.__postStore) {
    globalForPostStore.__postStore = [...seedPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
  return globalForPostStore.__postStore;
}

export function listPosts() {
  return [...getStore()];
}

export function getPost(id: string) {
  return getStore().find((post) => post.id === id);
}

export function listPostsPage(cursor: string | null, limit = 3) {
  const posts = getStore();
  const startIndex = cursor
    ? posts.findIndex((post) => post.id === cursor) + 1
    : 0;
  const safeStartIndex = startIndex < 0 ? 0 : startIndex;
  const items = posts.slice(safeStartIndex, safeStartIndex + limit);
  const nextCursor = items.length === limit ? items.at(-1)?.id ?? null : null;
  return { items, nextCursor };
}

export function createPost(data: Pick<CatPost, "imageUrl" | "caption">) {
  const post: CatPost = {
    id: crypto.randomUUID(),
    imageUrl: data.imageUrl,
    caption: data.caption,
    createdAt: new Date().toISOString(),
    heartCount: 0,
  };
  getStore().unshift(post);
  return post;
}

export function updatePost(
  id: string,
  data: Partial<Pick<CatPost, "imageUrl" | "caption">>,
) {
  const store = getStore();
  const idx = store.findIndex((post) => post.id === id);
  if (idx === -1) return undefined;
  const prev = store[idx];
  const next: CatPost = {
    ...prev,
    ...data,
  };
  store[idx] = next;
  return next;
}

export function deletePost(id: string) {
  const store = getStore();
  const idx = store.findIndex((post) => post.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

export function incrementHeartCount(postId: string) {
  const store = getStore();
  const post = store.find((item) => item.id === postId);
  if (!post) return undefined;
  post.heartCount += 1;
  return post;
}
