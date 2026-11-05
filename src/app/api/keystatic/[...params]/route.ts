import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';

/**
 * Increase Vercel serverless function timeout to 60 seconds.
 * Keystatic GitHub storage uploads images via GitHub GraphQL mutations
 * (createCommitOnBranch) which can be slow for large binary files.
 * Without this, the default 10s Vercel limit causes 504/499 timeouts.
 */
export const maxDuration = 60;

export const { POST, GET } = makeRouteHandler({
  config,
});

// Cache bust: 1790180493.32239
// refresh
