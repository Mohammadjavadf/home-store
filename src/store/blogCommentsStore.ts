import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BlogComment {
  id: string;
  postSlug: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}

interface BlogCommentsState {
  comments: BlogComment[];
  addComment: (data: {
    postSlug: string;
    userId: string;
    userName: string;
    text: string;
  }) => { ok: boolean; error?: string };
  updateComment: (id: string, text: string) => void;
  deleteComment: (id: string) => void;
  getPostComments: (postSlug: string) => BlogComment[];
  getUserComment: (postSlug: string, userId: string) => BlogComment | undefined;
  countForPost: (postSlug: string) => number;
}

export const useBlogCommentsStore = create<BlogCommentsState>()(
  persist(
    (set, get) => ({
      comments: [],

      addComment: (data) => {
        const existing = get().comments.find(
          (c) => c.postSlug === data.postSlug && c.userId === data.userId
        );
        if (existing) {
          return { ok: false, error: 'شما قبلاً برای این مقاله نظر داده‌اید' };
        }
        if (data.text.trim().length < 10) {
          return { ok: false, error: 'متن نظر باید حداقل ۱۰ کاراکتر باشد' };
        }

        const comment: BlogComment = {
          id: `bc-${Date.now()}`,
          ...data,
          text: data.text.trim(),
          createdAt: Date.now(),
        };

        set((s) => ({ comments: [comment, ...s.comments] }));
        return { ok: true };
      },

      updateComment: (id, text) =>
        set((s) => ({
          comments: s.comments.map((c) =>
            c.id === id ? { ...c, text: text.trim(), createdAt: Date.now() } : c
          ),
        })),

      deleteComment: (id) =>
        set((s) => ({ comments: s.comments.filter((c) => c.id !== id) })),

      getPostComments: (postSlug) =>
        get().comments
          .filter((c) => c.postSlug === postSlug)
          .sort((a, b) => b.createdAt - a.createdAt),

      getUserComment: (postSlug, userId) =>
        get().comments.find(
          (c) => c.postSlug === postSlug && c.userId === userId
        ),

      countForPost: (postSlug) =>
        get().comments.filter((c) => c.postSlug === postSlug).length,
    }),
    { name: 'khanestore-blog-comments', version: 1 }
  )
);