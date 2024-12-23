import React from 'react'
import { LoginForm } from "@/components/login-form"
import styled from 'styled-components'
const Heading = styled.h1`
  font-family: "Mea Culpa", serif;
  font-weight: 500;
  font-style: normal;
  font-size: 80px;
  color:sky-blue;
`;
function Login() {
  return (
    <div
          className="flex min-h-svh flex-col items-center justify-center pl-6 pr-6">
          <div className="w-full max-w-sm md:max-w-3xl">
          <Heading className='text-center'>Frixle</Heading>
            <LoginForm />
          </div>
        </div>
  )
}

export default Login
