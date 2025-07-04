import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TestsService } from '@admin-dashboard/services/tests.service';
import { map } from 'rxjs';
import { TestCardComponent } from "../../../test/components/test-card/test-card.component";

@Component({
  selector: 'type-test-page',
  imports: [TestCardComponent],
  templateUrl: './type-test-page.component.html',
})
export class TypeTestPageComponent {
  route = inject(ActivatedRoute);
  testService = inject(TestsService);

  type = toSignal(this.route.params.pipe(map(({ type }) => type)));

  testsResource= rxResource({
    request:()=>({type:this.type()}),
    loader:({request})=>{
      return this.testService.getTestByType(
        request.type,
      )
    }
  })

}
