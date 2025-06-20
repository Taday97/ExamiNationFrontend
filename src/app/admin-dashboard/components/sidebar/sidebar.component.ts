import { Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  sidebarOpen = input.required<boolean>();

  authService = inject(AuthService);
  sanitizer = inject(DomSanitizer);


  menuItems = [
    {
      route: '/admin/dashboard',
      label: 'Dashboard',
      iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M19 5v2h-4V5zM9 5v6H5V5zm10 8v6h-4v-6zM9 17v2H5v-2zM21 3h-8v6h8zM11 3H3v10h8zm10 8h-8v10h8zm-10 4H3v6h8z" />
          </svg>
      `),
    },
    {
      route: '/admin/tests',
      label: 'Tests',
      iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16">
          <path fill="currentColor" fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147l1.146-1.147a.5.5 0 0 1 .708 0"/>
        </svg>
      `),
    },
    {
      route: '/admin/questions',
      label: 'Questions',
      iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <g fill="none">
              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
              <path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 12a1 1 0 1 1 0 2a1 1 0 0 1 0-2m0-9.5a3.625 3.625 0 0 1 1.348 6.99a.8.8 0 0 0-.305.201c-.044.05-.051.114-.05.18L13 14a1 1 0 0 1-1.993.117L11 14v-.25c0-1.153.93-1.845 1.604-2.116a1.626 1.626 0 1 0-2.229-1.509a1 1 0 1 1-2 0A3.625 3.625 0 0 1 12 6.5"/>
            </g>
          </svg>
        `),
    },
    {
      route: '/admin/options',
      label: 'Options',
      iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M7 7V3a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4v3.992C17 21.55 16.551 22 15.992 22H3.008A1.006 1.006 0 0 1 2 20.992l.003-12.985C2.003 7.451 2.452 7 3.01 7zm2 0h6.993C16.549 7 17 7.449 17 8.007V15h3V4H9zm6 2H4.003L4 20h11zm-6.498 9l-3.535-3.536L6.38 13.05l2.121 2.122l4.243-4.243l1.414 1.414z" />
          </svg>
        `),
    },
    {
      route: '/admin/cognitiveCategories',
      label: 'Cognitive Categories',
      iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path
                d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
              <path fill="currentColor"
                d="M9 3a4 4 0 0 0-4 4v1.126a4.002 4.002 0 0 0 0 7.748V17a4 4 0 0 0 7 2.646A4 4 0 0 0 19 17v-1.126a4.002 4.002 0 0 0 0-7.748V7a4 4 0 0 0-7-2.646A4 4 0 0 0 9 3m8 6V7a2 2 0 1 0-4 0v4.535A4 4 0 0 1 15 11a1 1 0 1 1 0 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0v-1.126a4 4 0 0 1-.333-.102a1 1 0 1 1 .666-1.886A2 2 0 1 0 18 10a1 1 0 0 1-1-1m-8 4a2 2 0 0 1 2 2v2a2 2 0 1 1-4 0v-1.126q.17-.044.333-.102a1 1 0 1 0-.666-1.886A2 2 0 1 1 6 10a1 1 0 0 0 1-1V7a2 2 0 1 1 4 0v4.535A4 4 0 0 0 9 11a1 1 0 1 0 0 2" />
            </g>
          </svg>
      `),
    },
    {
      route: '/admin/scoringRanges',
      label: 'Scoring ranges',
      iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16">
            <path fill="currentColor"
              d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1zm1 12h2V2h-2zm-3 0V7H7v7zm-5 0v-3H2v3z" />
          </svg>
        `),
    },
    {
      route: '/admin/answers',
      label: 'Answers',
      iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M21 8v12.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995zm-2 1h-5V4H5v16h14zM8 7h3v2H8zm0 4h8v2H8zm0 4h8v2H8z" />
          </svg>
         `),
    },
    {
      route: '/admin/userManagment',
      label: 'User Management',
      iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 32">
            <path fill="currentColor"
              d="M8 5c-3.3 0-6 2.7-6 6c0 2 1 3.8 2.5 4.8C1.8 17.2 0 19.9 0 23h2c0-3.3 2.7-6 6-6s6 2.7 6 6h2c0-3.2 2.6-5.9 5.8-6h.2c2.5 0 4.6-1.5 5.5-3.6c0 0 0-.1.1-.1c.1-.1.1-.3.1-.4s0-.1.1-.2c0-.1.1-.3.1-.4s0-.2.1-.3c0-.1 0-.2.1-.3v-.6c0-3.3-2.7-6-6-6s-6 2.7-6 6c0 2 1 3.8 2.5 4.8c-1.5.7-2.7 1.9-3.5 3.3c-.8-1.4-2-2.6-3.5-3.3C13 14.8 14 13 14 11c0-3.3-2.7-6-6-6m0 2c2.2 0 4 1.8 4 4s-1.8 4-4 4s-4-1.8-4-4s1.8-4 4-4m14 0c2.2 0 4 1.8 4 4s-1.8 4-4 4s-4-1.8-4-4s1.8-4 4-4m2.1 11v2.1c-.6.1-1.2.4-1.7.7l-1.5-1.5l-1.4 1.4l1.5 1.5c-.4.5-.6 1.1-.7 1.8H18v2h2.1c.1.6.4 1.2.7 1.8l-1.5 1.5l1.4 1.4l1.5-1.5c.5.3 1.1.6 1.7.7V32h2v-2.1c.6-.1 1.2-.4 1.7-.7l1.5 1.5l1.4-1.4l-1.5-1.5c.4-.5.6-1.1.7-1.8H32v-2h-2.1c-.1-.6-.4-1.2-.7-1.8l1.5-1.5l-1.4-1.4l-1.5 1.5c-.5-.3-1.1-.6-1.7-.7V18zm.9 4c1.7 0 3 1.3 3 3s-1.3 3-3 3s-3-1.3-3-3s1.3-3 3-3m0 2a.9.9 0 0 0-.367.086a1.1 1.1 0 0 0-.32.227a1.1 1.1 0 0 0-.227.32A.9.9 0 0 0 24 25q.002.19.086.367c.055.117.133.227.227.32c.093.094.203.172.32.227A.9.9 0 0 0 25 26c.5 0 1-.5 1-1s-.5-1-1-1"
              stroke-width="0.2" stroke="currentColor" />
          </svg>
        `),
      expanded: false,
      children: [
        {
          route: '/admin/users',
          label: 'Users',
          iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M6.578 15.482c-1.415.842-5.125 2.562-2.865 4.715C4.816 21.248 6.045 22 7.59 22h8.818c1.546 0 2.775-.752 3.878-1.803c2.26-2.153-1.45-3.873-2.865-4.715a10.66 10.66 0 0 0-10.844 0M16.5 6.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0"
              color="currentColor" />
          </svg>
         `),
        },
        {
          route: '/admin/roles',
          label: 'Roles',
          iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="1.8">
              <path
                d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991z" />
              <circle cx="12" cy="9" r="2" />
              <path d="M16 15c0 1.105 0 2-4 2s-4-.895-4-2s1.79-2 4-2s4 .895 4 2Z" />
            </g>
          </svg>
         `),
        },
        {
          route: '/admin/permissions',
          label: 'Permissions',
          iconSvg: this.sanitizer.bypassSecurityTrustHtml(`
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
            <g fill="none">
              <path
                d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path fill="currentColor"
                d="M12 2a6 6 0 0 1 5.996 5.775L18 8h1a2 2 0 0 1 1.995 1.85L21 10v10a2 2 0 0 1-1.85 1.995L19 22H5a2 2 0 0 1-1.995-1.85L3 20V10a2 2 0 0 1 1.85-1.995L5 8h1a6 6 0 0 1 6-6m7 8H5v10h14zm-7 2a2 2 0 0 1 1.134 3.647l-.134.085V17a1 1 0 0 1-1.993.117L11 17v-1.268A2 2 0 0 1 12 12m0-8a4 4 0 0 0-4 4h8a4 4 0 0 0-4-4" />
            </g>
          </svg>
            `),
        },
      ],
    },
  ];
}
