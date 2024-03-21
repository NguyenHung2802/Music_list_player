// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

console.log(playBtn);


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    //config: {},
    //(1/2) Uncomment the line below to use localStorage
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    

    songs: [
        {
            name: "Anh da on hon",
            singer: "MCK",
            path: "assets/music/AnhDaOnHon.mp3",
            image: "assets/img/anhdaonhon.png"
        },
        {
            name: "Anhs ems",
            singer: "QNT, RZ Mas, Wxrdie",
            path: "assets/music/AnhsEms.mp3",
            image: "assets/img/anhsems.jpg"
        },
        {
        name: "Buồn hay vui",
        singer: "VSOUL, MCK, Obito, Ronboogz",
        path:
            "assets/music/BuonHayVui.mp3",
        image: "assets/img/buonhayvui.png"
        },
        {
        name: "Chương hai của tương lai",
        singer: "Wean, MCK",
        path: "assets/music/ChuongHaiCuaTuongLai.mp3",
        image:
            "assets/img/chuong2cuatuonglai.png"
        },
        {
        name: "Đánh đổi",
        singer: "Obito, MCK, Shiki",
        path: "assets/music/DanhDoi.mp3",
        image:
            "assets/img/danhdoi.png"
        },
        {
        name: "Show me love",
        singer: "MCK",
        path:
            "assets/music/ShowMeLove.mp3",
        image:
            "assets/img/showmelove.png"
        },
        {
        name: "Tho Er",
        singer: "MCK",
        path: "assets\music\ThoEr.mp3",
        image:
            "assets/img/thoer.png"
        },
        {
        name: "Tựa đêm mây",
        singer: "MCK",
        path: "assets/music/TuaDemNay.mp3",
        image:
            "assets/img/tuademnay.jpg"
        },
        {
            name: "Xanh",
            singer: "Ngọt",
            path: "assets/music/Xanh.mp3",
            image:
                "assets/img/xanh.jpg"
        },
        {
            name: "Xuất phát điểm",
            singer: "Obito, Shiki",
            path: "assets/music/XuatPhatDiem.mp3",
            image:
                "assets/img/xuatphatdiem.jpg"
        }
    ],

    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">                 
                    <div class="thumb"
                       style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg'}
        ], {
            duration: 10000, //10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xử lý phóng to / thu nhỏ
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newcdWidth = cdWidth - scrollTop

            cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0
            cd.style.opacity = newcdWidth / cdWidth

            console.log(newcdWidth);
        }

        //Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
        } 
        //Khi hát được play 
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //Khi song bi pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xử lý khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        //khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else{
                _this.prevSong()
            }
            audio.play()
        }

        // Khi Random xu ly
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại một bài hát
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lý next song khi radio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                audio.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || !e.target.closest('.option') ){ 
                
                //Xử lý click vào playlist
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lý khi click vào song option
                if(e.target.closest('.option')){

                }
            }
        }
    },

    // Kéo tới active song
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scroollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 500)      
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    
    start: function(){
        //Gán cấu hình vào config app
        this.loadConfig()

        // Định nghĩa thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe sự kiện / Sử lý các sự kiện DOM events
        this.handleEvents()

        // Tải thông tin bài hát vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Lấy ra bài hát
        this.render()

        //Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', _this.isRepeat)
        randomBtn.classList.toggle('active', _this.isRandom)
        
    }


}
app.start();
