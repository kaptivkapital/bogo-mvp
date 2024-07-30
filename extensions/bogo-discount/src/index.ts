// extensions/bogo-discount/src/index.ts
import { applyBogoDiscount } from "../../../app/models/bogo.server";

interface Input {
  cart: {
    lines: Array<{
      quantity: number;
      merchandise: {
        id: string;
        price: {
          amount: string;
        };
      };
    }>;
  };
}

export async function run(input: Input) {
  const { cart } = input;
  const lineItems = cart.lines.map(line => ({
    variant: {
      id: line.merchandise.id,
      price: parseFloat(line.merchandise.price.amount),
      product: {
        id: line.merchandise.id.split('/')[2], // Assuming the format is like "gid://shopify/ProductVariant/12345"
      },
    },
    quantity: line.quantity,
    title: `Product ${line.merchandise.id}`, // You might want to fetch the actual title from somewhere
  }));

  const { discounts } = await applyBogoDiscount(lineItems);

  return {
    discounts,
    discountApplicationStrategy: "MAXIMUM",
  };
}