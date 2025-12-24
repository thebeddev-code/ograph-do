import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    stories: ['../src/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
    addons: [],
};

export default config;
