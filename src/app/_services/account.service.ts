import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Employee } from '@app/_models/employee';
import { Department } from '@app/_models/departments';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/auth/login`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/auth/signup`, user);
    }


    addEmployee(user: Employee) {
        return this.http.post(`${environment.apiUrl}/api/employees`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/api/employees`);
    }

    getById(id: any) {
        return this.http.get<Employee>(`${environment.apiUrl}/api/employees/${id}`);
    }


    addDepartment(department: Department) {
        return this.http.post(`${environment.apiUrl}/api/departments`, department);
    }

    getAllDepartments() {
        return this.http.get<Department[]>(`${environment.apiUrl}/api/departments`);
    }

    getDepartmentById(id: any) {
        return this.http.get<Department>(`${environment.apiUrl}/api/departments/${id}`);
    }
    update(id: any, user: Employee) {
        return this.http.put(`${environment.apiUrl}/api/employees/${id}`, user)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    //const user = { ...this.userValue, ...user };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                   // this.userSubject.next(user);
                }
                return x;
            }));
    }

    updateDepartment(id: any, department: Department) {
        return this.http.put(`${environment.apiUrl}/api/departments/${id}`, department)
            .pipe(map(x => {
               
                return x;
            }));
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/api/employees/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                // if (id == this.userValue?.id) {
                //     this.logout();
                // }
                return x;
            }));
    }






    
}