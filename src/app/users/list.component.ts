﻿import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users?: any[];
    departments?: any[];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
            this.accountService.getAllDepartments()
            .pipe(first())
            .subscribe(departments => this.departments = departments);

    }

    deleteUser(data:any) {
        const user = this.users!.find(x => x.id === data.employeeID);
        console.log("users Data"+user);
        this.accountService.delete(data.employeeID)
            .pipe(first())
            .subscribe(() => this.users = this.users!.filter(x => x.id !== data.employeeID));
    }
}