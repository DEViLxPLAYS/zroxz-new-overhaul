import { supabase } from '../config/supabase.js';

export async function getAllPosts(req, res, next) {
  try {
    const { category } = req.query;

    let query = supabase
      .from('blog_posts')
      .select('id, title, slug, category, excerpt, read_time_minutes, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getPostBySlug(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('published', true)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  try {
    const body = req.body;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: body.title,
        slug: body.slug,
        category: body.category,
        quick_answer: body.quickAnswer,
        excerpt: body.excerpt,
        content: body.content,
        meta_description: body.metaDescription,
        read_time_minutes: body.readTimeMinutes || 5,
        published: body.published || false,
        published_at: body.published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    next(err);
  }
}
