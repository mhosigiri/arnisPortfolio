import url from '@rollup/plugin-url';

export default {
  // ... other config options
  plugins: [
    url({
      include: ['**/*.jpg', '**/*.png'], // patterns to match
      limit: 0, // Copy all files
    }),
    // ... other plugins
  ]
}