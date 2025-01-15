import SignInButton from '@/app/components/SignInButton'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='flex flex-col gap-5 items-center justify-center   p-6'  >
    <div className='flex flex-col gap-5 w-[400px]'>
      <SignInButton provider='google' />
      <SignInButton provider='github' />
    </div>

  </div>
  )
}

export default LoginPage