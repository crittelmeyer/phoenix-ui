import React from 'react'
import figma from '@figma/code-connect'
import { Toaster } from './toast'

/**
 * Figma Code Connect for Toast component
 * This file maps Figma design to React implementation
 */

figma.connect(
  Toaster,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      position: figma.enum('Position', {
        'Bottom Right': 'bottom-right',
        'Top Right': 'top-right',
      }),
    },
    example: ({ position }) => <Toaster position={position} />,
  },
)
