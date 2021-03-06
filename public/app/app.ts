module App {
    'use strict';

    import ISpreadsheetRow = csComp.Services.ISpreadsheetRow;
    import Technology      = TechRadar.Technology;

    export interface IAppScope extends ng.IScope {
        vm: AppCtrl;
    }

    export class AppCtrl {
        private public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';
        private technologies: Technology[];

        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        static $inject = [
            '$scope',
            'busService',
            'sheetService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope             : IAppScope,
            private busService         : csComp.Services.MessageBusService,
            private spreadsheetService : csComp.Services.SpreadsheetService
            ) {
            $scope.vm = this;

            spreadsheetService.loadSheet(this.public_spreadsheet_url, (spreadsheet: ISpreadsheetRow[]) => {
                //this.showInfo(spreadsheet);
                //busService.publish('spreadsheet', 'newSheet', spreadsheet);

                this.technologies = [];
                spreadsheet.forEach((row) => {
                    console.log(row.Category);
                    console.log(row.Title);

                    var deltaTimeString = row.DeltaTime;
                    var deltaCatString  = row.DeltaCategory;
                    var deltaTime     = 0,
                        deltaCategory = 0;
                    if (typeof deltaTimeString === 'string') {
                        deltaTime = +deltaTimeString.replace(',', '.');
                    } else {
                        deltaTime = deltaTimeString;
                    }
                    if (typeof deltaCatString === 'string') {
                        deltaCategory = +deltaCatString.replace(',', '.');
                    } else {
                        deltaCategory = deltaCatString;
                    }
                    var technology = new Technology(row.Category, row.Thumbnail, row.TimeCategory, deltaTime, deltaCategory, row.ShortTitle, row.Title, row.Subtitle, row.Text, row.Media);
                    this.technologies.push(technology);
                    //var technology = row.
                });
                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
            });
        }

        /**
         * Show info that is obtained from the Google sheet.
         */
        private showInfo(spreadsheet: ISpreadsheetRow[]) {
            var index = 1;
            spreadsheet.forEach((row) => {
                console.log('Row ' + index++);
                for (var header in row) {
                    if (!row.hasOwnProperty(header)) continue;
                    console.log(header + ': ' + row[header]);
                }
            });
        }
    }

    // Start the application
    angular.module('TechRadar', [
            // 'ngSanitize',
            // 'ui.router',
            'ui.bootstrap',
            'techRadar.infoslide',
            'techRadar.techRadarChart'
            // 'LocalStorageModule',
            // 'pascalprecht.translate',
        ])
        // .config(localStorageServiceProvider => {
        //     localStorageServiceProvider.prefix = 'csMap';
        // })
        // .config($translateProvider => {
        //     // TODO ADD YOUR LOCAL TRANSLATIONS HERE, OR ALTERNATIVELY, CHECK OUT
        //     // http://angular-translate.github.io/docs/#/guide/12_asynchronous-loading
        //     // Translations.English.locale['MAP_LABEL'] = 'MY AWESOME MAP';
        //     $translateProvider.translations('en', Translations.English.locale);
        //     $translateProvider.translations('nl', Translations.Dutch.locale);
        //     $translateProvider.preferredLanguage('en');
        // })
        // .config($languagesProvider => {
        //     // Defines the GUI languages that you wish to use in your project.
        //     // They will be available through a popup menu.
        //     var languages = [];
        //     languages.push({ key: 'en', name: 'English'   , img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAflJREFUeNpinDRzn5qN3uFDt16+YWBg+Pv339+KGN0rbVP+//2rW5tf0Hfy/2+mr99+yKpyOl3Ydt8njEWIn8f9zj639NC7j78eP//8739GVUUhNUNuhl8//ysKeZrJ/v7z10Zb2PTQTIY1XZO2Xmfad+f7XgkXxuUrVB6cjPVXef78JyMjA8PFuwyX7gAZj97+T2e9o3d4BWNp84K1NzubTjAB3fH0+fv6N3qP/ir9bW6ozNQCijB8/8zw/TuQ7r4/ndvN5mZgkpPXiis3Pv34+ZPh5t23//79Rwehof/9/NDEgMrOXHvJcrllgpoRN8PFOwy/fzP8+gUlgZI/f/5xcPj/69e/37//AUX+/mXRkN555gsOG2xt/5hZQMwF4r9///75++f3nz8nr75gSms82jfvQnT6zqvXPjC8e/srJQHo9P9fvwNtAHmG4f8zZ6dDc3bIyM2LTNlsbtfM9OPHH3FhtqUz3eXX9H+cOy9ZMB2o6t/Pn0DHMPz/b+2wXGTvPlPGFxdcD+mZyjP8+8MUE6sa7a/xo6Pykn1s4zdzIZ6///8zMGpKM2pKAB0jqy4UE7/msKat6Jw5mafrsxNtWZ6/fjvNLW29qv25pQd///n+5+/fxDDVbcc//P/zx/36m5Ub9zL8+7t66yEROcHK7q5bldMBAgwADcRBCuVLfoEAAAAASUVORK5CYII=' });
        //     languages.push({ key: 'nl', name: 'Nederlands', img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAFXSURBVHjaYvzPgAD/UNlYEUAAkuTgCAAIBgJggq5VoAs1qM0vdzmMz362vezjokxPGimkEQ5WoAQEKuK71zwCCKyB4c//J8+BShn+/vv/+w/D399AEox+//8FJH/9/wUU+cUoKw20ASCAWBhEDf/LyDOw84BU//kDtgGI/oARmAHRDJQSFwVqAAggxo8fP/Ly8oKc9P8/AxjiAoyMjA8ePAAIIJZ///5BVIM0MOBWDpRlZPzz5w9AALH8gyvCbz7QBrCJAAHEyKDYX15r/+j1199//v35++/Xn7+///77DST/wMl/f4Dk378K4jx7O2cABBALw7NP77/+ev3xB0gOpOHfr99AdX9/gTVASKCGP//+8XCyMjC8AwggFoZfIHWSwpwQk4CW/AYjsKlA8u+ff////v33998/YPgBnQQQQIzAaGNg+AVGf5AYf5BE/oCjGEIyAQQYAGvKZ4C6+xXRAAAAAElFTkSuQmCC' });
        //     //languages.push({ key: 'de', name: 'Deutsch', img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGzSURBVHjaYvTxcWb4+53h3z8GZpZff/79+v3n/7/fDAz/GHAAgABi+f37e3FxOZD1Dwz+/v3z9y+E/AMFv3//+Qumfv9et241QACxMDExAVWfOHkJJAEW/gUEP0EQDn78+AHE/gFOQJUAAcQiy8Ag8O+fLFj1n1+/QDp+/gQioK7fP378+vkDqOH39x9A/RJ/gE5lAAhAYhzcAACCQBDkgRXRjP034R0IaDTZTFZn0DItot37S94KLOINerEcI7aKHAHE8v/3r/9//zIA1f36/R+o4tevf1ANYNVA9P07RD9IJQMDQACxADHD3z8Ig4GMHz+AqqHagKp//fwLVA0U//v7LwMDQACx/LZiYFD7/5/53/+///79BqK/EMZ/UPACSYa/v/8DyX9A0oTxx2EGgABi+a/H8F/m339BoCoQ+g8kgRaCQvgPJJiBYmAuw39hxn+uDAABxMLwi+E/0PusRkwMvxhBGoDkH4b/v/+D2EDyz///QB1/QLb8+sP0lQEggFh+vGXYM2/SP6A2Zoaf30Ex/J+PgekHwz9gQDAz/P0FYrAyMfz7wcDAzPDtFwNAgAEAd3SIyRitX1gAAAAASUVORK5CYII=' });
        //     $languagesProvider.setLanguages(languages);
        // })
        // .config(($stateProvider, $urlRouterProvider) => {
        //     // For any unmatched url, send to /
        //     $urlRouterProvider.otherwise("/map");
        //     $stateProvider
        //         .state('map', {
        //             url: "/map?layers",
        //             templateUrl: "views/map/map.html",
        //             sticky: true,
        //             deepStateRedirect: true
        //         })
        //         .state('table', {
        //             url: "/table",
        //             template: "<datatable id='datatable'></datatable>",
        //             sticky: true
        //         });
        // })
        .service('sheetService', csComp.Services.SpreadsheetService)
        .service('busService', csComp.Services.MessageBusService)
        .controller('appCtrl', AppCtrl);

}
