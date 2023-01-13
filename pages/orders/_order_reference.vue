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
                                        <div>
                                            <span class="order-app-heading order-app-capitalize">
                                                Order Total: {{ displayData.order_total_str }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="order-app-content-body">
                                       <div class="full-width">
                                            <ul>
                                                <li v-for="(item,index) in displayData.all_item_names" :key="'order-item-'+ index">
                                                    {{  item  }}
                                                </li>
                                            </ul>
                                       </div>
                                       <div class="component-padding full-width">
                                            <div class="order-app-divider"></div>
                                       </div>
                                       <div class="order-app-heading order-app-capitalize">
                                               Redeem Type : {{ pageData.order.fulfill_type }}
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
            console.log(this.pageData.order)
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
            let item_total = this.pageData.order.transaction_details.payment_due.amount;
            let item_currency = this.pageData.order.transaction_details.payment_due.currency;
            order_items.forEach((oItem,oIndex)=>{
                let variant_selected = [...oItem.item.product_details.variants].find((vItem,vIndex)=>{
                    if(vItem.variant_reference === oItem.item.selection_reference){
                        return vItem
                    }
                })
                console.log(oItem)
                if(variant_selected !== undefined){
                    image_arr.push(variant_selected.image.url);
                    variant_arr_ref.push(variant_selected.variant_reference);
                    variant_name_arr.push(`${oItem.item.quantity} x ${variant_selected.name}`)
                }
                if(store_arr_ref.includes(oItem.item.product_details.store_details.store_reference) === false){
                    store_arr_ref.push(oItem.item.product_details.store_details.store_reference);
                    stores_name_arr.push(oItem.item.product_details.store_details.name.long);
                    return 
                }
            })
            this.displayData.images = image_arr;
            this.displayData.all_store_names = stores_name_arr.join(' , ');
            this.displayData.all_item_names = variant_name_arr;
            this.displayData.order_total_str = this.priceFormatter(item_currency, item_total);
            console.log(this.displayData)
        },
        priceFormatter(currency,amount){
            let formatter = new Intl.NumberFormat('en-US', {style:'currency', currency:currency});
            return formatter.format(amount)
        },
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
    gap:1.2em;
}


.order-app-divider{
    height:0.5px;
    width:100%;
    background:var(--app-platinum)
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