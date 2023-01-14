<template>
    <MainWrapper>
      <template v-slot:navbar>
          <BareNavbarVue
          :pageLoading="state.pageLoading"
          :hideCart="true"
          :showBack="true"
          />
      </template>
      <template v-slot:body>
        <div class="redeem-body-wrapper" v-if="successLoad === true">
            <div class="redeem-results-wrapper app-container-fluid">
                <div class="full-width redeem-result-container">
                    <div class="full-width">
                        <h1>Your Order</h1>
                        <p>You can redeem your items here</p>
                    </div>
                    <div class="full-width redeem-result-container app-md-spacing" v-for="(oRest,index) in uiFormatted.formattedArr" :key="`rest-order-${index}`">
                        <div class="full-width app-flex app-flex-between-row">
                            <h3>{{ oRest.restaurant_name }}</h3>
                            <MazBtn size="mini" color="black" @click="redeemAllByStore(oRest.restaurant_ref , oRest.restaurant_name)">Redeem All</MazBtn>
                        </div>
                        <div class="full-width app-grid app-grid-duo app-md-spacing">
                            <div class="full-width" v-for="(oItem,oIndex) in oRest.order_items" :key="`order-item-${oIndex}`">
                                <RestaurantDisplayCard
                                    :image="oItem.productImage"
                                    :reviews="[]"
                                    :numLocations="2"
                                >
                                    <template v-slot:card_content>
                                        <div class="full-width app-flex app-flex-column app-sm-spacing">
                                            <div class="full-width app-flex app-flex-between-row">
                                                <h6 class="restaurant-display-item">{{`${oItem.item.quantity} x ${oItem.productName}` }}</h6>
                                                <h6 class="restaurant-display-item">{{`${oItem.priceStr}` }}</h6>
                                            </div>
                                            <div class="full-width">
                                                <p>
                                                    {{ oItem.item.description }}
                                                </p>
                                            </div>
                                            <div class="full-width">

                                            </div>
                                        </div>
                                    </template>
                            
                                </RestaurantDisplayCard>
                            </div>
                        </div>
                    </div>
                </div>             
            </div>
            <div :class="actionClass">
                <div class="redeem-action-header app-container-fluid">
                    <MazBtn 
                    color="black" 
                    size="mini"
                    @click="disableActionWrapper"
                    >Close</MazBtn>
                </div>
                <div class="redeem-action-container app-container-fluid" v-if="qrComponent.visible === true">
                    <p>
                        {{ qrComponent.title }}
                    </p>
                    <div class="redeem-scanner-display">
                        <AppQrCode
                            :text="qrComponent.link"
                        />
                    </div>
                    <div class="redeem-scanner-code">
                        {{ pageData.order.redeem_code }}
                    </div>
                    <p>Scan the qr code or provide the code above to redeem your order</p>
                </div>
            </div>
        </div>
        <div class="redeem-body-placeholder" v-else></div>
      </template>

    </MainWrapper>
 
</template>

<script>
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import StandardFooter from '~/components/Footers/StandardFooter.vue';
import BareNavbarVue from '~/components/Navbars/BareNavbar.vue';

