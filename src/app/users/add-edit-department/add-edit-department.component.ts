import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit-department.component.html',
  styleUrls: ['./add-edit-department.component.less']
})
export class AddEditDepartmentComponent implements OnInit {

  form!: FormGroup;
  id?: number;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  departments?: any[];

  constructor( private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.accountService.getAllDepartments()
    .pipe(first())
    .subscribe(departments => this.departments = departments);

    // form with validation rules
    this.form = this.formBuilder.group({
       department_Name: ['', Validators.required],
        short_Name: ['', Validators.required],
      
    });
    this.title = 'Add Department';
    if (this.id) {
        // edit mode
        this.title = 'Edit Department';
        this.loading = true;
        this.accountService.getDepartmentById(this.id)
            .pipe(first())
            .subscribe(x => {
                this.form.patchValue(x);
                this.loading = false;
            });
    }
  }

   // convenience getter for easy access to form fields
   get f() { return this.form.controls; }

   onSubmit() {
       this.submitted = true;

       // reset alerts on submit
       this.alertService.clear();

       // stop here if form is invalid
       if (this.form.invalid) {
           return;
       }

       this.submitting = true;
       this.saveDepartment()
           .pipe(first())
           .subscribe({
               next: () => {
                   this.alertService.success('Department saved', { keepAfterRouteChange: true });
                   //this.router.navigateByUrl('/users');
               },
               error: error => {
                   this.alertService.error(error);
                   this.submitting = false;
               }
           })
   }

   private saveDepartment() {
       // create or update user based on id param
       return this.id
           ? this.accountService.updateDepartment(this.id!, this.form.value)
           : this.accountService.addDepartment(this.form.value);
   }

}
