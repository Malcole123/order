<template>
  <MainWrapper>
    <template v-slot:navbar>
      <BareNavbar 
      :hideCart="true"
      :showBack="false"
      />
    </template>
    <template v-slot:body>
      <div class="checkout-body app-container" v-if="successLoad">
        <div
          class="checkout-confirm-container app-md-spacing"
          v-if="pageData.order.fulfill_type === 'delivery'"
        >
          <div class="full-width checkout-body-section">
            <div class="full-width checkout-confirm-header">
              <h1>Almost Ready</h1>
              <p>Pay for your order to continue.</p>
            </div>
            <div class="full-width app-mt-3">
                <!--Courier display -->
            </div>
          </div>
          <div class="full-width checkout-body-section">
            <div class="full-width checkout-cart-preview checkout-body-section">
              <div class="full-width">
                <h3 class="checkout-heading">Complete Checkout</h3>
              </div>
              <div class="full-width checkout-body-section">
                <div class="full-width" 
                v-for="(detail,index) in checkoutState.checkout_summary"
                :key="`detail-item-`+ index"
                >
                <!--Single Start-->
                    <div class="full-width app-flex app-flex-between-row" v-if="detail.type === 'single'">
                      <p class="checkout-preview-description">
                        {{ detail.description }}
                      </p>
                    </div>
              
                    <!--Duo Start-->
                    <div class="full-width app-flex app-flex-between-row" v-else>
                      <div class="checkout-preview-heading">{{ detail.text_left }}</div>
                      <div class="checkout-preview-heading-bold">{{ detail.text_right }}</div>
                    </div>
                    <!--Divider-->
                    <div class="full-width component-padding">
                      <div class="checkout-divider"></div>
                    </div>
                </div>
              
                <div class="full-width" id="payment_checkout_container">
                  <!--New Component-->
                </div>
           
              </div>
            </div>
        
          </div>
        </div>
        <div
          class="checkout-confirm-container app-md-spacing"
          v-else-if="pageData.order.fulfill_type === 'pick_up'"
        >
          <div class="full-width checkout-body-section">
            <div class="full-width checkout-confirm-header">
              <h1>Confirm Pick Up Location</h1>
              <p>Confirm your pick up location for your order items.</p>
            </div>
            <div class="full-width app-mt-3">
              <div
                class="full-width app-mt-3"
                v-for="(store, index) in displayData.store_item_redeem"
                :key="`store-item-${index}`"
              >
                <div class="full-width">
                  <h3>{{ store.name }}</h3>
                </div>
                <div class="full-width app-mt-3">
                  <div class="full-width app-grid app-grid-duo app-md-spacing">
                    <div
                      class="full-width"
                      v-for="(locItem, locIndex) in store.locations"
                      :key="`location-card-${locIndex}`"
                    >
                      <!--List Component-->
                      <SquareDisplayCard
                        :image="store.store_image"
                        :reviews="[]"
                      >
                        <template v-slot:card_body_content>
                          <div class="checkout-location-card-content">
                            <div class="checkout-location-items-wrapper">
                              <MazAvatar
                                v-for="(oItem, oIndex) in store.order_items"
                                :key="`order-item-${oIndex}`"
                                :src="oItem.item.product_details.image.url"
                                :size="35"
                                :bordered="true"
                              />
                            </div>
                            <div
                              class="full-width app-flex app-flex-between-row"
                            >
                              <div class="width-75">
                                <div
                                  class="full-width"
                                >
                                  <p class="order-app-heading order-app-capitalize">{{ locItem.name }}</p>
                                  <small>
                                    {{ locItem.address_string }}
                                  </small>
                                </div>
                                <!--description _class redeem-card-desc-->
                              </div>
                              <span>
                                <MazBtn
                                  v-if="locItem.location_selected === true"
                                  color="black"
                                  size="mini"
                             
                                  >Selected</MazBtn>
                                  <MazBtn
                                  v-else
                                  color="black"
                                  size="mini"
                                  outline
                                  @click="selectLocation(index, locIndex)"
                                  >Select</MazBtn>
                              </span>
                            </div>
                          </div>
                        </template>
                      </SquareDisplayCard>

                      <!--List Component End-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="full-width checkout-body-section">
            <div class="full-width" v-if="checkoutState.ready === false">
                <lottie-vue-player
                :src="`https://lottie.host/7e9186c0-084f-48d8-b4fa-90aba944f813/oI0I5wiVtr.json`"
                :player-size="lottieOptions.playerSize"
                :player-controls="false"
                :loop="true"
                :autoplay="true"
                style="width: 100%; height: 400px"
              >
              </lottie-vue-player>
            </div>
            <div class="full-width checkout-cart-preview checkout-body-section" v-else>
              <div class="full-width">
                <h3 class="checkout-heading">Complete Checkout</h3>
              </div>
              <div class="full-width checkout-body-section">
                <div class="full-width" 
                v-for="(detail,index) in checkoutState.checkout_summary"
                :key="`detail-item-`+ index"
                >
                <!--Single Start-->
                    <div class="full-width app-flex app-flex-between-row" v-if="detail.type === 'single'">
                      <p class="checkout-preview-description">
                        {{ detail.description }}
                      </p>
                    </div>
              
                    <!--Duo Start-->
                    <div class="full-width app-flex app-flex-between-row" v-else>
                      <div class="checkout-preview-heading">{{ detail.text_left }}</div>
                      <div class="checkout-preview-heading-bold">{{ detail.text_right }}</div>
                    </div>
                    <!--Divider-->
                    <div class="full-width component-padding">
                      <div class="checkout-divider"></div>
                    </div>
                </div>
              
                <div class="full-width" id="payment_checkout_container">
                  <!--New Component-->
                </div>
           
              </div>
            </div>
        
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <SkeletonFooter />
    </template>
  </MainWrapper>
