<template>
    <MainWrapper>
      <template v-slot:navbar>
          <BareNavbarVue
          :pageLoading="state.pageLoading"
          :hideCart="true"
          />
      </template>
      <template v-slot:body>

      </template>
      <template v-slot:footer>
          <StandardFooter/>
      </template>
    </MainWrapper>
 
</template>

<script>

import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue';
import StandardFooter from '~/components/Footers/StandardFooter.vue';
import BareNavbarVue from '~/components/Navbars/BareNavbar.vue';

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
      },
      successLoad:false,
      pageData:{
        homeResults:[],
      }
    }
  },
  fetchOnServer:false,
  async fetch(){
    this.userDelayAction(()=>{
      this.state.pageLoading = false;
    }, 600)
  },
  components:{
    MainWrapper,
    SquareDisplayCard,
    RestaurantDisplayCard,
    StandardFooter,
    BareNavbarVue,
  },
  methods:{
    userDelayAction(callback, time){
      setTimeout(()=>{
          callback()
      }, time)
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
  }
}
</script>
<style>


</style>