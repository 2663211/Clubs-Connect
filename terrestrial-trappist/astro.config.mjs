// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Bit-by-Bit',
			logo: {
				light: './src/assets/logo_black.png',
				dark: './src/assets/logo_white.png',
				replacesTitle: true
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/thetomaunatlala-777/Clubs-Connect' }],
			customCss: [
				'./src/styles.css',
			],
			sidebar: [
				{
					label: 'Home',
					slug: 'index',
				},
				{
					label: 'Introduction',
					items: [
						{ label: 'The Bit-by-Bit Team', slug: 'introduction/team' },
						{ label: 'About', slug: 'introduction/about_team' },
						{ label: 'Project Overview', slug: 'introduction/project_overview' }
					]
				},
				{
					label: 'Planning',
					items: [
						{ label: 'Methodology', slug: 'planning/methodology' },
						{ label: 'Technology Stack', slug: 'planning/tech_stack' },
						// { label: 'Planning Board', slug: 'planning/planning_board' }
					]
				},
				{
					label: 'Analysis',
					items: [
						{ label: 'Business Rules', slug: 'analysis/business_rules' },
						{ label: 'Requirements', slug: 'analysis/requirements' },
						{ label: 'User Stories', slug: 'analysis/user_stories' }
					]
				},
				{
					label: 'Design',
					items: [
						{ label: 'Interface Design', slug: 'design/interface_design' },
						{ label: 'Data Models', slug: 'design/data_models' }
					]
				},
				{
					label: 'Development',
					items: [
						{ label: 'Git/GitHub Methodology', slug: 'development/git_methodology' },
						{ label: 'Development Guides', slug: 'development/dev_guides' },
						{ label: 'Code Structure', slug: 'development/code_structure' },
						{ label: 'API', slug: 'development/api' },
						{ label: 'Third-Party Code', slug: 'development/3rd_party' }
					]
				},
				{
					label: 'Deployment',
					items: [
						{ label: 'Deployment Plan', slug: 'deployment/deploy_plan' },
						//{ label: 'Project Overview', slug: 'introduction/clubs_connect' }
					]
				},
				{
					label: 'Testing',
					items: [
						{ label: 'Test plan', slug: 'testing/testplan' },
						{ label: 'User Testing', slug: 'testing/uat' },
						{label: 'Security Audit', slug: 'testing/audit' }
					]
				},
				{
					label: 'Maintanance',
					items: [
						//{ label: 'The Bit-by-Bit Team', slug: 'introduction/team' },
						//{ label: 'Project Overview', slug: 'introduction/clubs_connect' }
					]
				},
				{
					label: 'LLMs Usage',
					slug: 'llms',
				},
				{
					label: 'References',
					slug: 'references',
				},
				{
					label: 'Appendix',
					slug: 'appendix',
				},
			],
		}),
	],
	site: 'https://thetomaunatlala-777.github.io',
	base: '/Clubs-Connect/',

});
