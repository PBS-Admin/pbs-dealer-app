// app/api/run-mbs/route.js
import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const { inputFilePath, outputFilePath } = await request.json();

    if (!inputFilePath || !outputFilePath) {
      return NextResponse.json(
        { error: 'Missing required paths' },
        { status: 400 }
      );
    }

    const exePath = 'C:\\MBS\\UTIL\\MBS_INI.exe';
    if (!existsSync(exePath)) {
      return NextResponse.json(
        { error: `MBS_INI.exe not found at ${exePath}` },
        { status: 400 }
      );
    }

    const sanitizedInputPath = inputFilePath.replace(/\//g, '\\');
    const sanitizedOutputPath = outputFilePath.replace(/\//g, '\\');

    // Construct the command
    const command = `cmd.exe /c ""${exePath}" 1 "${sanitizedInputPath}" "${sanitizedOutputPath}""`;
    console.log('Executing command:', command);

    return new Promise((resolve) => {
      exec(
        command,
        {
          windowsHide: true,
          // Add current working directory
          cwd: 'C:\\MBS\\UTIL',
        },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error}`);
            resolve(
              NextResponse.json(
                {
                  error: error.message,
                  command: command, // Include command in error for debugging
                  stdout: stdout,
                  stderr: stderr,
                },
                { status: 500 }
              )
            );
            return;
          }

          resolve(
            NextResponse.json({
              success: true,
              output: stdout,
              error: stderr || null,
            })
          );
        }
      );
    });
  } catch (error) {
    console.error('Failed to execute MBS:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
