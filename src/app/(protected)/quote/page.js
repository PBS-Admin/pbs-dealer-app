import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ClientQuote from './ClientQuote';

export default async function Quote() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return <ClientQuote session={session} />;
}
