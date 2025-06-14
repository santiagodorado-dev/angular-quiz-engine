import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, take } from 'rxjs';
import { Category, Question, QuizState, QuizResult } from '../../models/quiz.model';
import { AppStateService } from './app-state.service';
import { BehaviorSubject, of } from 'rxjs';
import { QuizQuestion } from '../../models/quiz.model';


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private categoryMap: { [key: string]: string } = {
    'biologia': 'Biología y Geología',
    'geografia': 'Geografía e Historia',
    'lengua': 'Lengua Castellana y Literatura',
    'matematicas': 'Matemáticas',
    'tecnologia': 'Tecnología y Digitalización',
    'fisica': 'Física y Química'
  };

  private quizState = new BehaviorSubject<QuizState>({
    isComplete: false,
    currentQuestionIndex: 0,
    selectedAnswers: [],
    timeSpent: 0,
    category: '',
    score: 0,
    questions: []
  });

  private questions: { [key: string]: QuizQuestion[] } = {
    'Biología y Geología': [
      {
        id: 1,
        text: '¿En qué fase de la mitosis se alinean los cromosomas en el ecuador de la célula?',
        options: ['Metafase', 'Profase', 'Anafase', 'Telofase'],
        correctAnswer: 'Metafase',
        category: 'Biología y Geología'
      },
      {
        id: 2,
        text: '¿Cuál es la función principal de la enzima ADN polimerasa?',
        options: ['Sintetizar ADN', 'Degradar proteínas', 'Producir ATP', 'Transcribir ARN'],
        correctAnswer: 'Sintetizar ADN',
        category: 'Biología y Geología'
      },
      {
        id: 3,
        text: '¿Qué proceso geológico es responsable de la formación de montañas por plegamiento?',
        options: ['Orogénesis', 'Erosión', 'Sedimentación', 'Meteorización'],
        correctAnswer: 'Orogénesis',
        category: 'Biología y Geología'
      },
      {
        id: 4,
        text: '¿En qué orgánulo celular se produce la síntesis de proteínas?',
        options: ['Ribosomas', 'Mitocondrias', 'Núcleo', 'Aparato de Golgi'],
        correctAnswer: 'Ribosomas',
        category: 'Biología y Geología'
      },
      {
        id: 5,
        text: '¿Cuál es la escala de dureza utilizada para clasificar los minerales?',
        options: ['Mohs', 'Richter', 'pH', 'Celsius'],
        correctAnswer: 'Mohs',
        category: 'Biología y Geología'
      },
      {
        id: 6,
        text: '¿Qué tipo de enlace químico une los nucleótidos en una cadena de ADN?',
        options: ['Fosfodiéster', 'Iónico', 'Metálico', 'Van der Waals'],
        correctAnswer: 'Fosfodiéster',
        category: 'Biología y Geología'
      },
      {
        id: 7,
        text: '¿Cuál es el nombre del proceso por el cual el magma se solidifica para formar rocas ígneas?',
        options: ['Cristalización', 'Metamorfismo', 'Diagénesis', 'Alteración'],
        correctAnswer: 'Cristalización',
        category: 'Biología y Geología'
      },
      {
        id: 8,
        text: '¿En qué consiste la selección natural según Darwin?',
        options: ['Supervivencia del más apto', 'Mutación dirigida', 'Herencia de caracteres adquiridos', 'Equilibrio ecológico'],
        correctAnswer: 'Supervivencia del más apto',
        category: 'Biología y Geología'
      },
      {
        id: 9,
        text: '¿Qué estructura geológica se forma cuando una falla permite el movimiento vertical de bloques rocosos?',
        options: ['Horst y graben', 'Anticlinal', 'Sinclinal', 'Domo'],
        correctAnswer: 'Horst y graben',
        category: 'Biología y Geología'
      },
      {
        id: 10,
        text: '¿Cuál es la función de los cloroplastos en las células vegetales?',
        options: ['Fotosíntesis', 'Respiración celular', 'Síntesis de lípidos', 'Digestión celular'],
        correctAnswer: 'Fotosíntesis',
        category: 'Biología y Geología'
      }
    ],
    'Geografía e Historia': [
      {
        id: 1,
        text: '¿Qué tratado puso fin a la Primera Guerra Mundial?',
        options: ['Tratado de Versalles', 'Tratado de París', 'Tratado de Tordesillas', 'Tratado de Utrecht'],
        correctAnswer: 'Tratado de Versalles',
        category: 'Geografía e Historia'
      },
      {
        id: 2,
        text: '¿Cuál es el río más largo de Europa?',
        options: ['Volga', 'Danubio', 'Rin', 'Dniéper'],
        correctAnswer: 'Volga',
        category: 'Geografía e Historia'
      },
      {
        id: 3,
        text: '¿En qué siglo se produjo la Revolución Industrial?',
        options: ['XVIII-XIX', 'XVI-XVII', 'XIX-XX', 'XV-XVI'],
        correctAnswer: 'XVIII-XIX',
        category: 'Geografía e Historia'
      },
      {
        id: 4,
        text: '¿Qué proceso geográfico explica la deriva de los continentes?',
        options: ['Tectónica de placas', 'Erosión fluvial', 'Sedimentación marina', 'Vulcanismo'],
        correctAnswer: 'Tectónica de placas',
        category: 'Geografía e Historia'
      },
      {
        id: 5,
        text: '¿Quién fue el primer emperador romano?',
        options: ['Augusto', 'Julio César', 'Trajano', 'Marco Aurelio'],
        correctAnswer: 'Augusto',
        category: 'Geografía e Historia'
      },
      {
        id: 6,
        text: '¿Cuál es la línea imaginaria que divide la Tierra en hemisferio norte y sur?',
        options: ['Ecuador', 'Trópico de Cáncer', 'Meridiano de Greenwich', 'Trópico de Capricornio'],
        correctAnswer: 'Ecuador',
        category: 'Geografía e Historia'
      },
      {
        id: 7,
        text: '¿En qué año cayó el Imperio Romano de Occidente?',
        options: ['476 d.C.', '410 d.C.', '455 d.C.', '493 d.C.'],
        correctAnswer: '476 d.C.',
        category: 'Geografía e Historia'
      },
      {
        id: 8,
        text: '¿Qué cordillera separa Europa de Asia?',
        options: ['Urales', 'Cáucaso', 'Alpes', 'Pirineos'],
        correctAnswer: 'Urales',
        category: 'Geografía e Historia'
      },
      {
        id: 9,
        text: '¿Cuál fue la causa principal del inicio de la Segunda Guerra Mundial?',
        options: ['Invasión de Polonia', 'Ataque a Pearl Harbor', 'Asesinato del archiduque Francisco Fernando', 'Crisis de los misiles'],
        correctAnswer: 'Invasión de Polonia',
        category: 'Geografía e Historia'
      },
      {
        id: 10,
        text: '¿Qué tipo de clima se caracteriza por temperaturas constantes y abundantes precipitaciones?',
        options: ['Ecuatorial', 'Mediterráneo', 'Continental', 'Desértico'],
        correctAnswer: 'Ecuatorial',
        category: 'Geografía e Historia'
      }
    ],
    'Lengua Castellana y Literatura': [
      {
        id: 1,
        text: '¿Cuál es la figura retórica que consiste en la repetición de sonidos consonánticos?',
        options: ['Aliteración', 'Metáfora', 'Hipérbole', 'Sinestesia'],
        correctAnswer: 'Aliteración',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 2,
        text: '¿Quién escribió "La casa de Bernarda Alba"?',
        options: ['Federico García Lorca', 'Antonio Machado', 'Miguel Hernández', 'Rafael Alberti'],
        correctAnswer: 'Federico García Lorca',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 3,
        text: '¿Qué tipo de oración subordinada introduce la conjunción "aunque"?',
        options: ['Concesiva', 'Causal', 'Condicional', 'Temporal'],
        correctAnswer: 'Concesiva',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 4,
        text: '¿En qué siglo se desarrolló el movimiento literario del Barroco en España?',
        options: ['XVII', 'XVI', 'XVIII', 'XV'],
        correctAnswer: 'XVII',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 5,
        text: '¿Cuál es la función sintáctica de "muy" en la oración "Está muy cansado"?',
        options: ['Modificador del adjetivo', 'Complemento directo', 'Atributo', 'Complemento circunstancial'],
        correctAnswer: 'Modificador del adjetivo',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 6,
        text: '¿Qué obra maestra escribió Miguel de Cervantes?',
        options: ['Don Quijote de la Mancha', 'La Celestina', 'El Lazarillo de Tormes', 'La vida es sueño'],
        correctAnswer: 'Don Quijote de la Mancha',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 7,
        text: '¿Cuál es el complemento del verbo en "Confío en ti"?',
        options: ['Complemento de régimen', 'Complemento directo', 'Complemento indirecto', 'Atributo'],
        correctAnswer: 'Complemento de régimen',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 8,
        text: '¿Qué generación literaria española se caracterizó por el tema de España y la búsqueda de la identidad nacional?',
        options: ['Generación del 98', 'Generación del 27', 'Generación del 14', 'Generación del 36'],
        correctAnswer: 'Generación del 98',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 9,
        text: '¿Cuál es la diferencia entre verso libre y verso blanco?',
        options: ['El verso libre no tiene métrica ni rima, el verso blanco no tiene rima pero sí métrica', 'No hay diferencia', 'El verso libre tiene rima consonante', 'El verso blanco no tiene métrica'],
        correctAnswer: 'El verso libre no tiene métrica ni rima, el verso blanco no tiene rima pero sí métrica',
        category: 'Lengua Castellana y Literatura'
      },
      {
        id: 10,
        text: '¿Qué recurso estilístico utiliza Góngora en "sus cabellos son de oro"?',
        options: ['Metáfora', 'Metonimia', 'Hipérbaton', 'Sinécdoque'],
        correctAnswer: 'Metáfora',
        category: 'Lengua Castellana y Literatura'
      }
    ],
    'Matemáticas': [
      {
        id: 1,
        text: '¿Cuál es la derivada de f(x) = x³?',
        options: ['3x²', 'x²', '3x', 'x³'],
        correctAnswer: '3x²',
        category: 'Matemáticas'
      },
      {
        id: 2,
        text: '¿Cuál es el límite de (x²-1)/(x-1) cuando x tiende a 1?',
        options: ['2', '1', '0', 'No existe'],
        correctAnswer: '2',
        category: 'Matemáticas'
      },
      {
        id: 3,
        text: '¿Cómo se llama una función que cumple f(x+y) = f(x) + f(y)?',
        options: ['Función aditiva', 'Función lineal', 'Función exponencial', 'Función logarítmica'],
        correctAnswer: 'Función aditiva',
        category: 'Matemáticas'
      },
      {
        id: 4,
        text: '¿Cuál es la integral indefinida de 2x?',
        options: ['x² + C', '2x² + C', 'x²/2 + C', '2x + C'],
        correctAnswer: 'x² + C',
        category: 'Matemáticas'
      },
      {
        id: 5,
        text: '¿Cuál es el determinante de la matriz 2x2 [[2,3],[1,4]]?',
        options: ['5', '8', '11', '6'],
        correctAnswer: '5',
        category: 'Matemáticas'
      },
      {
        id: 6,
        text: '¿Cuál es la ecuación de la recta que pasa por (0,2) y tiene pendiente 3?',
        options: ['y = 3x + 2', 'y = 2x + 3', 'y = 3x - 2', 'y = -3x + 2'],
        correctAnswer: 'y = 3x + 2',
        category: 'Matemáticas'
      },
      {
        id: 7,
        text: '¿Cuál es el valor de log₂(8)?',
        options: ['3', '2', '4', '8'],
        correctAnswer: '3',
        category: 'Matemáticas'
      },
      {
        id: 8,
        text: '¿Cuál es la solución de la ecuación x² - 5x + 6 = 0?',
        options: ['x = 2, x = 3', 'x = 1, x = 6', 'x = -2, x = -3', 'x = 0, x = 5'],
        correctAnswer: 'x = 2, x = 3',
        category: 'Matemáticas'
      },
      {
        id: 9,
        text: '¿Cuál es el área de un círculo con radio 5?',
        options: ['25π', '10π', '5π', '50π'],
        correctAnswer: '25π',
        category: 'Matemáticas'
      },
      {
        id: 10,
        text: '¿Cuál es la fórmula de la distancia entre dos puntos (x₁,y₁) y (x₂,y₂)?',
        options: ['√[(x₂-x₁)² + (y₂-y₁)²]', '(x₂-x₁) + (y₂-y₁)', '|x₂-x₁| + |y₂-y₁|', '(x₂-x₁)² + (y₂-y₁)²'],
        correctAnswer: '√[(x₂-x₁)² + (y₂-y₁)²]',
        category: 'Matemáticas'
      }
    ],
    'Tecnología y Digitalización': [
      {
        id: 1,
        text: '¿Cuál es la principal diferencia entre un algoritmo y un programa?',
        options: ['El algoritmo es conceptual, el programa es su implementación', 'No hay diferencia', 'El programa es más complejo', 'El algoritmo usa código'],
        correctAnswer: 'El algoritmo es conceptual, el programa es su implementación',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 2,
        text: '¿Qué es la inteligencia artificial supervisada?',
        options: ['Aprendizaje con datos etiquetados', 'Aprendizaje sin supervisión humana', 'IA que supervisa humanos', 'IA controlada por gobierno'],
        correctAnswer: 'Aprendizaje con datos etiquetados',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 3,
        text: '¿Cuál es la función principal de un firewall?',
        options: ['Filtrar tráfico de red', 'Acelerar internet', 'Almacenar datos', 'Comprimir archivos'],
        correctAnswer: 'Filtrar tráfico de red',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 4,
        text: '¿Qué significa IoT en tecnología?',
        options: ['Internet of Things', 'Input Output Technology', 'Internal Operating Tools', 'Integrated Online Technology'],
        correctAnswer: 'Internet of Things',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 5,
        text: '¿Cuál es la principal ventaja del cloud computing?',
        options: ['Escalabilidad y accesibilidad', 'Mayor velocidad', 'Menos seguridad', 'Menor costo siempre'],
        correctAnswer: 'Escalabilidad y accesibilidad',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 6,
        text: '¿Qué es blockchain?',
        options: ['Una cadena de bloques de información distribuida', 'Un tipo de criptomoneda', 'Un lenguaje de programación', 'Un protocolo de internet'],
        correctAnswer: 'Una cadena de bloques de información distribuida',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 7,
        text: '¿Cuál es la diferencia entre HTTP y HTTPS?',
        options: ['HTTPS es la versión segura con cifrado SSL/TLS', 'HTTPS es más rápido', 'No hay diferencia real', 'HTTP es para móviles'],
        correctAnswer: 'HTTPS es la versión segura con cifrado SSL/TLS',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 8,
        text: '¿Qué es Big Data?',
        options: ['Grandes volúmenes de datos complejos de procesar', 'Datos de empresas grandes', 'Bases de datos caras', 'Información personal'],
        correctAnswer: 'Grandes volúmenes de datos complejos de procesar',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 9,
        text: '¿Cuál es el propósito principal de la metodología DevOps?',
        options: ['Integrar desarrollo y operaciones para entregas más rápidas', 'Desarrollar solo aplicaciones', 'Operar servidores únicamente', 'Crear documentación'],
        correctAnswer: 'Integrar desarrollo y operaciones para entregas más rápidas',
        category: 'Tecnología y Digitalización'
      },
      {
        id: 10,
        text: '¿Qué es la computación cuántica?',
        options: ['Computación que usa principios de mecánica cuántica', 'Computación muy rápida', 'Computación en la nube', 'Computación con muchos núcleos'],
        correctAnswer: 'Computación que usa principios de mecánica cuántica',
        category: 'Tecnología y Digitalización'
      }
    ],
    'Física y Química': [
      {
        id: 1,
        text: '¿Cuál es la ecuación de la segunda ley de Newton?',
        options: ['F = m·a', 'E = m·c²', 'P = F/A', 'W = F·d'],
        correctAnswer: 'F = m·a',
        category: 'Física y Química'
      },
      {
        id: 2,
        text: '¿Cuál es la configuración electrónica del átomo de oxígeno?',
        options: ['1s² 2s² 2p⁴', '1s² 2s² 2p⁶', '1s² 2s² 2p²', '1s² 2s⁴'],
        correctAnswer: '1s² 2s² 2p⁴',
        category: 'Física y Química'
      },
      {
        id: 3,
        text: '¿Cuál es la velocidad de la luz en el vacío?',
        options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'],
        correctAnswer: '3×10⁸ m/s',
        category: 'Física y Química'
      },
      {
        id: 4,
        text: '¿Qué tipo de enlace se forma entre un metal y un no metal?',
        options: ['Iónico', 'Covalente', 'Metálico', 'Van der Waals'],
        correctAnswer: 'Iónico',
        category: 'Física y Química'
      },
      {
        id: 5,
        text: '¿Cuál es la unidad del momento angular en el Sistema Internacional?',
        options: ['kg·m²·s⁻¹', 'kg·m·s⁻¹', 'kg·m²·s⁻²', 'kg·m·s⁻²'],
        correctAnswer: 'kg·m²·s⁻¹',
        category: 'Física y Química'
      },
      {
        id: 6,
        text: '¿Cuál es el número de Avogadro?',
        options: ['6.022×10²³', '6.022×10²¹', '6.022×10²⁵', '6.022×10¹⁹'],
        correctAnswer: '6.022×10²³',
        category: 'Física y Química'
      },
      {
        id: 7,
        text: '¿Cuál es la ecuación de la ley de Ohm?',
        options: ['V = I·R', 'P = V·I', 'Q = m·c·ΔT', 'F = k·x'],
        correctAnswer: 'V = I·R',
        category: 'Física y Química'
      },
      {
        id: 8,
        text: '¿Cuál es la hibridación del carbono en el metano (CH₄)?',
        options: ['sp³', 'sp²', 'sp', 'sp³d'],
        correctAnswer: 'sp³',
        category: 'Física y Química'
      },
      {
        id: 9,
        text: '¿Cuál es la relación entre la energía cinética y la velocidad?',
        options: ['Ec = ½mv²', 'Ec = mv', 'Ec = mv²', 'Ec = ½mv'],
        correctAnswer: 'Ec = ½mv²',
        category: 'Física y Química'
      },
      {
        id: 10,
        text: '¿Qué principio establece que es imposible determinar simultáneamente la posición y velocidad exactas de una partícula?',
        options: ['Principio de incertidumbre de Heisenberg', 'Principio de Pauli', 'Principio de Hund', 'Principio de Aufbau'],
        correctAnswer: 'Principio de incertidumbre de Heisenberg',
        category: 'Física y Química'
      }
    ]
  };

  constructor(
    private http: HttpClient,
    private appState: AppStateService
  ) {}

  getQuizState(): Observable<QuizState> {
    return this.quizState.asObservable();
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<{ [key: string]: Category }>('/assets/data/questions.json').pipe(
      map(data => Object.values(data)),
      catchError(this.handleError)
    );
  }

  getQuestions(category: string): Observable<QuizQuestion[]> {
    return of(this.questions[category] || []);
  }

  selectAnswer(answer: string): void {
    const currentState = this.quizState.value;
    const newSelectedAnswers = currentState.selectedAnswers.slice();
    
    if (currentState.currentQuestionIndex < newSelectedAnswers.length) {
      newSelectedAnswers[currentState.currentQuestionIndex] = answer;
    } else {
      newSelectedAnswers.push(answer);
    }

    this.quizState.next({
      ...currentState,
      selectedAnswers: newSelectedAnswers
    });
  }

  calculateResult(questions: QuizQuestion[]): QuizResult {
    const state = this.quizState.value;
    const correctAnswers = state.selectedAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;

    const totalQuestions = questions.length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = state.timeSpent;

    let message = '';
    if (score >= 90) {
      message = '¡Excelente trabajo! Eres un experto en esta materia.';
    } else if (score >= 70) {
      message = '¡Buen trabajo! Tienes un buen dominio del tema.';
    } else if (score >= 50) {
      message = '¡No está mal! Sigue practicando para mejorar.';
    } else {
      message = '¡Sigue intentándolo! La práctica hace al maestro.';
    }

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      score,
      timeSpent,
      category: state.category,
      message
    };
  }

  resetQuiz(): void {
    this.quizState.next({
      isComplete: false,
      currentQuestionIndex: 0,
      selectedAnswers: [],
      timeSpent: 0,
      category: '',
      score: 0,
      questions: []
    });
  }

  private getCategoryKey(name: string): string {
    return Object.entries(this.categoryMap).find(
      ([_, value]) => value === name
    )?.[0] || '';
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Algo salió mal. Por favor, inténtalo de nuevo más tarde.'));
  }

  startQuiz(category: string) {
    const questions = this.questions[category] || [];
    this.quizState.next({
      isComplete: false,
      currentQuestionIndex: 0,
      selectedAnswers: [],
      timeSpent: 0,
      category,
      score: 0,
      questions
    });
  }

  nextQuestion() {
    const currentState = this.quizState.value;
    const nextIndex = currentState.currentQuestionIndex + 1;

    this.quizState.next({
      ...currentState,
      currentQuestionIndex: nextIndex,
      questions: currentState.questions
    });
  }

  completeQuiz() {
    const currentState = this.quizState.value;
    this.quizState.next({
      ...currentState,
      isComplete: true
    });
  }

  updateTimeSpent(time: number) {
    const currentState = this.quizState.value;
    this.quizState.next({
      ...currentState,
      timeSpent: time
    });
  }

  startNewQuiz(category: string) {
    this.resetQuiz();
    this.startQuiz(category);
  }
} 