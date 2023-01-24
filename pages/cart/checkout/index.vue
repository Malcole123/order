<template>
    <MainWrapper>
      <template v-slot:navbar>
          <BareNavbar
            :hideCart="true"
          />
      </template>
      <template v-slot:body>
        <div class="checkout-body app-container">
          <div class="checkout-body-container" v-if="successLoad">
            <div class="full-width checkout-body-section">
                  <div class="full-width checkout-body-section">
                    <div class="full-width">
                      <h3 class="checkout-heading">Your Items</h3>
                    </div>
                    <div class="full-width">
                      <div class="checkout-divider"></div>
                    </div>
                    <MazList
                    :noShadow="true"
                    :noScroll="true"
                    >
                        <MazListItem v-for="(cItem,index) in userCart.cart_items" :key="'cart-item-'+ index">
                            <CartCheckoutCardVue
                                :data_id="cItem.id" 
                                :index="index"
                                :title="cItem.item.product_details.name.short"
                                :quantity="cItem.item.quantity"
                                :desc="cItem.item.special_instruction"
                                :price="cItem.item.price"
                                @valueChanged="updateUserQuantity"
                                :addons="cItem.item.addons"
                            />
                        </MazListItem>
                    </MazList>
                  </div>
                  <div class="full-width component-padding">
                    <div class="component-padding">
                      <div class="checkout-divider"></div>
                    </div>
                  </div>
                  <div class="full-width checkout-body-section">
                    <div class="full-width">
                      <h3 class="checkout-heading">Checkout Option</h3>
                    </div>
                    <div class="full-width">
                      <form class="full-width checkout-body-section">
                          <div class="checkout-option-wrapper" v-for="(opt,index) in checkout_options" :key="'option-item-'+index">
                              <CheckoutOptionCardVue 
                                :index="index"       
                                :title="opt.title"
                                :selected="opt.selected"
                                @selectChange="enforceDeliverySelect"
                                >
                              <template v-slot:option_body>
                                  <div class="full-width" v-if="opt.component_key === 'delivery'">
                                    <div class="full-width">
                                        <div class="full-width location-display-card checkout-body-section">
                                            <div class="location-display-street">
                                              <div class="full-width">
                                                <MazInput 
                                                color="black" 
                                                placeholder="Street Num." 
                                                label="Street Num."
                                                v-model="user.delivery.street_number"
                                                ></MazInput>
                                              </div>
                                              <div class="full-width">
                                                <MazInput 
                                                color="black" 
                                                placeholder="Street Name"
                                                v-model="user.delivery.street_name"
                                                ></MazInput>
                                              </div>
                                            </div>
                                            <div class="location-display-parish">
                                              <div class="full-width">
                                                <MazSelect 
                                                color="black" 
                                                placeholder="Town / City" 
                                                label="Town / City" 
                                                :options="delivery_options.towns"
                                                :listWidth="'100%'"
                                                v-model="user.delivery.town_name"
                                                ></MazSelect>
                                              </div>
                                              <div class="full-width">
                                                <MazSelect 
                                                color="black" 
                                                placeholder="Parish" 
                                                label="Parish" 
                                                :options="delivery_options.parishes"
                                                :listWidth="'100%'"
                                                v-model="user.delivery.parish_name"
                                                ></MazSelect>                                              
                                              </div>
                                            </div>
                                            <div class="location-display-custdetails">
                                              <div class="full-width">
                                                  <MazInput 
                                                  color="black" 
                                                  placeholder="First Name..."
                                                  v-model="user.delivery.customer_name"
                                                  ></MazInput>
                                                </div>
                                              <div class="full-width">
                                                <MazPhoneNumberInput
                                                color="black"
                                                :defaultCountryCode="'JM'"
                                                :noValidation="true"
                                                    :value="user.delivery.customer_phone_number"
                                                    @update="setUserCheckoutPhone"
                                                  />
                                              </div>
                                            
                                            </div>
                                            <div class="full-width">
                                                <MazInput 
                                                v-model="user.delivery.delivery_instructions"
                                                textarea color="black"
                                                label="Delivery Instructions"
                                                placeholder="Special instructions for delivery..."
                                                ></MazInput>
                                            </div>
                                        </div>
                                    </div>
                                     
                                  </div>
                                  <div class="full-width" v-else>
                                      <p>
                                        You will be given a scannable QR Code to redem your order in store.
                                      </p>
                                  </div>
                              </template>
                              
                              </CheckoutOptionCardVue>
                          </div>
                      </form>
                    </div>
                  </div>
                  <div class="full-width component-padding">
                    <div class="component-padding">
                      <div class="checkout-divider"></div>
                    </div>
                  </div>
                  <div class="full-width checkout-body-section">
                    <div class="full-width">
                      <h3 class="checkout-heading">Payment Method</h3>
                    </div>
                    <div class="full-width">
                      <form class="full-width checkout-body-section">
                          <div class="checkout-option-wrapper" v-for="(opt,index) in payment_methods" :key="'payment-option-item-'+index">
                              <CheckoutOptionCardVue 
                                :index="index"       
                                :title="opt.title"
                                :selected="opt.selected"
                                @selectChange="enforcePaymentSelect"
                                >
                              <template v-slot:option_body>

                              </template>
                              
                              </CheckoutOptionCardVue>
                          </div>
                      </form>
                    </div>
                  </div>
                  <div class="full-width component-padding">
                    <div class="component-padding">
                      <div class="checkout-divider"></div>
                    </div>
                  </div>
                  <div class="full-width checkout-body-section">
                    <div class="full-width">
                      <h3 class="checkout-heading">Refund Policy</h3>
                      <p>If an item is unavailable it will be removed from your order and you will be refunded the full price of the item.</p>
                    </div>
                  
                  </div>
              </div>

              <div class="full-width checkout-body-section">
                <div class="full-width checkout-cart-preview checkout-body-section" v-if="checkoutReady">
                    <div class="full-width">
                      <h3 class="checkout-heading">Cart Total</h3>
                    </div>
                    <div class="full-width checkout-body-section">
                      <div class="full-width app-flex app-flex-between-row">
                          <div class="checkout-preview-heading">
                            Cart Total
                          </div>
                          <div class="checkout-preview-heading-bold">
                            {{ userCart.cart_total }}
                          </div>
                          
                      </div>
                  
                      <div class="full-width component-padding">
                      <div class="checkout-divider"></div>
                    </div>
                      <div class="full-width app-flex app-flex-between-row">
                          <div class="checkout-preview-heading">
                            Service Charge
                          </div>
                          <div class="checkout-preview-heading-bold">
                            {{ userCart.service_total }}
                          </div>
                          
                      </div>
                      <div class="full-width component-padding">
                        <div class="checkout-divider"></div>
                      </div>
                      <div class="full-width" v-if="state.maxScrlReached">
                          <MazBtn 
                          color="black" 
                          style="width:100%"
                          :loading="state.checkoutProcessing"
                          @click="userCheckout"
                          >Pay Now - {{ userCart.checkout_total }}</MazBtn>
                      </div>
                    </div>
                    
                  </div>
              </div>
          </div>
             

        </div>
      </template>
      <template v-slot:footer>
          <StandardFooter/>
      </template>
    </MainWrapper>
 
