
/*
This page is for capturing theft-report  by an user

*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService} from '../shared/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-theft-report',
  templateUrl: './theft-report.page.html',
  styleUrls: ['./theft-report.page.scss'],
})
export class TheftReportPage implements OnInit {

  theft_report: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: Router
    ) { }

  ngOnInit() {
    this.theft_report = this.fb.group({
      name: [''],
      descripcion: [''],
      fecha: [''],
      hora: [''],
      calle: ['']
    })
  }
  formSub

  formSubmit() {
    if (!this.theft_report.valid) {
      console.log("Inválido :(")
    } else {
      this.api.createTheftReport(this.theft_report.value)

      console.log("Válido :)")
     
    }

}
}
