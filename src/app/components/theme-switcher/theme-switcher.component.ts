import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss', // oder .css, je nachdem was generiert wurde
})
export class ThemeSwitcherComponent implements OnInit {
  /**
   * Indicates whether the current theme is dark mode.
   */
  isDarkMode = false;

  /**
   * Injected Document and Renderer2
   * @private
   */
  private document = inject<Document>(DOCUMENT);
  private renderer = inject(Renderer2);

  /**
   * A constant that holds the key used for storing and retrieving
   * the application's theme preference from local storage or similar storage solutions.
   *
   * This key is used to save or fetch the user's preferred theme setting
   * to persist their preference across sessions.
   */
  private readonly STORAGE_KEY = 'app-theme-preference';

  /**
   * Lifecycle hook that is called after the component has been initialized.
   */
  ngOnInit(): void {
    // Check if there is a stored theme preference
    const storedTheme = localStorage.getItem(this.STORAGE_KEY);

    // Set fallback theme if no stored theme preference is found
    const initialTheme = storedTheme || this.document.documentElement.getAttribute('data-bs-theme') || 'light';

    // Update local state with the initial theme (for toggle button)
    this.isDarkMode = initialTheme === 'dark';

    // Set the correct theme
    this.renderer.setAttribute(this.document.documentElement, 'data-bs-theme', initialTheme);
  }

  /**
   * Toggles the theme between light and dark mode and saves the state to the local storage of the browser
   * @param event The event triggered by the theme toggle action.
   */
  toggleTheme(event: Event): void {
    // Update local state with the new theme
    this.isDarkMode = (event.target as HTMLInputElement).checked;

    // Evaulate the new theme
    const newTheme = this.isDarkMode ? 'dark' : 'light';

    // Set attribut on the <html> element
    this.renderer.setAttribute(this.document.documentElement, 'data-bs-theme', newTheme);

    // Save the new theme to local storage
    localStorage.setItem(this.STORAGE_KEY, newTheme);
  }
}
