/**
 * @author Serkan YESILDAG
 * @link https://github.com/syesildag/lazy-load
 */
var LazyLoad;
(function (LazyLoad) {
    'use strict';
    var InstanceImpl = (function () {
        function InstanceImpl(options) {
            this.options = options;
            if ('IntersectionObserver' in window)
                this.observer = new IntersectionObserver(this.onIntersection.bind(this), options);
        }
        InstanceImpl.prototype.onIntersection = function (entries, observer) {
            var _this = this;
            entries.forEach(function (entry) {
                if (entry.intersectionRatio > 0) {
                    observer.unobserve(entry.target);
                    if (!_this.options.isLoaded(entry.target))
                        _this.options.load(entry.target);
                }
            });
        };
        InstanceImpl.prototype.observe = function () {
            var elements = document.querySelectorAll(this.options.selector);
            for (var i = 0; i < elements.length; i++)
                this.observeElement(elements[i]);
        };
        InstanceImpl.prototype.observeElement = function (element) {
            this._observeElement(element, this.observer);
        };
        InstanceImpl.prototype.load = function (element) {
            this._observeElement(element);
        };
        InstanceImpl.prototype._observeElement = function (element, observer) {
            if (this.options.isLoaded(element))
                return;
            if (observer) {
                observer.observe(element);
                return;
            }
            this.options.load(element);
        };
        return InstanceImpl;
    }());
    var DefaultOptions = (function () {
        function DefaultOptions(selector, rootMargin, threshold, dataLoaded, dataSource, dataSourceSet, dataBackgroundImage) {
            if (selector === void 0) { selector = '.lazy-load'; }
            if (rootMargin === void 0) { rootMargin = '0px'; }
            if (threshold === void 0) { threshold = 0; }
            if (dataLoaded === void 0) { dataLoaded = 'data-loaded'; }
            if (dataSource === void 0) { dataSource = 'data-src'; }
            if (dataSourceSet === void 0) { dataSourceSet = 'data-srcset'; }
            if (dataBackgroundImage === void 0) { dataBackgroundImage = 'data-background-image'; }
            this.selector = selector;
            this.rootMargin = rootMargin;
            this.threshold = threshold;
            this.dataLoaded = dataLoaded;
            this.dataSource = dataSource;
            this.dataSourceSet = dataSourceSet;
            this.dataBackgroundImage = dataBackgroundImage;
        }
        DefaultOptions.prototype.isLoaded = function (element) {
            return element.hasAttribute(this.dataLoaded);
        };
        DefaultOptions.prototype.load = function (element) {
            this.loadElement(element);
            element.setAttribute(this.dataLoaded, '');
        };
        DefaultOptions.prototype.loadElement = function (element) {
            if (element.getAttribute(this.dataSource))
                element.src = element.getAttribute(this.dataSource);
            if (element.getAttribute(this.dataSourceSet))
                element.srcset = element.getAttribute(this.dataSourceSet);
            if (element.getAttribute(this.dataBackgroundImage))
                element.style.backgroundImage = 'url(' + element.getAttribute(this.dataBackgroundImage) + ')';
        };
        return DefaultOptions;
    }());
    LazyLoad.DefaultOptions = DefaultOptions;
    function create(options) {
        if (options === void 0) { options = new DefaultOptions(); }
        return new InstanceImpl(options);
    }
    LazyLoad.create = create;
})(LazyLoad || (LazyLoad = {}));
