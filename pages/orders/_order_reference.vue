<template> 
    <div class="order-app-wrapper">
                    <div class="order-app-container" v-if="successLoad">
                        <div class="order-app-action-area">
                            <div class="order-app-action-header app-container-fluid">
                                <span>
                                    <span></span>
                                </span>
                                <span>
                                    <MazBtn color="black" size="mini" @click="$router.push('/orders')">Close</MazBtn>
                                </span>
                            </div>
                            <div class="order-app-action-body app-container-fluid">
                                <div class="order-app-action-container">
                                    <div class="order-app-gallery">
                                        <MazGallery
                                            :images="displayData.images"
                                            :height="'100%'"
                                            :blur="false"
                                        />
                                    </div>
                                    <div class="order-app-content-header">
                                        <div>
                                            <span class="order-app-heading order-app-capitalize">
                                                Stores: {{ displayData.all_store_names }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="order-app-content-body">
            
                                       <div class="full-width">
                                        <MazList
                                        :noShadow="true"
                                        style="padding:0px;"
                                        >
                                            <MazListItem v-for="(orderItem,index) in pageData.order.order_items"
                                            :key="'cart-item-'+ index"
                                            style="padding:0px;"
                                            >
                                                <CartCheckoutCardVue
                                                :title="orderItem.item.product_details.name.short"
                                                :quantity="orderItem.item.quantity"
                                                :desc="orderItem.item.special_instruction"
                                                :price="orderItem.item.price"
                                                :addons="orderItem.item.addons"
                                                :disableChange="true"                     
                                                />
                                            </MazListItem>
                                        </MazList>
                                       </div>
                                       <div class="component-padding full-width">
                                            <div class="order-app-divider"></div>
                                       </div>
                                       <div class="order-app-heading order-app-capitalize">
                                               Redeem Type : {{ pageData.order.fulfill_type.replaceAll("_", " ") }}
                                        </div>
                                        <div class="full-width">
                                            <div class="full-width" v-if="pageData.order.fulfill_type === 'delivery'">
                                                <div class="full-width">
                                                    <div class="order-app-heading order-app-capitalize">
                                                Address
                                                </div>
                                                <div class="full-width">
                                                    <span class="order-app-capitalize">
                                                        {{ addressDisplay.streetNumber }}
                                                    </span>
                                                    &nbsp;
                                                    <span class="order-app-capitalize">
                                                        {{ addressDisplay.streetName }}
                                                    </span>
                                                </div>
                                                <div class="full-width">
                                                    <span class="order-app-capitalize">
                                                        {{ addressDisplay.townName }}
                                                    </span>
                                                    &nbsp;,&nbsp;
                                                    <span class="order-app-capitalize">
                                                        {{ addressDisplay.parishName }}
                                                    </span>
                                                    .
                                                </div>
                                                <div class="full-width">
                                                    <span class="order-app-capitalize">
                                                        {{ addressDisplay.countryName }}
                                                    </span>
                                                    .
                                                </div>
                                                </div>
                                                <div class="component-padding full-width">
                                                        <div class="order-app-divider"></div>
                                                </div>
                                                <div class="full-width">
                                                    <div class="order-app-heading order-app-capitalize">
                                                        Courier
                                                    </div>
                                            
                                                </div>
                                            </div>
                                            <div class="full-width" v-else>
                                                <div class="full-width app-flex app-flex-column app-md-spacing">
                                                    <div class="order-app-heading order-app-capitalize">
                                                        Pick Up Details
                                                    </div>
                                                    <div class="component-padding full-width">
                                                            <div class="order-app-divider"></div>
                                                    </div>
                                                    <!--List of locations here -->
                                                    <div class="full-width app-flex app-flex-column app-md-spacing"
                                                        v-for="(redeemSect, rIndex) in displayData.store_item_redeem"
                                                        :key="`redeem-section-${rIndex}`"
                                                    >
                                                        <div class="full-width">
                                                            <div class="order-app-heading order-app-capitalize">
                                                                {{ redeemSect.name }}
                                                            </div>
                                                        </div>
                                                        <div class="component-padding full-width">
                                                            <div class="component-padding full-width">
                                                                    <div class="order-app-divider"></div>
                                                            </div>
                                                        </div>
                                                        <div class="full-width app-grid app-grid-duo app-md-spacing">
                                                            <div class="full-width"
                                                                v-for="(locItem,locIndex) in redeemSect.locations"
                                                                :key="`location-card-${locIndex}`"
                                                            >
                                                                <!--List Component-->
                                                                    <SquareDisplayCard
                                                                        :image="redeemSect.store_image"
                                                                        :reviews="[]"
                                                                    >
                                                                    <template v-slot:card_body_content>
                                                                        <div class="redeem-location-card-content">
                                                                            <div class="redeem-card-items-wrapper">
                                                                                <MazAvatar
                                                                                v-for="(oItem,oIndex) in redeemSect.order_items"
                                                                                    :key="`order-item-${oIndex}`"
                                                                                    :src="oItem.item.product_details.image.url"
                                                                                    :size="35"
                                                                                    :bordered="true"
                                                                                />
                                                                            </div>
                                                                            <div class="full-width app-flex app-flex-between-row">                                                  
                                                                                <div class="width-75">
                                                                                    <div class="order-app-heading order-app-capitalize">
                                                                                        {{ locItem.name }}
                                                                                    </div>
                                                                                    <!--description _class redeem-card-desc-->
                                                                                </div>
                                                                                <span>
                                                                                    <MazBtn color="black" size="mini" @click="$router.push(`/redeem/order/${pageData.order.order_reference}?focus=${redeemSect.store_ref}`)">Redeem</MazBtn>
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
                                        <div class="component-padding full-width">
                                            <div class="order-app-divider"></div>
                                       </div>
                                    </div>
                                </div>
                            </div>
                            <div class="order-app-action-footer app-container-fluid">
                                <AppLogo/>
                                <span>
                                    <span>
                                        ORDER - {{ order_reference }}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
    </div>
</template>

<script>
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import AppLogo from '~/components/Branding/AppLogo.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue'
import CartCheckoutCardVue from '~/components/Cart/CartCheckoutCard.vue';

export default {
    name:"seeMyOrderPage",
    head(){
        return {
            title:"My Orders",
        }
    },
    components:{
        MainWrapper,
        AppLogo,
        SquareDisplayCard,
        CartCheckoutCardVue,
    },
    data(){
        return {
            order_reference:"",
            fulfill_type:"delivery",
            displayData:{
                images:[],
                all_store_names:"",
                order_total_str:"",
                all_item_names:[],
                store_item_redeem:[
                
                ]
            }
        }
    },
    async asyncData({$axios, route, store, env, params, query, req, res, redirect, error}) {
        let url_ = process.env.NUXT_ENV_IDENTIFY_MY_ORDER;
        let reference_ = params.order_reference;
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
    methods:{
        formatData(){
                const { 
                order_items,          
            } = this.pageData.order;
            if(order_items === undefined){ return };
            this.order_reference = this.pageData.order.order_reference;
            this.fulfill_type = this.pageData.order.fulfill_type || 'delivery';
            let stores_name_arr = [];
            let store_arr_ref = [];
            let variant_arr_ref  = [];
            let variant_name_arr = [];
            let image_arr = [];
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
            let item_total = this.pageData.order.transaction_details.payment_due.amount;
            let item_currency = this.pageData.order.transaction_details.payment_due.currency;
            order_items.forEach((oItem,oIndex)=>{
                let variant_selected = [...oItem.item.product_details.variants].find((vItem,vIndex)=>{
                    if(vItem.variant_reference === oItem.item.selection_reference){
                        return vItem
                    }
                })
                if(variant_selected !== undefined){
                    if(variant_selected.image !== null){
                        image_arr.push(variant_selected.image.url);
                    }
                    variant_arr_ref.push(variant_selected.variant_reference);
                    variant_name_arr.push(`${oItem.item.quantity} x ${variant_selected.name}`)
                }
                
                if(store_arr_ref.includes(oItem.item.product_details.store_details.store_reference) === false){
                    store_arr_ref.push(oItem.item.product_details.store_details.store_reference);
                    stores_name_arr.push(oItem.item.product_details.store_details.name.long);
                    redeem_location_arr.push({
                        name:oItem.item.product_details.store_details.name.long,
                        store_ref:oItem.item.product_details.store_details.store_reference,
                        store_image:oItem.item.product_details.store_details.promotional.image.storeLogo,
                        locations:oItem.item.product_details.store_details.locations,
                        order_items:[...this.pageData.order.order_items].filter((rOrderItem,rIndex)=>{
                           if(
                            rOrderItem.item.product_details.store_details.store_reference 
                           === 
                           oItem.item.product_details.store_details.store_reference){
                            return rOrderItem;
                           }
                        })
                    })
                    return 
                }
            })
            this.displayData.images = image_arr;
            this.displayData.all_store_names = stores_name_arr.join(' , ');
            this.displayData.all_item_names = variant_name_arr;
            this.displayData.order_total_str = this.priceFormatter(item_currency, item_total);
            this.displayData.store_item_redeem = redeem_location_arr;
        },
        priceFormatter(currency,amount){
            let formatter = new Intl.NumberFormat('en-US', {style:'currency', currency:currency});
            return formatter.format(amount)
        },
        formatRedeemStoreData(){

        }
    },
    computed:{
        addressDisplay(){
            const { delivery } = this.pageData.order;
            return {
                streetName:delivery.street_name,
                streetNumber:delivery.street_number,
                townName:delivery.town_name.replace('_', ' '),
                parishName:delivery.parish_name.replace('_', ' '),
                deliveryInstruction:delivery.delivery_instruction,
                contactNumber:delivery.contact_number,
                countryName:'Jamaica'
            }
        }
    }
}
</script>

<style>
.order-app-wrapper{
    width:100%;
    height:100vh;
    position:relative;
    display:flex;
    justify-content:center;
}

.order-app-container{
    width:50%;
    height:100vh;
}

.order-app-action-area{
    width:100%;
    height:100vh;
    position:relative;
}

.order-app-action-header{
    width:100%;
    height:8%;
    position:absolute;
    top:0;
    left:0;
    display:flex;
    justify-content:space-between;
    align-items:center;
}


.order-app-action-body{
    width:100%;
    height:84%;
    overflow-y:scroll;
    position:absolute;
    top:8%;
    left:0%;
    padding-bottom:0.5em;
    border-bottom:0.1px solid var(--app-platinum);
    border-top:0.1px solid var(--app-platinum);
}

.order-app-action-container{
    width:100%;
    height:fit-content;
    display:flex;
    flex-direction:column;
    gap:0.8em;
}

.order-app-action-footer{
    width:100%;
    height:8%;
    position:absolute;
    bottom:0;
    left:0;
    display:flex;
    align-items:center;
    justify-content:space-between;
}


/*Com */

.order-app-gallery{
    height:45vh;
    width:100%;
    padding-top:0.5em;
    padding-bottom:0.5em;
}

.order-app-content-header{
    position:sticky;
    top:-0.1%;
    background:var(--app-background);
    height:60px;
    width:100%;
    z-index:3;
}


.order-app-heading{
    font-weight:600;
    font-size:var(--app-text-base);

}


.order-app-capitalize{
    text-transform:capitalize;

}


.order-app-content-body{
    display:flex;
    flex-direction:column;
    gap:2.5em;
}


.order-app-divider{
    height:0.5px;
    width:100%;
    background:var(--app-platinum)
}

.redeem-location-card-content{
    width:100%;
    height:100%;
    position:relative;
}


.redeem-card-items-wrapper{
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

.redeem-card-desc{
    font-size:var(--app-text-xs);
    display: -webkit-box;
        -webkit-line-clamp:1;
        -webkit-box-orient: vertical; 
        width: 100%;
        overflow: hidden;
}

@media (max-width:992px) {   
    .order-app-container{
        position:absolute;
        left:50%;
        top:0%;
        transform:translateX(-50%);
        width:100%;
        height:100%;
    }

}
</style>