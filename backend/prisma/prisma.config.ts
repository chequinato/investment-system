import { defineConfig } from '@prisma/cli';

export default defineConfig({
  datasource: {
    provider: 'sqlite',
    url: 'file:./dev.db',
  },
});
