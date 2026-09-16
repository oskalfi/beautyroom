# Моковые данные Beauty Room

Все активные фикстуры приложения находятся здесь: treatments.ts, videos.ts, facts.ts. Старые mockTreatments.ts и mockData.ts — только совместимые реэкспорты, не копии данных.

## Контракт и подключение сервера

Тип Treatment находится в shared/model/types.ts. concerns и steps — массивы кортежей [title, description]; skinTypes и contraindications — массивы строк. Все восемь запрошенных полей обязательны. stepsDescription и contraindicationsNote также хранятся в данных, чтобы текст шаблона не зависел от конкретного метода или количества этапов.

Страница вызывает await getTreatmentById(id) из shared/api/treatments.ts. Пока это локальный mock-адаптер, не сетевой сервер. При подключении API замените его реализацию запросом и валидацией ответа по контракту Treatment. Неизвестный id возвращает null, страница вызывает notFound(). Существующие id, порядок каталога и пути фотографий сохранены; id 13 в исходном каталоге отсутствует.

## Медицинская редактура — 16 сентября 2026

Это редакционные черновики, а не утверждённые клинические протоколы Beauty Room. Все записи имеют статус draft-needs-clinical-review. Списки «Противопоказания» включают как причины отложить процедуру, так и относительные ограничения, требующие оценки; они не являются исчерпывающими инструкциями. Названия типов кожи — категории для индивидуального подбора, не доказательство пригодности каждого типа. Этапы описывают общий путь пациента, без вымышленных доз, температур, глубин, длительности или количества сеансов.

Часть предосторожностей — редакционный вывод из принципов безопасности, а не дословная инструкция AAD. Для неизвестного устройства нельзя установить полный список противопоказаний. Клиника должна подтвердить модели, инструкции, квалификацию исполнителей, составы и регистрацию препаратов, протоколы и изображения. Американские разрешения FDA не означают разрешения в Израиле.

Особенно проверить изображение IPL (venusviva.jpg), фактическое различие двух микротоковых услуг, вариант охлаждения и безынъекционный протокол CO₂. Источники о другом аппарате используются для обозначения ограничений переноса результатов, а не для доказательства эффективности услуги клиники. Для методов со слабой базой ограничения отражены и в видимом concernsDescription.

## Процедуры и область применимости источников

### 5. Мануальная чистка лица

Извлечение комедонов не предотвращает их повторное появление и не является самостоятельным лечением акне. Этапы — пример, не подтверждённый протокол клиники.

