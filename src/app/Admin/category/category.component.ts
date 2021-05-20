import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'app/api.service';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { ClothSize } from './clothsize.model';
import { Images } from './images.model';
import { Product } from './product.model';
import { QuantityWithSize } from './quantity.model';
// ...
declare var $: any;
declare var require: any
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  mainCateRegForm: FormGroup;
  cateRegForm: FormGroup;
  subCateRegForm: FormGroup;
  productRegForm: FormGroup;
  submitted = false;
  onSubmit() { this.submitted = true; }
  startRating: boolean = false;
  avibilityStatus: boolean = false;
  emiOptiions: boolean = false;
  relatedProduct: boolean = false;
  isShow: boolean = false;
  isshowsub: boolean = false;
  isProduct: boolean = false;
  isCatData: boolean = false;
  isMainShow: boolean = false;
  isMainCatData: boolean = false;
  isSubCatData: boolean = false;
  public CategoryModel: Category = new Category;
  public ProductModel: Product = new Product;
  public ImagesModel: Images = new Images;
  public ClothSizeModel: ClothSize = new ClothSize;
  public QuantityWithSizeModel: QuantityWithSize = new QuantityWithSize;
  public quantitysize: QuantityWithSize[] = [];
  public images: Images[] = [];
  public clothsize: ClothSize[] = [];
  public product: Product[] = [];
  public category: Category[] = [];
  public subcategory: Category[] = [];
  public subprodcat: Category[] = [];
  selectedCat: any;
  selectedSubCat: any;
  selectedSubProCat: any;
  selectedSubCatid: any;
  selectClothSize: any;
  subToSubCat: any;
  editMain: any = {};
  editCat: any = {};
  addingprdtimg: any = [];
  val = 0;
  myForm: FormGroup;
  disabled: boolean = false;
  ShowFilter: boolean = false;
  limitSelection: boolean = false;
  image: any;
  multi: any = [];
  files: File[] = [];
  addSelectFields: any = [];
  value = 0;
  multiplefile: any = [];


  constructor(
    private categoryService: CategoryService,
    private fm: FormBuilder,
    private apiservice: ApiService,
    private router: Router
  ) {
    this.mainNavCategory();
    this.getMainCategory(0);
    this.ProductModel.startRating = false;
    this.ProductModel.avibilityStatus = false;
    this.ProductModel.emiOptiions = false;
    this.ProductModel.relatedProduct = false;
    this.ProductModel.discountPrice =0;

  }

  ngOnInit(): void {
    this.addSelectFields = [{ name: this.value }];
    this.value++;
    this.mainCateRegForm = this.fm.group({
      name: ['', Validators.required, Validators.name,],
    });
    this.cateRegForm = this.fm.group({
      subname: ['', Validators.required, Validators.name,],
    })
    this.subCateRegForm = this.fm.group({
      name: ['', Validators.required, Validators.name,],
    });
    this.productRegForm = this.fm.group({
      productName: ['', Validators.required, Validators.name,],
      brandName: ['', Validators.required, Validators.name,],
      manufacturerName: ['', Validators.required, Validators.name,],
      productCode: ['', Validators.required, Validators.name],
      productPrice: ['', Validators.required, Validators.name],
      productSRNumber: ['', Validators.required, Validators.name],
      discountPrice: ['', Validators.required, Validators.name],
    });
  }
  mainNavCategory() {
    this.isMainShow = true;
    this.isshowsub = false;
    this.isProduct = false;
    this.isCatData = false;
    this.isShow = false;
    this.isSubCatData = false;

  }
  mainCategory() {
    this.isShow = true;
    this.isshowsub = false;
    this.isProduct = false;
    this.isCatData = false;
    this.isMainShow = false;
    this.isMainCatData = false;
    this.isSubCatData = false;
  }
  subCategory() {
    this.isshowsub = true;
    this.isShow = false;
    this.isProduct = false;
    this.isCatData = false;
    this.isMainShow = false;
    this.isMainCatData = false;
  }
  addProduct() {
    this.isProduct = true;
    this.isShow = false;
    this.isshowsub = false;
    this.isCatData = false;
    this.isMainShow = false;
    this.isMainCatData = false;
    this.isSubCatData = false;
    this.getClothSize();

  }
  ngAfterViewInit() {
    $('[rel="tooltip"]').tooltip();
  }
  submitMainCategory() {
    this.CategoryModel.parent = 0;
    this.CategoryModel.isactive = 1;
    this.categoryService.saveMainCat(this.CategoryModel).subscribe(response => {
      this.apiservice.showNotification('top', 'right', 'Main Category added Successfully.', 'success');
      // this.router.navigate(['/', 'labourlist']);
      this.getMainCategory(0);

    })
  }
  getMainCategory(id) {
    this.categoryService.getMainCat(id).subscribe(data => {
      this.category = data;
    });
  }
  mainCatEdit(data) {
    debugger
    this.editMain = data;
  }
  updateMainCate(data) {
    debugger
    this.CategoryModel.isactive = 1;
    this.categoryService.updateMainCategory(data).subscribe((req) => {
      this.apiservice.showNotification('top', 'right', 'Updated Main Category Successfully.', 'success');
      this.getMainCategory(0);
    })
  }

  mainCatRemove(id) {

    this.categoryService.removeMainCatList(id).subscribe((req) => {
      this.apiservice.showNotification('top', 'right', 'Main Category removed Successfully.', 'success');
      this.getMainCategory(0);
      this.getProductSubCategory(this.selectedSubCatid);
      this.getSubCategory(this.subToSubCat);
    })
  }
  editCategory(Data) {
    debugger
    this.editCat = Data;
  }
  updatemaincatddl(parent,name){
    debugger
    this.editCat.parent = parent;
    this.selectedCat=name;
  }
  EditedSaveCategory(data) {
    debugger
    this.categoryService.updateMainCat(data).subscribe((req) => {
      console.log(req);
      this.apiservice.showNotification('top','right','Successfully updated.','success');
      this.getSubCategory(this.subToSubCat);

    })
  }
  EditedSavesubCategory(){
    
  }
  cateMain(id) {
    this.ImagesModel.mainCategoryId = id;
    this.ProductModel.mainCategory = id;
    this.category.forEach(element => {
      if (element.id == id) {
        this.selectedCat = element.name;
      }
    })
    this.getSubCategory(id);

  }
  submitCategory() {
    this.category.forEach(element => {
      if (element.name == this.selectedCat) {
        this.CategoryModel.parent = element.id;
        this.CategoryModel.isactive = 1;
      }
    })
    this.categoryService.saveCat(this.CategoryModel).subscribe((response) => {
      console.log(response);
      this.apiservice.showNotification('top','right','Category successfully added.','success');
      this.getSubCategory(this.subToSubCat);
    })
  }
  cateCategory(id) {
    this.ProductModel.category = id;
    this.ImagesModel.categoryId = id;

    this.selectedSubCatid = id;
    this.subcategory.forEach(element => {
      if (element.id == id) {
        this.selectedSubCat = element.name;
      }
    })
    this.getProductSubCategory(id);
  }
  getSubCategory(id) {
    debugger
    this.subToSubCat = id;
    this.categoryService.getMainCat(id).subscribe(data => {
      this.subcategory = data;
    });
  }
  submitSubCategory() {
    this.subcategory.forEach(element => {
      if (element.name == this.selectedSubCat) {
        this.CategoryModel.parent = element.id;
        this.CategoryModel.isactive = 1;
      }
    })
    this.categoryService.saveCat(this.CategoryModel).subscribe((response) => {
      this.apiservice.showNotification('top','right','Sub Category successfully added.','success');
      this.getProductSubCategory(this.CategoryModel.parent);
    })
    this.isSubCatData = true;
  }
  getProductSubCategory(id) {
    debugger
    this.categoryService.getMainCat(id).subscribe(data => {
      this.subprodcat = data;
    });
  }
  subProCategory(id) {
    this.ImagesModel.subCategoryId = id;
    this.ProductModel.subCategory = id;
    this.subprodcat.forEach(element => {
      if (element.id == id) {
        this.selectedSubProCat = element.name;
      }
    })
  }

  addImageUploader() {
    this.val++;
    this.addingprdtimg.push({ name: this.val });
  }
  removeImageUploader(val) {
    this.addingprdtimg.splice(val, 1);
  }

  select(event) {
    debugger
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const formdata = new FormData();
      formdata.append('file', file);

      debugger
      this.categoryService.selectUploadImage(formdata).subscribe((response) => {
        this.image = response;
        console.log(response);
        

      })

    }
  }
  // Multiple Image Uploader

  onSelect(event) {
    debugger
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const formdata = new FormData();
      formdata.append('file', file);
      formdata.append('catid', this.ImagesModel.mainCategoryId);
      formdata.append('subcatid', this.ImagesModel.categoryId);
      formdata.append('grandchild', this.ImagesModel.subCategoryId);


      this.categoryService.selectMultiUploadImage(formdata).subscribe((response) => {
        this.multi.push(response);
        console.log(response);

      })

    }
  }
  addSelectSize() {
    this.value++;
    this.addSelectFields.push({ name: this.value, selsize: '', quantity: 0 });
  }
  removeSelectSize(value) {
    this.addSelectFields.splice(value, 1);
  }
  getClothSize() {
    this.categoryService.getCloth().subscribe((data: any) => {
      this.clothsize = data;

    });
  }
  selectClothsSize(id) {
    this.clothsize.forEach(element => {
      if (element.id == id) {
        this.selectClothSize = element.size;
      }
    })
  }
  submitClothSize(id, index) {
    if (index != undefined) {

      this.clothsize.forEach(element => {
        if (element.id == id) {
          this.addSelectFields[index].selsize = element.size;
          this.addSelectFields[index].soldquantity =0;
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

  submitAddProduct() {
    debugger
    this.ProductModel.isActive = 0;
    this.ProductModel.productMainImage = this.image;
    this.ProductModel.selectedSize = this.addSelectFields;
    this.ProductModel.multi = this.multi;
    if(this.ProductModel.subCategory == undefined){
      this.ProductModel.subCategory = null;
    }
    // this.ImagesModel.
    // this.QuantityWithSizeModel.addSelectFields = this.addSelectFields;
    this.categoryService.saveAddProduct(this.ProductModel).subscribe((response) => {
      this.apiservice.showNotification('top','right','Product successfully added.','success');
      // this.router.navigate(['/inventory']);
    })
  }
  // removeOrChangedImage() {
  //   debugger

  //   this.categoryService.removeOrChanged().subscribe((req) => {
  //   })
  // }

}
