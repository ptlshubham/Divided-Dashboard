import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Product } from 'app/Admin/category/product.model';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { ClothSize } from '../category/clothsize.model';
import { InventoryService } from './inventory.service';
declare var require: any
declare var $: any;
declare interface DataTable {
  headerRow: string[];
  footerRow: string[];
  dataRows: any[];
}
@Component({
  moduleId: module.id,
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  public ProductModel: Product = new Product;
  public product: Product[] = [];
  public Chagesproduct: Product[] = [];
  public dataTable: DataTable;
  public ClothSizeModel: ClothSize = new ClothSize;
  public clothsize: ClothSize[] = [];
  
  selectClothSize: any;
  model: Date;
  restock: any = {};
  index:any;
  selectedCheck:boolean=false;
  popularProduct: boolean = true;
  addSelectFields: any = [];
  value = 0;
  selectedCat: any;
  selectedSubCat: any;
  selectedSubProCat: any;
  maincatid:any;
  subcatid:any;
  subtosubid:any;
  isdef:boolean=true;
  isntdef:boolean=false;
  
  public category: Category[] = [];
  public subcategory: Category[] = [];
  public subprodcat: Category[] = [];
  subToSubCat: any;
  constructor(
    private categoryService: CategoryService,
    private inventoryService: InventoryService,
  ) {
    this.getProductList();
    this.getMainCategory(0);
  }

  ngOnInit(): void {
    this.addSelectFields = [{ name: this.value }];
    this.value++;
    this.model = new Date();
    if ($(".selectpicker").length != 0) {
      $(".selectpicker").selectpicker({
        iconBase: "nc-icon",
        tickIcon: "nc-check-2"
      });
    }
  }
  ngAfterViewInit(){
    
    $('#datatable').DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search records",
      }
    });
    var table = $('#datatable').DataTable();
  }
  getMainCategory(id) {
    this.categoryService.getMainCat(id).subscribe(data => {
      this.category = data;
    });
  }
  cateMain(id) {
    this.maincatid = id;
    this.category.forEach(element => {
      if (element.id == id) {
        this.selectedCat = element.name;
      }
    })
    this.getSubCategory(id);

  }
  getSubCategory(id) {
    this.subToSubCat = id;
    this.categoryService.getMainCat(id).subscribe(data => {
      this.subcategory = data;
    });
  }
  cateCategory(id) {
    this.subcatid = id;
    this.subcategory.forEach(element => {
      if (element.id == id) {
        this.selectedSubCat = element.name;
      }
    })
    this.getProductSubCategory(id);
  }
  getProductSubCategory(id) {
    
    this.categoryService.getMainCat(id).subscribe(data => {
      this.subprodcat = data;
    });
  }
  subProCategory(id) {
    this.subToSubCat = id;
    this.ProductModel.subCategory = id;
    this.subprodcat.forEach(element => {
      if (element.id == id) {
        this.selectedSubProCat = element.name;
      }
    })
  }
  addSelectSize(i) {
    debugger
    let data={
      productid:this.restock.id,
      size:'',
      quantity:'0',
      soldquantity:0
    }
    this.addSelectFields=[];
    if(this.isntdef == false){
      this.isntdef = true;
      this.isdef = false;
      // this.restock.sizeList=data;
      this.addSelectFields = this.restock.sizeList;
      this.addSelectFields.push(data);
    }
    else{
      this.isntdef = false;
      this.isdef = true;
      this.addSelectFields = this.restock.sizeList;
      this.addSelectFields.push(data);
    }
   
  }
  removeSelectSize(value) {
    this.addSelectFields.splice(value, 1);
  }
  getProductList() {
    debugger
    this.inventoryService.getProduct().subscribe((data: any) => {
      this.product = data;
      this.product.forEach(element => {
        this.inventoryService.getSize(element.id).subscribe((data:any)=>{
          element.sizeList = data;
        })
      })

     
     
      this.product.forEach(element => {
        element.selectedCheck = false;
      })
    });
  }
  removeProduct() {
    this.product.forEach(element => {
      if (element.selectedCheck == true) {
        this.inventoryService.removeProduct(element.id).subscribe((req) => {
          this.getProductList();
        })
      }
    })

  }
  selectAll(event) {
    debugger
    if(event==true){
      this.selectedCheck=false;
      this.inventoryService.getProduct().subscribe((data: any) => {
        this.product = data;
        this.product.forEach(element => {
          element.selectedCheck = false;
        })
        this.Chagesproduct=[];
      });
    }
    else{
      this.selectedCheck=true;
      this.inventoryService.getProduct().subscribe((data: any) => {
        this.product = data;
        this.product.forEach(element => {
          element.selectedCheck = true;
        })
        this.Chagesproduct=this.product;
      });
    }
   
  }
  onChanges(sel,data,idx){
    debugger
    if(sel == false){
      this.product[idx].selectedCheck = true;
      this.Chagesproduct.push(data);
    }
    else{
      this.product[idx].selectedCheck = false;
      for(let i=0;i<this.Chagesproduct.length;i++){
        if(this.Chagesproduct[i].id == data.id){
          this.Chagesproduct.splice(i,1);
        }
      }
    }
    

  }
  restokProduct(data,ind) {
    debugger
    this.restock = data;
    this.restock.index = ind+1;  
    this.getClothSize();
    this.addSelectFields =this.restock.sizeList;

  }
  submitClothSize(id, index) {
    if (index != undefined) {

      this.clothsize.forEach(element => {
        if (element.id == id) {
          this.addSelectFields[index].size = element.size;
          // this.addSelectFields[index].soldquantity =0;
        }
      })
    }
    else {
      this.clothsize.forEach(element => {
        if (element.id == id) {
          this.selectClothSize = element.size;
        }
      })
    }
  }
  getClothSize() {
    this.categoryService.getCloth().subscribe((data: any) => {
      this.clothsize = data;

    });
  }

  //filter code from here
  AddToNewArrival(){
      this.inventoryService.addToNewArrivals(this.Chagesproduct).subscribe(data=>{
        alert("added");
      })
  }
  AddToBestProduct(){
    this.inventoryService.addToBestProduct(this.Chagesproduct).subscribe(data=>{
      alert("added");
    })
  }
  AddToHotProduct(){
    this.inventoryService.addTohotProduct(this.Chagesproduct).subscribe(data=>{
      alert("added");
    })
  }
  AddToSale(){
    this.inventoryService.addToSale(this.Chagesproduct).subscribe(data=>{
      alert("added");
    })
  }
  // getMainCategory() {
  //   this.categoryService.getMainCat().subscribe(data => {
  //     this.category = data;
  //   });
  // }

}
