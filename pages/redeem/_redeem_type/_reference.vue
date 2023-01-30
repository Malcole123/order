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
            <div
              class="full-width redeem-result-container app-md-spacing"
              v-for="(oRest, index) in uiFormatted.formattedArr"
              :key="`rest-order-${index}`"
            >
              <div class="full-width app-flex app-flex-between-row">
                <h3>{{ oRest.restaurant_name }}</h3>
                <MazBtn
                  size="mini"
                  color="black"
                  @click="
                    redeemAllByStore(
                      oRest.restaurant_ref,
                      oRest.restaurant_name,
                      oRest.order_items,
                    )
                  "
                  >Redeem All</MazBtn
                >
              </div>
              <div class="full-width app-grid app-grid-duo app-md-spacing">
                <div
                  class="full-width"
                  v-for="(oItem, oIndex) in oRest.order_items"
                  :key="`order-item-${oIndex}`"
                >
                  <RedeemOrderItemDisplayCard
                    :image="oItem.productImage"
                    :title="oItem.productName"
                    :quantity="oItem.item.quantity"
                    :priceStr="oItem.priceStr"
                    :description="oItem.description"
                    :order_addons="oItem.item.addons"
                    :included_items="oItem.includedItems"
                    :special_instruction="oItem.item.special_instruction"
                  >
                  </RedeemOrderItemDisplayCard>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div :class="actionClass">
          <div class="redeem-action-parent-container">
            <div class="redeem-action-header app-container-fluid">
            <MazBtn color="black" size="mini" @click="toggleActionWrapper(false)"
              >Close</MazBtn
            >
            </div>
          <div
            class="redeem-action-container app-container-fluid"
            v-if="qrComponent.visible === true"
          >
            <p>
              {{ qrComponent.title }}
            </p>
            <div class="redeem-scanner-display">
              <AppQrCode :text="qrComponent.link" />
            </div>
            <div class="redeem-scanner-code">
              {{ pageData.order.redeem_code }}
            </div>
            <p>
              Scan the qr code or provide the code above to redeem your order
            </p>
          </div>

             <!--Loader--> 
            <div class="redeem-action-loader" v-if="qrComponent.loader.visible === true">
              <div class="redeem-action-loader-container">
                <div class="redeem-action-loader-header">
                  <MazBtn color="white" size="mini" @click="toggleActionWrapper(false)"
              >Close</MazBtn>
                </div>
                <div>
                  <MazLoader
                  color="white"
                  :dark="true"
                  v-if="qrComponent.loader.showLoader"
                  />
                  <span class="redeem-action-status-icon" v-else>
                    <span class="material-icons">
                      verified
                    </span>
                  </span>
                </div>
                <h5 class="redeem-action-loader-status">
                  {{ qrComponent.loader.status }}
                </h5>
                <p class="redeem-action-loader-description">
                  {{ qrComponent.loader.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="redeem-body-placeholder" v-else></div>
    </template>
  </MainWrapper>
</template>

<script>
import MainWrapper from '~/components/Wrapper/MainWrapper.vue'
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue'
import StandardFooter from '~/components/Footers/StandardFooter.vue'
import BareNavbarVue from '~/components/Navbars/BareNavbar.vue'

import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue';
import RedeemOrderItemDisplayCard from '~/components/Cards/DisplayCards/RedeemOrderItemDisplayCard.vue';
export default {
  name: 'redeemByTypeByReference',
  head() {
    return {
      title: 'Redeem',
      script: [
        {
          src: `https://cdn.socket.io/4.5.4/socket.io.min.js`,
          callback: () => {},
          async: true,
        },
      ],
    }
  },
  async asyncData({
    $axios,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error,
  }) {
    let url_ = process.env.NUXT_ENV_IDENTIFY_MY_ORDER
    let reference_ = params.reference
    let dt_ = await $axios
      .$get(url_, {
        progress: false,
        params: {
          reference: reference_,
        },
      })
      .then((data) => {
        return {
          successLoad: true,
          pageData: data,
        }
      })
      .catch((err) => {
        return {
          successLoad: false,
        }
      })
    return dt_
  },
  fetchOnServer: false,
  fetch() {

    this.formatData();
    this.initiateSocket();
  },
  data() {
    return {
      state: {
        pageLoading: true,
      },
      successLoad: true,
      uiFormatted: {
        formattedArr: [],
      },
      qrComponent: {
        focus_title: '',
        visible: false,
        link: '',
        title: 'Scan',
        loader:{
          visible:false,
          status:"Verifying Your Order",
          description:"Your order is being processed.",
          showLoader:true,
        }
      },
      redeem:{
        fetching:false,
        data:{
          valid:true,
          redeem_check_arr:[
            /*
              {
                id:"",
                valid:false,
                last_checked:0,
              }
            */
          ]
        }
      },
      actionOpen: false,
      socket:{
        instance:{},
      }
    }
  },
  components: {
    MainWrapper,
    SquareDisplayCard,
    StandardFooter,
    BareNavbarVue,
    RestaurantDisplayCard,
    RedeemOrderItemDisplayCard,
  },
  methods: {
    userDelayAction(callback, time) {
      setTimeout(() => {
        callback()
      }, time)
    },
    getCurrentLocation(returnFunc) {
      let location = navigator.geolocation.getCurrentPosition(
        //Success
        (pos) => {
          returnFunc({
            success: true,
            data: pos,
          })
        },
        //Error
        (err) => {
          returnFunc({
            success: false,
            err: err,
          })
        },
        //Options
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      )
      return location
    },
    priceFormatter(currency, amount) {
      let form = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      })
      return form.format(amount)
    },
    formatData() {
      let store_references = []
      let order_items = [...this.pageData.order.order_items]
      let filtered_arr = []
      //Map to set;
      let clean_arr = order_items
        .map((item, index) => {
          const { store_details } = item.item.product_details
          //UI Format
          let set_obj = {
            restaurant_name: store_details.name.long,
            restaurant_ref: store_details.store_reference,
            order_items: order_items.filter((oItem, i) => {
              //Find all related items by rest.
              if (
                oItem.item.product_details.store_details.store_reference ===
                store_details.store_reference
              ) {
                return item
              }
            }),
          }
          //Format to show variant name
          set_obj.order_items
            .map((setItem, setIndex) => {
              //Find name of product using product variants
              let variant = setItem.item.product_details.variants.find(
                (vItem, vIndex) => {
                  if (
                    vItem.variant_reference == setItem.item.selection_reference
                  ) {
                    return vItem
                  }
                  //Set false for no found for filterr
                }
              )
              if (variant === undefined) {
                return false
              } else {
                //Use to reference to display to ui
                setItem.productName = variant.name
                if (variant.image !== null) {
                  setItem.productImage = variant.image.url
                } else {
                  setItem.productImage =
                    setItem.item.product_details.image !== null
                      ? setItem.item.product_details.image.url
                      : ''
                }
                let addon_total = setItem.item.addons.length > 1 ?
                setItem.item.addons.map(a_item=>{ return a_item.quantity * a_item.price.amount}).reduce((prev,next)=>{
                  return prev + next 
                })
                : 0
                setItem.includedItems = variant.included_items;
                setItem.description = variant.description
                setItem.priceStr = this.priceFormatter(
                  variant.currency,
                  (variant.amount * setItem.item.quantity) + addon_total
                )
          
                return setItem
              }
            })
            .filter((filterItem, filteredIndex) => {
              if (filterItem !== false) {
                return filterItem
              }
            })

          if (
            store_references.includes(store_details.store_reference) === false
          ) {
            store_references.push(set_obj.restaurant_ref)
            return set_obj
          }
        })
        .filter((fItem, i) => {
          if (fItem !== undefined) {
            return fItem
          }
        })
      this.uiFormatted.formattedArr = clean_arr;
    },
    createQrLink({ path }) {
      let base_ = process.env.NUXT_ENV_RIDER_STORE_BROWSER_BASE_URL
      this.qrComponent.link = `${base_}/${path}`
    },
    async redeemAllByStore(restRef, restName, order_items) {
      this.actionOpen = true
      this.qrComponent.title = restName
      let order_reference = this.pageData.order.order_reference
      let order_redeem_reference = this.pageData.order.redeem_reference;
      //Show component area 
      this.qrComponent.visible = true;
      this.formatQRLoaderOverlay({
        loaderVisible:true,
        showLoaderSpinner:true,
        loaderDescription:"Checking your items for this restaurant",
        loaderStatusMsg:"Boop beep boop",
      })
      //Checks all order items to see if items can still be redeemed for restaurant
      let allow_redeem = this.checkOrderItemStatus(order_items);
      if(allow_redeem){
        this.userDelayAction(()=>{
          this.formatQRLoaderOverlay({loaderVisible:false});
        }, 700)
      }else{
        this.userDelayAction(()=>{
          this.formatQRLoaderOverlay({
                loaderVisible:true,
                showLoaderSpinner:false,
                loaderDescription:"All items in this order belonging to this restaurant have been redeemed.",
                loaderStatusMsg:"Success",
              })          
          }, 700)
      }
      this.createQrLink({
        path: `store/orders/redeem/${order_reference}/${order_redeem_reference}`,
      })
    },
    toggleActionWrapper(state) {
      this.actionOpen = state;
    },
    initiateSocket(){
      let url = process.env.NUXT_ENV_SOCKET_BASE_URL;
      let order_reference_ = this.pageData.order.order_reference
      let order_redeem_reference_ = this.pageData.order.redeem_reference;

          let socketOptions = {
              forceNew:true,
              path:"/socket.io/"
          }
          let io_ = new io( url, socketOptions );
          this.socket.instance = io_;
        try{
          this.socket.instance.on('connect', ()=>{
            console.log('has connected')
          })

          this.socket.instance.on('connect_error', (err)=>{
            console.log(err)
          })

          this.socket.instance.on('order_redeem_pending' , ({order_reference, redeem_reference})=>{
            if((order_reference === order_reference_ && redeem_reference === order_redeem_reference_)){
              this.formatQRLoaderOverlay({
                  loaderVisible:true,
                  showLoaderSpinner:true,
                  loaderDescription:"Your order is being processed",
                  loaderStatusMsg:"Cracking Some Eggs",
              })
            }

          })

          this.socket.instance.on('order_complete', (data)=>{
            const {order_reference, redeem_reference} = data;
            console.log({order_reference,redeem_reference})
            if((order_reference === order_reference_ && redeem_reference === order_redeem_reference_)){
              this.successScanHandle();
            }
          })
        }catch(err){
          //console.log(err);
          this.$toast.open({
            message:"Somethign went wrong",
            type:'error',
          })
        }
    },
    async verifyOrderItemsFulfill(order_items){
      //INACTIVE
      //Format for loading 
      let order_id = order_items[0].for_order;
      this.redeem.fetching = true;
      //Verifies all order items of restaurant to see if redeem is possible
      let check_item_ids = [...order_items].map((item,index)=>{
        return item.id;
      });
      let url = process.env.NUXT_ENV_VERIFY_ORDER_ITEMS;
      await this.$axios.$post(url, {
        order_id:order_id,
        order_reference:"",
        order_item_ids:check_item_ids,
      }).then(data=>{
        let valid_redeem = [...data.order_items].filter((item,index)=>{
            if(item.order_progress === 'user_fulfill_pending'
            || item.order_progress === 'store_pending'
            ){
              return item 
            }
          });
          if(valid_redeem.length === order_items.length){
       
          }else{
 
          }
      }).catch(err=>{
        this.formatQRLoaderOverlay({loaderVisible:false})
        this.redeem.data.valid = false;
        this.$toast.open({
          message:"Something went wrong.",
          type:'error'
        })
      })
    },
    checkOrderItemStatus(order_items){
      //Checks fetched order items to see if items are still pending
      let can_be_redeemed = [...order_items].filter((item,index)=>{
        if(item.order_progress === 'store_pending' || item.order_progress === 'store_complete'
        || item.order_progress === 'user_fulfill_pending'){
          return item ;
        }
      });
      if(can_be_redeemed.length === order_items.length){
        return true ;
      }else{
        return false;
      }
    },
    restrictFulfilIdentify(id){
      let foundItem = this.redeem.data.redeem_check_arr.find((item,index)=>{
        ///Checks if the item matches the id and the qr code has not been scanned
          if(item.id === id && item.recentScan === false){
            return item 
          }
      });
      if(foundItem === undefined){
        return  true
      }else{
        return false;
      }
    },

    //Test start
    testScan(){
      //this.qrComponent.loader.visible = true;
      this.socket.instance.emit('get_redeem_response', {
        order_reference:this.pageData.order.order_reference,
        redeem_reference:this.pageData.order.redeem_reference,
      })
    },
    successScanHandle(){
      this.formatQRLoaderOverlay({
          loaderVisible:true,
          showLoaderSpinner:false,
          loaderDescription:"All items in this order belonging to this restaurant have been redeemed.",
          loaderStatusMsg:"Success",
      })

    },
    formatQRLoaderOverlay({loaderVisible , showLoaderSpinner , loaderDescription , loaderStatusMsg }){
        this.qrComponent.loader.visible = loaderVisible;
        this.qrComponent.loader.showLoader = showLoaderSpinner;
        this.qrComponent.loader.description = loaderDescription;
        this.qrComponent.loader.status = loaderStatusMsg;
    },


    //Test end
  },
  computed: {
    actionClass() {
      let class_arr = ['redeem-action-wrapper']
      if (this.actionOpen === true) {
        class_arr.push('redeem-action-active')
      }
      let class_str = class_arr.join(' ')
      return class_str
    },
  },
  mounted(){
    
  },
  watch:{
 
  }
}
</script>
<style>
.redeem-body-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: 7fr 5fr;
  height: 90vh;
  position: relative;
  background: var(--app-prim-light);
}

