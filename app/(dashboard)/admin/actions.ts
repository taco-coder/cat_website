"use server";

import { revalidatePath } from "next/cache";
import { createPost, deletePost, updatePost } from "@/lib/posts-store";

function readFormValue(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export async function createPostAction(formData: FormData) {
  const imageUrl = readFormValue(formData, "imageUrl");
  const caption = readFormValue(formData, "caption");

  if (!imageUrl || !caption) return;

  createPost({ imageUrl, caption });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updatePostAction(formData: FormData) {
  const id = readFormValue(formData, "id");
  const imageUrl = readFormValue(formData, "imageUrl");
  const caption = readFormValue(formData, "caption");
  if (!id || !imageUrl || !caption) return;

  updatePost(id, { imageUrl, caption });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deletePostAction(formData: FormData) {
  const id = readFormValue(formData, "id");
  if (!id) return;

  deletePost(id);
  revalidatePath("/");
  revalidatePath("/admin");
}
