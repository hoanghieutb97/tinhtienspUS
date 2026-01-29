import clientPromise from "../../../lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("test_clone"); // Thay bằng tên database
    const data = await db.collection("users").find({}).toArray(); // Thay bằng tên collection
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Unable to fetch data" }), {
      status: 500,
    });
  }
}
