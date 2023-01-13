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
                    <span class="material-symbols-outlined">
                        location_on
                    </span>
                    <span class="location-details">
                        {{ numLocations }} {{ numLocations > 1 ? 'stores' :'store' }}
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
    'click'
],
props:[
    'image',
    'title',
    'numLocations',
    'reviews',
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
     
    }
}
}
</script>

<style scoped>
.app-display-card{
    width:100%;
    height:18em;
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
    font-size:var(--app-text-base)
}

.card-description, .card-location-info{
    font-size:var(--app-text-base)
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


</style>