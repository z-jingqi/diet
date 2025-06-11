import type { Meta, StoryObj } from "@storybook/react";
import UserMessageBubble from "@/components/chat/message-bubbles/UserMessageBubble";

const meta: Meta<typeof UserMessageBubble> = {
  title: "Chat/message-bubbles/UserMessageBubble",
  component: UserMessageBubble,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof UserMessageBubble>;

export const Default: Story = {
  args: {
    content: "我想吃番茄炒蛋",
  },
};

export const LongMessage: Story = {
  args: {
    content:
      "我想吃一道简单又营养的菜，最好是低钠的，因为我有高血压。希望这道菜能包含一些蔬菜和蛋白质，不要太油腻。",
  },
};

export const ShortMessage: Story = {
  args: {
    content: "你好",
  },
};
