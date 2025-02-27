// app/api/unfurl/route.js
import { NextResponse } from 'next/server';
import { load } from 'cheerio';
import fetch from 'node-fetch';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // Fetch the webpage content
    const response = await fetch(url);
    const html = await response.text();
    
    // Load HTML into cheerio
    const $ = load(html);
    
    // Extract metadata
    const metadata = {
      title: $('meta[property="og:title"]').attr('content') || 
             $('title').text() || 
             $('meta[name="title"]').attr('content'),
             
      description: $('meta[property="og:description"]').attr('content') || 
                   $('meta[name="description"]').attr('content'),
                   
      image: $('meta[property="og:image"]').attr('content') || 
             $('meta[name="image"]').attr('content'),
             
      siteName: $('meta[property="og:site_name"]').attr('content'),
      
      url: $('meta[property="og:url"]').attr('content') || url
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error unfurling URL:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link preview' },
      { status: 500 }
    );
  }
}