// src/middleware.js 
export function onRequest({ url, redirect }, next) {
  const pathname = url.pathname
  
  const doubleCategoryPattern = /^\/posts\/([^\/]+)\/\1\/([^\/]+)\/?$/i
  
  if (doubleCategoryPattern.test(pathname)) {
    const match = pathname.match(doubleCategoryPattern)
    const category = match[1]
    const slug = match[2]
    
    const newPath = `/posts/${category.toLowerCase()}/${slug.toLowerCase()}`
    return redirect(newPath, 301)
  }
  
  // Handle /posts/undefined
  if (pathname === '/posts/undefined' || pathname.startsWith('/posts/undefined/')) {
    return redirect("/posts", 302)
  }
  
  // Handle other undefined paths
  if (pathname.includes('/undefined')) {
    return redirect("/posts", 302)
  }
  
  // Handle uppercase redirects
  const categoryPattern = /^\/posts\/([^\/]+)\/?$/i
  if (categoryPattern.test(pathname)) {
    const match = pathname.match(categoryPattern)
    const category = match[1]
    
    if (/[A-Z]/.test(category)) {
      const newPath = `/posts/${category.toLowerCase()}`
      return redirect(newPath, 301)
    }
  }
  
  // Handle uppercase post paths
  const postPattern = /^\/posts\/([^\/]+)\/([^\/]+)\/?$/i
  if (postPattern.test(pathname)) {
    const match = pathname.match(postPattern)
    const category = match[1]
    const slug = match[2]
    
    if (/[A-Z]/.test(category) || /[A-Z]/.test(slug)) {
      const newPath = `/posts/${category.toLowerCase()}/${slug.toLowerCase()}`
      return redirect(newPath, 301)
    }
  }
  
  return next()
}