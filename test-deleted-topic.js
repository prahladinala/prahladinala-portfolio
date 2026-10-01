const { createReader } = require("@keystatic/core/reader");
const core = require("@keystatic/core");

const config = core.config({
  storage: { kind: 'local' },
  collections: {
    notes: core.collection({
      label: 'Notes',
      slugField: 'title',
      path: 'src/content/notes/{topic}/*',
      format: { contentField: 'content' },
      schema: {
        title: core.fields.slug({ name: { label: 'Title' } }),
        topic: core.fields.select({ label: 'Topic', options: [{label: 'Next.js', value: 'nextjs'}], defaultValue: 'nextjs' }),
        content: core.fields.mdx({ label: 'Content' })
      }
    })
  }
});

const reader = createReader("", config);
reader.collections.notes.list().then(items => {
  console.log("Found items:", items);
}).catch(console.error);
