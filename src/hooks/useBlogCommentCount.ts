import { useMemo } from 'react';
import { useBlogCommentsStore } from '../store/blogCommentsStore';

export function useBlogCommentCount(slug: string): number {
  const all = useBlogCommentsStore((s) => s.comments);
  return useMemo(
    () => all.filter((c) => c.postSlug === slug).length,
    [all, slug]
  );
}