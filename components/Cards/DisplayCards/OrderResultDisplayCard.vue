<template>
    <div class="order-result-display-card">
        <div class="order-result-gallery">
            <MazGallery
                :radius="false"
                :height="'100%'"
                :width="'100%'"
                :images="images"
                :blur="false"
                :zoom="false"
            />

            <div class="order-status-wrapper">
                {{ fulfill_type.replaceAll("_", ' ') }}
            </div>
        </div>

        <div class="full-width component-padding">
            <div class="full-width order-result-content ">
                <div class="full-width order-result-text">
                <span class="order-result-title order-result-truncate">{{ all_store_names }}</span>
                <span class="order-result-price">
                    {{ order_total_str }}
                </span>
                </div>
                <div class="full-width order-result-action">
                    <MazBtn color="black" size="mini" :loading="loading" @click="redirectUser">See Details</MazBtn>
                </div>
            </div>
         
            <div class="full-width">
                <p class="order-result-truncate order-result-description">
                    {{ all_item_names }}
                </p>
            </div>
            <div class="full-width">

            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:[
        'order',
    ],
    data(){
        return {
            images:[],
            quantity:1,
            all_store_names:"",
            all_item_names:"",
            order_reference:"",
            order_total_str:"",
            fulfill_type:'delivery',
            loading:false,
        }
    },
    watch:{
        order(newVal,oldVal){
            this.formatData();
        },
    },
    mounted(){
         this.formatData()
     
    },
    methods:{
        formatData(){
                const { 
                order_items,          
            } = this.order;
            if(order_items === undefined){ return };
            this.order_reference = this.order.order_reference;
            this.fulfill_type = this.order.fulfill_type || 'delivery';
            let stores_name_arr = [];
            let store_arr_ref = [];
            let variant_arr_ref  = [];
            let variant_name_arr = [];
            let image_arr = [];
            let item_total = this.order.transaction_details.payment_due.amount;
            let item_currency = this.order.transaction_details.payment_due.currency;
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
                    return 
                }
            })
            this.images = image_arr;
            this.all_store_names = stores_name_arr.join(' , ');
            this.all_item_names = variant_name_arr.join(' , ');
            this.order_total_str = this.priceFormatter(item_currency, item_total);
        },
        priceFormatter(currency,amount){
            let formatter = new Intl.NumberFormat('en-US', {style:'currency', currency:currency});
            return formatter.format(amount)
        },
        redirectUser(val){
            this.loading = true;
            setTimeout(()=>{
                this.$router.push(`/orders/${this.order_reference}`)
            }, 200)
        },
    }
}
</script>

<style scoped>
    .order-result-display-card{
        height:60vh;
        width:100%;
        background:var(--app-prim-light);
        border:0.015em solid var(--app-platinum)
    }

    .order-result-gallery{
        height:65%;
        width:100%;
        position:relative;
    }

    .order-result-content{
        height:35%;
        width:100%;
        display:grid;
        gap:0.5em;
        grid-template-columns:3fr 1fr;
        padding:0.1em 0em;
        background:var(--app-prim-light);
    }
    .order-result-text{
        display:flex;
        flex-direction:column;
        gap:0.1em;
    }

    .order-result-action{
        display:flex;
        justify-content:flex-end;
    }

    .order-result-title{
        font-size:var(--app-text-md);
        font-weight:700;
    }

    .order-result-truncate{
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient: vertical; 
        width: 100%;
        overflow: hidden;
    }

    .order-result-description{
        font-size:var(--app-text-xs);
    }

    .order-result-price{
        font-size:var(--app-text-base);
        font-weight:700;
    }

    .order-status-wrapper{
        position:absolute;
        top:5%;
        right:1%;
        height:fit-content;
        padding:0.2em 0.4em;
        background:var(--app-prim-black);
        color:var(--app-prim-light);
        text-transform:uppercase;
        font-size:var(--app-text-xs);
        font-weight:600;
    }

    @media(max-width:992px){
        .order-result-content{
            grid-template-columns:2fr 1fr;
        }
    }
</style>