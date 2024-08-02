import React from "react";
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
  Box,
  Grid,
  Icon,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "~/shopify.server";
import { SunIcon } from '@shopify/polaris-icons';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const campaigns: any[] = [];

  return json({ campaigns });
};

export default function CampaignsPage() {
  const { campaigns } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleCreateCampaign = () => {
    navigate('/app/campaigns/new');
  };

  return (
    <Page
  fullWidth
  title="Campaigns"
  primaryAction={
    <Button onClick={handleCreateCampaign} variant="primary">Create Campaign</Button>
  }
>
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
                    onAction: handleCreateCampaign
                  }}
                >
                  <p>Boost your sales and revenue today by creating promotional offers for your customers</p>
                </EmptyState>
              </Card>
            ) : (
              <Grid>
                {campaigns.map((campaign, index) => (
                  <Grid.Cell key={index} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
                    <Card>
                      <Text variant="headingMd" as="h2">
                        Campaign {index + 1}
                      </Text>
                      {/* Add more campaign details here */}
                    </Card>
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
              <Icon source={SunIcon} tone="base" />
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