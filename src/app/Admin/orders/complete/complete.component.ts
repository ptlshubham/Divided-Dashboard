import { Component, OnInit } from '@angular/core';
declare var require: any
declare var $:any;
@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css']
})
export class CompleteComponent implements OnInit {
  model: Date;
  constructor() { }

  ngOnInit(): void {
    this.model = new Date();
    if ($(".selectpicker").length != 0) {
      $(".selectpicker").selectpicker({
        iconBase: "nc-icon",
        tickIcon: "nc-check-2"
      });
    }
  }
  requestReview(){
    
  }

}
