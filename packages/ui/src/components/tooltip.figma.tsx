import React from 'react'
import figma from '@figma/code-connect'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

/**
 * Figma Code Connect for Tooltip component
 * This file maps Figma design to React implementation
 */

figma.connect(
  Tooltip,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      content: figma.string('Tooltip Text'),
      side: figma.enum('Side', {
        Top: 'top',
        Right: 'right',
        Bottom: 'bottom',
        Left: 'left',
      }),
    },
    example: ({ content, side }) => (
      <Tooltip>
        <TooltipTrigger>Trigger</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    ),
  },
)
