<template>
    <MainWrapper>
      <template v-slot:navbar>
          <ApplicationNavbarVue
          :pageLoading="state.pageLoading"
          />
      </template>
      <template v-slot:body>
        <div class="home-body-wrapper" v-if="successLoad === true">
            <div class="home-results-wrapper app-container-fluid">
              <div class="full-width" v-for="(homeSect, index) in pageData.homeResults" :key="'home-sect-item-'+ index">
                  <div class="home-results-header">
                      <div class="home-main-heading-placeholder" v-if="state.componentLoading">
                        <div class="app-skeleton"></div>
                      </div>
                      <h2 class="home-main-heading"
                      v-else
                      >{{ homeSect.label }}</h2>
                  </div>
                  <div class="home-results-display">
                    <div 
                    class="full-width" v-for="(store, i) in homeSect.results" 
                    :key="`${index}-store-item-result-${i}`">
                        <RestaurantDisplayCard 
                          :store_id="store.id"                             
                          :title="store.name.short"
                          :description="store.promotional.description.short"
                          :image="store.promotional.image.storeLogo"
                          :numLocations="store.locations.length"
                          :reviews="store.reviews"
                          @click="$router.push(`/store/${store.store_reference}`)"
                          @favouriteToggled="setUserFavourite"
                          @guestClick="$router.push('/auth/login')"
                          :cardLoading="state.componentLoading"
                        />
                    </div>
                    
                  </div>
              </div>
              
            </div>
            <div class="home-map-wrapper">

            </div>
        </div>
        <div class="home-body-placeholder" v-else></div>
      </template>
      <template v-slot:footer>
          <StandardFooter/>
      </template>
    </MainWrapper>
 
</template>

<script>
import ApplicationNavbarVue from '~/components/Navbars/ApplicationNavbar.vue';
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue';
import StandardFooter from '~/components/Footers/StandardFooter.vue';


export default {
  auth:false,
  name: 'Home',
  head(){
    return {
      title:"Home",
    }
  },
  async asyncData({$axios, route, store, env, params, query, req, res, redirect, error}) {

  },
  data(){
    return {
      state:{
        pageLoading:true,
        componentLoading:true,
      },
      successLoad:false,
      pageData:{
        homeResults:[],
      }
    }
  },
  fetchOnServer:false,
  async fetch(){
    await this.formatHome();
    this.userDelayAction(()=>{
      this.state.pageLoading = false;
      this.userDelayAction(()=>{
        this.state.componentLoading = false;
      }, 800)
    }, 600)
  },
  components:{
    MainWrapper,
    ApplicationNavbarVue,
    SquareDisplayCard,
    RestaurantDisplayCard,
    StandardFooter,
  },
  methods:{
    userDelayAction(callback, time){
      setTimeout(()=>{
          callback()
      }, time)
    },
    async formatHome(){
      let current_location = {
        lat:0,
        lng:0,
      };
      let finder = this.getCurrentLocation((data)=>{
        current_location.lat = data.data.coords.latitude;
        current_location.lng = data.data.coords.latitude;
      });
    
      let url = process.env.NUXT_ENV_HOME_CLIENT_LOAD;
              let data_ = await  this.$axios.$get(url, {
                params:{
                  location:{
                    lat:current_location.lat,
                    lng:current_location.lng,
                  },
                  region_id:null,
                }
          }).then(data=>{
              let homeResults = [];       
              data.forEach((item,index)=>{
                let setResult = {
                    label:"",
                    filter:"",
                    results:[],
                }
                let inResult = homeResults.find((setItem,i)=>{
                  if(setItem.filter === item.store_type){
                      homeResults[i].results.push(item)
                      return setItem
                  }
                });
                if(inResult !== undefined){ return }
                setResult.label = item.store_type;
                setResult.filter = item.store_type;
                setResult.results = [item];
                homeResults.push(setResult);
                return 
              })
              this.pageData.homeResults = homeResults;
              this.userDelayAction(()=>{
                this.successLoad = true;
              }, 400)
            }).catch(err=>{
              this.successLoad = false;
            });
    },
    getCurrentLocation(returnFunc){
          let location = navigator.geolocation.getCurrentPosition( 
          //Success  
          (pos)=>{
                returnFunc({
                  success:true,
                  data:pos
                })
            },
          //Error
          (err)=>{
            returnFunc({
              success:false,
              err:err,
            })
          },
          //Options
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          })
          return location
    },
    async setUserFavourite(data){
      const { restaurant_id, setState } = data;
      let dt = await this.$store.dispatch('user/userFavouritesToggleStore', {
        store_id:restaurant_id,
      })
      console.log(dt)
      if(dt.ok){
          let message = setState === true ? 'New favourite added' : 'Store removed';
          this.$toast.open({
            message,
            type:'dark',
          })
      }else{
        
      }
    }
  }
}
</script>
<style>
.home-body-wrapper{
    width:100%;
    display:grid;
    grid-template-columns:7fr 5fr;
    height:90vh;
    position:relative;
    background:var(--app-prim-light)
}

.home-body-placeholder{
  height:90vh;
  width:100%;
}

.home-results-wrapper, .home-map-wrapper{
    width:100%;
    height:100%;
    overflow-y:scroll;
    padding-top:1em;
}

.home-map-wrapper{
  overflow-y:hidden;
  padding:0;
  background:var(--app-prim-black);
}

.home-results-header{
  width:100%;
  padding-top:0.5em;
  padding-bottom:0.5em;
}

.home-main-heading{
  font-size:var(--app-text-xl);
  font-weight:600;
  margin:0px;
  text-transform:capitalize;
}

.home-main-heading-placeholder{
  height:var(--app-text-xl);
  width:25%;
}

.home-results-display{
  width:100%;
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:0.5em;
}

@media(max-width:992px) {
  .home-body-wrapper{
    grid-template-columns:1fr;
    height:fit-content;
  }

  .home-results-wrapper{
    overflow-y:hidden;
  }

  .home-results-display{
    grid-template-columns:1fr;
  }
}

</style>