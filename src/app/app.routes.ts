import { Routes } from '@angular/router';
import { LoadingComponent } from './loading/loading.component'
import { LanguagesComponent } from './languages/languages.component'

export const routes: Routes = [
    {
        path: '',
        component: LoadingComponent
    },
    {
        path: 'languages',
        component: LanguagesComponent
    }
];
