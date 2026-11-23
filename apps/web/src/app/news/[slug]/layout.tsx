import React from 'react';
import { DataSeed } from '../../../components/DataSeed';
import { getPostBySlug } from '../../../lib/public-data';

export const revalidate = 3600;
// Maqolalar birinchi ochilganda tayyorlanadi va keshlanadi (keyingilari CDN'dan).
export async function generateStaticParams() { return []; }

export default async function PostLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: any = null;
  try { post = await getPostBySlug(slug); } catch (e: any) { console.error('post load error:', e?.message); }
  return <DataSeed entries={post ? { [`/api/posts?slug=${slug}`]: { posts: [post] } } : null}>{children}</DataSeed>;
}
