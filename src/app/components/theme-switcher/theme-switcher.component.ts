import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss' // oder .css, je nachdem was generiert wurde
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkMode = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2 // Angular-way um DOM zu manipulieren
  ) {}

  ngOnInit(): void {
    // Beim Starten prüfen, welches Theme aktiv ist
    const currentTheme = this.document.documentElement.getAttribute('data-bs-theme');
    if (currentTheme === 'dark') {
      this.isDarkMode = true;
    }
  }

  toggleTheme(event: Event): void {
    this.isDarkMode = (event.target as HTMLInputElement).checked;

    const newTheme = this.isDarkMode ? 'dark' : 'light';

    // Setzt das Attribut am <html> Tag
    this.renderer.setAttribute(this.document.documentElement, 'data-bs-theme', newTheme);
  }
}

