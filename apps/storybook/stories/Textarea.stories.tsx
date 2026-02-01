import type { Meta, StoryObj } from '@storybook/react'
import { Label, Textarea } from '@phoenix/ui'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    autoResize: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    disabled: true,
  },
}

export const AutoResize: Story = {
  args: {
    autoResize: true,
    defaultValue:
      'This textarea automatically grows and shrinks based on content.\n\nTry adding or removing lines of text!\n\nThe height adjusts dynamically.',
    placeholder: 'Type here and watch it grow...',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea id="message" placeholder="Type your message here" />
    </div>
  ),
}
