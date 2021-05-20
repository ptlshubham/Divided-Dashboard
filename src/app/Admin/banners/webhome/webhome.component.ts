import { Component, OnInit } from '@angular/core';
import { BannersService } from '../banners.service';
import { Webbanners } from './webhome.model';

@Component({
  selector: 'app-webhome',
  templateUrl: './webhome.component.html',
  styleUrls: ['./webhome.component.css']
})
export class WebhomeComponent implements OnInit {
  isAddShow = true;
  image: any;
  positiion: any = []
  selectedPosition: any;
  public WebbannersModel: Webbanners = new Webbanners;
  public webImage: Webbanners[] = [];
  constructor(
    private bannersServie: BannersService,
  ) {
    this.positiion = [
      {
        name: 'Top'
      },
      {
        name: 'Middle',
      },
      {
        name: 'End',
      },
      {
        name: 'Deal of the Day',
      }
    ]
    this.getBanners();
  }

  ngOnInit(): void {
  }
  addNewImages() {
    this.isAddShow = false;
  }
  cancelAddImage() {
    this.isAddShow = true;
  }
  selectPosition(name) {
    this.positiion.forEach(element => {
      if (element.name == name) {
        this.selectedPosition = element.name;
      }
    })

  }
  select(event) {
    debugger
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const formdata = new FormData();
      formdata.append('file', file);

      debugger
      this.bannersServie.uploadImage(formdata).subscribe((response) => {
        this.image = response;
        console.log(response);


      })

    }
  }
  saveBannersImage() {
    debugger
    this.WebbannersModel.bannersimage = this.image;
    this.WebbannersModel.name = this.selectedPosition;
    this.WebbannersModel.status = true;
    this.bannersServie.saveWebBannersImage(this.WebbannersModel).subscribe(response => {
      this.getBanners();
      this.isAddShow=true;
    })
  }
  getBanners() {
    debugger
    this.bannersServie.getWebBanners().subscribe((data: any) => {
      this.webImage = data;
    });

  }
  removeBannersImage(id) {
    debugger
    this.bannersServie.removeWebBanners(id).subscribe((req) => {
      this.getBanners();
    })
  }
  activeBanners(id){
    this.webImage[id].status =true;
    this.bannersServie.activeDeavctiveWebBanners( this.webImage[id]).subscribe((req)=>{

    })
  }
  deactiveBanners(id){
    this.webImage[id].status =false;
    this.bannersServie.activeDeavctiveWebBanners( this.webImage[id]).subscribe((req)=>{

    })
  }
  
}
