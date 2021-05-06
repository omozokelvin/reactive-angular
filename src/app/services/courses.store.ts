import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(response => response['payload']),
        catchError(error => {
          const message = 'Could not load courses.';
          this.messagesService.showErrors(message);
          console.log(message, error);
          return throwError(error);
        }),
        tap(courses => this.subject.next(courses))
      );

    this.loadingService
      .showLoaderUntilCompleted(loadCourses$)
      .subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    //update data in memory First
    const courses = this.subject.getValue();

    const index = courses.findIndex(({ id }) => id === courseId);

    const newCourse: Course = {
      ...courses[index],
      ...changes
    };

    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    //trigger a save to the backend
    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError(err => {
          const message = 'Could not save course';
          console.log(message, err);
          this.messagesService.showErrors(message);

          // const oldCourse: Course = {
          //   ...courses[index]
          // }

          // newCourses[index] = oldCourse;

          // this.subject.next(newCourses);
          return throwError(err);
        }),
        shareReplay()
      )
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses => courses.filter(course => course.category === category)
          .sort(sortCoursesBySeqNo)
        )
      )
  }
}