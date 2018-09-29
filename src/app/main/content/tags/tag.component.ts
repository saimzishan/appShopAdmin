import { Component, OnDestroy, OnInit } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { Tag } from '../models/tag.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SnotifyService } from 'ng-snotify';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { SpinnerService } from '../../../spinner/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TagsService } from './tags.service';
import { NgForm, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  animations: fuseAnimations
})
export class TagComponent implements OnInit, OnDestroy {

  tag: Tag;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  pageType: string;
  sub: any;
  tagID: any;

  constructor(private tagService: TagsService, private spinnerService: SpinnerService,
    private snotifyService: SnotifyService, private route: ActivatedRoute, public router: Router,
    private dialog: MatDialog) {
    this.tag = new Tag();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.tagID = params['id'] || '';
      if (Boolean(this.tagID) && parseInt(this.tagID, 10) > 0) {
        this.getTagById(this.tagID);
        this.pageType = 'edit';
      } else {
        this.pageType = 'new';
      }
    });
  }

  ngOnDestroy(): void {
    return this.sub && this.sub.unsubscribe();
  }

  getTagById(id: number) {
    this.spinnerService.requestInProcess(true);
    this.sub = this.tagService.getTagById(id).subscribe((res: any) => {
      this.tag = new Tag(res.res.data);
      this.spinnerService.requestInProcess(false);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  addTag(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    } else {
      this.createTag();
    }
  }

  createTag() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.tagService.addTag(this.tag).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/tag-management/tags']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  updateTag(form: NgForm) {
    if (form.invalid) {
      this.validateForm(form);
      return;
    } else {
      this.editTag();
    }
  }

  editTag() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.tagService.updateTag(this.tag).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/tag-management/tags']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  delTag() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTag();
      }
      this.confirmDialogRef = null;
    });
  }

  deleteTag() {
    this.spinnerService.requestInProcess(true);
    this.sub = this.tagService.deleteTag(this.tag.id).subscribe((res: any) => {
      let e = res.res.message;
      this.snotifyService.success(e, 'Success !');
      this.spinnerService.requestInProcess(false);
      this.router.navigate(['/tag-management/tags']);
    }, errors => {
      this.spinnerService.requestInProcess(false);
      let e = errors.message;
      this.snotifyService.error(e, 'Error !');
    });
  }

  validateForm(form) {
    this.validateAllFormFields(form.control);
    this.snotifyService.error("Please Fill All Required Fields");
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
