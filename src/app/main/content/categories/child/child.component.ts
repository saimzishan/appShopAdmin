import { Category } from "./../../models/category.model";
import {
  Component,
  Input,
  OnInit,
  ViewChildren,
  Directive
} from "@angular/core";
import { SpinnerService } from "../../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { CategoriesService } from "../categories.service";
import { Router } from "@angular/router";

// @Directive({
//     selector:'[my-custom-directive]',
//     exportAs:'customdirective'   //the name of the variable to access the directive
//   })

@Component({
  selector: "category-child",
  template: `
    <mat-accordion>
        <mat-expansion-panel (opened)="show(category.id)">
            <mat-expansion-panel-header>
                <mat-panel-title class="w-40-p"> {{category.name}}</mat-panel-title>
                <mat-panel-title class="w-45-p"> {{getSpecificNotes(category.notes)}}</mat-panel-title>
                <mat-panel-title class="w-35-p"> {{category.children.length}}</mat-panel-title>
                <mat-panel-title class="w-20-p"> 
                  <mat-icon class="active-icon mat-green-600-bg s-26" (click)="editCategory(category.id)" style="margin-right: 10%;cursor:pointer">edit</mat-icon>
                </mat-panel-title>
            </mat-expansion-panel-header>
            <ng-container *ngIf="hasChild(category)">
                <ng-container *ngFor="let cate of categoryChildren">
                    <category-child [category]='cate'  > </category-child>
                </ng-container>
            </ng-container>    
        </mat-expansion-panel>
    </mat-accordion>
   
    `,
  styleUrls: ["./child.component.scss"]
})
export class CategoryChildComponent implements OnInit {
  @Input()
  category: Category;
  categoryChildren: any;

  constructor(
    private categoriesService: CategoriesService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService,
    private router: Router
  ) {
    this.categoryChildren = [];
  }
  ngOnInit() {}
  hasChild(category: Category): boolean {
    if (category && category.children) {
      return Boolean(category.children.length > 0);
    }
    return false;
  }
  getSpecificNotes(notes: string): string {
    let res = "";
    if (!notes) {
      res = " ";
    } else if (notes.length < 20) {
      res = notes;
    } else {
      res = notes.substring(0, 20) + " ...";
    }
    return res;
  }
  show(id) {
    if (!id) {
      return;
    }
    this.spinnerService.requestInProcess(true);
    this.categoriesService.edit(id).subscribe(
      (res: any) => {
        this.spinnerService.requestInProcess(false);
        if (!res.status) {
          this.categoryChildren = res.res.data;
        }
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error;
        e = JSON.stringify(e.error);
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  editCategory(id) {
    // console.log(id);
    this.router.navigate(["/categories/" + id]);
  }
}
