/**
 * Debug Panel Module
 * 
 * This module creates a simple debug panel that can be used to display
 * information about the application state and component loading.
 */

export class DebugPanel {
  private static panel: HTMLElement | null = null;
  private static logContainer: HTMLElement | null = null;
  private static isVisible = false;
  private static logs: string[] = [];
  private static maxLogs = 50;

  /**
   * Initialize the debug panel
   */
  public static init(): void {
    // Create panel if it doesn't exist
    if (!this.panel) {
      this.createPanel();
    }

    // Add keyboard shortcut to toggle panel (Ctrl+Shift+D)
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        this.toggle();
      }
    });

    // Intercept console.log, console.error, etc.
    this.interceptConsole();

    console.log('Debug panel initialized (Press Ctrl+Shift+D to toggle)');
  }

  /**
   * Create the debug panel
   */
  private static createPanel(): void {
    // Create panel container
    this.panel = document.createElement('div');
    this.panel.style.position = 'fixed';
    this.panel.style.bottom = '0';
    this.panel.style.right = '0';
    this.panel.style.width = '400px';
    this.panel.style.height = '300px';
    this.panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    this.panel.style.color = 'white';
    this.panel.style.fontFamily = 'monospace';
    this.panel.style.fontSize = '12px';
    this.panel.style.padding = '10px';
    this.panel.style.zIndex = '9999';
    this.panel.style.overflowY = 'auto';
    this.panel.style.display = 'none';
    
    // Create header
    const header = document.createElement('div');
    header.style.borderBottom = '1px solid #444';
    header.style.paddingBottom = '5px';
    header.style.marginBottom = '10px';
    header.innerHTML = '<strong>Debug Panel</strong> <span style="float: right; cursor: pointer;" id="debug-panel-close">×</span>';
    this.panel.appendChild(header);
    
    // Create log container
    this.logContainer = document.createElement('div');
    this.panel.appendChild(this.logContainer);
    
    // Add to document
    document.body.appendChild(this.panel);
    
    // Add event listener to close button
    document.getElementById('debug-panel-close')?.addEventListener('click', () => {
      this.hide();
    });
  }

  /**
   * Toggle the debug panel
   */
  public static toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Show the debug panel
   */
  public static show(): void {
    if (this.panel) {
      this.panel.style.display = 'block';
      this.isVisible = true;
      this.updateLogs();
    }
  }

  /**
   * Hide the debug panel
   */
  public static hide(): void {
    if (this.panel) {
      this.panel.style.display = 'none';
      this.isVisible = false;
    }
  }

  /**
   * Add a log message to the debug panel
   */
  public static log(message: string, type: 'log' | 'error' | 'warn' = 'log'): void {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const formattedMessage = `[${timestamp}] ${message}`;
    
    // Add to logs array
    this.logs.push(`<span class="debug-${type}">${formattedMessage}</span>`);
    
    // Trim logs if needed
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Update logs if panel is visible
    if (this.isVisible) {
      this.updateLogs();
    }
  }

  /**
   * Update the logs in the debug panel
   */
  private static updateLogs(): void {
    if (this.logContainer) {
      this.logContainer.innerHTML = this.logs.join('<br>');
      this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
  }

  /**
   * Intercept console methods to also log to the debug panel
   */
  private static interceptConsole(): void {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.log = (...args) => {
      originalLog.apply(console, args);
      this.log(args.map(arg => this.formatArg(arg)).join(' '));
    };
    
    console.error = (...args) => {
      originalError.apply(console, args);
      this.log(args.map(arg => this.formatArg(arg)).join(' '), 'error');
    };
    
    console.warn = (...args) => {
      originalWarn.apply(console, args);
      this.log(args.map(arg => this.formatArg(arg)).join(' '), 'warn');
    };
  }

  /**
   * Format an argument for logging
   */
  private static formatArg(arg: any): string {
    if (arg === undefined) return 'undefined';
    if (arg === null) return 'null';
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (e) {
        return arg.toString();
      }
    }
    return String(arg);
  }
}
