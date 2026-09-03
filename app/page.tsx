'use client';

import { useState } from 'react';
import { ArrowDownRight, ArrowRight, Check, Clock3, MapPin, Menu, Play, Star, X } from 'lucide-react';

const directions = [
  { number: '01', title: 'Contemporary', level: 'Любой уровень', time: 'Пн · Ср 19:00', tone: 'coral' },
  { number: '02', title: 'High Heels', level: 'Начинающие', time: 'Вт · Чт 20:00', tone: 'cream' },
  { number: '03', title: 'Hip-Hop', level: 'Любой уровень', time: 'Сб 13:00', tone: 'dark' },
];

const teachers = [
  { initials: 'АК', name: 'Анна Крылова', role: 'Contemporary', years: '12 лет в танце' },
  { initials: 'МС', name: 'Мария Соколова', role: 'High Heels', years: '8 лет в танце' },
  { initials: 'ИД', name: 'Илья Демин', role: 'Hip-Hop', years: '10 лет в танце' },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="РИТМ — на главную">РИТМ<span>.</span></a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Главная навигация">
          <a href="#directions" onClick={() => setMenuOpen(false)}>Направления</a><a href="#teachers" onClick={() => setMenuOpen(false)}>Педагоги</a><a href="#about" onClick={() => setMenuOpen(false)}>О школе</a><a href="#contacts" onClick={() => setMenuOpen(false)}>Контакты</a>
        </nav>
        <a className="header-cta" href="#trial">Пробный урок <ArrowDownRight size={17} /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-image" aria-hidden="true" /><div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Танцевальная школа в Москве</p>
          <h1>Найди свой<br /><em>ритм.</em></h1>
          <p className="hero-text">Танцуй свободно. Чувствуй музыку.<br />Становись увереннее с каждым движением.</p>
          <div className="hero-actions"><a className="button button-primary" href="#trial">Записаться на пробный <ArrowRight size={19} /></a><a className="watch-link" href="#about"><span><Play size={16} fill="currentColor" /></span> Смотреть о школе</a></div>
        </div>
        <div className="hero-stats"><div><strong>7</strong><span>лет<br />в движении</span></div><div><strong>450+</strong><span>учеников<br />нашли свой ритм</span></div><div><strong>12</strong><span>педагогов-<br />практиков</span></div></div>
        <a className="scroll-hint" href="#directions"><span>Листай</span><ArrowDownRight size={18} /></a>
      </section>

      <section className="directions section" id="directions">
        <div className="section-heading"><div><p className="kicker">Направления</p><h2>Выбери, как<br />хочешь <em>двигаться.</em></h2></div><p>Неважно, танцевал ли ты раньше. Мы подберём группу, где будет комфортно начать и интересно расти.</p></div>
        <div className="direction-grid">{directions.map((item) => <article className={`direction-card ${item.tone}`} key={item.title}><span className="card-number">{item.number}</span><div className="card-figure" aria-hidden="true"><span>{item.title.slice(0, 2).toUpperCase()}</span></div><div className="card-content"><h3>{item.title}</h3><p>{item.level}</p><div><Clock3 size={16} /> {item.time}</div></div><a href="#trial" aria-label={`Записаться на ${item.title}`}><ArrowDownRight /></a></article>)}</div>
      </section>

      <section className="about section" id="about">
        <div className="about-visual"><div className="quote-mark">“</div><blockquote>Тело знает<br />ответ. Дай ему<br /><em>двигаться.</em></blockquote><span className="line-art" aria-hidden="true" /></div>
        <div className="about-copy"><p className="kicker light">О школе</p><h2>Здесь не учат<br />быть идеальным.</h2><p>Здесь учат слышать себя, доверять телу и получать удовольствие от каждого движения.</p><ul><li><Check /> Небольшие группы до 14 человек</li><li><Check /> Залы с профессиональным покрытием</li><li><Check /> Дружелюбная атмосфера без оценок</li></ul><a className="text-link" href="#teachers">Познакомиться с командой <ArrowRight /></a></div>
      </section>

      <section className="teachers section" id="teachers">
        <div className="section-heading compact"><div><p className="kicker">Команда</p><h2>Те, кто<br /><em>вдохновляет.</em></h2></div><div className="rating"><div>{[1,2,3,4,5].map(i => <Star key={i} size={15} fill="currentColor" />)}</div><strong>4.9</strong><span>по отзывам учеников</span></div></div>
        <div className="teacher-grid">{teachers.map((teacher, index) => <article className="teacher-card" key={teacher.name}><div className={`teacher-portrait portrait-${index + 1}`}><span>{teacher.initials}</span></div><div><p>{teacher.role}</p><h3>{teacher.name}</h3><span>{teacher.years}</span></div></article>)}</div>
      </section>

      <section className="trial section" id="trial">
        <div className="trial-copy"><p className="kicker light">Первый шаг</p><h2>Попробуй.<br /><em>Это бесплатно.</em></h2><p>Оставь номер — администратор перезвонит, поможет выбрать направление и удобное время.</p><div className="trial-note"><span>0 ₽</span><p>Пробный урок<br /><small>для новых учеников</small></p></div></div>
        <form className="trial-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>{sent ? <div className="success"><span><Check size={28} /></span><h3>Заявка отправлена!</h3><p>Скоро свяжемся с вами и подберём занятие.</p><button type="button" onClick={() => setSent(false)}>Отправить ещё</button></div> : <><label>Как вас зовут?<input required name="name" placeholder="Ваше имя" /></label><label>Номер телефона<input required name="phone" type="tel" placeholder="+7 (___) ___-__-__" /></label><label>Что хотите попробовать?<select name="direction" defaultValue=""><option value="" disabled>Выберите направление</option><option>Contemporary</option><option>High Heels</option><option>Hip-Hop</option><option>Пока не знаю</option></select></label><button className="button button-dark" type="submit">Записаться бесплатно <ArrowRight size={19} /></button><small>Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</small></>}</form>
      </section>

      <footer id="contacts"><div><a className="logo" href="#top">РИТМ<span>.</span></a><p>Танцы начинаются<br />с первого шага.</p></div><div><span>Адрес</span><p><MapPin size={16} /> Москва, ул. Тверская, 18</p><p>5 минут от м. Пушкинская</p></div><div><span>Связаться</span><a href="tel:+74951234567">+7 (495) 123-45-67</a><a href="mailto:hello@ritm.school">hello@ritm.school</a></div><div><span>Мы в соцсетях</span><a href="#">Instagram*</a><small>* принадлежит Meta, признанной экстремистской организацией в РФ</small></div><div className="copyright">© 2026 Школа танцев «РИТМ»</div></footer>
    </main>
  );
}