.redeem-body-placeholder {
  height: 90vh;
  width: 100%;
}

.redeem-results-wrapper,
.redeem-action-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-top: 1em;
}

.redeem-action-wrapper {
  overflow-y: hidden;
  padding: 0;
  background: var(--app-prim-light);
}


.redeem-action-parent-container{
    width:100%;
    position:relative;
    height:100%;
}

.redeem-action-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: center;
  align-items: center;
}

.redeem-result-container {
  display: flex;
  flex-direction: column;
  gap: 2em;
  border-bottom: 1px solid var(--app-grey);
  padding-top: 1em;
  padding-bottom: 2em;
}

.redeem-scanner-display {
  width: fit-content;
  height: fit-content;
  border: 2px solid var(--app-prim-black);
  border-radius: 4%;
  padding: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.redeem-scanner-code {
  width: 50%;
  height: fit-content;
  font-size: var(--app-text-xl);
  font-weight: 600;
  padding: 0.4em 0.8em;
  border: 2px solid var(--app-prim-black);
  background: var(--app-prim-black);
  color: var(--app-prim-light);
  border-radius: 4%;
  display: flex;
  justify-content: center;
}

.redeem-action-header {
  display: none;
  justify-content: flex-end;
}

.redeem-action-loader{
  position:absolute;
  top:0;
  left:0;
  width:0;
  right:0;
  height:100%;
  width:100%;
  background:black;
}

.redeem-action-loader-container{
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  gap:0.4em;
  align-items:center;
  justify-content:center;
}

.redeem-action-loader-status{
  color:var(--app-prim-light);
  font-size:var(--app-text-xl)
}


.redeem-action-loader-description{
  font-size:var(--app-text-xs);
  color:var(--app-prim-light);
  width:75%;
  text-align:center;
}


.redeem-action-status-icon .material-icons{
  font-size:var(--app-text-3xl);
  color:var(--app-prim-light)
}

.redeem-action-loader-header{
  position:absolute;
  top:1%;
  right:1%;
  z-index:2;
}

.restaurant-display-item {
  font-size: var(--app-text-base);
  font-weight: 600;
}

.card-text-sml{
  font-size:var(--app-text-xs);
}

.restaurant-display-description {
  font-size: var(--app-text-xs);
}

@media (max-width: 992px) {
  .redeem-body-wrapper {
    grid-template-columns: 1fr;
    height: fit-content;
  }

  .redeem-results-wrapper {
    overflow-y: hidden;
  }

  .redeem-action-wrapper {
    position: fixed;
    top: 0px;
    right: -100%;
    height: 100%;
    width: 100%;
    z-index: 999;
    transition: 0.3s ease-in-out;
  }

  .redeem-action-active {
    right: 0px;
  }

  .redeem-action-header {
    display: flex;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }
}
</style>