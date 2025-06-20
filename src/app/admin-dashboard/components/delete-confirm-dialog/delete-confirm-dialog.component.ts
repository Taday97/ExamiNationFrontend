import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { NotificationService } from '@shared/services/notification.service';
import { IDeleteService } from '@shared/services/interfaces/delete-service.interface';
import { firstValueFrom } from 'rxjs';
import { handle } from 'src/app/utils/handle.helper';

@Component({
  selector: 'app-delete-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './delete-confirm-dialog.component.html',
})
export class DeleteConfirmDialogComponent {
  constructor(private notificationService: NotificationService) {}

  @Output() completed = new EventEmitter<void>();

  itemToDeleteId = signal<string | null>(null);
  showModal = signal(false);

  entityName = input.required<string>();
  entityId = signal<string>('');
  deleteService = input.required<IDeleteService<any>>();

  @Output() confirm = new EventEmitter<boolean>();


  openModal(id: string) {
    this.itemToDeleteId.set(id);
    this.showModal.set(true);
  }

  onCancel() {
    this.showModal.set(false);
    this.itemToDeleteId.set('');
  }

  onConfirm() {
    if (this.itemToDeleteId()) {
      this.confirmDelete(this.itemToDeleteId()!);
      this.showModal.set(false);
    }
  }
  async confirmDelete(id: string) {
    if (!id || !this.deleteService) return;

    await handle(
      () => firstValueFrom(this.deleteService().delete(id)),
      `${this.entityName()} deleted successfully`,
      this.notificationService,
      `Failed to delete ${this.entityName()}`
    );

    this.onCancel();
    this.completed.emit();
  }
}
