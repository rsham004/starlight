// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'AI Product Development Wiki',
			description: 'A premium AI development community platform with role-based access control',
			logo: {
				src: './src/assets/logo.svg',
				replacesTitle: false,
			},
			social: [
				{ 
					icon: 'github', 
					label: 'GitHub', 
					href: 'https://github.com/AI-Product-Development/wiki' 
				}
			],
			customCss: [
				'./src/styles/global.css',
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Home', link: '/' },
						{ label: 'Quick Start', link: '/getting-started' },
						{ label: 'Contributing', link: '/contributing' },
					],
				},
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
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect', 
						href: 'https://fonts.gstatic.com',
						crossorigin: true,
					},
				},
				{
					tag: 'link',
					attrs: {
						href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
						rel: 'stylesheet',
					},
				},
			],
		}),
	],
});