import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue';
export default {
  auth:false,
  name: 'redeemByTypeByReference',
  head(){
    return {
      title:"Redeem",
    }
  },
  async asyncData({$axios, route, store, env, params, query, req, res, redirect, error}) {
        let url_ = process.env.NUXT_ENV_IDENTIFY_MY_ORDER;
        let reference_ = params.reference;
        let dt_ = await $axios.$get(url_, {progress:false,params:{
            reference:reference_,
        }}).then(data=>{
            return {
                successLoad:true,
                pageData:data,
            }
        }).catch(err=>{
            return {
                successLoad:false,
            }
        });
        return dt_;
    },
    fetchOnServer:false,
    fetch(){
        this.formatData();
    },
  data(){
    return {
      state:{
        pageLoading:true,
      },
      successLoad:true,
      uiFormatted:{
        formattedArr:[],
      },
      qrComponent:{
        focus_title:"",
        visible:false,
        link:"",
        title:"Scan"
      },
      actionOpen:false,
    }
  },
  components:{
    MainWrapper,
    SquareDisplayCard,
    StandardFooter,
    BareNavbarVue,
    RestaurantDisplayCard,
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
      priceFormatter(currency,amount){
            let form = new Intl.NumberFormat('en-US', {style:'currency',currency:currency});
            return form.format(amount)
        },
      formatData(){
        let store_references = [];
        let order_items = [...this.pageData.order.order_items];
        let filtered_arr = [];
        //Map to set;
        let clean_arr = order_items.map((item,index)=>{
            const { store_details } = item.item.product_details ;
            //UI Format
            let set_obj = {
                restaurant_name:store_details.name.long,
                restaurant_ref:store_details.store_reference,
                order_items:order_items.filter((oItem,i)=>{
                    //Find all related items by rest. 
                    if(oItem.item.product_details.store_details.store_reference === store_details.store_reference){
                        return item;
                    }
                }),
            };
            //Format to show variant name
            set_obj.order_items.map((setItem, setIndex)=>{
                //Find name of product using product variants 
                let variant = setItem.item.product_details.variants.find((vItem,vIndex)=>{
                        if(vItem.variant_reference == setItem.item.selection_reference){
                            return vItem;
                        };
                        //Set false for no found for filterr
                });
                if(variant === undefined){
                    return false
                }else{
                    //Use to reference to display to ui
                    setItem.productName = variant.name;
                    if(variant.image !== null){
                        setItem.productImage = variant.image.url;
                    }else{
                        setItem.productImage = 
                        setItem.item.product_details.image !== null
                        ? setItem.item.product_details.image.url 
                        : 
                         "";
                    };
                    setItem.includedItems = variant.included_items;
                    setItem.description = variant.description;
                    setItem.priceStr = this.priceFormatter(variant.currency, variant.amount * setItem.item.quantity)
                    return setItem
                }
            }).filter((filterItem,filteredIndex)=>{
                if(filterItem !== false){
                    return filterItem;
                }
            });

            if(store_references.includes(store_details.store_reference) === false){
                store_references.push(set_obj.restaurant_ref);
                return set_obj;
            }

        }).filter((fItem,i)=>{
            if(fItem !== undefined){
                return fItem;
            }
        });
        this.uiFormatted.formattedArr = clean_arr;
      },
      createQrLink({path}){
        let base_ = process.env.NUXT_ENV_RIDER_STORE_BROWSER_BASE_URL;
        this.qrComponent.link = `${base_}/${path}`;
      },
      redeemAllByStore(restRef, restName){
        this.actionOpen = true;
        this.qrComponent.title = restName;
        let order_reference = this.pageData.order.order_reference;
        let order_redeem_reference = this.pageData.order.redeem_reference;
        let restaurant_reference = restRef;
        let path_arr = [order_reference , order_redeem_reference];
        console.log(path_arr)
        let path_clean = path_arr.filter((item,index)=>{
            if(item !== undefined){
                return item;
            }
        });
        let path_str = path_clean.join('/');
        this.qrComponent.visible = true;
        this.createQrLink({
            path:`store/orders/redeem/${path_str}`,
        })
      },
      disableActionWrapper(){
        this.actionOpen = false;
      } 
  },
  computed:{
    actionClass(){
        let class_arr = ['redeem-action-wrapper'];
        if(this.actionOpen === true){
            class_arr.push('redeem-action-active')
        }
        let class_str = class_arr.join(' ')
         return class_str;
    }
  }
}
</script>
<style>
.redeem-body-wrapper{
    width:100%;
    display:grid;
    grid-template-columns:7fr 5fr;
    height:90vh;
    position:relative;
    background:var(--app-prim-light)
}

.redeem-body-placeholder{
  height:90vh;
  width:100%;
}

.redeem-results-wrapper, .redeem-action-wrapper{
    width:100%;
    height:100%;
    overflow-y:scroll;
    padding-top:1em;
}

.redeem-action-wrapper{
  overflow-y:hidden;
  padding:0;
  background:var(--app-prim-light);
}

.redeem-action-container{
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    gap:1em;
    justify-content:center;
    align-items:center;
}

.redeem-result-container{
    display:flex;
    flex-direction:column;
    gap:2em;
    border-bottom:1px solid var(--app-grey);
    padding-top:1em;
    padding-bottom:2em;
}


.redeem-scanner-display{
    width:fit-content;
    height:fit-content;
    border:2px solid var(--app-prim-black);
    border-radius:4%;
    padding:1.5em;
    display:flex;
    align-items:center;
    justify-content:center;
}

.redeem-scanner-code{
    width:50%;
    height:fit-content;
    font-size:var(--app-text-xl);
    font-weight:600;
    padding:0.4em 0.8em;
    border:2px solid var(--app-prim-black);
    background:var(--app-prim-black);
    color:var(--app-prim-light);
    border-radius:4%;
    display:flex;
    justify-content:center;

}

.redeem-action-header{
    display:none;
    justify-content:flex-end;
}


.restaurant-display-item{
    font-size:var(--app-text-base);
    font-weight:600;
}

.restaurant-display-description{
    font-size:var(--app-text-xs);

}


@media(max-width:992px) {
  .redeem-body-wrapper{
    grid-template-columns:1fr;
    height:fit-content;
  }

  .redeem-results-wrapper{
    overflow-y:hidden;
  }

  .redeem-action-wrapper{
    position:fixed;
    top:0px;
    right:-100%;
    height:100%;
    width:100%;
    z-index:999;
    transition:0.3s ease-in-out;
  }

  .redeem-action-active{
    right:0px;
  }

  .redeem-action-header{
    display:flex;
    padding-top:0.5em;
    padding-bottom:0.5em;
  }


}

</style>