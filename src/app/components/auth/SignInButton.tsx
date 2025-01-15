'use client'
import { githubSignIn } from '@/app/actions/github-signin';
import { googleSignIn } from '@/app/actions/google-signin';
import React, { useActionState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { GrGithub } from "react-icons/gr";



interface SignInButtonProps {
  provider: "google" | "github"
}

const SignInButton:React.FC<SignInButtonProps> = ({provider}:SignInButtonProps) => {
  const logAction = (provider === 'google') ? googleSignIn : githubSignIn
  const [message, formAction, isPending] = useActionState(logAction, undefined)
    return (
    <form
      className='w-full'
      action={formAction}
      >
      <button className='flex w-full justify-center border rounded-lg p-2 space-x-2 items-center'>
          <p>
            {`LogIn With ${(provider === 'google') ? 'Google' : 'Github'}`}
            </p> 
            {(provider === 'google') 
            ? <FcGoogle className='h-5 w-5' />
            : <GrGithub className='h-5 w-5' />
            }
      </button>
      <p>{isPending ? "Loading..." : message}</p>
    </form>
    )

}

export default SignInButton