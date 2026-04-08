// src/utils/postFilter.ts

export function getVisiblePosts(posts: any[]) {
    const now = new Date();

    return posts.filter((post) => {
        const status = post.data.status ?? 'published';
        const pubDate = post.data.pubdate ? new Date(post.data.pubdate) : null;
        const scheduledTime = post.data.scheduledTime ? new Date(post.data.scheduledTime) : null;

        // Jika status scheduled, tampilkan HANYA JIKA scheduledTime sudah terlewati
        if (status === 'scheduled') {
            if (scheduledTime && scheduledTime <= now) {
                return true;
            }
            return false;
        }

        // Jika status selain 'published' dan 'scheduled' (seperti draft, takedown), sembunyikan
        if (status !== 'published') {
            return false;
        }

        // Jika status published, pastikan pubDate tidak di masa depan
        if (pubDate && pubDate > now) {
            return false;
        }

        return true;
    });
}
