import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { DishService } from '../services/dish.service';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  @ViewChild('cForm') commentFormDirective;

  commentForm: FormGroup;

  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required':      'Author is required.',
      'minlength':     'Author must be at least 2 characters long.',
      'maxlength':     'Author cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
    }
  };

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;

  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds,
        errmess => this.errMess = <any>errmess);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
          errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      rating: 5,
      comment: ['', Validators.required ]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    const comment = {
      rating: this.commentForm.value.rating,
      comment: this.commentForm.value.comment,
      author: this.commentForm.value.author,
      date: (new Date()).toISOString(),
    };

    this.dish.comments.push(comment);

    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }

}
