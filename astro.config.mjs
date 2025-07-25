// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import clerk from '@clerk/astro';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		clerk(),
		starlight({
			title: 'AI Product Development Wiki',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/AI-Product-Development/wiki' }],
			components: {
				PageFrame: './src/components/PageFrame.astro',
			},
			sidebar: [
				{
					label: 'Public Wiki',
					autogenerate: { 
						directory: 'wiki',
						collapsed: false
					},
				},
				{
					label: 'Working Group',
					autogenerate: { 
						directory: 'wiki/working-group',
						collapsed: true
					},
				},
				{
					label: 'Management',
					autogenerate: { 
						directory: 'wiki/management',
						collapsed: true
					},
				},
			],
		}),
	],
});
