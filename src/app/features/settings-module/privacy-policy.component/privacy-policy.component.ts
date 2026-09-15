import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SettingsService } from '../../../core/services/settings.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-privacy-policy.component',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent implements OnInit {

  @ViewChild('editor')
  editor!: ElementRef<HTMLDivElement>;

  isLoading = false;
  isSaving = false;

  private savedContent = '';

  constructor(
    private readonly settingsService: SettingsService,
    private readonly alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadPrivacyPolicy();
  }

  loadPrivacyPolicy(): void {

    this.isLoading = true;

    this.settingsService.getPrivacyPolicy().subscribe({

      next: (response) => {
        const dataObj = response?.data ?? response?.Data ?? response;
        this.savedContent = dataObj?.content ?? dataObj?.Content ?? (typeof dataObj === 'string' ? dataObj : '');
        this.isLoading = false;
        this.setEditorContent(this.savedContent);
      },

      error: (error) => {
        console.error('Failed to load Privacy Policy', error);
        this.savedContent = '';
        this.isLoading = false;
        this.setEditorContent('');
      }

    });
  }

  private setEditorContent(content: string): void {

    setTimeout(() => {
      if (this.editor) {
        this.editor.nativeElement.innerHTML = content;
      }
    }, 0);

  }

  private getEditorContent(): string {
    if (!this.editor) {
      return '';
    }
    return this.editor.nativeElement.innerHTML.trim();
  }

  format(command: string): void {
    document.execCommand(command, false);
    this.editor.nativeElement.focus();
  }

  formatBlock(tag: string): void {
    document.execCommand('formatBlock', false, tag);
    this.editor.nativeElement.focus();
  }

  createLink(): void {
    const url = window.prompt('Enter URL');
    if (!url) {
      return;
    }
    document.execCommand('createLink', false, url);
    this.editor.nativeElement.focus();
  }

  insertUnorderedList(): void {
    document.execCommand('insertUnorderedList', false);
    this.editor.nativeElement.focus();
  }

  insertOrderedList(): void {
    document.execCommand('insertOrderedList', false);
    this.editor.nativeElement.focus();
  }

  insertTable(): void {

    const tableHtml = `
      <table border="1"
             cellpadding="6"
             cellspacing="0"
             style="border-collapse: collapse; width: 100%;">
        <tbody>
          <tr>
            <td>Column 1</td>
            <td>Column 2</td>
          </tr>
          <tr>
            <td>Data</td>
            <td>Data</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, tableHtml);
    this.editor.nativeElement.focus();
  }

  insertImage(): void {
    const imageUrl = window.prompt('Enter image URL');
    if (!imageUrl) {
      return;
    }
    document.execCommand('insertImage', false, imageUrl);
    this.editor.nativeElement.focus();
  }

  update(): void {
    const content = this.getEditorContent();
    if (!content || content === '<br>') {
      return;
    }
    this.isSaving = true;

    this.settingsService.updatePrivacyPolicy({ content }).subscribe({

      next: (response) => {
        this.savedContent = content;
        this.isSaving = false;
        this.alertService.toastSuccess(response?.message ?? 'Privacy Policy updated successfully.');
      },

      error: (error) => {
        console.error('Failed to update Privacy Policy', error);
        this.isSaving = false;
        this.alertService.toastError(error?.error?.message ?? 'Failed to update Privacy Policy.');
      }

    });
  }

  cancel(): void {
    this.setEditorContent(this.savedContent);
  }
}
