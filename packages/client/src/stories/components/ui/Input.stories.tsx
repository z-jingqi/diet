import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/Input';

const meta = {
  title: 'Components/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "请输入内容",
  },
};

export const WithValue: Story = {
  args: {
    value: "已输入的内容",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "禁用状态",
  },
};

export const WithType: Story = {
  args: {
    type: "password",
    placeholder: "请输入密码",
  },
}; 