<template>
        <div class="app-display-card" @click="$emit('click')">
            <div class="card-display-img">
                <img :src="cardImage" alt="">
            </div>
            <div class="card-content component-padding">
               <slot name="card_body_content">
                    <div class="card-content-header">
                        <span class="card-title">{{ title }}</span>
                        <span class="order-rating" v-if="(reviews !== null && reviews !== undefined) && reviews.length > 0">
                        <span class="material-symbols-outlined">
                            star_outline
                        </span>
                        <span>
                        -
                        </span>

                        </span>
                
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
        'desc',
        'reviews'
    ],
    computed:{
        cardImage(){
            let defaultImage = "";
            if(this.image === null || this.image === undefined){ return defaultImage};
            const { url } = this.image;
            if(url === undefined){ return defaultImage};
            return url 
        }
    }
}
</script>

<style scoped>
    .app-display-card{
        width:100%;
        height:14em;
        background:var(--app-prim-light);
        border:0.1px solid var(--app-platinum);
        cursor:pointer;
    }

    .card-display-img{
        width:100%;
        height:70%;
    }

    .card-display-img img{
        width:100%;
        height:100%;
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

    .order-rating{
    background:var(--app-prim-black);
    color:var(--app-prim-light);
    font-size:var(--app-text-xs);
    border-radius:12%;
    display:flex;
    align-items:center;
    padding:0.1em 0.5em;
    gap:0.2em;
}

.order-rating .material-symbols-outlined, .card-location-info .material-symbols-outlined{
    font-size:var(--app-text-base)
}

</style>