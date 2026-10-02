import { config, fields, collection, singleton } from "@keystatic/core";
import topicsData from "./src/content/topics/topics.json";

// Dynamically build dropdown options from src/content/topics/topics.json
const topicOptions =
  topicsData?.topics?.map((item: any) => ({
    label: item.topic?.name || item.name || "Untitled",
    value: item.topic?.slug || item.slug || "untitled",
  })) || [];

export default config({
  storage:
    process.env.NODE_ENV === "development"
      ? { kind: "local" }
      : {
          kind: "github",
          repo: { owner: "prahladinala", name: "prahladinala-portfolio" },
        },
  ui: {
    brand: {
      name: "Prahlad Portfolio CMS",
    },
  },
  singletons: {
    settings: singleton({
      label: "Site Settings",
      path: "src/content/settings",
      format: { data: "json" },
      schema: {
        showComments: fields.checkbox({ label: "Show Comments", defaultValue: true, description: "Enable or disable Giscus comments on notes." }),
        showViews: fields.checkbox({ label: "Show View Counters", defaultValue: true, description: "Enable or disable view counters on notes." }),
        showTableOfContents: fields.checkbox({ label: "Show Table of Contents", defaultValue: true, description: "Enable or disable the sticky table of contents on notes." }),
        showShareButtons: fields.checkbox({ label: "Show Share Buttons", defaultValue: true, description: "Enable or disable share buttons on notes." }),
        showRelatedNotes: fields.checkbox({ label: "Show Related Notes", defaultValue: true, description: "Enable or disable the related notes section at the bottom of notes." }),
        showOpenSource: fields.checkbox({ label: "Show Open Source Section", defaultValue: false, description: "Enable or disable the Open Source section." }),
        showTestimonials: fields.checkbox({ label: "Show Testimonials Section", defaultValue: false, description: "Enable or disable the Testimonials section." }),
        enableNotes: fields.checkbox({ label: "Enable Digital Notes", defaultValue: true, description: "Show the Notes section in the navbar and enable the routes." }),
        showHireMeBanner: fields.checkbox({ label: "Show 'Available for Work' Banner", defaultValue: false, description: "Displays a sticky banner at the top." }),
        maintenanceMode: fields.checkbox({ label: "Maintenance Mode", defaultValue: false, description: "Replaces the site with a 'Coming Soon' screen." }),
        enableAiAssistant: fields.checkbox({ label: "Enable AI Assistant", defaultValue: true, description: "Shows the AI Chatbot floating button." }),
        defaultTheme: fields.select({
          label: "Default Theme",
          defaultValue: "system",
          options: [
            { label: "System Default", value: "system" },
            { label: "Always Dark", value: "dark" },
            { label: "Always Light", value: "light" }
          ],
          description: "Force a specific theme or use the user's system preference."
        }),
      }
    }),
    aiKnowledgeBase: singleton({
      label: "AI Knowledge Base",
      path: "src/content/ai-knowledge-base",
      format: { data: "json" },
      schema: {
        slashCommands: fields.array(
          fields.object({
            command: fields.text({ label: "Command (e.g. /dark)" }),
            label: fields.text({ label: "Label (e.g. Dark Mode)" }),
            desc: fields.text({ label: "Description" }),
          }),
          {
            label: "Slash Commands",
            itemLabel: (props) => props.fields.command.value,
          },
        ),
        greetings: fields.array(fields.text({ label: "Greeting" }), {
          label: "Greetings",
          itemLabel: (props) => props.value,
        }),
        defaultResponses: fields.array(
          fields.text({ label: "Default Response" }),
          { label: "Default Responses", itemLabel: (props) => props.value },
        ),
        knowledgeBase: fields.array(
          fields.object({
            keywords: fields.array(fields.text({ label: "Keyword" }), {
              label: "Keywords",
              itemLabel: (props) => props.value,
            }),
            responses: fields.array(
              fields.text({ label: "Response", multiline: true }),
              { label: "Responses", itemLabel: (props) => props.value },
            ),
            actionLink: fields.object({
              label: fields.text({ label: "Action Link Label (Optional)" }),
              url: fields.text({ label: "Action Link URL (Optional)" }),
            }),
          }),
          {
            label: "Knowledge Base Items",
            itemLabel: (props) => {
              try {
                return props.fields.keywords.elements[0].value || "Item";
              } catch (_e) {
                return "Item";
              }
            },
          },
        ),
      },
    }),
    socials: singleton({
      label: "Social Links",
      path: "src/content/socials/socials",
      format: { data: "json" },
      schema: {
        email: fields.text({ label: "Email Address" }),
        github: fields.text({ label: "GitHub URL" }),
        linkedin: fields.text({ label: "LinkedIn URL" }),
        twitter: fields.text({ label: "Twitter URL" }),
        medium: fields.text({ label: "Medium URL" }),
      },
    }),
    skills: singleton({
      label: "Skills",
      path: "src/content/skills/skills",
      format: { data: "json" },
      schema: {
        categories: fields.array(
          fields.object({
            title: fields.text({ label: "Category Title" }),
            skills: fields.array(fields.text({ label: "Skill" }), {
              label: "Skills",
              itemLabel: (props) => props.value,
            }),
          }),
          {
            label: "Skill Categories",
            itemLabel: (props) => props.fields.title.value,
          },
        ),
      },
    }),
    topics: singleton({
      label: "Topics",
      path: "src/content/topics/topics",
      format: { data: "json" },
      schema: {
        topics: fields.array(
          fields.object({
            topic: fields.slug({
              name: {
                label: "Topic Name",
                validation: { isRequired: true },
              },
              slug: {
                label: "Slug",
                description: "Auto-generated from Topic Name",
              },
            }),
            description: fields.text({
              label: "Description",
              multiline: true,
            }),
          }),
          {
            label: "Topics",
            slugField: "topic",
            itemLabel: (props) =>
              `${props.fields.topic.value.name} (${props.fields.description.value})`,
          },
        ),
      },
    }),
  },
  collections: {
    openSource: collection({
      label: "Open Source Projects",
      slugField: "title",
      path: "src/content/open-source/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Project Title" } }),
        description: fields.text({ label: "Description", multiline: true }),
        type: fields.select({
          label: "Type",
          defaultValue: "Library",
          options: [
            { label: "Library", value: "Library" },
            { label: "VS Code Extension", value: "VS Code Extension" },
            { label: "Theme", value: "Theme" },
            { label: "Framework", value: "Framework" },
            { label: "CLI Tool", value: "CLI Tool" }
          ],
          description: "Select the type of project (this determines the icon shown on the UI)."
        }),
        url: fields.text({ label: "URL" }),
        metrics: fields.object({
          downloads: fields.text({ label: "Downloads" }),
          stars: fields.text({ label: "Stars" }),
          users: fields.text({ label: "Users" }),
        }, { label: "Metrics" })
      }
    }),
    testimonials: collection({
      label: "Testimonials",
      slugField: "name",
      path: "src/content/testimonials/*",
      format: { data: "json" },
      schema: {
        name: fields.slug({ name: { label: "Name" } }),
        role: fields.text({ label: "Role" }),
        company: fields.text({ label: "Company" }),
        content: fields.text({ label: "Testimonial Content", multiline: true }),
        image: fields.text({ label: "Image URL" })
      }
    }),
    experience: collection({
      label: "Experience",
      slugField: "company",
      columns: ["company", "role", "duration", "location"],
      path: "src/content/experience/*",
      format: { data: "json" },
      schema: {
        company: fields.slug({ name: { label: "Company Name" } }),
        role: fields.text({ label: "Role", validation: { isRequired: true } }),
        duration: fields.text({
          label: "Duration (e.g., Aug 2025 - Present)",
          validation: { isRequired: true },
        }),
        location: fields.text({
          label: "Location",
          validation: { isRequired: true },
        }),
        shortDescription: fields.text({
          label: "Short Description",
          multiline: true,
          validation: { isRequired: true },
        }),
        responsibilities: fields.array(
          fields.text({ label: "Responsibility", multiline: true }),
          { label: "Responsibilities", itemLabel: (props) => props.value },
        ),
        technologies: fields.array(fields.text({ label: "Technology" }), {
          label: "Technologies",
          itemLabel: (props) => props.value,
        }),
        logo: fields.image({
          label: "Logo",
          directory: "public/images/experience",
          publicPath: "/images/experience/",
        }),
      },
    }),
    projects: collection({
      label: "Projects",
      slugField: "title",
      columns: ["title", "featured", "liveUrl", "githubUrl"],
      path: "src/content/projects/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Project Title" } }),
        description: fields.text({
          label: "Short Description",
          multiline: true,
          validation: { isRequired: true },
        }),
        longDescription: fields.text({
          label: "Long Description",
          multiline: true,
        }),
        image: fields.image({
          label: "Project Image",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        githubUrl: fields.text({ label: "GitHub URL" }),
        liveUrl: fields.text({ label: "Live URL" }),
        featured: fields.checkbox({ label: "Featured Project" }),
      },
    }),
    notes: collection({
      label: "Digital Notes",
      slugField: "title",
      columns: ["title", "topic", "draft", "date"],
      path: "src/content/notes/**",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        draft: fields.checkbox({
          label: "Draft",
          description: "Hide this note from the public site",
        }),
        description: fields.text({ label: "Description", multiline: true }),
        date: fields.date({
          label: "Publish Date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        updatedAt: fields.date({
          label: "Last Updated Date",
          defaultValue: { kind: "today" },
          description: "Optional. Show when you last updated this note.",
        }),
        topic: fields.select({
          label: "Topic",
          options: topicOptions,
          defaultValue: topicOptions[0]?.value || "react",
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        content: fields.mdx({
          options: {
            image: {
              directory: "public/images/notes",
              publicPath: "/images/notes/",
            },
          },
          label: "Content",
        }),
      },
    }),
  },
});
