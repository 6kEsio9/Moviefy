'use server'
import { NextAppProvider } from '@toolpad/core/nextjs';
import { SignInPage } from '@toolpad/core/SignInPage';

const providers = [
  { id: 'google', name: 'Google' },
  { id: 'credentials', name: 'Email and Password' }
];

export default async function Auth() {
  return (
    <NextAppProvider>
      <SignInPage
        providers={providers}
        signIn={async (provider) => {
          
        }}
        slotProps={{ emailField: { autoFocus: false }, form: { noValidate: true } }}
      />
    </NextAppProvider>
  );
}