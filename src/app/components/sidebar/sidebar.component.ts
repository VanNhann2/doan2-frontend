import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';
import {GLOBAL} from '../../services/global';
import {Publication} from '../../models/publication';
import {UploadService} from '../../services/upload.service';
import { NgZone, AfterViewInit } from '@angular/core';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: [UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {
    public url;
    public identity;
    public token;
    public stats;
    public status;
    public publication: Publication;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _uploadService: UploadService
    ) {
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.publication = new Publication("", "", "", "", this.identity._id);
    }

    ngOnInit() {
        console.log('[OK] Component: sidebar.');
        this.getCounter(this.identity._id);
    }

    getCounter(id) {
        this._userService.getCounter(id).subscribe(
            response => {
                this.stats = response;
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    onSubmit(form, event) {
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if (response.publication) {
//                    this.publication = response.publication;
                    // upload image
                    if (this.filesToUpload && this.filesToUpload.length) {
                        this._uploadService
                            .makeFileRequest(this.url + 'upload-image-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
                            .then((result: any) => {
                                this.publication.file = result.image;
                                this.status = 'success';
                                form.reset();
                                this._router.navigate(['/timeline']);
                                this.sended.emit({send:'true'});
                        });
                    } else {
                        this.status = 'success';
                        form.reset();
                        this._router.navigate(['/timeline']);
                        this.sended.emit({send:'true'});
                    }
                } else {
                    this.status = 'error';
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    @Output() sended = new EventEmitter();

    sendPublication(event) {
        this.sended.emit({send:'true'});
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    //shorten link api google
    //  makeShort() {
    // var longUrl=document.getElementById("longurl");
    //     var request = gapi.client.urlshortener.url.insert({
    //     'resource': {
    //     'longUrl': longUrl
    //     }
    //     });
    //     request.execute(function(response) 
    //     {
            
    //         if(response.id != null)
    //         {
    //             var str ="<b>Long URL:</b>"+longUrl+"<br>";
    //             str +="<b>Short URL:</b> <a href='"+response.id+"'>"+response.id+"</a><br>";
    //             document.getElementById("output").innerHTML = str;
    //         }
    //         else
    //         {
    //             alert("error: creating short url");
    //         }
        
    //     });
    // }
    // getShortInfo(){
    // var shortUrl=document.getElementById("shorturl");

    //     var request = gapi.client.urlshortener.url.get({
    //     'shortUrl': shortUrl,
    //     'projection':'FULL'
    //     });
    //     request.execute(function(response) 
    //     {
            
    //         if(response.longUrl!= null)
    //         {
    //             var str ="<b>Long URL:</b>"+response.longUrl+"<br>";
    //             str +="<b>Create On:</b>"+response.created+"<br>";
    //             document.getElementById("output").innerHTML = str;
    //         }
    //         else
    //         {
    //             alert("error: unable to get URL information");
    //         }
        
    //     });

    // }
    // load()
    // {
    //     gapi.client.setApiKey('AIzaSyADirc-fL3EOVW9M8t28UDthMQKNQLrzIU'); //get your ownn Browser API KEY
    //     gapi.client.load('urlshortener', 'v1',function(){});

    // }
    // window.onload = load;
}
