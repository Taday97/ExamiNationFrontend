import { Provider } from '@angular/core';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const socialAuthProviders: Provider[] = [
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('685435682005-6354qioaa2qtluergi1mrmndst7etrj1.apps.googleusercontent.com'),
        },
      ],
    } as SocialAuthServiceConfig,
  },
];