</template>

<script>
import BareNavbar from '~/components/Navbars/BareNavbar.vue';
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue';
import CartCheckoutCardVue from '~/components/Cart/CartCheckoutCard.vue';
import CheckoutOptionCardVue from '~/components/Cart/CheckoutOptionCard.vue';
import StandardFooter from '~/components/Footers/StandardFooter.vue';
export default {
  name: 'Checkout',
  head(){
    let paypal_client_id = process.env.NUXT_ENV_PAYPAL_CLIENT_ID;
    return {
      title:"Checkout",
      script:[
        {
            src:`https://www.paypal.com/sdk/js?client-id=${paypal_client_id}&buyer-country=JM`,
            callback:()=>{
                console.log('run')
            },
            async:true,
        }
      ]
    }
  },
  async asyncData({$axios, route, store, env, params, query, req, res, redirect, error}) {
    await store.dispatch('user/getUserCart');
    return {
      successLoad:true,
    }
  },
  components:{
    MainWrapper,
    BareNavbar,
    SquareDisplayCard,
    RestaurantDisplayCard,
    CartCheckoutCardVue,
    CheckoutOptionCardVue,
    StandardFooter,
  },
  data(){
    return {
      checkout_options:[
        /*{
          title:"Delivery",
          selected:true,
          component_key:"delivery",
          selected_location:{
            name:"",
            input_value:""
          },
        },*/
        {
          title:"Pick Up",
          selected:true,
          component_key:"pick_up",
          selected_location:{
            name:"",
            input_value:""
          },

        }
      ],
      payment_methods:[
        {
          title:"Online Checkout",
          payment_key:"online_checkout",
          selected:true,
        },
        {
          title:"Cash Payment",
          payment_key:"cash_payment",
          selected:false,
        }
      ],
      user:{
        current_location:{
          lat:0,
          lng:0,
        },
        delivery:{
          street_number:"",
          street_name:"",
          delivery_instructions:"",
          parish_name:'saint_catherine',
          customer_name:'',
          customer_phone_number:'',
          customer_phone_formatted:'',
          town_name:'old_harbour',
        }
      },
      delivery_options:{
        towns:[
          {label:'Old Harbour',value:'old_harbour'},
          {label:'Old Harbour Bay',value:'old_harbour_bay'},
        ],
        parishes:[
          {label:'Saint Catherine',value:'saint_catherine'},
        ],
      },
      state:{
        checkoutProcessing:false,
        maxScrlReached:false,
      },
      checkoutMet:{
        deliveryAddress:false,

      },
      cart_total:{
        currency:"",
        amount:0,
      }
    }
  },
  computed:{
    userCart(){
            let cart = this.$store.getters['user/userCartItems'];
            let cart_items = [...cart.cart_items].filter((item,index)=>{
                if(item.item.quantity > 0){
                    return item;
                }
            })
            let cart_total = this.priceFormatter('JMD', cart.cart_total);
            let service_charge = 350;
            let service_total = this.priceFormatter('JMD', service_charge );
            let checkout_total = this.priceFormatter('JMD', service_charge + cart.cart_total);
            this.cart_total.amount = cart.cart_total;
            this.cart_total.currency = 'JMD';
            return {
                cart_items,
                cart_total,
                service_total,
                checkout_total,
            }
        },
        checkoutReady(){
            //Determines if a checkout preview can be showm
            return true
        }
  },
  methods:{
        priceFormatter(currency,amount){
            let form = new Intl.NumberFormat('en-US', {style:'currency',currency:currency});
            return form.format(amount)
        },
        async updateUserQuantity(val){
            let res_ = await this.$store.commit('user/updateSingleCartItem', {
                id:val.id,
                quantity:val.value,
                remove:val.quantity === 0 ? true : false,
                index:val.index,
            });
            this.component_data.cart.changed = true;
        },
        async getCheckoutOptions(){

        },
        enforceDeliverySelect(val){
          //Enforces single select for delivery option
          this.checkout_options.map((item,index)=>{
            if(index === val.index){
              item.selected = val.newVal;
            }else{
              item.selected = val.oldVal;
            }
            return item ;
          })
        },
        enforcePaymentSelect(val){
            this.payment_methods.map((item,index)=>{
            if(index === val.index){
              item.selected = val.newVal;
            }else{
              item.selected = val.oldVal;
            }
            return item ;
          }) 
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
        setDeliveryLocationFromCurrent(){
          let dt = this.getCurrentLocation((data)=>{
              if(data.success === true){
                  this.setUserCurrentLocation({lat:data.coords.latitude,lng:data.coords.longitude})
              }else{

              }
              return data;
          });
          return dt
        },  
        setUserCurrentLocation({lat,lng}){
          this.user.current_location.lat = lat;
          this.user.current_location.lng = lng;
        },
        async userCheckout(){
          let ful_type = this.checkout_options.find((item,index)=>{
            if(item.selected === true){
              return item;
            }
          })
          this.state.checkoutProcessing  = true;
          let payment_method = this.payment_methods.find((item,index)=>{
            if(item.selected === true){
                return item
            }
          })
          let dt = await this.$store.dispatch('user/userCartCheckout', {
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
            order_item_total:{
              currency:this.cart_total.currency,
              amount:this.cart_total.amount,
            },
            payment_method:payment_method.payment_key,
          });
          if(dt.ok){
            this.userDelayAction(()=>{
            this.state.checkoutProcessing = false;
            this.$router.push(`/cart/checkout/confirm/${dt.transaction_reference}`);

          }, 1200)
          }else{
            this.userDelayAction(()=>{
            this.state.checkoutProcessing = false;
            this.$toast.open({
                message:"Someting went wrong",
                type:'error'
            })

            }, 1200)
          }
          return 
        },
        userDelayAction(callbck, time){
          setTimeout(()=>{
            callbck()
          }, time)
        },
        setUserCheckoutPhone(val){
          if(val.isValid){
            this.user.delivery.customer_phone_formatted = val.e164

          }
        },
        enforceMaxScrl(){
            //Ensures user scrolls and views all parts of checkout before showing checkut
            let scrlPos = scrollY;
            let maxScrl = document.querySelector('body').scrollHeight;
            console.log({maxScrl,scrlPos})
            if(scrlPos >= maxScrl/2){
                this.state.maxScrlReached = true; 
                window.removeEventListener('scroll', this.enforceMaxScrl)  
            }
        }
  },
  mounted(){
    window.addEventListener('scroll', this.enforceMaxScrl )
  },
}
</script>

<style>
.checkout-body{
  min-height:90vh;
  width:100%;
  background:var(--app-prim-light);
  padding-top:1.5em;
  padding-bottom:60px;
}

.checkout-body-container{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:0.5em;
}

.checkout-body-section{
  width:100%;
  display:flex;
  flex-direction:column;
  gap:1em;
}

.checkout-heading{
  font-size:var(--app-text-lg);
  font-weight:700;
  margin:0px
}

.checkout-divider{
  width:100%;
  height:0.015em;
  background:var(--app-platinum)
}

.checkout-option-wrapper{
  width:50%;
}

.checkout-cart-preview{
  background:rgb(246, 246, 246);
  padding:0.4em 0.8em;
  position:sticky;
  top:70px;

}

.checkout-preview-heading-bold{
  font-weight:600;
}

.location-display-card{
  padding:0.8em 0.4em;
}

.location-display-street, .location-display-parish ,.location-display-custdetails{
  display:grid;
  grid-template-columns:1fr 2fr;
  gap:0.5em;

}

.location-display-parish{
  grid-template-columns:repeat(2,1fr);
  
}

.location-display-custdetails{
  grid-template-columns:5fr 7fr;
}



@media(max-width:992px){
  .checkout-body-container{
    display:grid;
    grid-template-columns:1fr;
    gap:1.5em;
    padding-top:1.5em;
  }
  .checkout-option-wrapper{
    width:100%;
  }

  .location-display-custdetails{
    grid-template-columns:1fr;
  }

}
</style>