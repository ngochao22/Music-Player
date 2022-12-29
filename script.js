const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Ghé qua',
            singer: 'Dick x Tofu x PC',
            path: './assets/music/gheQua.mp3',
            image: './assets/img/gheQua.png'
        },
        {
            name: 'Head In The Clouds',
            singer: 'Hayd',
            path: './assets/music/headInTheClouds.mp3',
            image: './assets/img/headInTheClouds.png'
        },
        {
            name: 'Grateful',
            singer: 'NEFFEX',
            path: './assets/music/grateful.mp3',
            image: './assets/img/grateful.png'
        },
        {
            name: 'Hẹn yêu',
            singer: '2T',
            path: './assets/music/henYeu.mp3',
            image: './assets/img/henYeu.png'
        },
        {
            name: 'Khi mà',
            singer: 'RONGBOOGZ',
            path: './assets/music/khiMa.mp3',
            image: './assets/img/khiMa.png'
        },
        {
            name: 'Lớn rồi còn khóc nhè',
            singer: 'Trúc Nhân',
            path: './assets/music/lonRoiConKhocNhe.mp3',
            image: './assets/img/lonRoiConKhocNhe.png'
        },
        {
            name: 'Love 08',
            singer: 'DuongG',
            path: './assets/music/love08.mp3',
            image: './assets/img/love08.png'
        },
        {
            name: 'Mama',
            singer: 'Jonas Blue',
            path: './assets/music/mama.mp3',
            image: './assets/img/mama.png'
        },
        {
            name: 'Như Anh Mơ',
            singer: 'PC',
            path: './assets/music/nhuAnhMo.mp3',
            image: './assets/img/nhuAnhMo.png'
        },
        {
            name: 'Rise',
            singer: 'Jonas Blue',
            path: './assets/music/rise.mp3',
            image: './assets/img/rise.png'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active1' : ''}" data-index="${index}">
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
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 60000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //Xử lí phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lí khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        //Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        
        //Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Xử lí khi tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //Khi next song
        nextBtn.onclick = function() {
            _this.nextSong();
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //Khi prev song
        prevBtn.onclick = function() {
            _this.prevSong();
            audio.play();
            this.render();
            _this.scrollToActiveSong();
        }

        //Xử lí bật tắt random
        randomBtn.onclick = function(e) {
            _this.playRandomSong();
            randomBtn.classList.toggle('active');
            audio.play();
            _this.scrollToActiveSong();
            this.render();
        }

        //Xử lí phát lại 1 song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active1', _this.isRepeat);
        }

        //Xử lí next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) { 
            const songNode =  e.target.closest('.song:not(.active1)');
            if(songNode || e.target.closest('.option')) {
                //Xử lí khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //Xử lí khi lick vào song option
                if(e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active1').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        },300);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();

    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe và xử lí các sự kiện
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();

        //Render Playlist
        this.render();
    }

};

app.start();



 
