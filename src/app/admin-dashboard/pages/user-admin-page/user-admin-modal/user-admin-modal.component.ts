import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormErrorLabelComponent } from '@shared/components/form-error-label/form-error-label.component';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '@shared/services/notification.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { OptionData } from '@shared/interfaces/option.interface';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { User } from '@shared/interfaces/users.interface';
import { UsersService } from '@admin-dashboard/services/users.service';
import { FormErrorService } from '@shared/services/form-error.service';
import { submitForm } from 'src/app/utils/submit-form.helper';
import { RolesResponse } from '@shared/interfaces/roles.interface';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-user-admin-modal',
  imports: [
    DialogModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    FormErrorLabelComponent,
    AutoCompleteModule,
    MultiSelectModule,
  ],
  templateUrl: './user-admin-modal.component.html',
})
export class UserAdminModalComponent implements OnInit {
  // Inputs
  roles = input<RolesResponse>();

  // Signals
  dialog = signal(false);
  submitted = signal(false);
  globalError = signal('');
  User = signal<User | null>(null);

  // Servicios inyectados
  private fb = inject(FormBuilder);
  UserService = inject(UsersService);
  formErrorService = inject(FormErrorService);
  private notificationService = inject(NotificationService);

  // Eventos
  @Output() refreshTrigger = new EventEmitter<boolean>();

  // Variables de ayuda / estado
  filteredOptions: OptionData[] = [];
  previousOptions: any[] | null = null;

  get roleOptions() {
    return (
      this.roles()?.data.map((r) => ({ label: r.name, value: r.id })) || []
    );
  }

  // Computed / getters
  get currentUser() {
    return this.User();
  }
  get isNew() {
    return !this.currentUser || this.currentUser.id === 'new';
  }

  // Formulario
  userForm = this.fb.group({
    id: [''],
    userName: ['', [Validators.required, Validators.maxLength(100)]],
    password: [''],
    email: ['', [Validators.required, Validators.email]],
    roles: [<string[]>[], Validators.required],
  });


  // Lifecycle
  ngOnInit() {
    this.globalError.set('');
  }

  // Métodos principales

  resetForm() {
    this.userForm.reset({});
    this.globalError.set('');
  }

  async loadUser(id: string) {
    try {
      const User = await firstValueFrom(this.UserService.getById(id));
      this.User.set(User);

      const rolesIds = (User.roles ?? [])
        .map((roleName) => {
          const option = this.roleOptions.find((o) => o.label === roleName);
          return option ? option.value : null;
        })
        .filter((v) => v !== null);

      this.userForm.patchValue({
        id: User.id,
        userName: User.userName,
        email: User.email,
        roles: rolesIds,
      });
    } catch (error) {
      this.notificationService.error('Failed to load User data');
    }
  }

openModal(user?: User) {
  if (user) {
    // Modo editar
    this.loadUser(user.id);
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();

  } else {
    // Modo crear
    this.User.set(null);
    this.resetForm();

    // Hacer que password sea obligatorio en crear
    this.userForm.get('password')?.setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])/)
    ]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  this.dialog.set(true);
}


  closeModal() {
    this.dialog.set(false);
    this.resetForm();
  }

  async onSubmit() {
    const formValue = this.userForm.value;
    const valueLike: Partial<User> = { ...(formValue as any) };
    const current = this.User();
    const isNew = !current || current.id === 'new';

    const task = () =>
      isNew
        ? firstValueFrom(this.UserService.create(valueLike))
        : firstValueFrom(this.UserService.update(current!.id, valueLike));

    console.log('submitForm');
    const result = await submitForm(
      this.userForm,
      task,
      this.notificationService,
      'User saved successfully',
      'Failed to save User',
      this.formErrorService,
      (msg) => this.globalError.set(msg)
    );

    if (result) {
      this.closeModal();
      this.resetForm();
      this.refreshTrigger.emit(true);
    }
  }
  onRolSelected(rolId: string) {
    if (!rolId) return;
  }
}
