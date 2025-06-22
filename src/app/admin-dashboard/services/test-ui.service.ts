import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TestType } from '@shared/interfaces/test.interface';

@Injectable({
  providedIn: 'root',
})
export class TestUiService {

  sanitizer = inject(DomSanitizer);
  baseColors = [
    { color: 'green' },
    { color: 'yellow' },
    { color: 'red' },
    { color: 'orange' },
    { color: 'blue' },
    { color: 'purple' },
  ];

  typeTestData = [
    {
      type: TestType.IQ,
      color: 'indigo',
      svg: this.sanitizer
        .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4">
        <path d="M12 5a3 3 0 1 0-5.997.125a4 4 0 0 0-2.526 5.77a4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.997.125a4 4 0 0 1 2.526 5.77a4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4a4.5 4.5 0 0 1-3 4m8.599-6.5a3 3 0 0 0 .399-1.375m-11.995 0A3 3 0 0 0 6.401 6.5m-2.924 4.396a4 4 0 0 1 .585-.396m15.876 0a4 4 0 0 1 .585.396M6 18a4 4 0 0 1-1.967-.516m15.934 0A4 4 0 0 1 18 18" />
      </g>
    </svg>`),
    },
    {
      type: TestType.Personality,
      color: 'purple',
      svg: this.sanitizer
        .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" stroke-width="2">
      <path fill="currentColor"
        d="M6 22v-4.3q-1.425-1.3-2.212-3.037T3 11q0-3.75 2.625-6.375T12 2q3.125 0 5.538 1.838t3.137 4.787l1.3 5.125q.125.475-.175.863T21 15h-2v3q0 .825-.587 1.413T17 20h-2v2h-2v-4h4v-5h2.7l-.95-3.875q-.575-2.275-2.45-3.7T12 4Q9.1 4 7.05 6.025T5 10.95q0 1.5.613 2.85t1.737 2.4l.65.6V22zm6-6q.425 0 .713-.288T13 15t-.288-.712T12 14t-.712.288T11 15t.288.713T12 16m-.75-3.2h1.525q0-.625.163-1.012t.662-.938q.45-.5.875-1.012T14.9 8.5q0-1.05-.812-1.775T12.075 6q-1 0-1.812.575t-1.138 1.5l1.375.575q.175-.55.613-.888t.962-.337q.55 0 .913.3t.362.775q0 .525-.312.938t-.738.837q-.5.525-.775 1.05T11.25 12.8" />
    </svg>`),
    },
    {
      type: TestType.Skills,
      color: 'red',
      svg: this.sanitizer
        .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" stroke-width="2">
      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
        d="M12 9.8V20m0-10.2c0-1.704.107-3.584-1.638-4.473C9.72 5 8.88 5 7.2 5H4.6C3.364 5 3 5.437 3 6.6v8.8c0 .568-.036 1.195.546 1.491c.214.109.493.109 1.052.109H7.43c2.377 0 3.26 1.036 4.569 3m0-10.2c0-1.704-.108-3.584 1.638-4.473C14.279 5 15.12 5 16.8 5h2.6c1.235 0 1.6.436 1.6 1.6v8.8c0 .567.035 1.195-.546 1.491c-.213.109-.493.109-1.052.109h-2.833c-2.377 0-3.26 1.036-4.57 3" />
    </svg>`),
    },
    {
      type: TestType.Other,
      color: 'purple',
      svg: this.sanitizer
        .bypassSecurityTrustHtml(`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="4" />
    </svg>`),
    },
  ];

  getRandomColor(index: number): string {
    console.log(index % this.baseColors.length);
    return this.baseColors[index % this.baseColors.length].color;
  }
  getTestTypeData(type: TestType) {
    return this.typeTestData.find((item) => item.type === type);
  }

}
