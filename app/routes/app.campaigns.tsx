import { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  EmptyState,
  Button,
  Text,
  InlineStack,
  BlockStack,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  // In a real app, you would fetch the campaigns from your database here
  const campaigns = [];

  return json({ campaigns });
};

export default function CampaignsPage() {
  const { campaigns } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCampaign = () => {
    setIsLoading(true);
    submit({ action: "create" }, { method: "post" });
  };

  return (
    <Page>
      <TitleBar title="Campaigns" primaryAction={
        <Button onClick={handleCreateCampaign} loading={isLoading}>New campaign</Button>
      } />
      <Layout>
        <Layout.Section>
          <Card>
            {campaigns.length === 0 ? (
              <EmptyState
                heading="Create a campaign to get started!"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                action={{
                  content: "Create campaign",
                  onAction: handleCreateCampaign,
                }}
              >
                <p>Boost your sales and revenue today by creating promotional offers for your customers</p>
              </EmptyState>
            ) : (
              <BlockStack gap="500">
                <Text variant="headingMd" as="h2">
                  Campaign List
                </Text>
                {/* Add your campaign list items here */}
              </BlockStack>
            )}
          </Card>
        </Layout.Section>
      </Layout>
      <Box paddingBlockStart="500">
        <Card>
          <InlineStack gap="200" align="center">
            <div style={{ color: '#00a47c' }}>💡</div>
            <Text as="p" variant="bodyMd">
              Use a <Text as="span" fontWeight="bold">countdown timer</Text> to make people feel like they might miss out and create a sense of urgency. Make it look cool and match your brand to close the deal!
            </Text>
          </InlineStack>
        </Card>
      </Box>
    </Page>
  );
}