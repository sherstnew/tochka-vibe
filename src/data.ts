export type Topic = { id: string; title: string; hours: number; competencyIds: string[] };
export type Competency = { id: string; title: string; knowledge: string; ability: string; skill: string };
export type Material = { id: string; kind: 'lecture' | 'practice' | 'test'; title: string; content: string; competencyIds: string[]; topicIds: string[] };
export type Module = { id: string; title: string; description: string; topics: Topic[]; materials: Material[] };
export type Program = { title: string; audience: string; targetHours: number; type: string; approved: boolean; modules: Module[]; competencies: Competency[] };
export const uid = () => crypto.randomUUID();
export const hours = (m: Module) => m.topics.reduce((s, t) => s + t.hours, 0);
export const totalHours = (p: Program) => p.modules.reduce((s, m) => s + hours(m), 0);
export const materialKinds = { lecture: 'Лекция', practice: 'Практика', test: 'Тест' };
export function makeMaterials(m: Module): Material[] {
 const competencyIds = [...new Set(m.topics.flatMap(t => t.competencyIds))];
 const topicIds = m.topics.map(t => t.id);
 return (['lecture', 'practice', 'test'] as const).map(kind => ({ id: uid(), kind, title: `${materialKinds[kind]}: ${m.title}`, competencyIds, topicIds,
 content: kind === 'lecture' ? `Цель занятия\nРазобраться в теме «${m.title}» и применить её к банковским данным.\n\nПлан лекции\n${m.topics.map((t,i) => `${i+1}. ${t.title}: основные понятия и разбор примера.`).join('\n')}\n\nПлан слайдов\n1. Задача аналитика и ожидаемый результат\n2. Основные понятия\n3. Пошаговый разбор на учебном наборе транзакций\n4. Типичные ошибки\n5. Выводы и вопросы\n\nПример\nСравните средний размер транзакции по сегментам клиентов. Обсудите, почему среднее может искажать картину при наличии выбросов.` : kind === 'practice' ? `Задание\nИспользуя синтетический набор из 1 000 банковских транзакций, выполните задания по темам:\n${m.topics.map(t => `• ${t.title}`).join('\n')}\n\nРезультат\nНоутбук с решением и краткий вывод для руководителя отдела. Персональные данные не используются.\n\nКритерии оценки — 10 баллов\n• Корректность решения — 4 балла\n• Обоснование подхода — 3 балла\n• Воспроизводимость — 2 балла\n• Ясность выводов — 1 балл\n\nПроходной результат: 7 баллов.` : `Вопрос 1\nПри анализе банковских транзакций обнаружены пропуски. Какое действие следует выполнить первым?\nА. Удалить все строки с пропусками\nБ. Изучить долю пропусков и причины их появления\nВ. Заменить все пропуски нулями\n\nКлюч: Б. Решение зависит от смысла данных.\n\nВопрос 2\nПочему важно проверять результат обработки данных?\nА. Чтобы убедиться, что преобразования не исказили выводы\nБ. Только для сокращения времени выполнения\nВ. Проверка не требуется\n\nКлюч: А.\n\nОценивание: по 1 баллу за верный ответ. Для зачёта нужны 2 балла.\n\nДемонстрационные вопросы: требуют предметной адаптации.`
 }));
}
export function demoProgram(): Program {
 const titles = ['Основы Python', 'Работа с данными', 'Анализ и статистика', 'Визуализация данных', 'Итоговый проект'];
 const topics = [['Синтаксис и типы данных','Функции и коллекции'],['Загрузка данных с Pandas','Очистка банковских данных'],['Исследовательский анализ','Гипотезы и метрики'],['Графики с Matplotlib','Дашборд для бизнеса'],['Анализ клиентских транзакций','Защита и обратная связь']];
 const budgets = [10,14,18,18,12];
 const competencies = titles.map((title,i) => ({id:`c${i}`,title:['Писать код на Python','Подготавливать данные','Находить закономерности','Представлять результаты','Решать задачу бизнеса'][i],knowledge:`Основные понятия: ${title.toLowerCase()}`,ability:`Применять инструменты раздела «${title}» к учебным банковским данным`,skill:'Самостоятельное решение практической задачи и объяснение результата'}));
 const modules = titles.map((title,i) => { const m: Module = { id:`m${i}`, title, description:['Осваиваем базовые инструменты аналитика и пишем первый код.','Превращаем сырые таблицы в данные, готовые к анализу.','Задаём правильные вопросы и проверяем гипотезы.','Рассказываем историю данных понятным языком.','Собираем навыки в решение реальной бизнес-задачи.'][i],topics:topics[i].map((t,j) => ({id:`t${i}-${j}`,title:t,hours:budgets[i]/2,competencyIds:[`c${i}`]})),materials:[] }; m.materials=makeMaterials(m); return m; });
 return {title:'Анализ данных на Python',audience:'Сотрудники банка · начальный уровень',targetHours:72,type:'Повышение квалификации',approved:true,modules,competencies};
}
export function loadProgram(): Program {
 try { const raw = JSON.parse(localStorage.getItem('ride-edu-v1') || 'null'); if(raw && typeof raw.title === 'string' && Array.isArray(raw.modules) && Array.isArray(raw.competencies)) return raw; } catch { /* use demo */ }
 return demoProgram();
}
