import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'
import { Button, Toaster } from '@phoenix/ui'

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Toast position on screen',
    },
    expand: {
      control: 'boolean',
      description: 'Whether toasts expand to fill width',
    },
    richColors: {
      control: 'boolean',
      description: 'Enable rich color styling for toast types',
    },
    closeButton: {
      control: 'boolean',
      description: 'Show close button on toasts',
    },
    duration: {
      control: 'number',
      description: 'Default duration in ms before auto-dismiss',
    },
    visibleToasts: {
      control: 'number',
      description: 'Maximum number of visible toasts',
    },
  },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button onClick={() => toast('Event created')}>Show Toast</Button>
    </>
  ),
}

export const Variants: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-col gap-2">
        <Button onClick={() => toast.success('Success message')}>
          Success
        </Button>
        <Button onClick={() => toast.error('Error message')}>Error</Button>
        <Button onClick={() => toast.warning('Warning message')}>
          Warning
        </Button>
        <Button onClick={() => toast.info('Info message')}>Info</Button>
        <Button onClick={() => toast.loading('Loading...')}>Loading</Button>
      </div>
    </>
  ),
}

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.error('Failed to save', {
            action: {
              label: 'Retry',
              onClick: () => toast.success('Retried!'),
            },
          })
        }
      >
        Show With Action
      </Button>
    </>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast('Event created', {
            description: 'Monday, January 3rd at 6:00pm',
          })
        }
      >
        Show With Description
      </Button>
    </>
  ),
}
