// src/services/blogService.js
// -----------------------------------------------------------------------------
// Blog data service.
// Pass 1: in-memory CRUD over the static posts (src/data/blogs.js).
//         Admin edits live for the current session only.
// Pass 2: swap the internals for Firestore (blogs collection). The public API
//         below is intentionally the ONLY thing the UI depends on, so the
//         migration will not touch any page component.
// -----------------------------------------------------------------------------
import { blogs as seedBlogs } from "../data/blogs";

const cloneBlock = (block) => ({
    ...block,
    items: Array.isArray(block.items) ? [...block.items] : block.items,
});

const cloneBlog = (blog) => ({
    ...blog,
    tags: Array.isArray(blog.tags) ? [...blog.tags] : blog.tags,
    content: Array.isArray(blog.content) ? blog.content.map(cloneBlock) : blog.content,
});

let blogs = seedBlogs.map(cloneBlog);
let nextId = blogs.reduce((max, b) => Math.max(max, b.id), 0) + 1;

const today = () =>
    new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

export const getAllBlogs = () => blogs.map(cloneBlog);

export const getBlogById = (id) => {
    const found = blogs.find((b) => b.id === Number(id));
    return found ? cloneBlog(found) : null;
};

export const createBlog = (data) => {
    const blog = {
        id: nextId,
        title: (data.title || "").trim(),
        excerpt: (data.excerpt || "").trim(),
        image: data.image || "",
        author: (data.author || "TerraBloom Team").trim(),
        date: data.date || today(),
        readTime: data.readTime || "5 min read",
        category: data.category || "Sustainability",
        tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
        featured: Boolean(data.featured),
        content: Array.isArray(data.content) ? data.content.map(cloneBlock) : [],
    };
    nextId += 1;
    blogs.push(blog);
    return cloneBlog(blog);
};

export const updateBlog = (id, data) => {
    const index = blogs.findIndex((b) => b.id === Number(id));
    if (index === -1) return null;
    blogs[index] = { ...cloneBlog(data), id: Number(id) };
    return cloneBlog(blogs[index]);
};

export const deleteBlog = (id) => {
    const index = blogs.findIndex((b) => b.id === Number(id));
    if (index === -1) return false;
    blogs.splice(index, 1);
    return true;
};