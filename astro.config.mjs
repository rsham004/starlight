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
				Sidebar: './src/components/Sidebar.astro',
			},
			sidebar: [
				{
					label: 'Challenges (Public)',
					autogenerate: { 
						directory: 'challenges',
						collapsed: false
					},
				},
				{
					label: 'Circle Management',
					badge: 'Management Only',
					autogenerate: { 
						directory: 'Circle_Management',
						collapsed: true
					},
				},
			],
		}),
	],
});
