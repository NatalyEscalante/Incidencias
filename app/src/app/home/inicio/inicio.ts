import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit, AfterViewInit, OnDestroy {
  private timeRunning = 3000;
  private timeAutoNext = 4000;
  private runTimeOut: any;
  private runNextAuto: any;
  
  private nextBtn: HTMLElement | null = null;
  private prevBtn: HTMLElement | null = null;
  private carousel: HTMLElement | null = null;
  private list: HTMLElement | null = null;

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeCarousel();
    }, 0);
  }

  ngOnDestroy() {
    if (this.runTimeOut) {
      clearTimeout(this.runTimeOut);
    }
    if (this.runNextAuto) {
      clearTimeout(this.runNextAuto);
    }
  }

  private initializeCarousel(): void {
    this.nextBtn = document.querySelector('.next');
    this.prevBtn = document.querySelector('.prev');
    this.carousel = document.querySelector('.carousel');
    this.list = document.querySelector('.list');

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.showSlider('next'));
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.showSlider('prev'));
    }

    this.startAutoNext();
    // ← QUITAMOS resetTimeAnimation() porque ya no existe la barra
  }

  private startAutoNext(): void {
    this.runNextAuto = setTimeout(() => {
      if (this.nextBtn) {
        this.nextBtn.click();
      }
    }, this.timeAutoNext);
  }

  private showSlider(type: 'next' | 'prev'): void {
    if (!this.list || !this.carousel) return;

    const sliderItems = this.list.querySelectorAll('.carousel .list .item');
    
    if (type === 'next') {
      this.list.appendChild(sliderItems[0]);
      this.carousel.classList.add('next');
    } else {
      this.list.prepend(sliderItems[sliderItems.length - 1]);
      this.carousel.classList.add('prev');
    }

    if (this.runTimeOut) {
      clearTimeout(this.runTimeOut);
    }

    this.runTimeOut = setTimeout(() => {
      if (this.carousel) {
        this.carousel.classList.remove('next');
        this.carousel.classList.remove('prev');
      }
    }, this.timeRunning);

    if (this.runNextAuto) {
      clearTimeout(this.runNextAuto);
    }
    this.startAutoNext();

  }
}