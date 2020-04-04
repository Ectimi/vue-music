let mixins = {
    methods: {
        playMusic(e) {
            let id = e.currentTarget.getAttribute("data-id");
            if (id != this.songInfo.id) {
                let sing = {
                    id,
                    name: e.currentTarget.getAttribute("data-name"),
                    artists: e.currentTarget.getAttribute("data-artists")
                };
                this.$store.dispatch("tapPlay", sing);
                for (let i = 0, len = this.songsArray.length; i < len; i++) {
                    if (this.songsArray[i].id == id) {
                        return;
                    }
                }
                this.songsArray.push(sing);
            }
        },
    }

}

export {
    mixins
}