Источники: [AAD — Acne extraction](https://www.aad.org/public/diseases/acne/skin-care/popping).

### 4. Микротоковый массаж лица

Исследование комбинированного аппарата не доказывает эффект изолированных микротоков или лимфодренаж. Название сохранено из каталога; модель и режим клиники неизвестны.

Источники: [Clinical trial: combined multi-energy device, 2024](https://pubmed.ncbi.nlm.nih.gov/38236440/); [FDA — Powered Muscle Stimulator guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-document-powered-muscle-stimulator-510ks-guidance-industry-fda-reviewersstaff-and).

### 1. La Fontaine / Bloomea

Производитель подтверждает сочетание технологий, но его маркетинговые заявления не считаются независимым доказательством. Рекомендации AAD относятся к микродермабразии, а не исследованию La Fontaine.

Источники: [AAD — Microdermabrasion: FAQs](https://www.aad.org/public/cosmetic/age-spots-marks/microdermabrasion-faqs); [Bloomea — La Fontaine](https://bloomea.fr/en/appareil/la-fontaine/).

### 3. Электропорация

Данные о трансдермальной доставке не подтверждают клиническую эффективность любой косметической сыворотки; точный аппарат и состав не указаны.

Источники: [Perspectives on Transdermal Electroporation](https://pmc.ncbi.nlm.nih.gov/articles/PMC4810085/); [FDA — Powered Muscle Stimulator guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-document-powered-muscle-stimulator-510ks-guidance-industry-fda-reviewersstaff-and).

### 2. Микротоковая терапия

Исследование сочетало микротоки, RF, свет и ультразвук; вклад микротоков отдельно неизвестен. Нельзя переносить результаты NMES на микротоки.

Источники: [Clinical trial: combined multi-energy device, 2024](https://pubmed.ncbi.nlm.nih.gov/38236440/); [FDA — Powered Muscle Stimulator guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-document-powered-muscle-stimulator-510ks-guidance-industry-fda-reviewersstaff-and).

### 6. Криотерапия лица

Материалы об охлаждении лица не являются испытанием криоаппарата Beauty Room. Тип процедуры принят по исходному косметическому описанию.

Источники: [Cleveland Clinic — Facial icing](https://health.clevelandclinic.org/facial-icing); [Cleveland Clinic — Cold urticaria](https://my.clevelandclinic.org/health/diseases/24629-cold-urticaria).

### 7. Неинвазивная карбокситерапия CO₂

Alvi подтверждает существование безыгольных устройств, а не доказанность результата. Работа OxyGeneo изучает другую комбинированную технологию с RF; доказательством для Alvi не служит.

Источники: [Alvi Prague — каталог устройств](https://alvi-prague.com/alvi-prague-en-gb/); [OxyGeneo + TriPollar RF study, 2017](https://pubmed.ncbi.nlm.nih.gov/29399257/).

### 8. Мезотерапия

Для неопределённых мезотерапевтических коктейлей доказательства ограничены, состав и регистрация препарата неизвестны. Это не описание определённого skin booster или филлера.

Источники: [DermNet — Mesotherapy](https://dermnetnz.org/topics/mesotherapy).

### 9. Jet Peel

Раннее клиническое исследование и небольшой split-face протокол не подтверждают все маркетинговые заявления. Исследование увлажнения размещено производителем; не независимая рекомендация общества.

Источники: [JetPeel: a new technology for facial rejuvenation, 2005](https://pubmed.ncbi.nlm.nih.gov/15785274/); [Streker & Kerscher — Hydroporation with JetPeel, 2013](https://jetpeel.com/wp-content/uploads/2024/05/Streker-Kerscher-Hydroporation-with-Jetpeel-Dermalinfusion-University-of-Hamburg-2013.pdf).

### 10. IPL — фототерапия

Фото сохранено из исходного каталога: имя venusviva.jpg не подтверждает IPL-аппарат. Требуется проверить реальную модель и соответствие изображения.

Источники: [DermNet — Intense pulsed light therapy](https://dermnetnz.org/topics/intense-pulsed-light-therapy).

### 11. RF-терапия — радиочастотный лифтинг

Описано наружное неинвазивное RF; данные не переносятся автоматически на все устройства или инвазивные методы.

Источники: [AAD — Many ways to firm sagging skin](https://www.aad.org/public/cosmetic/younger-looking/firm-sagging-skin); [FDA — Powered Muscle Stimulator guidance](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-document-powered-muscle-stimulator-510ks-guidance-industry-fda-reviewersstaff-and).

### 12. Микроигольчатый RF-лифтинг

Не обещать безопасность для всех или отсутствие восстановления. Предупреждение FDA от 15.10.2025 учтено; клиника должна подтвердить устройство и квалификацию.

Источники: [AAD — Microneedling](https://www.aad.org/public/cosmetic/scars-stretch-marks/microneedling-fade-scars); [FDA — RF microneedling safety communication, 15 October 2025](https://www.fda.gov/medical-devices/safety-communications/potential-risks-certain-uses-radiofrequency-rf-microneedling-fda-safety-communication); [FDA — Microneedling devices](https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/microneedling-devices).

### 14. Электрокоагуляция (удаление папилом)

Каталог не различает акрохордоны и вирусные бородавки. Показания нельзя определять по названию «папилома»; подозрительные образования требуют морфологической диагностики.

Источники: [DermNet — Electrosurgery](https://dermnetnz.org/topics/electrosurgery).


## Реестр источников

Машиночитаемый реестр — treatmentSources.ts. У каждого источника указаны kind и scope. Обзор, рекомендация общества, сообщение регулятора и страница производителя не равнозначны клиническому испытанию. Доказательность не выражена вымышленными оценками или процентами.

