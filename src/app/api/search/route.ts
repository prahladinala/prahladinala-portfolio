import { NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/mdx';

export async function GET() {
  const notes = getAllNotes();
  return NextResponse.json(notes);
}
