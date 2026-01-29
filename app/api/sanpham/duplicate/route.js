import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI không được cấu hình trong .env.local");
}

let clientPromise;
if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

// Kết nối database
async function getDB() {
  const client = await clientPromise;
  return client.db("test_clone").collection("sanpham");
}

// API: Nhân đôi sản phẩm
export async function POST(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return Response.json({ success: false, error: "Thiếu ID sản phẩm" }, { status: 400 });
    }

    const collection = await getDB();
    const originalDoc = await collection.findOne({ _id: new ObjectId(id) });

    if (!originalDoc) {
      return Response.json({ success: false, error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    delete originalDoc._id; // Xóa ID để MongoDB tự tạo mới
    originalDoc.thongSoTong.variant = originalDoc.thongSoTong.variant + " (Copy)"; // Thêm nhãn phân biệt
    originalDoc.thongSoTong.dateCreate = Date.now();

    const result = await collection.insertOne(originalDoc);
    return Response.json({ success: true, newId: result.insertedId }, { status: 200 });

  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
