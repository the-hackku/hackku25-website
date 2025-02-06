import { put } from "@vercel/blob";

export async function testPut() {
  try {
    const { url } = await put("test.txt", "Hello from test!", {
      access: "public",
    });
    console.log("Test put successful:", url);
  } catch (err) {
    console.error("Test put failed:", err);
  }
}
