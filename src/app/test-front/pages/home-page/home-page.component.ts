import { Component, inject } from '@angular/core';
import { TestCardComponent } from '@test/components/test-card/test-card.component';
import { TestsService } from '@test/services/tests.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [TestCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

   testsService=inject(TestsService);
   testsResource=rxResource({
    request:()=>({}),
    loader:({request})=>{
      return this.testsService.getAll();
    }
   })

 }
