import React from 'react'
import { auth } from '../../../auth';
import { LogoutButton } from '../components/auth/LogoutButton';
import { redirect } from 'next/navigation';

const DashboardPage = async() => {
    const session = await auth();
    console.log(session);
    if (!session) {
      redirect('/login'); 
    }
  return (
    <div>DashboardPage

      <LogoutButton/>
    </div>
  )
}

export default DashboardPage