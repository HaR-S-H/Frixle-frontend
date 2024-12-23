import React from 'react'
import { RegisterForm } from "@/components/register-form"
import styled from 'styled-components'
const Heading = styled.h1`
  font-family: "Mea Culpa", serif;
  font-weight: 500;
  font-style: normal;
  font-size: 80px;
  color:sky-blue;
`;
function Register() {
  return (
    <div
              className="flex min-h-svh flex-col items-center justify-center pb-3 pl-6 pr-6">
          <div className="w-full max-w-sm md:max-w-3xl">
              <Heading className='text-center'>Frixle</Heading>
                <RegisterForm />
              </div>
            </div>
  )
}

export default Register
