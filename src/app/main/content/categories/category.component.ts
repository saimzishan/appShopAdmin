import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CategoryService} from './category.service';
import {fuseAnimations} from '../../../core/animations';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {Subscription} from 'rxjs/Subscription';
import {Supplier} from '../models/supplier.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FuseUtils} from '../../../core/fuseUtils';
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {ITreeOptions, TreeNode, TreeModel} from 'angular-tree-component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CategoryComponent implements OnInit, OnDestroy {
  supplier = new Supplier();
  onSupplierChanged: Subscription;
  pageType: string;
  supplierForm: FormGroup;

  parentCat;

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this)
  };

  nodes: any[] = [];

  asyncChildren = [
    {
      name: 'child1',
      hasChildren: true
    }, {
      name: 'child2'
    }
  ];

  constructor(private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private location: Location) {

    this.nodes = [
      {
        id: 1,
        name: 'root1',
        children: [
          {name: 'child1'}
        ]
      },
      {
        id: 2,
        name: 'root2',
        hasChildren: true
      },
      {
        id: 3,
        name: 'root3'
      }
    ];

  }

  ngOnInit() {
    // Subscribe to update product on changes
    /*this.onSupplierChanged =
      this.categoryService.onSupplierChanged
        .subscribe(supplier => {

          if ( supplier )
          {
            this.supplier = new Supplier(supplier);
            this.pageType = 'edit';
          }
          else
          {
            this.pageType = 'new';
            this.supplier = new Supplier();
          }

          this.supplierForm = this.createSupplierForm();
        });*/
    this.supplierForm = this.createSupplierForm();
  }

  addNode(tree: any) {
    this.nodes[0].children.push({
      name: 'a new child'
    });
    tree.treeModel.update();
  }

  activeNodes(treeModel: any) {
    this.parentCat = treeModel.activeNodes.data.name;
    console.log(treeModel.activeNodes);
  }

  onEvent(data) {
    console.log(data.node);
    this.parentCat = data.node;
  }

  getChildren(node: any) {
    const newNodes = this.asyncChildren.map((c) => Object.assign({}, c));
    console.log(newNodes);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(newNodes), 1000);
    });
  }

  createSupplierForm() {
    return this.formBuilder.group({
      // id              : [this.supplier.id],
      name: [''],
      /*email           : [this.supplier.contact.email],
      no              : [this.supplier.contact.no],
      street          : [this.supplier.contact.street],
      postal_code     : [this.supplier.contact.postal_code],
      city            : [this.supplier.contact.city],
      country         : [{value: 'Germany', disabled: true}],
      po_box          : [this.supplier.contact.po_box],
      ph_landline1    : [this.supplier.contact.ph_landline1],
      ph_landline2    : [this.supplier.contact.ph_landline2],
      ph_landline3    : [this.supplier.contact.ph_landline3],
      ph_mobile1      : [this.supplier.contact.ph_mobile1],
      ph_mobile2      : [this.supplier.contact.ph_mobile2],
      ph_mobile3      : [this.supplier.contact.ph_mobile3],
      handle          : [this.supplier.handle],*/
      /*description     : [this.supplier.description],
      categories      : [this.supplier.categories],
      tags            : [this.supplier.tags],
      images          : [this.supplier.images],
      priceTaxExcl    : [this.supplier.priceTaxExcl],
      priceTaxIncl    : [this.supplier.priceTaxIncl],
      taxRate         : [this.supplier.taxRate],
      comparedPrice   : [this.supplier.comparedPrice],
      quantity        : [this.supplier.quantity],
      sku             : [this.supplier.sku],
      width           : [this.supplier.width],
      height          : [this.supplier.height],
      depth           : [this.supplier.depth],
      weight          : [this.supplier.weight],
      extraShippingFee: [this.supplier.extraShippingFee],
      active          : [this.supplier.active]*/
    });
  }



  saveSupplier() {
    const data = this.supplierForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.categoryService.saveSupplier(data)
      .then(() => {

        // Trigger the subscription with new data
        this.categoryService.onSupplierChanged.next(data);

        // Show the success message
        this.snackBar.open('Supplier saved', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  addSupplier() {
    const data = this.supplierForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.categoryService.addSupplier(data)
      .then(() => {

        // Trigger the subscription with new data
        this.categoryService.onSupplierChanged.next(data);

        // Show the success message
        this.snackBar.open('Supplier added', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });

        // Change the location with new one
        this.location.go('suppliers/' + this.supplier.id);
      });
  }

  ngOnDestroy() {
    this.onSupplierChanged.unsubscribe();
  }
}
