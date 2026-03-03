// src/utils/postFilter.ts

export function getVisiblePosts(posts: any[]) {
    const now = new Date();

    return posts.filter((post) => {
        const status = post.data.status ?? 'published';
        const pubDate = post.data.pubdate ? new Date(post.data.pubdate) : null;

        // Logic: status must be 'published' AND (no pubDate OR pubDate <= now)
        if (status !== 'published') {
            return false;
        }

        if (pubDate && pubDate > now) {
            return false;
        }

        return true;
    });
}
