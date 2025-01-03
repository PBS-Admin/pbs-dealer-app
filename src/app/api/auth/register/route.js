import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { query, endPool } from '../../../../lib/db';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if user already exists
    const existingUser = await query(
      'SELECT * FROM Dealer_Users WHERE Username = ?',
      [email]
    );
    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Store the new user in the database
    await query('INSERT INTO Dealer_Users (Username, Password) VALUES (?, ?)', [
      email,
      hashedPassword,
    ]);

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  } finally {
    await endPool;
  }
}
