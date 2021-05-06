import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { CoursesStore } from '../services/courses.store';
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    // private coursesService: CoursesService,
    // private loadingService: LoadingService,
    // private messagesService: MessagesService,
    private coursesStore: CoursesStore
  ) { }

  ngOnInit() {

    this.reloadCourses();

  }

  reloadCourses() {
    // const courses$ = this.coursesService
    //   .loadAllCourses()
    //   .pipe(
    //     map(courses => courses.sort(sortCoursesBySeqNo)),
    //     catchError(error => {
    //       const message = 'could not load courses';
    //       this.messagesService.showErrors(message);
    //       console.log(message, error);
    //       return throwError(error);
    //     })
    //   );

    // const loadCourses$ = this.loadingService
    //   .showLoaderUntilCompleted(courses$);

    //   this.beginnerCourses$ = loadCourses$
    //     .pipe(
    //       map(courses => courses
    //         .filter(course => course.category === 'BEGINNER')
    //       )
    //     );

    //   this.advancedCourses$ = loadCourses$
    //     .pipe(
    //       map(courses => courses
    //         .filter(course => course.category === 'ADVANCED')
    //       )
    //     );

    this.beginnerCourses$ = this.coursesStore.filterByCategory('BEGINNER')
    this.advancedCourses$ = this.coursesStore.filterByCategory('ADVANCED')
  }
}




