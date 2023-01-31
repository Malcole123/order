<template>
    <div class="app-display-card" @click="$emit('click')">
        <div class="card-display-img">
            <img :src="cardImage" alt="">
        </div>
        <div class="card-content component-padding">
          <slot name="card_content">
            <div class="card-content-header">
                <span class="card-title">{{ title }}</span>
                <span class="restaurant-rating" v-if="reviews !== null && reviews.length > 0">
                    <span class="material-symbols-outlined">
                        star_outline
                    </span>
                    <span>
                       -
                    </span>

                </span>
            </div>
            <div class="card-content-body">
                <div class="full-width card-location-info">
                    <div class="card-location-badge">
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
                <div class="favourite-icon" @click="toggleFavourite">
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
    'image',
    'title',
    'numLocations',
    'reviews',
    'description'
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
    }
},
data(){
    return {
        isFavourite:false,
    }
},
methods:{
    toggleFavourite(ev){
        ev.stopPropagation();
        if(this.$auth.loggedIn === false){
            this.$emit('guestClick')
            return 
        }
        this.isFavourite = !this.isFavourite;
    }
},
watch:{
    isFavourite(newVal, oldVal){
        this.$emit('favouriteToggled', {
            restaurant_id:0,
        })
    }
}
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
}

.card-title{
    font-size:var(--app-text-base);
    font-weight:600;
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
</style>