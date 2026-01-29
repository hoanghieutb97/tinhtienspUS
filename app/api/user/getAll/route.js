import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise; // Kết nối MongoDB
    const db = client.db();

    const users = await db.collection("user").find({}).toArray(); // Lấy tất cả user

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Lỗi khi lấy danh sách user", error }), {
      status: 500,
    });
  }
}
