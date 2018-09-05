import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { CalendarEvent } from "angular-calendar";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Option } from "../../models/product.model";

@Component({
  selector: "fuse-contacts-contact-form-dialog",
  templateUrl: "./option-form.component.html",
  styleUrls: ["./option-form.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FuseOptionFormDialogComponent implements OnInit {
  // event: CalendarEvent;
  dialogTitle: string;
  optionForm: FormGroup;
  action: string;
  option: Option;
  opion_name = [];
  opionNames = [];
  constructor(
    public dialogRef: MatDialogRef<FuseOptionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === "edit") {
      this.dialogTitle = "Edit Contact";
      // this.contact = data.contact;
    } else {
      this.dialogTitle = "New Option set";
      this.option = new Option();
    }

    this.optionForm = this.createContactForm();
  }

  ngOnInit() {}

  createContactForm() {
    return this.formBuilder.group({
      // id      : [this.option.id],
      name: [this.option.option_name]
    });
  }
  addOptionSetName(val) {
    this.opion_name.push(val);
  }
  removeOptionName(val: string) {
    const res = this.opion_name.indexOf(val) > -1;
    if (res) {
      this.opion_name.splice(this.opion_name.indexOf(val), 1);
    }
  }

  addOptionName(val) {
    this.opionNames.push(val);
  }
}
