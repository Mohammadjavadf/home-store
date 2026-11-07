import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { blogPosts as seedPosts, type BlogPost } from '../data/blog';

interface BlogState {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'slug'>) => { ok: boolean; slug?: string; error?: string };
  updatePost: (slug: string, updates: Partial<BlogPost>) => void;
  deletePost: (slug: string) => void;
  toggleFeatured: (slug: string) => void;
  getBySlug: (slug: string) => BlogPost | undefined;
  resetToSeed: () => void;
}

function generateSlug(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `post-${Date.now()}`;
}

function calculateReadTime(content: string): number {
  // میانگین ۲۰۰ کلمه در دقیقه
  const text = content.replace(/<[^>]*>/g, ' ').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      posts: seedPosts,

      addPost: (post) => {
        const baseSlug = generateSlug(post.title);
        let slug = baseSlug;
        let counter = 1;
        while (get().posts.some((p) => p.slug === slug)) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        const newPost: BlogPost = {
          ...post,
          slug,
          readTime: post.readTime || calculateReadTime(post.content),
          publishedAt: post.publishedAt || new Date().toISOString().split('T')[0],
        };

        set((s) => ({ posts: [newPost, ...s.posts] }));
        return { ok: true, slug };
      },

      updatePost: (slug, updates) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.slug === slug
              ? {
                  ...p,
                  ...updates,
                  readTime: updates.content
                    ? calculateReadTime(updates.content)
                    : p.readTime,
                }
              : p
          ),
        })),

      deletePost: (slug) =>
        set((s) => ({ posts: s.posts.filter((p) => p.slug !== slug) })),

      toggleFeatured: (slug) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.slug === slug ? { ...p, featured: !p.featured } : p
          ),
        })),

      getBySlug: (slug) => get().posts.find((p) => p.slug === slug),

      resetToSeed: () => set({ posts: seedPosts }),
    }),
    { name: 'khanestore-blog', version: 1 }
  )
);