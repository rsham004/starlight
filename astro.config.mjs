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
					label: 'Welcome',
					items: [
						{ label: 'Getting Started', link: '/wiki/' },
						{ label: 'How to Contribute', link: '/wiki/contributing/' },
					],
				},
				{
					label: 'Public Resources',
					autogenerate: { 
						directory: 'wiki',
						collapsed: false
					},
				},
				{
					label: 'AI Builders Circle',
					items: [
						{ label: 'Circle Home', link: '/wiki/working-group/ai-builders-circle/' },
						{ label: 'Getting Started', link: '/wiki/working-group/ai-builders-circle/getting-started/' },
						{ label: 'Core Values', link: '/wiki/working-group/ai-builders-circle/core-values/' },
						{ label: 'Foundry OS', link: '/wiki/working-group/ai-builders-circle/foundry-os/' },
						{
							label: 'Challenges',
							collapsed: true,
							items: [
								{ label: 'Overview', link: '/wiki/working-group/ai-builders-circle/challenges/overview/' },
								{ label: 'All Challenges', link: '/wiki/working-group/ai-builders-circle/challenges/Challenges_list/' },
								{ label: 'Challenge Template', link: '/wiki/working-group/ai-builders-circle/challenges/challenge_template/' },
							]
						},
						{
							label: 'Events & Meetings',
							collapsed: true,
							items: [
								{ label: 'Events Overview', link: '/wiki/working-group/ai-builders-circle/Events/Events_overview/' },
								{ label: 'Events List', link: '/wiki/working-group/ai-builders-circle/Events/Events_list/' },
								{ label: 'Meetings', link: '/wiki/working-group/ai-builders-circle/meetings/overview/' },
							]
						},
						{
							label: 'Exploration',
							collapsed: true,
							items: [
								{ label: 'RuV SynapticMesh', link: '/wiki/working-group/ai-builders-circle/exploration/RuV/RuV-SynapticMesh-explanation/' },
								{ label: 'Swarm Learning', link: '/wiki/working-group/ai-builders-circle/exploration/RuV/swarm/Learning_swarming_example/' },
							]
						},
					],
				},
				{
					label: 'Management Dashboard',
					items: [
						{ label: 'Dashboard', link: '/wiki/management/' },
						{ label: 'Circle Management', link: '/wiki/working-group/ai-builders-circle/Circle_Management/management_tasks/' },
						{ label: 'Member Directory', link: '/wiki/working-group/ai-builders-circle/Circle_Management/member_table/' },
					],
				},
			],
		}),
	],
});
