import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';
import { pathService } from './services/path.service';
@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './app.page-shop.html',
  styleUrls: ['./app.page-shop.css']
})
export class PageShopComponent {
    // Variables we're gonna use in this page
    username              = '';
    
    token                 = '';
    message               = '';
    _apiService:ApiService;
    public site: string;
    path: any

    itemArray:any
    bitcoin: number
    soundImg: string = "assets/images/SoundOn.png";
    musicImg: string = "assets/images/musicOn.png"
    musicPlayer = <HTMLAudioElement>document.getElementById("musicPlayer")
    currentSong: string = "assets/sounds/songs/theme.mp3";
    
    

    // This constructor is basically "do these things when the page is being loaded"
    constructor(private http: HttpClient, private router:Router, pathService: pathService) {
        this._apiService = new ApiService(http, this,pathService);
        this.site = pathService.path;
        this.musicPlayer.loop = true;
        this.musicPlayer.volume = 0.5;
        this.setup()
    }

    // Used when page is loaded up. Loads each function one at a time in order to fix potential
    // issues with functions relying on other functions finishing to work.
    async setup(){
        await this.getItems()
        await this.getBitcoin()
        await this.setSound()
        await this.setMusic()
        console.log("Setup Complete!")
    }

    // Get user's bitcoin from the database
    getBitcoin() {
        // Set variable 'inshop' in session storage to 'true'. This is used to tell the autosave that the user is in the shop and should not be auto saving.
        sessionStorage.setItem('inshop', 'true')
        // Locate which appropriate controller function to use. In this case, we use getBitcoin function in UserController.js
        // You can find this out in router.js
        let url = this.site + 'user/getBitcoin'
        // Send a POST request with email data.
        // In UserController.js, this email data is recieved by "req.body.email"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    this.bitcoin = data
                } )
    }

    // Get all the items in the database
    getItems() {
        // Locate which approrpiate controller function to use. In this case, we use getItems function in GameController.js
        // You can find this out in router.js
        let url = this.site + 'Game/getItems'
        this.http.get<any>(url)
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (For debugging purposes).
                    console.log(JSON.stringify(data))
                    this.itemArray = data
                } )
    }

    // Buy. This function is called whenver user buys something. In the parameters, name is the item name and price is the item price.
    buy(name, price) {
        // If user doesnt have enough bitcoins,
        if(this.bitcoin < price){
            // let em know.
            this.message = "You don't have enough bitcoin!"
        }
        // If user DOES have enough bitcoin,
        else {
            // Deduct bitcoin from item price (Visually only).
            this.bitcoin -= price
            // Thank the user
            this.message = "Thank you come again!"
            // Call make_transaction function with the item name
            this.make_transaction(name)
            // Save progress (This is so that bitcoins are officially deducted).
            this.saveProgress()
        }
    }

    // This function is to increase the user's quantity of the item
    make_transaction(name){
        // Locate whic appropriate controller function to use. In this case, we use makeTransaction function in UserController.js
        // You can tell how by looking in router.js
        let url = this.site + 'user/makeTransaction'
        // Send a POST request with email and item name data.
        // In UserController.js, this data is recieved by "req.body.[whatever we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            name: name
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (for debugging purposes)
                    console.log(data)
                }
            )
    }

    // Save progress
    saveProgress() {
        // Locate which appropriate controller function to use. In this case, we use saveProgress function in UserController.js
        // You can tell how by looking in router.js
        let url = this.site + 'user/saveProgress'
        // Send a POST request with email and bitcoin data.
        // In UserController.js, this data is recieved by "req.body.[whatever we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            bitcoin: this.bitcoin
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (for debugging purposes)
                    console.log(data)
                } )
    }

    // This function is called when the using comes to the main page. Changes image and sound
    // settings based on what they were the last time you entered the main page.
    async setSound() {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true'){
            // Keep sound on and change the image accordingly
            sessionStorage.setItem('sound', 'true');
            this.soundImg = "assets/images/SoundOn.png"
        }
        // If sound is turned off
        else if (sessionStorage.getItem('sound') == 'false'){
            // Keep sound off and change the image accordingly
            sessionStorage.setItem('sound', 'false');
            this.soundImg = "assets/images/SoundOff.png"
        }
        // If sound has not been set this session
        else {
            // Turn sound on
            sessionStorage.setItem('sound', 'true');
            this.soundImg = "assets/images/SoundOn.png"
        }
    }

    // This function is called every time the user clicks on the sound icon to turn on/off the sound
    changeSound() {
        // If the session variable "sound" is set to "true"
        if (sessionStorage.getItem('sound') == 'true') {
            //Set the session variable "sound" to false and change the image accordingly
            sessionStorage.setItem('sound', 'false');
            this.soundImg = "assets/images/SoundOff.png"
        }

        // If the session variable "sound" is set to "false"
        else if (sessionStorage.getItem('sound') == 'false') {
            //Set the session variable "sound" to true and change the image accordingly
            sessionStorage.setItem('sound', 'true');
            this.soundImg = "assets/images/SoundOn.png"
        }
    }

    async setMusic() {
        if (sessionStorage.getItem('music') == 'true'){
            sessionStorage.setItem('music', 'true')
            if (this.musicPlayer.duration > 0 && !this.musicPlayer.paused) {
                console.log("Music already playing")
            }
            else {
                this.musicPlayer.src = this.currentSong;
                this.musicPlayer.load();
                this.musicPlayer.play();
                this.musicImg = "assets/images/musicOn.png"
            }
        }

        else if (sessionStorage.getItem('music') == 'false'){
            sessionStorage.setItem('music', 'false');
            this.musicPlayer.pause()
            this.musicImg = "assets/images/musicOff.png"
        }
        else {
            sessionStorage.setItem('music', 'true')
            this.musicPlayer.src = this.currentSong;
            this.musicPlayer.load();
            this.musicPlayer.play();
            this.musicImg = "assets/images/musicOn.png"
        }
    }

    changeMusic() {
        if (sessionStorage.getItem('music') == 'true'){
            sessionStorage.setItem('music', 'false');
            this.musicPlayer.pause()
            this.musicImg = "assets/images/musicOff.png"
            console.log("music off")
        }

        else if (sessionStorage.getItem('music') == 'false'){
            sessionStorage.setItem('music', 'true')
            this.musicPlayer.play();
            this.musicImg = "assets/images/musicOn.png"
        }
    }

}
    