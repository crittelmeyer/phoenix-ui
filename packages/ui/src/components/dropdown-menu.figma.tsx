import React from 'react'
import figma from '@figma/code-connect'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'

figma.connect(
  DropdownMenu,
  'https://www.figma.com/design/FIGMA_FILE_KEY?node-id=NODE_ID',
  {
    props: {
      open: figma.boolean('Open'),
    },
    example: (props) => (
      <DropdownMenu open={props.open}>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
)
