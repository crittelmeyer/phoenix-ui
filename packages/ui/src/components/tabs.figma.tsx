import React from 'react'
import figma from '@figma/code-connect'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

/**
 * Figma Code Connect for Tabs component
 * This file maps Figma design to React implementation
 */

figma.connect(
  Tabs,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      defaultValue: figma.string('Default Tab'),
    },
    example: ({ defaultValue }) => (
      <Tabs defaultValue={defaultValue}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    ),
  },
)
