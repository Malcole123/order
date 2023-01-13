<template>
    <MainWrapper>
      <template v-slot:navbar>
          <ApplicationNavbarVue
          :pageLoading="state.pageLoading"
          />
      </template>
      <template v-slot:body>
            <div class="order-app-body" v-if="successLoad">
                <div class="empty-order-display" v-if="myOrders.total_orders === 0">
                    <span class="material-symbols-outlined">
                        menu_book
                    </span>
                    <h1 class="order-app-large-heading">You Have No Orders</h1>
                    <p>Your orders will appear here after checkout</p>
                </div>
                <div class="full-width order-display-wrapper app-container-fluid" v-else>
                    <div class="full-width">
                        <h1 class="order-app-large-heading">Your Orders</h1>
                        <div class="order-filter-area">
                            <div class="order-filter-component">
                                <span class="order-filter-selection" 
                                :class="filter==='pending' ? class_.filterActiveClass : ''"
                                @click="setFilterVal('pending')"
                                >
                                    Pending
                                </span>
                                <span class="order-filter-selection" 
                                :class="filter==='in_progress' ? class_.filterActiveClass : ''"
                                @click="setFilterVal('in_progress')"
                                >
                                    In Progress
                                </span>
                                <span class="order-filter-selection" 
                                :class="filter==='completed' ? class_.filterActiveClass : ''"
                                @click="setFilterVal('completed')"
                                >
                                    Completed
                                </span>
                            </div>
                        </div>
                        <div class="full-width order-result-wrapper" v-if="myOrders.orders.length > 0">
                            <div class="full-width" v-for="(order,index) in myOrders.orders" :key="'filtered-order-'+index">
                                <OrderResultDisplayCard
                                    :order="order"
                                />
                            </div>
                        </div>
                        <div class="empty-order-display" v-else>
                    <span class="material-symbols-outlined">
                        menu_book
                    </span>
                    <h1 class="order-app-large-heading">No Orders Found</h1>
                    <p>Your orders will appear here after checkout</p>
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


export default {
  auth:false,
  name: 'your_orders_page',
  head(){
    return {
      title:"Your Orders",
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
