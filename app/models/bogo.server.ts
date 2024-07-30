// app/models/bogo.server.ts
import { MongoClient, Db, ObjectId } from "mongodb";

interface BogoRule {
  _id?: string;
  buyProductId: string;
  getProductId: string;
  createdAt: Date;
}

interface LineItem {
  variant: {
    id: string;
    price: number;
    product: {
      id: string;
    };
  };
  quantity: number;
  title: string;
}

interface Discount {
  value: number;
  title: string;
  targets: {
    productVariantId: string;
    quantity: number;
  }[];
}

let db: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (db) return db;
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    db = client.db();
    
    // Test the connection
    await db.command({ ping: 1 });
    console.log("Successfully connected to MongoDB");
    
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getBogoRules(): Promise<BogoRule[]> {
  const database = await connectToDatabase();
  return database.collection<BogoRule>("bogoRules").find().toArray();
}

export async function createBogoRule(buyProductId: string, getProductId: string): Promise<void> {
  const database = await connectToDatabase();
  await database.collection<BogoRule>("bogoRules").insertOne({
    buyProductId,
    getProductId,
    createdAt: new Date(),
  });
}

export async function deleteBogoRule(ruleId: string): Promise<void> {
  const database = await connectToDatabase();
  await database.collection<BogoRule>("bogoRules").deleteOne({ _id: new ObjectId(ruleId) });
}

export async function applyBogoDiscount(lineItems: LineItem[]): Promise<{ updatedLineItems: LineItem[], discounts: Discount[] }> {
  const database = await connectToDatabase();
  const bogoRules = await database.collection<BogoRule>("bogoRules").find().toArray();

  let updatedLineItems = [...lineItems];
  let discounts: Discount[] = [];

  for (const rule of bogoRules) {
    const buyItem = updatedLineItems.find(item => item.variant.product.id === rule.buyProductId);
    const getItem = updatedLineItems.find(item => item.variant.product.id === rule.getProductId);

    if (buyItem && getItem) {
      const discountQuantity = Math.min(buyItem.quantity, getItem.quantity);
      const discountAmount = getItem.variant.price * discountQuantity;

      discounts.push({
        value: discountAmount,
        title: `BOGO: Buy ${buyItem.title}, Get ${getItem.title} Free`,
        targets: [
          {
            productVariantId: getItem.variant.id,
            quantity: discountQuantity,
          },
        ],
      });
    }
  }

  return { updatedLineItems, discounts };
}