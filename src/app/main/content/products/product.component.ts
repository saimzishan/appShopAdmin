import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductService} from './product.service';
import {fuseAnimations} from '../../../core/animations';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {Subscription} from 'rxjs/Subscription';
import {Product} from '../models/product.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FuseUtils} from '../../../core/fuseUtils';
import {MatSnackBar} from '@angular/material';
import {Location} from '@angular/common';
import {FileSystemDirectoryEntry, FileSystemFileEntry, UploadEvent, UploadFile} from 'ngx-file-drop';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProductComponent implements OnInit, OnDestroy {
  product = new Product();
  onProductChanged: Subscription;
  pageType: string;
  productForm: FormGroup;
  files: UploadFile[] = [];
  nodes = [
    {
      id: 1,
      name: 'cat 1',
      children: [
        { id: 2, name: 'cat 1-1' },
        { id: 3, name: 'cat 1-2' }
      ]
    },
    {
      id: 4,
      name: 'cat 2',
      children: [
        { id: 5, name: 'cat 2-1' },
        {
          id: 6,
          name: 'cat 2-2',
          children: [
            { id: 7, name: 'cat 2-2-1' }
          ]
        }
      ]
    }
  ];
  options = {};

  constructor(private productService: ProductService,
              private formBuilder: FormBuilder,
              public snackBar: MatSnackBar,
              private location: Location) {

  }

  ngOnInit() {
    // Subscribe to update product on changes
    this.onProductChanged =
      this.productService.onProductChanged
        .subscribe(product => {

          if (product) {
            this.product = new Product(product);
            this.pageType = 'edit';
          }
          else {
            this.pageType = 'new';
            this.product = new Product();
          }

          this.productForm = this.createProductForm();
        });

  }

  createProductForm() {
    return this.formBuilder.group({
      id: [this.product.id],
      name: [this.product.name],
      handle: [this.product.handle],
      description: [this.product.description],
      categories: [this.product.categories],
      tags: [this.product.tags],
      images: [this.product.images],
      priceTaxExcl: [this.product.priceTaxExcl],
      priceTaxIncl: [this.product.priceTaxIncl],
      price: [this.product.price],
      taxRate: [this.product.taxRate],
      comparedPrice: [this.product.comparedPrice],
      quantity: [this.product.quantity],
      sku: [this.product.sku],
      width: [this.product.width],
      height: [this.product.height],
      depth: [this.product.depth],
      weight: [this.product.weight],
      extraShippingFee: [this.product.extraShippingFee],
      active: [this.product.active]
    });
  }

  saveProduct() {
    const data = this.productForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.productService.saveProduct(data)
      .then(() => {

        // Trigger the subscription with new data
        this.productService.onProductChanged.next(data);

        // Show the success message
        this.snackBar.open('Product saved', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  addProduct() {
    const data = this.productForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
    this.productService.addProduct(data)
      .then(() => {

        // Trigger the subscription with new data
        this.productService.onProductChanged.next(data);

        // Show the success message
        this.snackBar.open('Product added', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });

        // Change the location with new one
        this.location.go('apps/e-commerce/products/' + this.product.id + '/' + this.product.handle);
      });
  }

  dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          /**
           // You could upload it like this:
           const formData = new FormData()
           formData.append('logo', file, relativePath)

           // Headers
           const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

           this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
           .subscribe(data => {
            // Sanitized logo returned from backend
          })
           **/

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  fileOver(event) {
    console.log(event);
  }

  fileLeave(event) {
    console.log(event);
  }


  ngOnDestroy() {
    this.onProductChanged.unsubscribe();
  }
}
