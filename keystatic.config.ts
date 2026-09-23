import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    // In production, you would switch this to 'github' and set your repo
    kind: process.env.NODE_ENV === 'production' ? 'local' : 'local',
  },
  ui: {
    brand: {
      name: 'Prahlad Portfolio CMS',
    },
  },
  singletons: {
    socials: singleton({
      label: 'Social Links',
      path: 'src/content/socials/socials',
      format: { data: 'json' },
      schema: {
        email: fields.text({ label: 'Email Address' }),
        github: fields.text({ label: 'GitHub URL' }),
        linkedin: fields.text({ label: 'LinkedIn URL' }),
        twitter: fields.text({ label: 'Twitter URL' }),
        medium: fields.text({ label: 'Medium URL' }),
      }
    }),
    skills: singleton({
      label: 'Skills',
      path: 'src/content/skills/skills',
      format: { data: 'json' },
      schema: {
        categories: fields.array(
          fields.object({
            title: fields.text({ label: 'Category Title' }),
            skills: fields.array(
              fields.text({ label: 'Skill' }),
              { label: 'Skills', itemLabel: props => props.value }
            )
          }),
          { label: 'Skill Categories', itemLabel: props => props.fields.title.value }
        )
      }
    }),
  },
  collections: {
    experience: collection({
      label: 'Experience',
      slugField: 'company',
      columns: ['company', 'role', 'duration', 'location'],
      path: 'src/content/experience/*',
      format: { data: 'json' },
      schema: {
        company: fields.slug({ name: { label: 'Company Name' } }),
        role: fields.text({ label: 'Role', validation: { isRequired: true } }),
        duration: fields.text({ label: 'Duration (e.g., Aug 2025 - Present)', validation: { isRequired: true } }),
        location: fields.text({ label: 'Location', validation: { isRequired: true } }),
        shortDescription: fields.text({ label: 'Short Description', multiline: true, validation: { isRequired: true } }),
        responsibilities: fields.array(
          fields.text({ label: 'Responsibility', multiline: true }),
          { label: 'Responsibilities', itemLabel: props => props.value }
        ),
        technologies: fields.array(
          fields.text({ label: 'Technology' }),
          { label: 'Technologies', itemLabel: props => props.value }
        ),
        logo: fields.image({
          label: 'Logo',
          directory: 'public/images/experience',
          publicPath: '/images/experience/',
        }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      columns: ['title', 'featured', 'liveUrl', 'githubUrl'],
      path: 'src/content/projects/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Project Title' } }),
        description: fields.text({ label: 'Short Description', multiline: true, validation: { isRequired: true } }),
        longDescription: fields.text({ label: 'Long Description', multiline: true }),
        image: fields.image({
          label: 'Project Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
        githubUrl: fields.text({ label: 'GitHub URL' }),
        liveUrl: fields.text({ label: 'Live URL' }),
        featured: fields.checkbox({ label: 'Featured Project' }),
      },
    }),
    notes: collection({
      label: 'Digital Notes',
      slugField: 'title',
      columns: ['title', 'topic', 'draft', 'date'],
      path: 'src/content/notes/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        draft: fields.checkbox({ label: 'Draft', description: 'Hide this note from the public site' }),
        description: fields.text({ label: 'Description', multiline: true }),
        date: fields.date({ 
          label: 'Publish Date', 
          defaultValue: { kind: 'today' },
          validation: { isRequired: true } 
        }),
        updatedAt: fields.date({ 
          label: 'Last Updated Date', 
          defaultValue: { kind: 'today' },
          description: 'Optional. Show when you last updated this note.' 
        }),
        topic: fields.text({ label: 'Topic (e.g., react, nextjs)', validation: { isRequired: true } }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: props => props.value }
        ),
        content: fields.mdx({
          options: {
            image: {
              directory: 'public/images/notes',
              publicPath: '/images/notes/'
            }
          },
          label: 'Content',
        }),
      },
    }),
  },
});

// Cache bust: 1790180505.6265287
