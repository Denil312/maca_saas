"use server";

import { revalidatePath } from "next/cache";

/**
 * 管理後台儲存後呼叫，清除相關頁面快取
 */
export async function revalidateAfterSave(type: "activities" | "associations" | "banner" | "about" | "social") {
  switch (type) {
    case "activities":
      revalidatePath("/activities");
      revalidatePath("/past-activities");
      break;
    case "associations":
    case "banner":
    case "social":
      revalidatePath("/");
      break;
    case "about":
      revalidatePath("/about");
      break;
  }
}
