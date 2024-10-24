// app/api/run-mbs/route.js
import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { join } from 'path';

export async function POST(request) {
  console.log('post hit');
  console.log('req: ', request);
  try {
    const { inputFilePath, outputFilePath } = await request.json();

    console.log('inputFile: ', inputFilePath);
    console.log('outputFile: ', outputFilePath);

    if (!inputFilePath || !outputFilePath) {
      return NextResponse.json(
        { error: 'Missing required paths' },
        { status: 400 }
      );
    }

    const exePath = 'C:\\MBS\\UTIL\\MBS_INI.exe';

    console.log('Checking if MBS_INI.exe exists at:', exePath);
    const exists = existsSync(exePath);
    console.log('File exists:', exists);

    if (!exists) {
      return NextResponse.json(
        {
          error: `MBS_INI.exe not found at ${exePath}`,
          details: {
            checkedPath: exePath,
            currentWorkingDir: process.cwd(),
            nodeEnv: process.env.NODE_ENV,
          },
        },
        { status: 400 }
      );
    }

    const sanitizedInputPath = inputFilePath.replace(/\//g, '\\');
    const sanitizedOutputPath = outputFilePath.replace(/\//g, '\\');

    // Construct the command
    const command = `"${exePath}" 1 "${sanitizedInputPath}" "${sanitizedOutputPath}"`;
    console.log('Executing command:', command);

    return new Promise((resolve) => {
      exec(
        command,
        {
          windowsHide: true,
          cwd: 'C:\\MBS\\UTIL',
          shell: true,
          env: { ...process.env },
        },
        (error, stdout, stderr) => {
          console.log('Execution complete');
          console.log('stdout:', stdout);
          console.log('stderr:', stderr);
          if (error) {
            console.error('Execution error:', error);
            resolve(
              NextResponse.json(
                {
                  error: error.message,
                  command: command,
                  stdout: stdout,
                  stderr: stderr,
                  details: {
                    code: error.code,
                    killed: error.killed,
                    signal: error.signal,
                  },
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
              command: command, // Include for debugging
            })
          );
        }
      );
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
        type: error.type,
      },
      { status: 500 }
    );
  }
}
