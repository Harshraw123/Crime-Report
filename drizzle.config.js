import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url:"postgresql://Crime_owner:npg_TRY7DaMBd6EG@ep-shy-block-a4igh6a1-pooler.us-east-1.aws.neon.tech/Crime?sslmode=require"
  },
});
