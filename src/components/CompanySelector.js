import React from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { useSession } from 'next-auth/react';

const CompanySelector = ({ companies = [] }) => {
  const { data: session } = useSession();
  const { isLoading, switchCompany } = useUserContext();

  const handleCompanyChange = async (event) => {
    const newCompany = parseInt(event.target.value);
    await switchCompany(newCompany);
  };

  if (!session?.user?.permission || session.user.permission < 3) {
    return null;
  }

  return (
    <div className="companyList">
      <select
        className="selectInput"
        id="companyList"
        name="companyList"
        value={session?.user?.company || ''}
        onChange={handleCompanyChange}
        disabled={isLoading}
      >
        {companies.map((option) => (
          <option key={option.ID} value={option.ID}>
            {option.Name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanySelector;
