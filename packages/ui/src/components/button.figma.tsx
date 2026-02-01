import React from 'react'
import figma from '@figma/code-connect'
import { Button } from './button'

/**
 * Placeholder - update URL when Figma file is created
 * https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID
 */
figma.connect(
  Button,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      variant: figma.enum('Variant', {
        Default: 'default',
        Destructive: 'destructive',
        Outline: 'outline',
        Secondary: 'secondary',
        Ghost: 'ghost',
        Link: 'link',
      }),
      size: figma.enum('Size', {
        Default: 'default',
        Small: 'sm',
        Large: 'lg',
        Icon: 'icon',
      }),
      disabled: figma.boolean('Disabled'),
      children: figma.string('Label'),
    },
    example: (props) => <Button {...props} />,
  },
)
