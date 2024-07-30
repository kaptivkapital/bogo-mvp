import React from 'react';
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  Button,
  Icon,
  BlockStack,
  InlineStack,
} from '@shopify/polaris';
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return json({
    // You can add any data you need to pass to the component here
  });
};

const CampaignTypeCard = ({ title, description, icon, examples, actionText }) => (
  <Card>
    <BlockStack gap="400">
      <InlineStack gap="400">
        <div style={{ flexShrink: 0 }}>
          <Icon source={icon} color="base" />
        </div>
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">{title}</Text>
          <Text variant="bodyMd" as="p">{description}</Text>
        </BlockStack>
      </InlineStack>
      <BlockStack gap="200">
        {examples.map((example, index) => (
          <Text key={index} variant="bodyMd" as="p">• {example}</Text>
        ))}
      </BlockStack>
      <div style={{ textAlign: 'right' }}>
        <Button>{actionText}</Button>
      </div>
    </BlockStack>
  </Card>
);

export default function CampaignTypeSelection() {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const campaignTypes = [
    {
      title: 'Buy X Get Y (BXGY)',
      description: 'Offer different product(s) as gift when customers buy a specified product.',
      icon: 'GiftMajor',
      examples: ['Buy 2 of X, get Y for free', 'Buy 2 of X, get Y 50% OFF'],
      actionText: 'Select campaign'
    },
    {
      title: 'Buy X Get X (BXGX)',
      description: 'Offer same product(s) as gift when customers buy a specified product.',
      icon: 'GiftCardMajor',
      examples: ['Buy 2 of X, get X for free', 'Buy 2 of X, get X 50% OFF'],
      actionText: 'Select campaign'
    },
    {
      title: 'Gift with purchase (GWP)',
      description: 'Setup free or discounted gift when customers reach specific cart amount.',
      icon: 'CartUpMajor',
      examples: ['Spend $100, get a gift 50% OFF', 'Spend $200, get a free gift'],
      actionText: 'Select campaign'
    },
    {
      title: 'Volume discount',
      description: 'Setup discounted price for bulk purchases based on quantity.',
      icon: 'InventoryMajor',
      examples: ['Buy 2 of X, save 20%', 'Buy 3 of X, save 50%'],
      actionText: 'Select campaign'
    }
  ];

  return (
    <Page
      breadcrumbs={[{ content: 'Campaigns', onAction: () => navigate('/app/campaigns') }]}
      title="Select Campaign type"
    >
      <Layout>
        {campaignTypes.map((type, index) => (
          <Layout.Section key={index} oneThird>
            <CampaignTypeCard {...type} />
          </Layout.Section>
        ))}
        <Layout.Section oneThird>
          <Card>
            <BlockStack gap="400">
              <InlineStack gap="400">
                <div style={{ flexShrink: 0 }}>
                  <Icon source="SaleMajor" color="base" />
                </div>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h3">Flash Sale - SALE+ app by WizzCommerce</Text>
                  <Text variant="bodyMd" as="p">Apply discounted prices on products, collections and display a countdown timer.</Text>
                </BlockStack>
              </InlineStack>
              <BlockStack gap="200">
                <Text variant="bodyMd" as="p">• 20% OFF for all products</Text>
                <Text variant="bodyMd" as="p">• Discount $10 for products in collection X</Text>
              </BlockStack>
              <div style={{ textAlign: 'right' }}>
                <Button>Install app</Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}