import * as ftp from 'basic-ftp';
import { NextResponse } from 'next/server';
import { Readable, Writable } from 'stream';

export async function GET(request) {
  const client = new ftp.Client();
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const company = searchParams.get('company');

  try {
    await client.access({
      host: 'ftp3.ftptoyoursite.com',
      user: 'pbstoolsftp',
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    // Create a custom writable stream
    const chunks = [];
    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });

    await client.downloadTo(
      writableStream,
      `/lib/assets/${company}/${filename}`
    );
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('FTP Error:', err);
    return NextResponse.json(
      { error: err.message, details: err.stack },
      { status: 500 }
    );
  } finally {
    client.close();
  }
}