</template>

<script>
import BareNavbar from '~/components/Navbars/BareNavbar.vue'
import MainWrapper from '~/components/Wrapper/MainWrapper.vue'
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue'
import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue'
import CartCheckoutCardVue from '~/components/Cart/CartCheckoutCard.vue'
import CheckoutOptionCardVue from '~/components/Cart/CheckoutOptionCard.vue'
import SkeletonFooter from '~/components/Footers/SkeletonFooter.vue'

export default {
  name: 'CheckoutConfirmPage',
  head() {
    let paypal_url = ''
    let paypal_client_id = process.env.NUXT_ENV_PAYPAL_CLIENT_ID
    return {
      title: 'Confirm Checkout',
      script: [
        {
          src: `https://www.paypal.com/sdk/js?client-id=${paypal_client_id}&buyer-country=JM&components=buttons&commit=false`,
          callback: () => {

          },
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
    let identifyUrl = process.env.NUXT_ENV_TRANSACTION_REFERENCE_IDENTIFY
    let transaction_reference = params.transaction_reference
    let pageData = await $axios
      .$get(identifyUrl, {
        params: {
          reference: transaction_reference,
        },
      })
      .then((data) => {
        return {
          ok: true,
          data,
        }
      })
      .catch((err) => {
        return {
          ok: false,
        }
      })
    return {
      successLoad: pageData.ok,
      pageData: pageData.data,
    }
  },
  components: {
    MainWrapper,
    BareNavbar,
    SquareDisplayCard,
    RestaurantDisplayCard,
    CartCheckoutCardVue,
    CheckoutOptionCardVue,
    SkeletonFooter,
  },
  data() {
    let paypal_client_id = process.env.NUXT_ENV_PAYPAL_CLIENT_ID
    return {
      paypal: {
        credentials: {
          sandbox: paypal_client_id,
          production: paypal_client_id,
        },
        environment: 'sandbox',
        experience: {
          input_fields: {
            no_shipping: 1,
          },
        },
        buttonStyle: {
          label: 'checkout',
          size: 'responsive',
          shape: 'pill',
          color: 'gold',
        },
      },
      paypalComponentShown:false,
      payment_due: {
        amount: 10.0,
        currency: 'JMD',
        items: [
          {
            name: 'hat',
            description: 'Brown hat.',
            quantity: '1',
            price: '5',
            currency: 'USD',
          },
          {
            name: 'handbag',
            description: 'Black handbag.',
            quantity: '1',
            price: '5',
            currency: 'USD',
          },
        ],
      },
      component: '',
      displayData: {
        images: [],
        all_store_names: '',
        order_total_str: '',
        all_item_names: [],
        store_item_redeem: [],
      },
      lottieOptions: {
        minimizable: false,
        playerSize: 'standard',
        backgroundColor: '#fff',
        backgroundStyle: 'color',
        theme: {
          controlsView: 'standard',
          active: 'light',
          light: {
            color: '#3D4852',
            backgroundColor: '#fff',
            opacity: '0.7',
          },
          dark: {
            color: '#fff',
            backgroundColor: '#202020',
            opacity: '0.7',
          },
        },
      },
      lottieUrls: [
        {
          name: 'lottieScan',
          src: 'https://assets7.lottiefiles.com/packages/lf20_EcWipt2nmD.json',
        },
        {
          name: 'lottieLocate',
          src: 'https://lottie.host/7e9186c0-084f-48d8-b4fa-90aba944f813/oI0I5wiVtr.json',
        },
      ],
      checkoutState:{
        ready:false,
        checkout_summary:[
          /*
            {
              type:'single', 'single' or 'duo'
              text_left:'Text Bold',
              text_right:'Text Light',
              description:'Lorem ipsum',
            }
          */
        ]
      }
    }
  },
  watch:{
 
  },
  mounted() {
    this.formatData();
    this.userDelayAction({
      callbck:()=>{
        this.checkoutReadyDetect({renderPayment:true});
      },
      time:600,
    })
  },
  computed: {
    allLocationsSelected(){
      return false
    }
  },
  methods: {
    async userCheckout() {
      let ful_type = this.checkout_options.find((item, index) => {
        if (item.selected === true) {
          return item
        }
      })
      this.state.checkoutProcessing = true
      /*let dt = await this.$store.dispatch('user/userCartCheckout', {
            delivery:{
              street_name:this.user.delivery.street_name,
              street_number:this.user.delivery.street_number,
              town_name:this.user.delivery.town_name,
              parish_name:this.user.delivery.parish_name,
              instruction:this.user.delivery.delivery_instructions,
              customer_name:this.user.delivery.customer_name,
              customer_phone:this.user.delivery.customer_phone_formatted,
            },
            fulfill_type:ful_type.component_key,
            checkout_total:{
              currency:this.cart_total.currency,
              amount:this.cart_total.amount,
            }
          });*/
      this.userDelayAction({
        callbck:() => {
        this.state.checkoutProcessing = false
        this.$router.push(`/cart/checkout/confirm`)
      }, time:1200})
      return
    },
    showPayment(){
      if(this.paypalComponentShown === true){ return }
      this.paypalComponentShown = true;
    },
    renderPayment() {
      let financeElID = 'payment_checkout_container';
      let price = this.currencyPriceConvert(this.payment_due.amount);
      const successHandle = async ()=>{
        this.userDelayAction({
            callbck:async ()=>{
              await this.confirmPickupLocations()
            },
          time:400,
        })
      }
      paypal.Buttons({
        onInit(data,actions){

        },
        createOrder: function(data, actions) {
          // This function sets up the details of the transaction, including the amount and line item details.

          return actions.order.create({
            purchase_units: [{
              amount: {
                value:`${price}`,
              }
            }]
          });
        },
        onError(data, actions){
          this.$toast.open({
            message:'Something went wrong. Please try again later.',
            type:'error'
        })
        },
        onApprove(data, actions){
          return actions.order.capture().then(function(details) {
            // This function shows a transaction success message to your buyer.
            successHandle();
          });
        },
      }).render(`#${financeElID}`);
    },
    currencyPriceConvert(jmdPrice){
      //1 JMD = 0.0072164 USD
      let usdPrice = jmdPrice * 0.0072164;
      return usdPrice.toFixed(2);
    },
    formatData() {
      const { order_items } = this.pageData.order
      if (order_items === undefined) {
        return
      }
      this.order_reference = this.pageData.order.order_reference
      this.fulfill_type = this.pageData.order.fulfill_type || 'delivery'
      let stores_name_arr = []
      let store_arr_ref = []
      let variant_arr_ref = []
      let variant_name_arr = []
      let image_arr = []
      let redeem_location_arr = [
        /*
                    {
                        store_name:"",
                        store_ref:"",
                        stor_image:"",
                        order_items:[],
                        locations:[],
                    }redeem_location_arr
                */
      ]
      let item_total = this.pageData.payment_due.amount
      let item_currency = this.pageData.payment_due.currency
      order_items.forEach((oItem, oIndex) => {
        let variant_selected = [...oItem.item.product_details.variants].find(
          (vItem, vIndex) => {
            if (vItem.variant_reference === oItem.item.selection_reference) {
              return vItem
            }
          }
        )
        if (variant_selected !== undefined) {
          if (variant_selected.image !== null) {
            image_arr.push(variant_selected.image.url)
          }
          variant_arr_ref.push(variant_selected.variant_reference)
          variant_name_arr.push(
            `${oItem.item.quantity} x ${variant_selected.name}`
          )
        }

        if (
          store_arr_ref.includes(
            oItem.item.product_details.store_details.store_reference
          ) === false
        ) {
          store_arr_ref.push(
            oItem.item.product_details.store_details.store_reference
          )
          stores_name_arr.push(
            oItem.item.product_details.store_details.name.long
          )
          redeem_location_arr.push({
            name: oItem.item.product_details.store_details.name.long,
            store_ref: oItem.item.product_details.store_details.store_reference,
            store_image:
              oItem.item.product_details.store_details.promotional.image
                .storeLogo,
            locations:[...oItem.item.product_details.store_details.locations].map((locItem,locIndex)=>{
              //Set location array for item select
              locItem.location_selected = false;
              return locItem;
            }),
            order_items: [...this.pageData.order.order_items].filter(
              (rOrderItem, rIndex) => {
                if (
                  rOrderItem.item.product_details.store_details
                    .store_reference ===
                  oItem.item.product_details.store_details.store_reference
                ) {
                  return rOrderItem
                }
              }
            ),
          })
          return
        }
      })
      //All images for selected products available here
      this.displayData.images = image_arr
      //All store names in order available here
      this.displayData.all_store_names = stores_name_arr.join(' , ')
      //All item names available here
      this.displayData.all_item_names = variant_name_arr
      // Order total Set here
      this.displayData.order_total_str = this.priceFormatter(
        item_currency,
        item_total
      )
      //All redeem locations available here
      this.displayData.store_item_redeem = redeem_location_arr
    },
    priceFormatter(currency, amount) {
      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      })
      return formatter.format(amount)
    },
    selectLocation(topIndex, nestedIndex){
      //Used top index from list and nested Index from location button on component reder
      this.displayData.store_item_redeem = [...this.displayData.store_item_redeem].map((item,index)=>{
        //Ensures location is being set at current store 
        if(index === topIndex){
          item.locations[nestedIndex].location_selected = true;
          item.locations = [...item.locations].map((lItem,lIndex)=>{
            //Ensures location is being picked for current branch 
            if(lIndex === nestedIndex){
              lItem.location_selected = true;
            }else{
              lItem.location_selected = false;
            }
            return lItem;
          })
        }
        return item;
      });
      
      //Detect checkout after every select location
      this.checkoutReadyDetect({renderPayment:true})
    },
    checkoutReadyDetect({renderPayment}){
      if(this.checkoutState.ready){ return }
      //Enforces checkout to be ready to continue
      
      //for pickup select 
      //Checks locations for picks
      let locationSelect = this.enforceAllLocationSelect();
      let pickup_arr = [ locationSelect ]
      //for online checkout
      let delivery_arr = [];
      let pass_test = []
      //Use array by type to check for true values;
      
      //Enforce location select for cash payment only
      let checkout_type = this.pageData.order.fulfill_type;
      let use_arr = [];
      switch(checkout_type){
          case "pick_up":
              use_arr = pickup_arr;
            break
          case "delivery":
              use_arr = delivery_arr;
            break
      }
      pass_test = use_arr.filter((item,index)=>{ if(item === true){ return item }});
      //Ensures all test have been passed for used array
      if(pass_test.length === use_arr.length){
        //Set payment details 
        this.setPaymentCheckout();
        //Show payment
        this.checkoutState.ready = true;
        //Render Paypal 
        if(renderPayment === true){
            this.userDelayAction({
              callbck:()=>{
                this.renderPayment();
              },
              time:400,
            })
        }
      }else{
        this.checkoutState.ready = false;
      }
      
    },
    enforceAllLocationSelect(){
      //Enforces user to select atleast one redeem location for each store
        //Checks if a user has selected a location for each restaurant order
        let locations_picks = this.displayData.store_item_redeem;
        let location_picked = [...locations_picks].filter((item,index)=>{
          let selected = item.locations.find((locItem,locIndex)=>{
            if(locItem.location_selected === true){
              return locItem
            }
          });
          if(selected !== undefined){
            return item 
          }
        });
        if(locations_picks.length === location_picked.length){
          //Show payment for succesful render
          return true
        }else{
          return false
        }
    },
    //Set Checkout Data
    setPaymentCheckout(){
        //Calculates total due for order to be processed and sets labels
        let instruction_section = this.createCheckoutLabel({
          type:'single',
          description:this.generateCheckoutInstructions(),
        });
        let checkout_arr = [ instruction_section ];
        let set_instructions = this.pageData.transaction_charges;
        let formatted = [...set_instructions].map((item,index)=>{
            let new_item = this.createCheckoutLabel({
                type:'duo',
                description:item.long_description,
                text_left:item.short_description,
                text_right:this.priceFormatter(item.currency, item.amount),
            });
            return new_item;
        });
        //If payment handle has been specified by db function display to UI
        let payment_due_obj = [...set_instructions].filter((item,index)=>{
          if(item.payment_handle === true){
            return item ;
          }
        }).map((item, index)=>{
          return {
            currency:item.currency,
            amount:item.amount,
          }
        })
        if(payment_due_obj.length > 1){
          payment_due_obj = {
            amount:payment_due_obj.reduce((prev,next)=>{
              return prev.amount + next.amount
            }),
            currency:payment_due_obj[0].currency
          } 
        }else{
          payment_due_obj = payment_due_obj[0]
        }
        let use_price = payment_due_obj || { currency:'JMD', amount:0 }
        let payment_due = this.createCheckoutLabel({
            type:'duo',
            description:'',
            text_left:'Total Due',
            text_right:this.priceFormatter(use_price.currency, use_price.amount)
        })
        //Add 
        formatted.push(payment_due)
        checkout_arr.push(...formatted)
        this.checkoutState.checkout_summary = checkout_arr;
        //Set total price due to paypal button 
        this.payment_due.currency = use_price.currency;
        this.payment_due.amount = use_price.amount;
    },
    createCheckoutLabel({type, text_left , text_right , description}){
        let checkout_obj = {
          type,
          text_left,
          text_right,
          description,
        };
        return checkout_obj;
    },
    generateCheckoutInstructions(){
      let type_ = this.pageData.payment_method; 
      let instruction = "";
      switch(type_){
         case "online_checkout":
              instruction = "Complete your payment to submit your order. After a succesful checkout you will receive instructions to collect your order.";
          break
        case "cash_payment":
             instruction = "Complete your payment to submit your order. After a successful checkout you will receive instructions to collect your order in store. You will still need to pay the total for the items when you arrive for pick-up in store.";
          break
      };
      return instruction;
    },
    userDelayAction({callbck,time}){
      setTimeout(()=>{
        callbck()
      }, time)
    },
    async confirmPickupLocations(){
      //Final Handler for pick up fulfillment
      //find selected branches
      let selected = this.displayData.store_item_redeem.map((item,index)=>{
        //Get locations from display data
        return {
          locations:item.locations,
          store_id:item.order_items[0].item.product_details.store_details.id,
        };
      }).map((item,index)=>{
        //Get selected location from locations array 
        let selected_location = item.locations.find((f_item,index)=>{
            if(f_item.location_selected === true){
              //Add store id for transform from first order item 
              //f_item.store_id = f_item.order_items[0].item.product_details.store_details.id;
              return f_item;
            };
        });
        return {
          store_id:item.store_id,
          branch:selected_location,
        }
      }).filter((item, index)=>{
        //Filter item 
        if(item.branch !== undefined){
          return item;
        }
      }).map((item,index)=>{
        //Create store object for database
          let store_obj = {
            store_id:item.store_id,
            branch_uuid:item.branch.uid,
            location:{
              lat:item.branch.exact_location.data.lat,
              lng:item.branch.exact_location.data.lng,
            }
          };
          return store_obj 
      });
      let url = process.env.NUXT_ENV_CHECKOUT_CONFIRM;
      await this.$axios.$post(url, {
        reference:this.pageData.order.order_reference,
        stores:selected,
        transaction_reference:this.pageData.transaction_reference,
      }).then(data=>{
        this.userDelayAction({
          callbck:()=>{
            this.$toast.open({
              message:"Success ! We were able to process your payment. You will be redirected shortly.",
              type:'success'
            });
            this.userDelayAction({
              callbck:()=>{
                this.$router.push('/orders')
              },
              time:1200
            })
          },
          time:400,
        })
      }).catch(err=>{
        this.userDelayAction({
          callbck:()=>{
            this.$toast.open({
              message:"Something went wrong while trying to process your payment.",
              type:'error'
            })
          },
          time:400,
        })
      })
    }
  },
}
</script>

<style>
.checkout-body {
  min-height: 90vh;
  width: 100%;
  background: var(--app-prim-light);
  padding-top: 1.5em;
  padding-bottom: 60px;
}

.checkout-confirm-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.5em;
}

