import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'film',
        data: { pageTitle: 'cipangoApp.film.home.title' },
        loadChildren: () => import('./film/film.module').then(m => m.FilmModule),
      },
      {
        path: 'application-user',
        data: { pageTitle: 'cipangoApp.applicationUser.home.title' },
        loadChildren: () => import('./application-user/application-user.module').then(m => m.ApplicationUserModule),
      },
      {
        path: 'serie',
        data: { pageTitle: 'cipangoApp.serie.home.title' },
        loadChildren: () => import('./serie/serie.module').then(m => m.SerieModule),
      },
      {
        path: 'livre',
        data: { pageTitle: 'cipangoApp.livre.home.title' },
        loadChildren: () => import('./livre/livre.module').then(m => m.LivreModule),
      },
      {
        path: 'album-photo',
        data: { pageTitle: 'cipangoApp.albumPhoto.home.title' },
        loadChildren: () => import('./album-photo/album-photo.module').then(m => m.AlbumPhotoModule),
      },
      {
        path: 'photo',
        data: { pageTitle: 'cipangoApp.photo.home.title' },
        loadChildren: () => import('./photo/photo.module').then(m => m.PhotoModule),
      },
      {
        path: 'video',
        data: { pageTitle: 'cipangoApp.video.home.title' },
        loadChildren: () => import('./video/video.module').then(m => m.VideoModule),
      },
      {
        path: 'audio',
        data: { pageTitle: 'cipangoApp.audio.home.title' },
        loadChildren: () => import('./audio/audio.module').then(m => m.AudioModule),
      },
      {
        path: 'contenant',
        data: { pageTitle: 'cipangoApp.contenant.home.title' },
        loadChildren: () => import('./contenant/contenant.module').then(m => m.ContenantModule),
      },
      {
        path: 'contenu',
        data: { pageTitle: 'cipangoApp.contenu.home.title' },
        loadChildren: () => import('./contenu/contenu.module').then(m => m.ContenuModule),
      },
      {
        path: 'lien',
        data: { pageTitle: 'cipangoApp.lien.home.title' },
        loadChildren: () => import('./lien/lien.module').then(m => m.LienModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
