<template>
    <div class="app-display-card" @click="detectClick">
        <div class="card-display-img">
            <div class="rest-image-placeholder" v-if="cardLoading=== true">
                <div class="app-skeleton"></div>
            </div>
            <img :src="cardImage" alt="" v-else>
        </div>
        <div class="card-content component-padding">
          <slot name="card_content">
            <div class="card-content-header">
                    <span class="card-title">
                            <span class="full-width" v-if="cardLoading === true">
                                <div class="title-placeholder">
                                    <div class="app-skeleton"></div>
                                </div>
                            </span>
                            <span v-else>
                                {{ title }}
                            </span>
                        </span>                
            </div>
            <div class="card-content-body">
                <div class="full-width card-location-info">
                    <div class="location-placeholder" v-if="cardLoading=== true">
                        <div class="app-skeleton"></div>
                    </div>
                    <div class="card-location-badge" v-else>
                        <span class="material-symbols-outlined">
                            location_on
                        </span>
                        <span class="location-details">
                            {{ numLocations }} {{ numLocations > 1 ? 'stores' :'store' }}
                        </span>
                    </div>
                </div>
                <div class="full-width app-mt-1" v-if="cardDescription.length > 0">
                    <p class="restaurant-description">
                        {{ cardDescription }}
                    </p>
                </div>
                <div class="favourite-icon" @click="toggleFavourite" v-if="cardLoading !== true">
                    <span class="material-icons favourite-icon-active" v-if="isFavourite === true" style="color:red;">
                        favorite
                    </span>
                    <span class="material-icons" v-else>
                        favorite_border
                    </span>
                </div>
            </div>
          </slot>
        </div>
    </div>
</template>

<script>
export default {
emits:[
    'click',
    'favouriteToggled',
    'guestClick'
],
props:[
    'store_id',
    'image',
    'title',
    'numLocations',
    'reviews',
    'description',
    'cardLoading'
],
computed:{
    cardImage(){
        let defaultImage = "";
        if(this.image === null || this.image === undefined){ return defaultImage};
        if(typeof this.image === 'object'){
            const { url } = this.image;
            if(url === undefined){ return defaultImage};
            return url 
        }else if(typeof this.image === 'string'){
            return this.image;
        }   
    },
    cardDescription(){
        let text = this.description || "";
        return text
    },
    storeFavourite(){
        if(this.useStore === true){ return }
        let favs = this.$store.getters['user/getStoreFavourites'];
        console.log(favs)
        let included_ = favs.favourites.inlcudes(this.store_id) ? true : false;
        this.isFavourite = included_
        return included_
    },
},
data(){
    return {
        isFavourite:false,
        useStore:false,
        componentLoaded:false,
    }
},
mounted(){
    if(this.$auth.loggedIn === false){
            this.isFavourite = false;
            this.componentLoaded = true;
        return 
    }
    let items = this.$auth.user.favourite_stores; 
    if(items.includes(this.store_id)){
        this.isFavourite = true;
    }else{
        this.isFavourite = false;
    }
    setTimeout(()=>{
        this.componentLoaded = true;
    },200)
},
methods:{
    toggleFavourite(ev){
        ev.stopPropagation();
        if(this.$auth.loggedIn === false){
            this.$emit('guestClick')
            return 
        }
        this.isFavourite = !this.isFavourite;
    },
    detectClick(){
        if(this.cardLoading === true){ return }
        this.$emit('click')
    }
},
watch:{
    isFavourite(newVal, oldVal){
        if(this.componentLoaded === false){ return }
        this.$emit('favouriteToggled', {
            restaurant_id:this.store_id,
            setState:newVal,
        })
    }
},
}
</script>

<style scoped>
.app-display-card{
    width:100%;
    height:20em;
    background:var(--app-prim-light);
    border:0.5px solid var(--app-platinum);
    cursor:pointer;
}

.card-display-img{
    width:100%;
    height:70%;
}

.card-display-img img{
    width:100%;
    height:100%;
    border:none;
    object-fit:cover;
}

.card-content{
    width:100%;
    height:30%;
    display:flex;
    flex-direction:column;
    gap:0.2em;
}

.card-content-header{
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:center;
}

.card-content-body{
    width:100%;
    position:relative;
    display:flex;
    flex-direction:column;
    gap:0.2em;
}

.card-title{
    font-size:var(--app-text-base);
    font-weight:600;
    width:75%;
}

.restaurant-rating{
    background:var(--app-prim-black);
    color:var(--app-prim-light);
    font-size:var(--app-text-xs);
    border-radius:12%;
    display:flex;
    align-items:center;
    padding:0.1em 0.5em;
    gap:0.2em;
}

.restaurant-rating .material-symbols-outlined, .card-location-info .material-symbols-outlined{
    font-size:var(--app-text-xs)
}

.restaurant-description, .card-location-info{
    font-size:var(--app-text-xs)
}

.restaurant-description{
    display: -webkit-box;
        -webkit-line-clamp:1;
        -webkit-box-orient: vertical; 
        width: 100%;
        overflow: hidden
}

.card-location-badge{
    background:var(--app-prim-black);
    color:var(--app-prim-light);
    width:fit-content;
    display:flex;
    align-items:center;
    gap:0.3em;
    padding:0.3em 0.5em;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
}

.card-location-info{
    display:flex;
    align-items:center;
    gap:0.2em;
}

.location-details{
    display: -webkit-box;
        -webkit-line-clamp:1;
        -webkit-box-orient: vertical; 
        width: 90%;
        overflow: hidden;
}

.favourite-icon .material-icons{
    font-size:var(--app-text-xl);
    color:var(--app-grey);
}

.favourite-icon{
    position:absolute;
    right:0%;
    bottom:0%;
}


.favourite-icon-active{
    color:red;
}

.title-placeholder{
    width:100%;
    height:24px;
}

.location-placeholder{
    width:25%;
    height:16px;
}

.rest-image-placeholder{
    width:100%;
    height:100%;
}
</style>