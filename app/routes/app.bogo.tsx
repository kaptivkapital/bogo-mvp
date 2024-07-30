import { useState, useCallback } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Form,
  FormLayout,
  Select,
  Button,
  Card,
  ResourceList,
  ResourceItem,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getBogoRules, createBogoRule, deleteBogoRule } from "../models/bogo.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query getProducts {
      products(first: 250) {
        edges {
          node {
            id
            title
          }
        }
      }
    }`
  );

  const responseJson = await response.json();
  const products = responseJson.data.products.edges.map(edge => ({
    label: edge.node.title,
    value: edge.node.id
  }));

  const bogoRules = await getBogoRules();

  return json({ products, bogoRules });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  const formData = await request.formData();
  const action = formData.get("action") as string;

  if (action === "create") {
    const buyProductId = formData.get("buyProductId") as string;
    const getProductId = formData.get("getProductId") as string;
    
    try {
      await createBogoRule(buyProductId, getProductId);
      return json({ success: true, error: null });
    } catch (error) {
      return json({ success: false, error: "Failed to create BOGO rule" }, { status: 500 });
    }
  } else if (action === "delete") {
    const ruleId = formData.get("ruleId") as string;
    try {
      await deleteBogoRule(ruleId);
      return json({ success: true, error: null });
    } catch (error) {
      return json({ success: false, error: "Failed to delete BOGO rule" }, { status: 500 });
    }
  }

  return json({ success: false, error: "Invalid action" }, { status: 400 });
};

export default function BogoRules() {
  const [selectedBuyProduct, setSelectedBuyProduct] = useState("");
  const [selectedGetProduct, setSelectedGetProduct] = useState("");
  const submit = useSubmit();
  const actionData = useActionData();
  const { bogoRules, products } = useLoaderData();

  const handleCreateRule = useCallback(() => {
    if (selectedBuyProduct && selectedGetProduct) {
      submit(
        {
          action: "create",
          buyProductId: selectedBuyProduct,
          getProductId: selectedGetProduct,
        },
        { method: "post" }
      );
    }
  }, [selectedBuyProduct, selectedGetProduct, submit]);

  const handleDelete = useCallback((ruleId: string) => {
    submit(
      { action: "delete", ruleId },
      { method: "post" }
    );
  }, [submit]);

  return (
    <Page title="BOGO Rules">
      <Layout>
        <Layout.Section>
          <Card title="Create BOGO Rule" sectioned>
            <FormLayout>
              <Select
                label="Buy Product"
                options={products}
                onChange={setSelectedBuyProduct}
                value={selectedBuyProduct}
              />
              <Select
                label="Get Product"
                options={products}
                onChange={setSelectedGetProduct}
                value={selectedGetProduct}
              />
              <Button onClick={handleCreateRule} disabled={!selectedBuyProduct || !selectedGetProduct}>
                Create BOGO Rule
              </Button>
            </FormLayout>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card title="Existing BOGO Rules" sectioned>
            <ResourceList
              items={bogoRules}
              renderItem={(item) => (
                <ResourceItem
                  id={item._id}
                  accessibilityLabel={`BOGO Rule: Buy ${item.buyProductId}, Get ${item.getProductId}`}
                >
                  <Text variant="bodyMd" as="h3">
                    Buy: {products.find(p => p.value === item.buyProductId)?.label || item.buyProductId}, 
                    Get: {products.find(p => p.value === item.getProductId)?.label || item.getProductId}
                  </Text>
                  <Text variant="bodySm">Created at: {new Date(item.createdAt).toLocaleString()}</Text>
                  <Button onClick={() => handleDelete(item._id)} tone="critical">
                    Delete
                  </Button>
                </ResourceItem>
              )}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}