import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import DashboardClient from './DashboardClient';

// Utility function to create a delay for testing loading screen
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Example Usage:
// await delay(3000);

async function getCompanies(session) {
  try {
    if (!session?.user?.id) {
      return { companies: [] };
    }

    const compResult = await query('SELECT ID, Name FROM Dealer_Company');
    const companies = compResult.map((company) => ({
      ID: company.ID,
      Name: company.Name,
    }));

    return { companies };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return { companies: [] };
  }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const { companies } = await getCompanies(session);

  return <DashboardClient initialCompanies={companies} />;
}
