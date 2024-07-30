import React, { useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
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
  Grid,
  SkeletonBodyText,
  SkeletonDisplayText,
  Icon,
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCampaign = () => {
    setIsLoading(true);
    navigate('new');
  };

  const CampaignSkeleton = () => (
    <Card>
      <BlockStack gap="400">
        <SkeletonDisplayText size="small" />
        <SkeletonBodyText lines={3} />
      </BlockStack>
    </Card>
  );

  const LightningBoltIcon = () => (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18l6-13h-4l1-5-6 13h4l-1 5z" fill="currentColor" />
    </svg>
  );

  return (
    <Page fullWidth>
      <TitleBar title="Campaigns" primaryAction={
        <Button onClick={handleCreateCampaign} loading={isLoading}>New campaign</Button>
      } />
      <Layout>
        <Layout.Section>
          <div style={{ background: '#f4f6f8', padding: '2rem', borderRadius: '0.5rem' }}>
            {campaigns.length === 0 ? (
              <Card>
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
              </Card>
            ) : (
              <Grid>
                {campaigns.map((campaign, index) => (
                  <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                    {isLoading ? <CampaignSkeleton /> : (
                      <Card>
                        <Text variant="headingMd" as="h2">
                          Campaign {index + 1}
                        </Text>
                      </Card>
                    )}
                  </Grid.Cell>
                ))}
              </Grid>
            )}
          </div>
        </Layout.Section>
      </Layout>
      <Box paddingBlockStart="500">
        <Card>
          <InlineStack gap="400" align="center" blockAlign="center">
            <div style={{ 
              background: '#00a47c', 
              borderRadius: '50%', 
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px'
            }}>
              <Icon source={LightningBoltIcon} color="base" />
            </div>
            <Text as="p" variant="bodyMd">
              Use a <Text as="span" fontWeight="bold">countdown timer</Text> to create urgency. Make it visually appealing and on-brand to boost conversions!
            </Text>
          </InlineStack>
        </Card>
      </Box>
    </Page>
  );
}