<template>
    <MainWrapper>
      <template v-slot:navbar>
          <ApplicationNavbarVue
          :pageLoading="state.pageLoading"
          />
      </template>
      <template v-slot:body>
            <div class="order-app-body" v-if="successLoad">
                <div class="full-width order-display-wrapper app-container-fluid">
                    <div class="full-width">
                        <h1 class="order-app-large-heading">Favourites</h1>
                        <div class="order-filter-area">
                            <div class="order-filter-component">
                                <span class="order-filter-selection" 
                                :class="filter==='pending' ? class_.filterActiveClass : ''"
                                @click="setFilterVal('pending')"
                                >
                                    All
                                </span>
                                <span class="order-filter-selection" 
                                :class="filter==='in_progress' ? class_.filterActiveClass : ''"
                                @click="setFilterVal('in_progress')"
                                >
                                    Store
                                </span>
                                <span class="order-filter-selection" 
                                :class="filter==='completed' ? class_.filterActiveClass : ''"
                                @click="setFilterVal('completed')"
                                >
                                    Products
                                </span>
                            </div>
                        </div>
                        <div class="full-width order-result-wrapper">
                           
                        </div>
                    
                    </div>
                </div>
            </div>
      </template>
    </MainWrapper>
 
</template>

<script>
import ApplicationNavbarVue from '~/components/Navbars/ApplicationNavbar.vue';
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue';
import OrderResultDisplayCard from '~/components/Cards/DisplayCards/OrderResultDisplayCard.vue'
import RedeemOrderItemDisplayCard from '~/components/Cards/DisplayCards/RedeemOrderItemDisplayCard.vue';

export default {
  name: 'your_favourites_pages',
  head(){
    return {
      title:"Your Favourites",
    }
  },
  async asyncData({$axios, route, store, env, params, query, req, res, redirect, error}) {    
    let xReq_ = await store.dispatch('user/getMyOrders');
    return{
        successLoad:xReq_.ok,
    }
  },
  data(){
    return {
      state:{
        pageLoading:true,
      },
      all_orders:[],
      filter:"pending",
      class_:{
        filterActiveClass:"order-filter-active"
      }
    }
  },
  fetchOnServer:false,
  fetch(){
    //Check queries
    let query = this.$route.query;
    if(typeof query === 'object'){
        const { type } = query;
        if(type === 'pending' || type === 'in_progress' || type === 'completed'){
            this.filter = type;
        }
    }
    this.userDelayAction(()=>{
      this.state.pageLoading = false;
    }, 600)
  },
  components:{
    MainWrapper,
    ApplicationNavbarVue,
    SquareDisplayCard,
    RestaurantDisplayCard,
    OrderResultDisplayCard,
    RedeemOrderItemDisplayCard,
  },
  methods:{
    userDelayAction(callback, time){
      setTimeout(()=>{
          callback()
      }, time)
    },
    setFilterVal(val){
        this.filter = val;
    },
  },
  computed:{
    myOrders(){
        //Returns getter function that filters by type
        let orders = this.$store.getters['user/seeMyOrders'];
        let called_ = orders(this.filter)
        return {
            orders:called_.orders,
            total_orders:called_.total
        }
    }
  },
}
</script>

<style>
.order-app-body{
    padding-top:1em;
    height:fit-content;
    width:100%;
    padding-bottom:60px;
}

.empty-order-display{
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    height:80vh;
    width:100%;
    gap:1em;
}


.empty-order-display > .material-symbols-outlined{
    font-size:var(--app-text-2xl)
}


.empty-order-display > .order-app-large-heading{
    font-size:var(--app-text-2xl)
}


.order-display-wrapper{
    min-height:90vh;
    width:100%;
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:1em;
}

.order-filter-area{
    width:100%;
    height:fit-content;
    padding:1em 0em;
    position:sticky;
    top:69px;
    background:var(--app-background);
    z-index:3;
}

.order-filter-component{
    height:3em;
    width:100%;
    border-radius:12px;
    background:var(--app-platinum);
    display:grid;
    grid-template-columns:repeat(3,1fr);
    overflow:hidden;
}


.order-filter-selection{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    border-left:0.1px solid var(--app-grey);
    border-right:0.1px solid var(--app-grey);
    transition:0.3s ease-in-out;
    cursor:pointer;
}

.order-filter-active{
    background:var(--app-prim-black);
    color:var(--app-prim-light)
}

.order-result-wrapper{
    display:flex;
    flex-direction:column;
    gap:1em;
}

.order-result-card-content{
    width:100%;
    height:100%;
}

@media (max-width:992px) {
    
    .order-display-wrapper{
        grid-template-columns:1fr;
        gap:0em;
    }

    .order-filter-component{
        height:3em;
        width:100%;
    }

}


</style>
