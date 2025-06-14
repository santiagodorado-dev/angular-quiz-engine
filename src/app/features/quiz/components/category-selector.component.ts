import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../../core/services/quiz.service';
import { QuizQuestion } from '../../../models/quiz.model';

@Component({
  selector: 'app-category-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit {
  categories: { name: string; questions: QuizQuestion[] }[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    const categoryNames = [
      'Biología y Geología',
      'Geografía e Historia',
      'Lengua Castellana y Literatura',
      'Matemáticas',
      'Tecnología y Digitalización',
      'Física y Química'
    ];

    categoryNames.forEach(category => {
      this.quizService.getQuestions(category).subscribe(
        questions => {
          this.categories.push({ name: category, questions });
          if (this.categories.length === categoryNames.length) {
            this.loading = false;
          }
        },
        error => {
          this.error = 'Error al cargar las categorías';
          this.loading = false;
        }
      );
    });
  }

  getCategoryClass(categoryName: string): string {
    const categoryMap: { [key: string]: string } = {
      'Biología y Geología': 'biologia',
      'Geografía e Historia': 'geografia',
      'Lengua Castellana y Literatura': 'lengua',
      'Matemáticas': 'matematicas',
      'Tecnología y Digitalización': 'tecnologia',
      'Física y Química': 'fisica'
    };
    return categoryMap[categoryName] || '';
  }

  selectCategory(category: { name: string; questions: QuizQuestion[] }) {
    if (category.questions.length > 0) {
      this.quizService.startNewQuiz(category.name);
      this.router.navigate(['/quiz']);
    }
  }
} 