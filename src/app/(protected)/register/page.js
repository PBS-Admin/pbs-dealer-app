'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../../public/images/pbslogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './page.module.css';

export default function Register() {
  console.log('Register component rendered');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <main className={styles.registerMain}>
      <form className={styles.registerCard} onSubmit={handleSubmit}>
        <Link href="/dashboard" className="backButton">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <Image alt="PBS Buildings Logo" src={logo} className="image" />
        <h1>Register</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className={styles.registerInputs}>
          <div className="cardInput">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="cardInput">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button className="prim" type="submit">
          Register
        </button>
      </form>
    </main>
  );
}
