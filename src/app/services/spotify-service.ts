import { Injectable }              from '@angular/core';
import { Http, Response, Headers, RequestOptions }          from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Spotify } from 'ng2-cordova-oauth/core';
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova';
import { SpotifyModel } from '../models/spotify';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class SpotifyService {
  private oauth: OauthCordova = new OauthCordova();
  private spotifyProvider: Spotify =  new Spotify({
    clientId: "c70714997a0843f59b778597b6afc0c2",
    appScope: ["user-read-private", "playlist-read-private"]
  });
  private meUrl = 'https://api.spotify.com/v1/me';  // URL to web API
  private playListUrl = 'https://api.spotify.com/v1/me/playlists';
  constructor (private http: Http) {}

  getAccessToken(): Promise<SpotifyModel> {
    return this.oauth.logInVia(this.spotifyProvider)
              .catch(this.handleError);
  }
  getMe(accessToken): Observable<SpotifyModel> {
    let headers = new Headers({'Authorization': 'Bearer ' + accessToken});
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.meUrl, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  getPlay(accessToken): Observable<SpotifyModel> {
    let headers = new Headers({'Authorization': 'Bearer ' + accessToken});
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.playListUrl, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  private extractData(res: Response) {
    let body = res.json();
    return body  || { };
  }
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
