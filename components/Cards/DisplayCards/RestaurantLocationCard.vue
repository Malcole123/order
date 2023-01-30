<template>
    <div class="restaurant-location-card">
        <div class="full-width">
            <div class="full-width">
                <span class="restaurant-card-heading">
                    {{ listTitle }}
                </span>
            </div>
            <div class="full-width app-flex app-flex-between-row">
                <span>
                   {{ distanceAway }}
                </span>
                <span>
                    <MazBtn 
                    color="black" 
                    outline 
                    size="mini"
                    @click="directionNavigation"
                    >Get Directions</MazBtn>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits:[
        'navigateAway'
    ],
    props:[
        'title',
        'distance',
        'user_location',
        'store_location'
    ],
    computed:{
        listTitle(){
            return this.title || "";
        },
        distanceAway(){
            //expect 1000 unit
            let expect_base = 1000;
            let useDist = this.distance || 0;
            let dist_ = useDist / expect_base;
            let formatted = dist_.toFixed(1)
            let dist_str = `${formatted} KM Away`;
            return dist_str;
        },
    },
    methods:{
        generateNavigationLink(){
            let current_location = {};
            let store_location = this.store_location || {lat:null,lng:null};
            let user_location = this.user_location || {lat:null,lng:null};
            let s_lat = store_location.lat;
            let s_lng = store_location.lng;
            let u_lat = user_location.lat;
            let u_lng = user_location.lng;
            //Generate google navigation link
            let url = `http://maps.google.com/maps?saddr=${u_lat},${u_lng}&daddr=${s_lat},${s_lng}`;
            return url 
        },
        directionNavigation(){
            let use_url = this.generateNavigationLink();
            this.$emit('navigateAway', {
                new_link:use_url,
            })
            open(use_url, '_blank')
        }
    }
}
</script>

<style scoped>
    .restaurant-location-card{
        width:100%;
        min-width:13rem;
        padding-top:12px;
        padding-bottom:12px;
    }

    .restaurant-card-heading{
        font-size:var(--app-text-lg);
        font-weight:600;
    }
</style>