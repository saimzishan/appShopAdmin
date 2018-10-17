import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../core/animations";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { TagsService } from "./tags.service";
import { SpinnerService } from "../../../spinner/spinner.service";
import { SnotifyService } from "ng-snotify";
import { Tag } from "../models/tag.model";

@Component({
  selector: "app-tags",
  templateUrl: "./tags.component.html",
  styleUrls: ["./tags.component.scss"],
  animations: fuseAnimations
})
export class TagsComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource: any;
  displayedColumns = ["id", "name", "notes"];
  tag: Tag;
  constructor(
    private tagsService: TagsService,
    private spinnerService: SpinnerService,
    private snotifyService: SnotifyService
  ) {
    this.tag = new Tag();
  }

  ngOnInit() {
    this.getTagList();
  }

  getTagList() {
    this.spinnerService.requestInProcess(true);
    this.tagsService.getTags().subscribe(
      (res: any) => {
        let data = res.res.data;
        this.setDataSource(data);
        this.spinnerService.requestInProcess(false);
      },
      errors => {
        this.spinnerService.requestInProcess(false);
        let e = errors.error.message;
        this.snotifyService.error(e, "Error !");
      }
    );
  }

  setDataSource(tags) {
    this.dataSource = new MatTableDataSource<Tag>(tags);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
