<template>
    <MainWrapper>
      <template v-slot:navbar>
          <ApplicationNavbarVue/>
      </template>
      <template v-slot:body>
       
      </template>
    </MainWrapper>
 
</template>

<script>
import ApplicationNavbarVue from '~/components/Navbars/ApplicationNavbar.vue';
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue';

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
  components:{
    MainWrapper,
    ApplicationNavbarVue,
    SquareDisplayCard,
    RestaurantDisplayCard,
  }
}
</script>
<style>
.home-body-wrapper{
    width:100%;
    display:grid;
    grid-template-columns:7fr 5fr;
    height:88vh;
    position:relative;
    background:var(--app-prim-light)
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

}

</style>