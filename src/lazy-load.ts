/**
 * @author Serkan YESILDAG
 * @link https://github.com/syesildag/lazy-load
 */
namespace LazyLoad {
  'use strict';
  
  export var DEBUG: boolean = false;
  
  export interface Options extends IntersectionObserverInit {
    dataLoaded?: string;
    dataSource?: string;
    dataSourceSet?: string;
    dataBackgroundImage?: string;
    selector: string;
    isLoaded(element: Element): boolean;
    load(element: HTMLImageElement): void;
  }

  export interface Instance {
    observe(): void;
    observeElement(element: Element): void;
    load(element: Element): void;
  }

  class InstanceImpl implements Instance {
    private observer: IntersectionObserver;

    constructor(private options: Options) {
      if ('IntersectionObserver' in window)
        this.observer = new IntersectionObserver(this.onIntersection.bind(this), options);
    }

    private onIntersection(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          observer.unobserve(entry.target);
          this.load(entry.target);
        }
      });
    }

    public observe() {
      const elements = document.querySelectorAll(this.options.selector);
      for (let i = 0; i < elements.length; i++)
        this.observeElement(elements[i]);
    }

    public observeElement(element: Element) {
      this._observeElement(element, this.observer);
    }

    public load(element: Element) {
      this._observeElement(element);
    }

    private _observeElement(element: Element, observer?: IntersectionObserver) {
      if (this.options.isLoaded(element))
        return;

      if (observer) {
        observer.observe(element);
        return;
      }

      this.options.load(<HTMLImageElement>element);
    }
  }

  export class DefaultOptions implements Options {
    constructor(
      public selector = '.lazy-load',
      public rootMargin = '0px',
      public threshold = 0,
      public dataLoaded = 'data-loaded',
      public dataSource = 'data-src',
      public dataSourceSet = 'data-srcset',
      public dataBackgroundImage = 'data-background-image') {
    }

    public isLoaded(element: Element) {
      return element.hasAttribute(this.dataLoaded);
    }

    public load(element: HTMLImageElement) {
      this.loadElement(element);
      element.setAttribute(this.dataLoaded, '');
    }

    protected loadElement(element: HTMLImageElement) {
      if (element.getAttribute(this.dataSource))
        element.src = <string>element.getAttribute(this.dataSource);

      if (element.getAttribute(this.dataSourceSet))
        element.srcset = <string>element.getAttribute(this.dataSourceSet);

      if (element.getAttribute(this.dataBackgroundImage))
        element.style.backgroundImage = 'url(' + element.getAttribute(this.dataBackgroundImage) + ')';
    }
  }

  export function create(options: Options = new DefaultOptions()): Instance {
    return new InstanceImpl(options);
  }
}
