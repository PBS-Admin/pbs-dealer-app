import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { transaction } from '../../../../lib/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const result = await transaction(async (conn) => {
      // Check if user exists (within transaction to prevent race conditions)
      const existingUser = await conn.query(
        'SELECT ID FROM Dealer_Users WHERE Username = ?',
        [email]
      );

      if (existingUser.length > 0) {
        throw new Error('User already exists');
      }

      // Hash the password
      const hashedPassword = await hash(password, 12);

      // Create the new user
      await conn.query(
        'INSERT INTO Dealer_Users (Username, Password) VALUES (?, ?)',
        [email, hashedPassword]
      );
    });

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'User already exists') {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