.checkout-body-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.checkout-heading {
  font-size: var(--app-text-lg);
  font-weight: 700;
  margin: 0px;
}

.checkout-divider {
  width: 100%;
  height: 0.015em;
  background: var(--app-platinum);
}

.checkout-option-wrapper {
  width: 50%;
}

.checkout-cart-preview {
  background: rgb(246, 246, 246);
  padding: 0.4em 0.8em;
  position: sticky;
  top: 70px;
}

.checkout-preview-heading-bold {
  font-weight: 600;
}

.location-display-card {
  padding: 0.8em 0.4em;
}

.location-display-street,
.location-display-parish,
.location-display-custdetails {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.5em;
}

.location-display-parish {
  grid-template-columns: repeat(2, 1fr);
}

.location-display-custdetails {
  grid-template-columns: 5fr 7fr;
}

.checkout-location-card-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.checkout-location-items-wrapper{
    position:absolute;
    bottom:115%;
    right:0%;
    height:fit-content;
    width:fit-content;
    display:flex;
    gap:0.2em;
    align-items:center;
    max-width:100%;
    overflow:hidden;
}

.checkout-preview-description{
  font-size:var(--app-text-xs);
}


@media (max-width: 992px) {
  .checkout-confirm-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5em;
    padding-top: 1.5em;
  }
  .checkout-option-wrapper {
    width: 100%;
  }

  .location-display-custdetails {
    grid-template-columns: 1fr;
  }
}
</style>